// js/lite/screens.home.js
export function screenHome() {
  return `
    <section class="card">
      <h1 class="h1">PRAXIS LITE</h1>
      <p class="muted">Start with your state. One tap.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="muted" style="font-weight:700; opacity:.8; margin-bottom:2px;">Start here</div>
      <div class="h2" style="margin:0 0 6px 0;">What do you need right now?</div>
      <div class="muted" style="margin:0 0 12px 0;">One tap. No thinking.</div>

      <div class="tileStack">
        <button class="tile" data-go="stabilize" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stabilize</div>
            <div class="tileSub">Lower intensity first.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="stopurge" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stop the Urge</div>
            <div class="tileSub">Interrupt the loop.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="moveforward" type="button">
          <div class="tileMain">
            <div class="tileTitle">Move Forward</div>
            <div class="tileSub">One small useful step.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="emergency" type="button">
          <div class="tileMain">
            <div class="tileTitle">Emergency</div>
            <div class="tileSub">Outside help is allowed.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotRed" aria-hidden="true"></span>
        </button>
      </div>
    </section>
  `;
}

// Hook wiring for this screen
window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.home = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () =>
      router.go(btn.getAttribute("data-go"))
    );
  });
};
