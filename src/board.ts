/* ════════════════════════════════════════════════════════════
   KMTC — Board page interaction (TypeScript source)

   Page-specific behaviour only (Lucide icon init + FAQ accordion).
   Generic behaviour + 3D card tilt is provided by premium.js.

   Compiled to src/board.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */

declare const lucide: { createIcons: () => void } | undefined;

(function board(): void {
  "use strict";

  // Render Lucide icons (loaded from CDN in the page head).
  try {
    if (typeof lucide !== "undefined") lucide.createIcons();
  } catch (e) {
    /* icons are non-critical */
  }

  // ── PREMIUM FAQ ACCORDION ─────────────────────────────────────
  document.querySelectorAll<HTMLElement>(".faq-q").forEach((btn): void => {
    btn.addEventListener("click", (): void => {
      const item = btn.closest(".faq-item");
      const body = item?.querySelector<HTMLElement>(".faq-body");
      const isOpen = btn.classList.contains("open");

      // Close all first.
      document.querySelectorAll<HTMLElement>(".faq-item").forEach((i): void => {
        const q = i.querySelector<HTMLElement>(".faq-q");
        const b = i.querySelector<HTMLElement>(".faq-body");
        q?.classList.remove("open");
        q?.setAttribute("aria-expanded", "false");
        b?.classList.remove("open");
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
