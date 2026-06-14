"""
AIリード対応ワークフロー — LangGraph 承認フロー付きエージェント

MVPの一直線フローを、人間承認(human-in-the-loop)を挟む堅牢なエージェントに拡張する例。
  classify → score → draft_reply → [human approval] → send → schedule_followup

- 高見込み or 法務/個人情報が絡む領域は、送信前に人間の承認を必須にする
- checkpointer + interrupt で「承認待ち」状態を永続化し、後から再開できる

依存: langgraph>=0.2, langchain-anthropic
"""

from __future__ import annotations

from typing import Literal, TypedDict

from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt, Command

llm = ChatAnthropic(model="claude-opus-4-8", max_tokens=1500)

SENSITIVE = ("士業", "相続", "採用", "応募者", "不動産", "個人情報")


class LeadState(TypedDict, total=False):
    message: str
    category: str
    lead_score: Literal["高", "中", "低"]
    reply_draft: str
    approved: bool
    sent: bool


def classify(state: LeadState) -> LeadState:
    res = llm.invoke(
        f"次の問い合わせを1語のカテゴリに分類して返答せよ:\n{state['message']}"
    )
    return {"category": res.content.strip()}


def score(state: LeadState) -> LeadState:
    res = llm.invoke(
        "次の問い合わせの商談見込み度を 高/中/低 のいずれかだけで返答せよ:\n"
        + state["message"]
    )
    label = "中"
    for k in ("高", "低", "中"):
        if k in res.content:
            label = k
            break
    return {"lead_score": label}


def draft_reply(state: LeadState) -> LeadState:
    res = llm.invoke(
        "次の問い合わせへの丁寧な初回返信文案を作成せよ。断定を避け、"
        f"オンライン相談につなげること:\n{state['message']}"
    )
    return {"reply_draft": res.content.strip()}


def route_after_draft(state: LeadState) -> Literal["human_approval", "send"]:
    """高見込み or センシティブ領域は人間承認へ。それ以外は自動送信。"""
    needs_review = state.get("lead_score") == "高" or any(
        w in state["message"] for w in SENSITIVE
    )
    return "human_approval" if needs_review else "send"


def human_approval(state: LeadState) -> Command[Literal["send", "draft_reply"]]:
    """interrupt で停止し、外部(管理画面)からの承認入力を待つ。"""
    decision = interrupt(
        {
            "type": "approval_required",
            "category": state.get("category"),
            "lead_score": state.get("lead_score"),
            "reply_draft": state.get("reply_draft"),
        }
    )
    # decision 例: {"action": "approve"} / {"action": "revise", "feedback": "..."}
    if decision.get("action") == "approve":
        return Command(goto="send", update={"approved": True})
    return Command(
        goto="draft_reply",
        update={"message": state["message"] + "\n[修正指示] " + decision.get("feedback", "")},
    )


def send(state: LeadState) -> LeadState:
    # 実運用では Gmail / Slack / CRM へ送信
    return {"sent": True}


def schedule_followup(state: LeadState) -> LeadState:
    # 3日後の追客タスクを登録
    return state


def build_graph():
    g = StateGraph(LeadState)
    g.add_node("classify", classify)
    g.add_node("score", score)
    g.add_node("draft_reply", draft_reply)
    g.add_node("human_approval", human_approval)
    g.add_node("send", send)
    g.add_node("schedule_followup", schedule_followup)

    g.add_edge(START, "classify")
    g.add_edge("classify", "score")
    g.add_edge("score", "draft_reply")
    g.add_conditional_edges("draft_reply", route_after_draft)
    g.add_edge("send", "schedule_followup")
    g.add_edge("schedule_followup", END)

    return g.compile(checkpointer=MemorySaver())


if __name__ == "__main__":
    graph = build_graph()
    cfg = {"configurable": {"thread_id": "lead-001"}}
    state = graph.invoke(
        {"message": "相続の相談です。至急対応してほしいです。"}, cfg
    )
    # 承認待ちで停止 → 管理画面の承認後に再開
    if "__interrupt__" in state:
        graph.invoke(Command(resume={"action": "approve"}), cfg)
