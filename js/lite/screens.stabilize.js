// js/lite/screens.stabilize.js

export function screenStabilize() {
  return `
    <section class="card">
      <h2 class="h2">Stabilize</h2>
      <p class="muted">60 seconds. Lower intensity.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">4–2–6 Breath</div>
            <div class="tileSub">Inhale 4 • Hold 2 • Exhale 6</div>
            <div class="tileBody">
              <ol class="liteList">
                <li>Inhale for <strong>4</strong></li>
                <li>Hold for <strong>2</strong></li>
                <li>Exhale for <strong>6</strong></li>
                <li>Repeat <strong>5</strong> cycles</li>
              </ol>
              <p class="muted" style="margin-top:10px;">Return attention to the exhale.</p>
            </div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </div>

        <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">Next</div>

        <button class="tile" data-next="stopurge" type="button">
          <div class="tileMain">
            <div class="tileTitle">Next</div>
            <div class="tileSub">Stop the Urge</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

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
window.__LITE_HOOKS.stabilize = (root, router) => {
  // normal nav
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  // linear progression
  root.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-next")));
  });
};
