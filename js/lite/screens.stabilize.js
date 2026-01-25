// js/lite/screens.stabilize.js
export function screenStabilize() {
  return `
    <section class="card">
      <h2 class="h2">Stabilize</h2>
      <p class="muted">60 seconds. Lower the volume. Nothing has to be solved right now.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        <div class="tile tileStatic" role="group" aria-label="Breathing exercise">
          <div class="tileMain">
            <div class="tileTitle">4–2–6 Breath</div>
            <div class="tileSub">Inhale 4 • Hold 2 • Exhale 6</div>
            <div class="tileBody">
              <ol class="liteList">
                <li>Inhale through the nose for <strong>4</strong></li>
                <li>Hold for <strong>2</strong></li>
                <li>Exhale slowly for <strong>6</strong></li>
                <li>Repeat <strong>5</strong> cycles</li>
              </ol>
              <p class="muted" style="margin-top:10px;">
                If your mind wanders, that’s normal. Come back to the exhale.
              </p>
            </div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </div>
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

        <button class="tile" data-go="act" type="button">
          <div class="tileMain">
            <div class="tileTitle">Next: Act (DOS)</div>
            <div class="tileSub">Choose the safest next action.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.stabilize = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });
};
