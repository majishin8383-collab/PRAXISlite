// js/lite/screens.moveforward.js
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[c]));
}

export function screenMoveForward() {
  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">One small useful action. Keep it tiny and real.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">Your one action</div>
          <div class="tileSub">Keep it small enough to do today.</div>
          <div class="tileBody" style="margin-top:10px;">
            <input id="mfAction" class="liteInput" maxlength="120"
              placeholder="Example: drink water, take a 5-min walk, send one text" />
          </div>
        </div>
        <span class="tileDot dotBlue" aria-hidden="true"></span>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-status="done" type="button">
          <div class="tileMain">
            <div class="tileTitle">Done</div>
            <div class="tileSub">I did it.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

        <button class="tile" data-status="delay" type="button">
          <div class="tileMain">
            <div class="tileTitle">Delay</div>
            <div class="tileSub">Not now. Later today.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

        <button class="tile" data-status="drop" type="button">
          <div class="tileMain">
            <div class="tileTitle">Drop it</div>
            <div class="tileSub">Not useful right now. Let it go.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotRed" aria-hidden="true"></span>
        </button>
      </div>

      <div id="mfSavedWrap" style="margin-top:14px; display:none;">
        <div class="tile tileStatic" id="mfSaved"></div>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Back</div>
            <div class="tileSub">Return to start.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>
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
  const wrap = root.querySelector("#mfSavedWrap");
  const box = root.querySelector("#mfSaved");

  function save(status) {
    const text = (input.value || "").trim();
    if (!text) {
      input.focus();
      return;
    }

    const stamp = new Date().toISOString();
    const payload = { text, status, stamp };

    try {
      localStorage.setItem("praxis_lite_last_moveforward", JSON.stringify(payload));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">Saved</div>
        <div class="tileSub"><strong>Action:</strong> ${escapeHtml(text)}</div>
        <div class="tileHint"><strong>Status:</strong> ${escapeHtml(status.toUpperCase())}</div>
      </div>
      <span class="tileDot dotBlue" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  root.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", () => save(btn.getAttribute("data-status")));
  });
};
