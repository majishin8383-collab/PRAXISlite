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

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

const KEY_LAST_STEP = "praxis_lite_last_step";

const PRESETS = [
  "Drink water",
  "Five slow breaths",
  "Stand and stretch",
  "Step near a window",
  "Delay for 10 minutes",
  "One sentence note",
  "Smallest part only",
];

function renderEndHtml(lastText) {
  return `
    <section class="card">
      <h2 class="h2">End</h2>
      <p class="muted">You can stop here.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">Ended.</div>
          <div class="tileSub">${lastText ? escapeHtml(lastText) : "Done."}</div>
          <div class="tileHint">Returning to start…</div>
        </div>
        <span class="tileDot dotBlue" aria-hidden="true"></span>
      </div>
    </section>
  `;
}

export function screenMoveForward() {
  const last = safeParse(localStorage.getItem(KEY_LAST_STEP), null);
  const lastText = last && typeof last.text === "string" ? last.text : "";

  // END STATE: show the action they chose + a real "Done" ending
  if (lastText) {
    return `
      <section class="card">
        <h2 class="h2">Move Forward</h2>
        <p class="muted">One small step.</p>
      </section>

      <section class="card" style="margin-top:14px;">
        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">Your step</div>
            <div class="tileSub">${escapeHtml(lastText)}</div>
            <div class="tileHint">Taken.</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </div>

        <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">End</div>

        <div class="tileStack">
          <button class="tile" data-done="1" type="button">
            <div class="tileMain">
              <div class="tileTitle">Done</div>
              <div class="tileSub">You can stop here.</div>
              <div class="tileHint">Tap</div>
            </div>
            <span class="tileDot dotBlue" aria-hidden="true"></span>
          </button>

          <button class="tile" data-reset="1" type="button">
            <div class="tileMain">
              <div class="tileTitle">Pick a different step</div>
              <div class="tileSub">Show options again.</div>
              <div class="tileHint">Tap</div>
            </div>
            <span class="tileDot dotYellow" aria-hidden="true"></span>
          </button>
        </div>
      </section>
    `;
  }

  // PICK STATE: show presets
  const presetHtml = PRESETS.map((p) => `
    <button class="tile" data-preset="${escapeHtml(p)}" type="button">
      <div class="tileMain">
        <div class="tileTitle">${escapeHtml(p)}</div>
        <div class="tileSub">Tap.</div>
        <div class="tileHint">Tap</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    </button>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">One small step.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        ${presetHtml}
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
  function saveStep(text) {
    try {
      localStorage.setItem(
        KEY_LAST_STEP,
        JSON.stringify({ text, stamp: new Date().toISOString() })
      );
    } catch {}
  }

  function clearStep() {
    try { localStorage.removeItem(KEY_LAST_STEP); } catch {}
  }

  // IMPORTANT: re-render this screen IN PLACE (router won't refresh same route)
  function rerenderSelf() {
    root.innerHTML = screenMoveForward();
    window.__LITE_HOOKS.moveforward(root, router);
  }

  // nav
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  // preset tap -> save + show end-state on THIS screen
  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-preset") || "One small step.";
      saveStep(action);
      rerenderSelf();
    });
  });

  // done -> FORCE show End UI immediately (no storage dependency), then go home
  root.querySelectorAll("[data-done]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const last = safeParse(localStorage.getItem(KEY_LAST_STEP), null);
      const lastText = last && typeof last.text === "string" ? last.text : "";

      root.innerHTML = renderEndHtml(lastText);

      setTimeout(() => {
        clearStep();
        router.go("home");
      }, 900);
    });
  });

  // reset -> clear + show presets again
  root.querySelectorAll("[data-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearStep();
      rerenderSelf();
    });
  });
};.
