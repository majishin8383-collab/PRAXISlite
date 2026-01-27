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

        <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">End</div>

        <button class="tile" data-end="REST" data-line="Stop here." type="button">
          <div class="tileMain">
            <div class="tileTitle">REST</div>
            <div class="tileSub">Stop here.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-end="RELIEF" data-line="Pressure reduced." type="button">
          <div class="tileMain">
            <div class="tileTitle">RELIEF</div>
            <div class="tileSub">Pressure reduced.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

        <button class="tile" data-end="READINESS" data-line="One small step is available." type="button">
          <div class="tileMain">
            <div class="tileTitle">READINESS</div>
            <div class="tileSub">One small step is available.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
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
  function end(flow, state, line) {
    try {
      sessionStorage.setItem(
        "praxis_lite_closure",
        JSON.stringify({ flow, state, line, stamp: new Date().toISOString() })
      );
    } catch {}
    router.go("closure");
  }

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-end]").forEach((btn) => {
    btn.addEventListener("click", () => {
      end("stabilize", btn.getAttribute("data-end"), btn.getAttribute("data-line") || "Stop here.");
    });
  });
};
