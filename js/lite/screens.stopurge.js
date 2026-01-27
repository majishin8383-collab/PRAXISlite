// js/lite/screens.stopurge.js

export function screenStopUrge() {
  return `
    <section class="card">
      <h2 class="h2">Stop the Urge</h2>
      <p class="muted">Interrupt. Reduce access. Delay.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">10-minute delay</div>
            <div class="tileSub">Delay is allowed.</div>
            <div class="tileBody">
              <ol class="liteList">
                <li>Put the trigger out of reach.</li>
                <li>Water. Breath. Stand up.</li>
                <li>Return in 10 minutes.</li>
              </ol>
            </div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </div>

        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">Reduce access</div>
            <div class="tileSub">Make the urge harder to follow.</div>
            <div class="tileBody">
              <ol class="liteList">
                <li>Move it away.</li>
                <li>Close the app.</li>
                <li>Change rooms.</li>
              </ol>
            </div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
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
window.__LITE_HOOKS.stopurge = (root, router) => {
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
      end("stopurge", btn.getAttribute("data-end"), btn.getAttribute("data-line") || "Stop here.");
    });
  });
};
