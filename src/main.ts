/* ════════════════════════════════════════════════════════════
   KMTC — Kingdom Media & Tech Confluence
   Front-end interaction layer (TypeScript source)

   Compiled to src/main.js via `npm run build` (tsc). The compiled
   file is committed to the repo so the static site deploys with no
   build step — the deployment workflow is untouched.
════════════════════════════════════════════════════════════ */

interface Window {
  /** Exposed for inline onclick handlers in the mobile drawer. */
  closeMob: () => void;
  toggleMob: () => void;
}

(function bootstrap(): void {
  "use strict";

  const prefersReducedMotion: boolean = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /** Small typed helper around getElementById. */
  function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  // ── 1. PAGE LOADER ────────────────────────────────────────────
  window.addEventListener("load", (): void => {
    window.setTimeout((): void => {
      byId("loader")?.classList.add("done");
    }, 1900);
  });

  // ── 2. SCROLL PROGRESS BAR ────────────────────────────────────
  const scrollBar = byId("scroll-bar");
  window.addEventListener(
    "scroll",
    (): void => {
      if (!scrollBar) return;
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollBar.style.width = pct + "%";
    },
    { passive: true }
  );

  // ── 3. NAV SCROLL SHADOW ──────────────────────────────────────
  const navEl = byId("nav");
  window.addEventListener(
    "scroll",
    (): void => {
      navEl?.classList.toggle("scrolled", window.scrollY > 50);
    },
    { passive: true }
  );

  // ── 4. CURSOR GLOW ────────────────────────────────────────────
  const cursorGlow = byId("cursor-glow");
  document.addEventListener("mousemove", (e: MouseEvent): void => {
    if (!cursorGlow) return;
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
    cursorGlow.style.opacity = "1";
  });
  document.addEventListener("mouseleave", (): void => {
    if (cursorGlow) cursorGlow.style.opacity = "0";
  });

  // ── 5. HERO PARTICLES ─────────────────────────────────────────
  (function spawnParticles(): void {
    const container = byId("particles");
    if (!container) return;
    const colors: readonly string[] = [
      "#f7572b",
      "#ffc703",
      "#00b675",
      "#780ae8",
      "#e982eb",
    ];
    const total = prefersReducedMotion ? 8 : 22;
    for (let i = 0; i < total; i++) {
      const p = document.createElement("div");
      p.className = "pt";
      const size = Math.random() * 5 + 2;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${Math.random() * 14 + 10}s;
        animation-delay:${Math.random() * 12}s;
        opacity:0;
      `;
      container.appendChild(p);
    }
  })();

  // ── 6. MAGNETIC BUTTONS ───────────────────────────────────────
  document
    .querySelectorAll<HTMLElement>(
      ".btn-y,.btn-gw,.ncta,.btn-dark,.inv-btn,.prog-action a"
    )
    .forEach((btn): void => {
      btn.classList.add("btn-mag");
      btn.addEventListener("mousemove", (e: MouseEvent): void => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      });
      btn.addEventListener("mouseleave", (): void => {
        btn.style.transform = "";
      });
    });

  // ── 7. TILT CARDS + PREMIUM 3D GLARE ──────────────────────────
  document
    .querySelectorAll<HTMLElement>(
      ".vc2,.wyi,.track-card,.why-card,.wc,.speaker-card,.acard,.dcard,.does-card"
    )
    .forEach((card): void => {
      card.classList.add("tilt");
      // Inject a glare layer once for a premium sheen on 3D tilt.
      let glare = card.querySelector<HTMLElement>(".tilt-glare");
      if (!glare) {
        glare = document.createElement("span");
        glare.className = "tilt-glare";
        card.appendChild(glare);
      }
      const glareEl = glare;

      card.addEventListener("mousemove", (e: MouseEvent): void => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const x = px - 0.5;
        const y = py - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(10px)`;
        glareEl.style.opacity = "1";
        glareEl.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.28), transparent 55%)`;
      });
      card.addEventListener("mouseleave", (): void => {
        card.style.transform = "";
        glareEl.style.opacity = "0";
      });
    });

  // ── 8. SHIMMER CARDS ──────────────────────────────────────────
  document
    .querySelectorAll<HTMLElement>(".acard,.dcard,.edr,.spon-tier,.obj-card")
    .forEach((el): void => {
      el.classList.add("shimmer");
    });

  // ── 9. REVEAL ANIMATION (enhanced 3D stagger) ─────────────────
  const animItems = document.querySelectorAll<HTMLElement>(".ao");
  animItems.forEach((el): void => el.classList.add("hidden"));
  const revObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.remove("hidden");
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
  );
  animItems.forEach((el): void => revObs.observe(el));
  window.setTimeout(
    (): void => animItems.forEach((el): void => el.classList.remove("hidden")),
    2000
  );

  // ── 10. STAGGER CHILDREN in section grids ─────────────────────
  const staggerObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach((child, i): void => {
            const el = child as HTMLElement;
            el.classList.add("stagger-child");
            window.setTimeout((): void => el.classList.add("in"), i * 80);
          });
          staggerObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll<HTMLElement>(
      ".val-grid,.who-grid,.why-grid,.tracks-grid,.obj-grid,.speakers-grid,.goal-goals"
    )
    .forEach((g): void => staggerObs.observe(g));

  // ── 11. SECTION LABEL LINE ANIMATION ──────────────────────────
  const lblObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("animated");
      });
    },
    { threshold: 0.5 }
  );
  document
    .querySelectorAll<HTMLElement>(".slbl,.ph-label,.block-label")
    .forEach((l): void => lblObs.observe(l));

  // ── 12. ACTIVE NAV on scroll ──────────────────────────────────
  const sections = document.querySelectorAll<HTMLElement>(
    "section[id], div[id]"
  );
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nl a");
  const sectObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) {
          navLinks.forEach((a): void => a.classList.remove("nav-active"));
          const match = document.querySelector<HTMLAnchorElement>(
            `.nl a[href="#${e.target.id}"]`
          );
          match?.classList.add("nav-active");
        }
      });
    },
    { threshold: 0.35, rootMargin: "-64px 0px -40% 0px" }
  );
  sections.forEach((s): void => sectObs.observe(s));

  // ── 13. PARALLAX on hero rings ────────────────────────────────
  const heroRings = document.querySelectorAll<HTMLElement>(".hero-ring");
  window.addEventListener(
    "scroll",
    (): void => {
      const sy = window.scrollY;
      heroRings.forEach((r, i): void => {
        const speed = (i + 1) * 0.18;
        r.style.transform = `translateY(${sy * speed}px)`;
      });
    },
    { passive: true }
  );

  // ── 14. MOBILE NAV ────────────────────────────────────────────
  const mobNav = byId("mobNav");
  const hamBtn = byId("hamBtn");
  let mobOpen = false;

  function toggleMob(): void {
    if (!mobNav || !hamBtn) return;
    mobOpen = !mobOpen;
    mobNav.classList.toggle("open", mobOpen);
    const spans = hamBtn.querySelectorAll<HTMLElement>("span");
    if (mobOpen) {
      spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
    } else {
      spans.forEach((s): void => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    }
  }

  function closeMob(): void {
    if (!mobNav || !hamBtn) return;
    mobOpen = false;
    mobNav.classList.remove("open");
    hamBtn.querySelectorAll<HTMLElement>("span").forEach((s): void => {
      s.style.transform = "";
      s.style.opacity = "";
    });
  }

  hamBtn?.addEventListener("click", toggleMob);
  document.addEventListener("click", (e: MouseEvent): void => {
    const target = e.target as Node;
    if (
      mobOpen &&
      mobNav &&
      hamBtn &&
      !mobNav.contains(target) &&
      !hamBtn.contains(target)
    ) {
      closeMob();
    }
  });

  // Inline handlers in the markup call these globally.
  window.closeMob = closeMob;
  window.toggleMob = toggleMob;

  // ── 16. SMOOTH HERO HEADLINE TYPEWRITER ───────────────────────
  window.setTimeout((): void => {
    const words: readonly string[] = ["Faith", "Meets", "Tech"];
    const selectors: readonly string[] = [".w1", ".w2", ".w3"];
    selectors.forEach((sel, i): void => {
      const el = document.querySelector<HTMLElement>(sel);
      if (!el) return;
      const text = words[i];
      el.textContent = "";
      el.style.opacity = "1";
      let j = 0;
      const type = window.setInterval((): void => {
        el.textContent += text[j];
        j++;
        if (j >= text.length) window.clearInterval(type);
      }, 55 + i * 25);
    });
  }, 2100);

  /* ══════════════════════════════════════════════════════════════
     PREMIUM 3D ENHANCEMENTS (new)
  ══════════════════════════════════════════════════════════════ */

  // ── 17. HERO 3D PARALLAX (pointer-driven depth on the image) ──
  const heroFrame = document.querySelector<HTMLElement>(".hero .img-frame");
  const heroSection = document.querySelector<HTMLElement>(".hero");
  if (heroFrame && heroSection && !prefersReducedMotion) {
    heroSection.addEventListener("mousemove", (e: MouseEvent): void => {
      const r = heroSection.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroFrame.style.transform = `perspective(1100px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(30px)`;
    });
    heroSection.addEventListener("mouseleave", (): void => {
      heroFrame.style.transform = "";
    });
  }

  // ── 18. 3D SCROLL REVEAL (flip-in depth for cards) ────────────
  const depthItems = document.querySelectorAll<HTMLElement>(
    ".acard,.dcard,.vc2,.wc,.wyi,.does-card,.mvc"
  );
  depthItems.forEach((el): void => el.classList.add("depth-in"));
  const depthObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("depth-shown");
          depthObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  depthItems.forEach((el): void => depthObs.observe(el));

  // ── 19. GOAL CONVERGENCE ORBIT (3D rotating illustration) ─────
  const orbit = byId("goalOrbit");
  if (orbit) {
    let angle = 0;
    let pointerTiltX = -14;
    let pointerTiltY = 0;
    let running = false;

    const goalSection = byId("goal");
    if (goalSection && !prefersReducedMotion) {
      goalSection.addEventListener("mousemove", (e: MouseEvent): void => {
        const r = goalSection.getBoundingClientRect();
        pointerTiltY = ((e.clientX - r.left) / r.width - 0.5) * 26;
        pointerTiltX = -14 + ((e.clientY - r.top) / r.height - 0.5) * 20;
      });
      goalSection.addEventListener("mouseleave", (): void => {
        pointerTiltY = 0;
        pointerTiltX = -14;
      });
    }

    const stage = orbit.querySelector<HTMLElement>(".orbit-stage");
    const nodes = orbit.querySelectorAll<HTMLElement>(".orbit-node");
    const radius = 150;

    function frame(): void {
      if (!stage) return;
      if (!prefersReducedMotion) angle += 0.28;
      stage.style.transform = `rotateX(${pointerTiltX}deg) rotateY(${pointerTiltY}deg)`;
      nodes.forEach((node, i): void => {
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
    const orbitObs = new IntersectionObserver(
      (entries): void => {
        entries.forEach((e): void => {
          if (e.isIntersecting && !running) {
            running = true;
            window.requestAnimationFrame(frame);
          }
        });
      },
      { threshold: 0.05 }
    );
    orbitObs.observe(orbit);
  }

  // ── 20. COUNT-UP for goal / impact numbers ────────────────────
  const counters = document.querySelectorAll<HTMLElement>("[data-count]");
  const countObs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        countObs.unobserve(el);
        const target = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        function tick(now: number): void {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          const val = target * eased;
          el.textContent =
            (Number.isInteger(target) ? Math.round(val).toString() : val.toFixed(1)) +
            suffix;
          if (p < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c): void => countObs.observe(c));
})();
