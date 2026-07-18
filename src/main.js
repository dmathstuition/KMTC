"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Homepage-only interaction (TypeScript source)

   Generic behaviour (loader, reveal, nav, tilt, count-up, mobile
   nav, 3D depth reveal, hero parallax …) lives in premium.ts and is
   shared by every page. This file adds only what is unique to the
   homepage: the hero headline typewriter and the 3D "Our Goal"
   convergence orbit.

   Compiled to src/main.js via `npm run build` (tsc). The compiled
   file is committed so the static site deploys with no build step —
   the deployment workflow is untouched.
════════════════════════════════════════════════════════════ */
(function homepage() {
    "use strict";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ── HERO HEADLINE TYPEWRITER (runs after loader clears) ───────
    window.setTimeout(() => {
        const words = ["Faith", "Meets", "Tech"];
        const selectors = [".w1", ".w2", ".w3"];
        selectors.forEach((sel, i) => {
            const el = document.querySelector(sel);
            if (!el)
                return;
            const text = words[i];
            el.textContent = "";
            el.style.opacity = "1";
            let j = 0;
            const type = window.setInterval(() => {
                el.textContent += text[j];
                j++;
                if (j >= text.length)
                    window.clearInterval(type);
            }, 55 + i * 25);
        });
    }, 2100);
    // ── GOAL CONVERGENCE ORBIT (3D rotating illustration) ─────────
    const orbit = document.getElementById("goalOrbit");
    if (!orbit)
        return;
    const stage = orbit.querySelector(".orbit-stage");
    const nodes = orbit.querySelectorAll(".orbit-node");
    const goalSection = document.getElementById("goal");
    const radius = 150;
    let angle = 0;
    let pointerTiltX = -14;
    let pointerTiltY = 0;
    let running = false;
    if (goalSection && !reduceMotion) {
        goalSection.addEventListener("mousemove", (e) => {
            const r = goalSection.getBoundingClientRect();
            pointerTiltY = ((e.clientX - r.left) / r.width - 0.5) * 26;
            pointerTiltX = -14 + ((e.clientY - r.top) / r.height - 0.5) * 20;
        });
        goalSection.addEventListener("mouseleave", () => {
            pointerTiltY = 0;
            pointerTiltX = -14;
        });
    }
    function frame() {
        if (!stage)
            return;
        if (!reduceMotion)
            angle += 0.28;
        stage.style.transform = `rotateX(${pointerTiltX}deg) rotateY(${pointerTiltY}deg)`;
        nodes.forEach((node, i) => {
            const a = (angle + i * (360 / nodes.length)) * (Math.PI / 180);
            const x = Math.cos(a) * radius;
            const z = Math.sin(a) * radius;
            // Counter-rotate each node so its label always faces the viewer.
            node.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-pointerTiltY}deg) rotateX(${-pointerTiltX}deg)`;
            node.style.zIndex = String(Math.round(z + 200));
            const depth = (z + radius) / (radius * 2); // 0 (back) → 1 (front)
            node.style.opacity = String(0.45 + depth * 0.55);
            node.style.filter = `blur(${(1 - depth) * 1.4}px)`;
        });
        window.requestAnimationFrame(frame);
    }
    // Only spin while the section is on-screen (saves battery/CPU).
    const orbitObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting && !running) {
                running = true;
                window.requestAnimationFrame(frame);
            }
        });
    }, { threshold: 0.05 });
    orbitObs.observe(orbit);
})();
