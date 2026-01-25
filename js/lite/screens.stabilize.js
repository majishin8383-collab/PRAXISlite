// js/lite/screens.stabilize.js

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[c]));
}

export function screenStabilize() {
  return `
    <section class="card">
      <h2 class="h2">Stabilize</h2>
      <p class="muted">60 seconds. Lower intensity.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack" id="stbMain">
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

        <div class="tileStack">
          <button class="tile" data-close="REST" data-line="Stop here." type="button">
            <div class="tileMain">
              <div class="tileTitle">REST</div>
              <div class="tileSub">Stop here.</div>
              <div class="tileHint">Tap</div>
            </div>
            <span class="tileDot dotBlue" aria-hidden="true"></span>
          </button>

          <button class="tile" data-close="RELIEF" data-line="Pressure reduced." type="button">
            <div class="tileMain">
              <div class="tileTitle">RELIEF</div>
              <div class="tileSub">Pressure reduced.</div>
              <div class="tileHint">Tap</div>
            </div>
            <span class="tileDot dotYellow" aria-hidden="true"></span>
          </button>

          <button class="tile" data-close="READINESS" data-line="One small step is available." data-go="moveforward" type="button">
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
      </div>

      <div id="stbClosed" style="display:none; margin-top:0;">
        <!-- injected end-state -->
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.stabilize = (root, router) => {
  const main = root.querySelector("#stbMain");
  const closed = root.querySelector("#stbClosed");

  function showClosed(flow, state, line) {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem(
        "praxis_lite_last_closure",
        JSON.stringify({ flow, state, line, stamp })
      );
    } catch {}

    // Swap UI to true end-state (no extra options/no meta copy)
    main.style.display = "none";
    closed.style.display = "block";

    closed.innerHTML = `
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">${escapeHtml(state)}</div>
          <div class="tileSub">${escapeHtml(line)}</div>
          <div class="tileHint">Ended.</div>
        </div>
        <span class="tileDot dotGreen" aria-hidden="true"></span>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stop here</div>
            <div class="tileSub">Return to start.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="stabilize" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stabilize</div>
            <div class="tileSub">Lower intensity.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>
      </div>
    `;

    // wire new buttons
    closed.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
    });

    closed.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // normal nav
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  // closure buttons become real end-state
  root.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const state = btn.getAttribute("data-close");
      const line = btn.getAttribute("data-line") || "Stop here.";
      showClosed("stabilize", state, line);

      // if readiness wants moveforward, we still let it go — but only AFTER closure is shown?
      // Governance-safe choice: if they tapped readiness + go, take them to moveforward immediately.
      const go = btn.getAttribute("data-go");
      if (go) router.go(go);
    });
  });
};
