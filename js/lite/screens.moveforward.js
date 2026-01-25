// js/lite/screens.moveforward.js
export function screenMoveForward() {
  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">One small useful action. Keep it tiny and real.</p>

      <label class="label" for="mfAction">Your one action</label>
      <input id="mfAction" class="input" maxlength="120" placeholder="Example: drink water, send one text, take a 5-min walk" />

      <div class="btnGrid" style="margin-top:12px;">
        <button class="primaryBtn" data-status="done" type="button">✅ Done</button>
        <button class="primaryBtn" data-status="delay" type="button">⏸ Delay</button>
        <button class="primaryBtn" data-status="drop" type="button">❌ Drop it</button>
      </div>

      <div id="mfSaved" class="card" style="margin-top:12px; display:none;"></div>

      <div class="btnRow" style="margin-top:12px;">
        <button class="ghostBtn" data-go="home" type="button">Back</button>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.moveforward = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  const input = root.querySelector("#mfAction");
  const box = root.querySelector("#mfSaved");

  root.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = (input.value || "").trim();
      if (!text) {
        input.focus();
        return;
      }
      const status = btn.getAttribute("data-status");
      const stamp = new Date().toISOString();
      const payload = { text, status, stamp };

      try {
        localStorage.setItem("praxis_lite_last_moveforward", JSON.stringify(payload));
      } catch {}

      box.style.display = "block";
      box.innerHTML = `
        <h3 class="h3">Saved</h3>
        <p class="muted" style="margin-top:6px;"><strong>Action:</strong> ${escapeHtml(text)}</p>
        <p class="muted" style="margin-top:6px;"><strong>Status:</strong> ${status.toUpperCase()}</p>
      `;
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[c]));
}
