"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Shared premium interaction layer (TypeScript source)

   Loaded by every page. Every module is guarded by an existence
   check, so a page only runs the behaviours whose markup it has.

   Compiled to src/premium.js via `npm run build` (tsc). The compiled
   file is committed so the static site deploys with no build step —
   the deployment workflow is untouched.
════════════════════════════════════════════════════════════ */
(function premium() {
    "use strict";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function byId(id) {
        return document.getElementById(id);
    }
    // ── PAGE LOADER ───────────────────────────────────────────────
    const loader = byId("loader");
    if (loader) {
        window.addEventListener("load", () => {
            window.setTimeout(() => loader.classList.add("done"), 1600);
        });
    }
    // ── SCROLL PROGRESS BAR ───────────────────────────────────────
    const scrollBar = byId("scroll-bar");
    if (scrollBar) {
        window.addEventListener("scroll", () => {
            const max = document.body.scrollHeight - window.innerHeight;
            scrollBar.style.width =
                Math.min(max > 0 ? (window.scrollY / max) * 100 : 0, 100) + "%";
        }, { passive: true });
    }
    // ── NAV SCROLL SHADOW ─────────────────────────────────────────
    const navEl = byId("nav");
    if (navEl) {
        window.addEventListener("scroll", () => {
            navEl.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }
    // ── CURSOR GLOW ───────────────────────────────────────────────
    const cursorGlow = byId("cursor-glow");
    if (cursorGlow) {
        document.addEventListener("mousemove", (e) => {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
            cursorGlow.style.opacity = "1";
        });
        document.addEventListener("mouseleave", () => {
            cursorGlow.style.opacity = "0";
        });
    }
    // ── HERO PARTICLES ────────────────────────────────────────────
    (function spawnParticles() {
        const container = byId("particles");
        if (!container)
            return;
        const colors = [
            "#f7572b",
            "#ffc703",
            "#00b675",
            "#780ae8",
            "#e982eb",
        ];
        const total = reduceMotion ? 8 : 20;
        for (let i = 0; i < total; i++) {
            const p = document.createElement("div");
            p.className = "pt";
            const size = Math.random() * 5 + 2;
            p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${Math.random() * 14 + 10}s;animation-delay:${Math.random() * 12}s;opacity:0;`;
            container.appendChild(p);
        }
    })();
    // ── MAGNETIC BUTTONS ──────────────────────────────────────────
    document
        .querySelectorAll(".btn-y,.btn-gw,.ncta,.btn-dark,.inv-btn,.prog-action a,.mag-btn,.btn-o")
        .forEach((btn) => {
        btn.classList.add("btn-mag");
        btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            btn.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
            btn.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
            btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "";
        });
    });
    // ── TILT CARDS + PREMIUM 3D GLARE ─────────────────────────────
    document
        .querySelectorAll(".vc2,.wyi,.track-card,.why-card,.wc,.speaker-card,.acard,.dcard,.does-card,.member-card,.spon-tier,.obj-card,.pkg-card,.reason-card")
        .forEach((card) => {
        card.classList.add("tilt");
        let glare = card.querySelector(".tilt-glare");
        if (!glare) {
            glare = document.createElement("span");
            glare.className = "tilt-glare";
            card.appendChild(glare);
        }
        const glareEl = glare;
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 9}deg) rotateX(${-(py - 0.5) * 9}deg) translateZ(10px)`;
            glareEl.style.opacity = "1";
            glareEl.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.28), transparent 55%)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            glareEl.style.opacity = "0";
        });
    });
    // ── SHIMMER CARDS ─────────────────────────────────────────────
    document
        .querySelectorAll(".acard,.dcard,.edr,.spon-tier,.obj-card")
        .forEach((el) => el.classList.add("shimmer"));
    // ── REVEAL ANIMATION ──────────────────────────────────────────
    const animItems = document.querySelectorAll(".ao");
    if (animItems.length) {
        animItems.forEach((el) => el.classList.add("hidden"));
        const revObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.remove("hidden");
                    revObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
        animItems.forEach((el) => revObs.observe(el));
        window.setTimeout(() => animItems.forEach((el) => el.classList.remove("hidden")), 2000);
    }
    // ── STAGGER CHILDREN in grids ─────────────────────────────────
    const staggerObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                Array.from(e.target.children).forEach((child, i) => {
                    const el = child;
                    el.classList.add("stagger-child");
                    window.setTimeout(() => el.classList.add("in"), i * 80);
                });
                staggerObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document
        .querySelectorAll(".val-grid,.who-grid,.why-grid,.tracks-grid,.obj-grid,.speakers-grid,.goal-goals,.pkg-grid")
        .forEach((g) => staggerObs.observe(g));
    // ── SECTION LABEL LINE ANIMATION ──────────────────────────────
    const lblObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting)
                e.target.classList.add("animated");
        });
    }, { threshold: 0.5 });
    document
        .querySelectorAll(".slbl,.ph-label,.block-label")
        .forEach((l) => lblObs.observe(l));
    // ── ACTIVE NAV on scroll ──────────────────────────────────────
    const navLinks = document.querySelectorAll(".nl a");
    if (navLinks.length) {
        const sectObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                var _a;
                if (e.isIntersecting) {
                    navLinks.forEach((a) => a.classList.remove("nav-active"));
                    (_a = document
                        .querySelector(`.nl a[href="#${e.target.id}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add("nav-active");
                }
            });
        }, { threshold: 0.35, rootMargin: "-64px 0px -40% 0px" });
        document
            .querySelectorAll("section[id], div[id]")
            .forEach((s) => sectObs.observe(s));
    }
    // ── PARALLAX on hero rings ────────────────────────────────────
    const heroRings = document.querySelectorAll(".hero-ring");
    if (heroRings.length) {
        window.addEventListener("scroll", () => {
            const sy = window.scrollY;
            heroRings.forEach((r, i) => {
                r.style.transform = `translateY(${sy * (i + 1) * 0.16}px)`;
            });
        }, { passive: true });
    }
    // ── MOBILE NAV ────────────────────────────────────────────────
    const mobNav = byId("mobNav");
    const hamBtn = byId("hamBtn");
    let mobOpen = false;
    function toggleMob() {
        if (!mobNav || !hamBtn)
            return;
        mobOpen = !mobOpen;
        mobNav.classList.toggle("open", mobOpen);
        const spans = hamBtn.querySelectorAll("span");
        if (mobOpen) {
            spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
        }
        else {
            spans.forEach((s) => {
                s.style.transform = "";
                s.style.opacity = "";
            });
        }
    }
    function closeMob() {
        if (!mobNav || !hamBtn)
            return;
        mobOpen = false;
        mobNav.classList.remove("open");
        hamBtn.querySelectorAll("span").forEach((s) => {
            s.style.transform = "";
            s.style.opacity = "";
        });
    }
    if (hamBtn)
        hamBtn.addEventListener("click", toggleMob);
    document.addEventListener("click", (e) => {
        const t = e.target;
        if (mobOpen && mobNav && hamBtn && !mobNav.contains(t) && !hamBtn.contains(t))
            closeMob();
    });
    window.closeMob = closeMob;
    window.toggleMob = toggleMob;
    /* ══════════════ PREMIUM 3D ENHANCEMENTS ══════════════ */
    // ── 3D SCROLL REVEAL (flip-in depth) ──────────────────────────
    const depthItems = document.querySelectorAll(".acard,.dcard,.vc2,.wc,.wyi,.does-card,.mvc,.member-card,.track-card,.why-card,.speaker-card,.spon-tier,.obj-card,.pkg-card");
    if (depthItems.length) {
        depthItems.forEach((el) => el.classList.add("depth-in"));
        const depthObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("depth-shown");
                    depthObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        depthItems.forEach((el) => depthObs.observe(el));
    }
    // ── HERO 3D PARALLAX (pointer-driven depth on image) ──────────
    const heroFrame = document.querySelector(".hero .img-frame");
    const heroSection = document.querySelector(".hero");
    if (heroFrame && heroSection && !reduceMotion) {
        heroSection.addEventListener("mousemove", (e) => {
            const r = heroSection.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            heroFrame.style.transform = `perspective(1100px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(30px)`;
        });
        heroSection.addEventListener("mouseleave", () => {
            heroFrame.style.transform = "";
        });
    }
    // ── COUNT-UP for [data-count] numbers ─────────────────────────
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting)
                    return;
                const el = e.target;
                countObs.unobserve(el);
                const target = parseFloat(el.dataset.count || "0");
                const suffix = el.dataset.suffix || "";
                const duration = 1400;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = target * eased;
                    el.textContent =
                        (Number.isInteger(target)
                            ? Math.round(val).toString()
                            : val.toFixed(1)) + suffix;
                    if (p < 1)
                        window.requestAnimationFrame(tick);
                };
                window.requestAnimationFrame(tick);
            });
        }, { threshold: 0.4 });
        counters.forEach((c) => countObs.observe(c));
    }
})();
