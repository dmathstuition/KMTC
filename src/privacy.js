"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Privacy page interaction (TypeScript source)

   Page-specific behaviour only (mobile TOC dropdown + scroll-spy).
   Nav shadow and other generics are provided by premium.js.

   Compiled to src/privacy.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */
(function privacy() {
    "use strict";
    // ── MOBILE TABLE OF CONTENTS DROPDOWN ─────────────────────────
    const tocBtn = document.getElementById("tocBtn");
    const tocPanel = document.getElementById("tocPanel");
    const mobToc = document.getElementById("mobToc");
    let tocOpen = false;
    function openToc() {
        if (!tocBtn || !tocPanel)
            return;
        tocOpen = true;
        tocBtn.classList.add("open");
        tocPanel.classList.add("open");
        tocBtn.setAttribute("aria-expanded", "true");
    }
    function closeToc() {
        if (!tocBtn || !tocPanel)
            return;
        tocOpen = false;
        tocBtn.classList.remove("open");
        tocPanel.classList.remove("open");
        tocBtn.setAttribute("aria-expanded", "false");
    }
    if (tocBtn) {
        tocBtn.addEventListener("click", () => tocOpen ? closeToc() : openToc());
    }
    document.addEventListener("click", (e) => {
        if (tocOpen && mobToc && !mobToc.contains(e.target))
            closeToc();
    });
    window.closeToc = closeToc;
    // ── SCROLL SPY — highlight active clause in both sidebars ─────
    const clauses = document.querySelectorAll(".clause");
    const sideLinks = document.querySelectorAll(".sidebar-nav a, .mob-toc-panel a");
    if (clauses.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    sideLinks.forEach((a) => a.classList.remove("active"));
                    document
                        .querySelectorAll(`.sidebar-nav a[href="#${e.target.id}"], .mob-toc-panel a[href="#${e.target.id}"]`)
                        .forEach((a) => a.classList.add("active"));
                }
            });
        }, { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" });
        clauses.forEach((c) => obs.observe(c));
    }
})();
