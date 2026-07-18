"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Board page interaction (TypeScript source)

   Page-specific behaviour only (Lucide icon init + FAQ accordion).
   Generic behaviour + 3D card tilt is provided by premium.js.

   Compiled to src/board.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */
(function board() {
    "use strict";
    // Render Lucide icons (loaded from CDN in the page head).
    try {
        if (typeof lucide !== "undefined")
            lucide.createIcons();
    }
    catch (e) {
        /* icons are non-critical */
    }
    // ── PREMIUM FAQ ACCORDION ─────────────────────────────────────
    document.querySelectorAll(".faq-q").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const body = item === null || item === void 0 ? void 0 : item.querySelector(".faq-body");
            const isOpen = btn.classList.contains("open");
            // Close all first.
            document.querySelectorAll(".faq-item").forEach((i) => {
                const q = i.querySelector(".faq-q");
                const b = i.querySelector(".faq-body");
                q === null || q === void 0 ? void 0 : q.classList.remove("open");
                q === null || q === void 0 ? void 0 : q.setAttribute("aria-expanded", "false");
                b === null || b === void 0 ? void 0 : b.classList.remove("open");
            });
            // Open the clicked one if it was closed.
            if (!isOpen && body) {
                btn.classList.add("open");
                btn.setAttribute("aria-expanded", "true");
                body.classList.add("open");
            }
        });
    });
})();
