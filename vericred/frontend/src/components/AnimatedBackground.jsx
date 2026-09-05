import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    const count = 18;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${50 + Math.random() * 60}%;
        --dur: ${6 + Math.random() * 10}s;
        --delay: ${-Math.random() * 10}s;
        background: ${Math.random() > 0.5 ? "var(--primary)" : "var(--secondary)"};
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
      `;
      container.appendChild(p);
    }
  }, []);

  return (
    <div className="anim-bg" aria-hidden="true">
      <div className="anim-bg-grid" />
      <div className="anim-bg-glow anim-bg-glow-1" />
      <div className="anim-bg-glow anim-bg-glow-2" />
      <div className="anim-bg-particles" ref={particlesRef} />
    </div>
  );
}
