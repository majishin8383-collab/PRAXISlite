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
      </div>

      <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">Closure</div>

      <div class="tileStack">
        <button class="tile" data-close="REST" type="button">
          <div class="tileMain">
            <div class="tileTitle">REST</div>
            <div class="tileSub">Stop here.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-close="RELIEF" type="button">
          <div class="tileMain">
            <div class="tileTitle">RELIEF</div>
            <div class="tileSub">Pressure reduced.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

        <button class="tile" data-close="READINESS" data-go="moveforward" type="button">
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

      <div id="stbSavedWrap" style="margin-top:14px; display:none;">
        <div class="tile tileStatic" id="stbSaved"></div>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.stabilize = (root, router) => {
  const wrap = root.querySelector("#stbSavedWrap");
  const box = root.querySelector("#stbSaved");

  function saveClosure(state) {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem("praxis_lite_last_closure", JSON.stringify({ flow: "stabilize", state, stamp }));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">${state}</div>
        <div class="tileSub">Closure named.</div>
        <div class="tileHint">Return when ready.</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      saveClosure(btn.getAttribute("data-close"));
      const go = btn.getAttribute("data-go");
      if (go) router.go(go);
    });
  });
};
