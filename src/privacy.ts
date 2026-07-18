/* ════════════════════════════════════════════════════════════
   KMTC — Privacy page interaction (TypeScript source)

   Page-specific behaviour only (mobile TOC dropdown + scroll-spy).
   Nav shadow and other generics are provided by premium.js.

   Compiled to src/privacy.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */

interface Window {
  closeToc: () => void;
}

(function privacy(): void {
  "use strict";

  // ── MOBILE TABLE OF CONTENTS DROPDOWN ─────────────────────────
  const tocBtn = document.getElementById("tocBtn");
  const tocPanel = document.getElementById("tocPanel");
  const mobToc = document.getElementById("mobToc");
  let tocOpen = false;

  function openToc(): void {
    if (!tocBtn || !tocPanel) return;
    tocOpen = true;
    tocBtn.classList.add("open");
    tocPanel.classList.add("open");
    tocBtn.setAttribute("aria-expanded", "true");
  }
  function closeToc(): void {
    if (!tocBtn || !tocPanel) return;
    tocOpen = false;
    tocBtn.classList.remove("open");
    tocPanel.classList.remove("open");
    tocBtn.setAttribute("aria-expanded", "false");
  }

  if (tocBtn) {
    tocBtn.addEventListener("click", (): void =>
      tocOpen ? closeToc() : openToc()
    );
  }
  document.addEventListener("click", (e: MouseEvent): void => {
    if (tocOpen && mobToc && !mobToc.contains(e.target as Node)) closeToc();
  });
  window.closeToc = closeToc;

  // ── SCROLL SPY — highlight active clause in both sidebars ─────
  const clauses = document.querySelectorAll<HTMLElement>(".clause");
  const sideLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".sidebar-nav a, .mob-toc-panel a"
  );
  if (clauses.length) {
    const obs = new IntersectionObserver(
      (entries): void => {
        entries.forEach((e): void => {
          if (e.isIntersecting) {
            sideLinks.forEach((a): void => a.classList.remove("active"));
            document
              .querySelectorAll<HTMLAnchorElement>(
                `.sidebar-nav a[href="#${e.target.id}"], .mob-toc-panel a[href="#${e.target.id}"]`
              )
              .forEach((a): void => a.classList.add("active"));
          }
        });
      },
      { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" }
    );
    clauses.forEach((c): void => obs.observe(c));
  }
})();
