/* ════════════════════════════════════════════════════════════
   KMTC — Terms page interaction (TypeScript source)

   Page-specific behaviour only (sidebar scroll-spy). Nav shadow and
   other generics are provided by premium.js.

   Compiled to src/terms.js via `npm run build`. Committed so the
   static site deploys with no build step.
════════════════════════════════════════════════════════════ */

(function terms(): void {
  "use strict";

  const clauses = document.querySelectorAll<HTMLElement>(".clause");
  const sideLinks = document.querySelectorAll<HTMLAnchorElement>(
    ".sidebar-nav a"
  );
  if (!clauses.length) return;

  const obs = new IntersectionObserver(
    (entries): void => {
      entries.forEach((e): void => {
        if (e.isIntersecting) {
          sideLinks.forEach((a): void => a.classList.remove("active"));
          document
            .querySelector<HTMLAnchorElement>(
              `.sidebar-nav a[href="#${e.target.id}"]`
            )
            ?.classList.add("active");
        }
      });
    },
    { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" }
  );
  clauses.forEach((c): void => obs.observe(c));
})();
