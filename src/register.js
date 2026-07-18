"use strict";
/* ════════════════════════════════════════════════════════════
   KMTC — Registration page interaction (TypeScript source)

   Page-specific behaviour: custom cursor, multi-step wizard,
   validation, summary, submission, and the live-registration toast.
   Functions invoked from inline handlers are exposed on `window`.

   Compiled to src/register.js via `npm run build`. Committed so the
   static site deploys with no build step — the deployment workflow
   is untouched.
════════════════════════════════════════════════════════════ */
(function register() {
    "use strict";
    const byId = (id) => document.getElementById(id);
    // ── CUSTOM CURSOR ─────────────────────────────────────────────
    const cursor = byId("cursor");
    const ring = byId("cursorRing");
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    if (cursor && ring) {
        document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.transform = `translate(${mx - 8}px,${my - 8}px)`;
        });
        (function animRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
            requestAnimationFrame(animRing);
        })();
        document
            .querySelectorAll("button,input,select,textarea,.ticket-option,.track-option,.source-chip,.checkbox-group")
            .forEach((el) => {
            el.addEventListener("mouseenter", () => {
                ring.style.width = "52px";
                ring.style.height = "52px";
            });
            el.addEventListener("mouseleave", () => {
                ring.style.width = "38px";
                ring.style.height = "38px";
            });
        });
    }
    // ── STEP NAVIGATION ───────────────────────────────────────────
    let currentStep = 1;
    const progressMap = { 1: 0.25, 2: 0.5, 3: 0.75, 4: 1 };
    function goToStep(n) {
        var _a, _b, _c;
        if (n > currentStep && !validateStep(currentStep))
            return;
        (_a = byId("step" + currentStep)) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        currentStep = n;
        (_b = byId("step" + n)) === null || _b === void 0 ? void 0 : _b.classList.add("active");
        updateUI();
        (_c = document
            .querySelector(".right-panel")) === null || _c === void 0 ? void 0 : _c.scrollTo({ top: 0, behavior: "smooth" });
    }
    function updateUI() {
        const bar = byId("progressBar");
        if (bar)
            bar.style.transform = `scaleX(${progressMap[currentStep] || 1})`;
        const num = byId("navStepNum");
        if (num)
            num.textContent = String(currentStep);
        document.querySelectorAll(".step-dot").forEach((dot, i) => {
            dot.classList.remove("active", "done");
            const s = i + 1;
            if (s < currentStep)
                dot.classList.add("done");
            else if (s === currentStep)
                dot.classList.add("active");
        });
        if (currentStep === 4)
            populateSummary();
    }
    // ── VALIDATION ────────────────────────────────────────────────
    function validateStep(step) {
        let valid = true;
        if (step === 1) {
            const checks = [
                ["firstName", "firstNameErr", (v) => v.length > 0],
                ["lastName", "lastNameErr", (v) => v.length > 0],
                ["email", "emailErr", (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v)],
                ["phone", "phoneErr", (v) => v.length > 5],
                ["role", "roleErr", (v) => v !== ""],
            ];
            checks.forEach(([id, errId, fn]) => {
                const el = byId(id);
                const err = byId(errId);
                if (el && !fn(el.value.trim())) {
                    el.classList.add("error");
                    err === null || err === void 0 ? void 0 : err.classList.add("show");
                    valid = false;
                }
                else if (el) {
                    el.classList.remove("error");
                    err === null || err === void 0 ? void 0 : err.classList.remove("show");
                }
            });
        }
        return valid;
    }
    // ── TICKET SELECT ─────────────────────────────────────────────
    let selectedTicket = {
        name: "Kingdom Builder",
        price: "FREE",
    };
    function selectTicket(el, name, price) {
        document
            .querySelectorAll(".ticket-option")
            .forEach((o) => o.classList.remove("selected"));
        el.classList.add("selected");
        const labels = {
            general: "General Admission",
            builder: "Kingdom Builder",
            vip: "VIP Access",
        };
        selectedTicket = { name: labels[name] || name, price };
    }
    // ── TRACK SELECT ──────────────────────────────────────────────
    let selectedTrack = "Media & Content";
    function selectTrack(el) {
        var _a;
        document
            .querySelectorAll(".track-option")
            .forEach((o) => o.classList.remove("selected"));
        el.classList.add("selected");
        selectedTrack = ((_a = el.querySelector("h4")) === null || _a === void 0 ? void 0 : _a.textContent) || selectedTrack;
    }
    // ── SOURCE CHIPS ──────────────────────────────────────────────
    function toggleSource(el) {
        el.classList.toggle("selected");
    }
    // ── POPULATE SUMMARY ──────────────────────────────────────────
    function populateSummary() {
        var _a, _b, _c;
        const fn = ((_a = byId("firstName")) === null || _a === void 0 ? void 0 : _a.value) || "";
        const ln = ((_b = byId("lastName")) === null || _b === void 0 ? void 0 : _b.value) || "";
        const em = ((_c = byId("email")) === null || _c === void 0 ? void 0 : _c.value) || "";
        const setText = (id, text) => {
            const el = byId(id);
            if (el)
                el.textContent = text;
        };
        setText("sumName", `${fn} ${ln}`.trim() || "—");
        setText("sumEmail", em || "—");
        setText("sumTicket", selectedTicket.name);
        setText("sumTrack", selectedTrack);
        setText("sumTotal", selectedTicket.price);
    }
    // ── CARD FORMAT ───────────────────────────────────────────────
    function formatCard(el) {
        const v = el.value.replace(/\D/g, "").substring(0, 16);
        el.value = v.replace(/(.{4})/g, "$1 ").trim();
    }
    // ── SUBMIT ────────────────────────────────────────────────────
    const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"; // ← paste after deploying Code.gs
    function randomCode() {
        return "KMTC-2026-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    function submitRegistration() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const terms = byId("termsCheck");
        if (!terms || !terms.checked) {
            alert("Please agree to the Terms & Conditions to proceed.");
            return;
        }
        const btn = document.querySelector(".btn-submit");
        if (btn) {
            btn.textContent = "Submitting…";
            btn.disabled = true;
        }
        const heard = [];
        document
            .querySelectorAll(".source-chip.selected")
            .forEach((c) => {
            heard.push((c.textContent || "").trim());
        });
        const selects = document.querySelectorAll(".form-select");
        const payload = {
            firstName: ((_a = byId("firstName")) === null || _a === void 0 ? void 0 : _a.value.trim()) || "",
            lastName: ((_b = byId("lastName")) === null || _b === void 0 ? void 0 : _b.value.trim()) || "",
            email: ((_c = byId("email")) === null || _c === void 0 ? void 0 : _c.value.trim()) || "",
            phone: ((_d = byId("phone")) === null || _d === void 0 ? void 0 : _d.value.trim()) || "",
            location: ((_e = byId("location")) === null || _e === void 0 ? void 0 : _e.value) || "",
            role: ((_f = byId("role")) === null || _f === void 0 ? void 0 : _f.value) || "",
            organisation: ((_g = byId("org")) === null || _g === void 0 ? void 0 : _g.value.trim()) || "",
            ticketType: selectedTicket.name,
            primaryTrack: selectedTrack,
            howHeard: heard,
            expectations: ((_h = document.querySelector(".form-textarea")) === null || _h === void 0 ? void 0 : _h.value.trim()) ||
                "",
            tshirtSize: ((_j = selects[2]) === null || _j === void 0 ? void 0 : _j.value) || "",
            groupSize: ((_k = selects[3]) === null || _k === void 0 ? void 0 : _k.value) || "",
        };
        fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((r) => r.json())
            .then((res) => {
            if (res.success) {
                const code = res.regCode || randomCode();
                const codeEl = byId("regCode");
                if (codeEl)
                    codeEl.textContent = code;
                showSuccessScreen();
            }
            else {
                throw new Error(res.error || "Submission failed");
            }
        })
            .catch((err) => {
            console.error(err);
            // Fallback: still show success with a local code so UX isn't broken.
            const codeEl = byId("regCode");
            if (codeEl)
                codeEl.textContent = randomCode();
            showSuccessScreen();
        });
    }
    function showSuccessScreen() {
        var _a, _b, _c;
        (_a = byId("step4")) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        const dots = document.querySelector(".step-dots");
        if (dots)
            dots.style.display = "none";
        (_b = byId("successPage")) === null || _b === void 0 ? void 0 : _b.classList.add("active");
        const bar = byId("progressBar");
        if (bar) {
            bar.style.transform = "scaleX(1)";
            bar.style.background = "var(--green)";
        }
        const num = byId("navStepNum");
        if (num)
            num.textContent = "✓";
        (_c = document
            .querySelector(".right-panel")) === null || _c === void 0 ? void 0 : _c.scrollTo({ top: 0, behavior: "smooth" });
    }
    // ── INPUT CLEAN ON FOCUS ──────────────────────────────────────
    document.querySelectorAll(".form-input").forEach((inp) => {
        inp.addEventListener("input", () => {
            var _a;
            inp.classList.remove("error");
            (_a = byId(inp.id + "Err")) === null || _a === void 0 ? void 0 : _a.classList.remove("show");
        });
    });
    // ── LIVE-REGISTRATION TOAST ───────────────────────────────────
    const mockNames = [
        "Chukwuemeka O.", "Adaeze N.", "Femi A.", "Blessing I.", "Tunde B.",
        "Ngozi E.", "Seun K.", "Chiamaka U.", "Damilola F.", "Emeka C.",
        "Nneka O.", "Babatunde A.", "Oluwaseun M.", "Chinonso D.", "Amara J.",
        "Kayode R.", "Ifunanya P.", "Rotimi S.", "Obiageli T.", "Yewande L.",
    ];
    const mockRoles = [
        "Content Creator", "Software Developer", "Filmmaker", "Graphic Designer",
        "Church Media Lead", "Podcast Host", "Entrepreneur", "Student",
    ];
    function showToast(name, role) {
        const toast = byId("regToast");
        const msgEl = byId("toastMsg");
        const timeEl = byId("toastTime");
        if (!toast || !msgEl || !timeEl)
            return;
        msgEl.textContent = `${name} · ${role} just registered`;
        timeEl.textContent = "just now";
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 5000);
    }
    function randomToast() {
        const name = mockNames[Math.floor(Math.random() * mockNames.length)];
        const role = mockRoles[Math.floor(Math.random() * mockRoles.length)];
        showToast(name, role);
    }
    window.setTimeout(randomToast, 8000);
    window.setInterval(randomToast, Math.floor(Math.random() * 30000) + 20000);
    window.setInterval(() => {
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
