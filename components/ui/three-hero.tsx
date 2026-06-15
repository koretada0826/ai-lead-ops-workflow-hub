"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js: 流れる3Dパーティクル波。白×水色の高級SaaS向け。
 * - マウス視差 / 自動うねり / DPR上限 / リサイズ対応 / 後始末
 * - prefers-reduced-motion を尊重（静止）
 * - WebGL非対応・初期化失敗時は何も描かず、親のCSS背景にフォールバック
 */
export function ThreeHero({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // CSS背景にフォールバック
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);
    camera.position.set(0, 14, 34);
    camera.lookAt(0, 0, 0);

    // 丸くソフトな点テクスチャ
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);

    // 点グリッド（波打つ面）
    const GX = 90;
    const GZ = 90;
    const SP = 1.2;
    const count = GX * GZ;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    const cInner = new THREE.Color("#22d3ee"); // cyan
    const cMid = new THREE.Color("#3b82f6"); // blue
    const cOuter = new THREE.Color("#818cf8"); // indigo
    const half = (GX * SP) / 2;
    const tmp = new THREE.Color();
    let n = 0;
    for (let gx = 0; gx < GX; gx++) {
      for (let gz = 0; gz < GZ; gz++) {
        const x = (gx - GX / 2) * SP;
        const z = (gz - GZ / 2) * SP;
        positions[n * 3] = x;
        positions[n * 3 + 1] = 0;
        positions[n * 3 + 2] = z;
        base[n * 2] = x;
        base[n * 2 + 1] = z;
        const d = Math.min(1, Math.hypot(x, z) / half);
        if (d < 0.5) tmp.lerpColors(cInner, cMid, d / 0.5);
        else tmp.lerpColors(cMid, cOuter, (d - 0.5) / 0.5);
        colors[n * 3] = tmp.r;
        colors[n * 3 + 1] = tmp.g;
        colors[n * 3 + 2] = tmp.b;
        n++;
      }
    }
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.66,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let tmx = 0;
    let tmy = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const w = container!.clientWidth || window.innerWidth;
      const h = container!.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    resize();

    const clock = new THREE.Clock();
    let raf = 0;
    let lastDraw = 0;
    const arr = posAttr.array as Float32Array;
    function draw() {
      const t = clock.getElapsedTime();
      for (let k = 0; k < count; k++) {
        const x = base[k * 2];
        const z = base[k * 2 + 1];
        arr[k * 3 + 1] =
          Math.sin(x * 0.18 + t * 1.05) * 2.5 +
          Math.cos(z * 0.16 + t * 0.85) * 2.5 +
          Math.sin((x + z) * 0.1 + t * 1.2) * 1.4;
      }
      posAttr.needsUpdate = true;
      points.rotation.y = t * 0.06;

      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      camera.position.x = mx * 9;
      camera.position.y = 14 - my * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    if (reduce) {
      draw(); // 動きオフ設定なら静止1フレームのみ
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (now - lastDraw < 33) return; // 約30fpsに制限（負荷半減）
        if (typeof document !== "undefined" && document.hidden) return; // タブ非表示時は描画停止
        lastDraw = now;
        draw();
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
