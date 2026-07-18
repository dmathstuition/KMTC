"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Terms page interaction (TypeScript source)

   Page-specific behaviour only (sidebar scroll-spy). Nav shadow and
   other generics are provided by premium.js.

   Compiled to src/terms.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */
(function terms() {
    "use strict";
    const clauses = document.querySelectorAll(".clause");
    const sideLinks = document.querySelectorAll(".sidebar-nav a");
    if (!clauses.length)
        return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            var _a;
            if (e.isIntersecting) {
                sideLinks.forEach((a) => a.classList.remove("active"));
                (_a = document
                    .querySelector(`.sidebar-nav a[href="#${e.target.id}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
            }
        });
    }, { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" });
    clauses.forEach((c) => obs.observe(c));
})();
