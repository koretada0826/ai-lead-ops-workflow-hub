"use client";

import { useEffect, useRef } from "react";

/**
 * 軽量WebGL（生シェーダー）で、ヌルッと流れる高級ダークグラデ背景を描く。
 * - 依存ライブラリなし（バンドル軽量）
 * - WebGL非対応／初期化失敗時は何も描かず、親のCSS背景にフォールバック
 * - prefers-reduced-motion を尊重（静止）
 */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.04;

  // domain warping で有機的に流れる場を作る
  vec2 q = vec2(fbm(p * 1.2 + t), fbm(p * 1.2 + vec2(5.2, 1.3) - t));
  float f = fbm(p * 1.2 + 1.6 * q + t * 0.6);

  // 高級ダーク・パレット（抑えめの発色）
  vec3 base = vec3(0.020, 0.022, 0.038);   // near-black navy
  vec3 indigo = vec3(0.14, 0.10, 0.40);
  vec3 teal = vec3(0.04, 0.26, 0.36);
  vec3 violet = vec3(0.32, 0.16, 0.52);

  vec3 col = base;
  col = mix(col, indigo, smoothstep(0.25, 0.95, f));
  col = mix(col, teal, smoothstep(0.45, 1.0, q.x) * 0.7);
  col += violet * 0.22 * smoothstep(0.6, 1.0, fbm(p * 1.6 - t));

  // ビネット（中央を少し明るく、端を締める）
  float vig = smoothstep(1.5, 0.15, length(p));
  col *= 0.5 + 0.65 * vig;

  // 微細なグレイン（質感）
  col += (hash(gl_FragCoord.xy * 0.7 + fract(u_time) * 80.0) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function WebGLBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { alpha: false, antialias: true }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // CSS背景にフォールバック

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // フルスクリーン三角形
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      if (!canvas) return;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      resize();
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
