/* ════════════════════════════════════════════════════════════
   KMTC — Registration page interaction (TypeScript source)

   Page-specific behaviour: custom cursor, multi-step wizard,
   validation, summary, submission, and the live-registration toast.
   Functions invoked from inline handlers are exposed on `window`.

   Compiled to src/register.js via `npm run build`. Committed so the
   static site deploys with no build step — the deployment workflow
   is untouched.
════════════════════════════════════════════════════════════ */

interface Window {
  goToStep: (n: number) => void;
  selectTicket: (el: HTMLElement, name: string, price: string) => void;
  selectTrack: (el: HTMLElement) => void;
  toggleSource: (el: HTMLElement) => void;
  formatCard: (el: HTMLInputElement) => void;
  submitRegistration: () => void;
}

(function register(): void {
  "use strict";

  const byId = <T extends HTMLElement = HTMLElement>(id: string): T | null =>
    document.getElementById(id) as T | null;

  // ── CUSTOM CURSOR ─────────────────────────────────────────────
  const cursor = byId("cursor");
  const ring = byId("cursorRing");
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  if (cursor && ring) {
    document.addEventListener("mousemove", (e: MouseEvent): void => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx - 8}px,${my - 8}px)`;
    });
    (function animRing(): void {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
      requestAnimationFrame(animRing);
    })();
    document
      .querySelectorAll<HTMLElement>(
        "button,input,select,textarea,.ticket-option,.track-option,.source-chip,.checkbox-group"
      )
      .forEach((el): void => {
        el.addEventListener("mouseenter", (): void => {
          ring.style.width = "52px";
          ring.style.height = "52px";
        });
        el.addEventListener("mouseleave", (): void => {
          ring.style.width = "38px";
          ring.style.height = "38px";
        });
      });
  }

  // ── STEP NAVIGATION ───────────────────────────────────────────
  let currentStep = 1;
  const progressMap: Record<number, number> = { 1: 0.25, 2: 0.5, 3: 0.75, 4: 1 };

  function goToStep(n: number): void {
    if (n > currentStep && !validateStep(currentStep)) return;
    byId("step" + currentStep)?.classList.remove("active");
    currentStep = n;
    byId("step" + n)?.classList.add("active");
    updateUI();
    document
      .querySelector<HTMLElement>(".right-panel")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateUI(): void {
    const bar = byId("progressBar");
    if (bar) bar.style.transform = `scaleX(${progressMap[currentStep] || 1})`;
    const num = byId("navStepNum");
    if (num) num.textContent = String(currentStep);
    document.querySelectorAll<HTMLElement>(".step-dot").forEach((dot, i): void => {
      dot.classList.remove("active", "done");
      const s = i + 1;
      if (s < currentStep) dot.classList.add("done");
      else if (s === currentStep) dot.classList.add("active");
    });
    if (currentStep === 4) populateSummary();
  }

  // ── VALIDATION ────────────────────────────────────────────────
  function validateStep(step: number): boolean {
    let valid = true;
    if (step === 1) {
      const checks: ReadonlyArray<[string, string, (v: string) => boolean]> = [
        ["firstName", "firstNameErr", (v) => v.length > 0],
        ["lastName", "lastNameErr", (v) => v.length > 0],
        ["email", "emailErr", (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v)],
        ["phone", "phoneErr", (v) => v.length > 5],
        ["role", "roleErr", (v) => v !== ""],
      ];
      checks.forEach(([id, errId, fn]): void => {
        const el = byId<HTMLInputElement>(id);
        const err = byId(errId);
        if (el && !fn(el.value.trim())) {
          el.classList.add("error");
          err?.classList.add("show");
          valid = false;
        } else if (el) {
          el.classList.remove("error");
          err?.classList.remove("show");
        }
      });
    }
    return valid;
  }

  // ── TICKET SELECT ─────────────────────────────────────────────
  let selectedTicket: { name: string; price: string } = {
    name: "Kingdom Builder",
    price: "FREE",
  };
  function selectTicket(el: HTMLElement, name: string, price: string): void {
    document
      .querySelectorAll<HTMLElement>(".ticket-option")
      .forEach((o): void => o.classList.remove("selected"));
    el.classList.add("selected");
    const labels: Record<string, string> = {
      general: "General Admission",
      builder: "Kingdom Builder",
      vip: "VIP Access",
    };
    selectedTicket = { name: labels[name] || name, price };
  }

  // ── TRACK SELECT ──────────────────────────────────────────────
  let selectedTrack = "Media & Content";
  function selectTrack(el: HTMLElement): void {
    document
      .querySelectorAll<HTMLElement>(".track-option")
      .forEach((o): void => o.classList.remove("selected"));
    el.classList.add("selected");
    selectedTrack = el.querySelector("h4")?.textContent || selectedTrack;
  }

  // ── SOURCE CHIPS ──────────────────────────────────────────────
  function toggleSource(el: HTMLElement): void {
    el.classList.toggle("selected");
  }

  // ── POPULATE SUMMARY ──────────────────────────────────────────
  function populateSummary(): void {
    const fn = byId<HTMLInputElement>("firstName")?.value || "";
    const ln = byId<HTMLInputElement>("lastName")?.value || "";
    const em = byId<HTMLInputElement>("email")?.value || "";
    const setText = (id: string, text: string): void => {
      const el = byId(id);
      if (el) el.textContent = text;
    };
    setText("sumName", `${fn} ${ln}`.trim() || "—");
    setText("sumEmail", em || "—");
    setText("sumTicket", selectedTicket.name);
    setText("sumTrack", selectedTrack);
    setText("sumTotal", selectedTicket.price);
  }

  // ── CARD FORMAT ───────────────────────────────────────────────
  function formatCard(el: HTMLInputElement): void {
    const v = el.value.replace(/\D/g, "").substring(0, 16);
    el.value = v.replace(/(.{4})/g, "$1 ").trim();
  }

  // ── SUBMIT ────────────────────────────────────────────────────
  const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"; // ← paste after deploying Code.gs

  function randomCode(): string {
    return "KMTC-2026-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function submitRegistration(): void {
    const terms = byId<HTMLInputElement>("termsCheck");
    if (!terms || !terms.checked) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }
    const btn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (btn) {
      btn.textContent = "Submitting…";
      btn.disabled = true;
    }

    const heard: string[] = [];
    document
      .querySelectorAll<HTMLElement>(".source-chip.selected")
      .forEach((c): void => {
        heard.push((c.textContent || "").trim());
      });

    const selects = document.querySelectorAll<HTMLSelectElement>(".form-select");
    const payload = {
      firstName: byId<HTMLInputElement>("firstName")?.value.trim() || "",
      lastName: byId<HTMLInputElement>("lastName")?.value.trim() || "",
      email: byId<HTMLInputElement>("email")?.value.trim() || "",
      phone: byId<HTMLInputElement>("phone")?.value.trim() || "",
      location: byId<HTMLSelectElement>("location")?.value || "",
      role: byId<HTMLSelectElement>("role")?.value || "",
      organisation: byId<HTMLInputElement>("org")?.value.trim() || "",
      ticketType: selectedTicket.name,
      primaryTrack: selectedTrack,
      howHeard: heard,
      expectations:
        document.querySelector<HTMLTextAreaElement>(".form-textarea")?.value.trim() ||
        "",
      tshirtSize: selects[2]?.value || "",
      groupSize: selects[3]?.value || "",
    };

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r): Promise<{ success?: boolean; regCode?: string; error?: string }> =>
        r.json()
      )
      .then((res): void => {
        if (res.success) {
          const code = res.regCode || randomCode();
          const codeEl = byId("regCode");
          if (codeEl) codeEl.textContent = code;
          showSuccessScreen();
        } else {
          throw new Error(res.error || "Submission failed");
        }
      })
      .catch((err): void => {
        console.error(err);
        // Fallback: still show success with a local code so UX isn't broken.
        const codeEl = byId("regCode");
        if (codeEl) codeEl.textContent = randomCode();
        showSuccessScreen();
      });
  }

  function showSuccessScreen(): void {
    byId("step4")?.classList.remove("active");
    const dots = document.querySelector<HTMLElement>(".step-dots");
    if (dots) dots.style.display = "none";
    byId("successPage")?.classList.add("active");
    const bar = byId("progressBar");
    if (bar) {
      bar.style.transform = "scaleX(1)";
      bar.style.background = "var(--green)";
    }
    const num = byId("navStepNum");
    if (num) num.textContent = "✓";
    document
      .querySelector<HTMLElement>(".right-panel")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── INPUT CLEAN ON FOCUS ──────────────────────────────────────
  document.querySelectorAll<HTMLInputElement>(".form-input").forEach((inp): void => {
    inp.addEventListener("input", (): void => {
      inp.classList.remove("error");
      byId(inp.id + "Err")?.classList.remove("show");
    });
  });

  // ── LIVE-REGISTRATION TOAST ───────────────────────────────────
  const mockNames: readonly string[] = [
    "Chukwuemeka O.", "Adaeze N.", "Femi A.", "Blessing I.", "Tunde B.",
    "Ngozi E.", "Seun K.", "Chiamaka U.", "Damilola F.", "Emeka C.",
    "Nneka O.", "Babatunde A.", "Oluwaseun M.", "Chinonso D.", "Amara J.",
    "Kayode R.", "Ifunanya P.", "Rotimi S.", "Obiageli T.", "Yewande L.",
  ];
  const mockRoles: readonly string[] = [
    "Content Creator", "Software Developer", "Filmmaker", "Graphic Designer",
    "Church Media Lead", "Podcast Host", "Entrepreneur", "Student",
  ];

  function showToast(name: string, role: string): void {
    const toast = byId("regToast");
    const msgEl = byId("toastMsg");
    const timeEl = byId("toastTime");
    if (!toast || !msgEl || !timeEl) return;
    msgEl.textContent = `${name} · ${role} just registered`;
    timeEl.textContent = "just now";
    toast.classList.add("show");
    window.setTimeout((): void => toast.classList.remove("show"), 5000);
  }

  function randomToast(): void {
    const name = mockNames[Math.floor(Math.random() * mockNames.length)];
    const role = mockRoles[Math.floor(Math.random() * mockRoles.length)];
    showToast(name, role);
  }

  window.setTimeout(randomToast, 8000);
  window.setInterval(randomToast, Math.floor(Math.random() * 30000) + 20000);
  window.setInterval((): void => {
    window.setTimeout(randomToast, Math.floor(Math.random() * 30000) + 20000);
  }, 50000);

  // Expose functions used by inline handlers in the markup.
  window.goToStep = goToStep;
  window.selectTicket = selectTicket;
  window.selectTrack = selectTrack;
  window.toggleSource = toggleSource;
  window.formatCard = formatCard;
  window.submitRegistration = submitRegistration;
})();
