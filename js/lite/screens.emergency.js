// js/lite/screens.emergency.js

export function screenEmergency() {
  return `
    <section class="card">
      <h2 class="h2">Emergency</h2>
      <p class="muted">Outside help is allowed.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">If you are in immediate danger</div>
            <div class="tileSub">Use local emergency services.</div>
          </div>
          <span class="tileDot dotRed" aria-hidden="true"></span>
        </div>

        <div class="tile tileStatic">
          <div class="tileMain">
            <div class="tileTitle">United States</div>
            <div class="tileSub">Call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline).</div>
            <div class="tileHint">This is outside Praxis.</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
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

        <button class="tile" data-go="stabilize" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stabilize</div>
            <div class="tileSub">Lower intensity.</div>
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

      <div id="emSavedWrap" style="margin-top:14px; display:none;">
        <div class="tile tileStatic" id="emSaved"></div>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.emergency = (root, router) => {
  const wrap = root.querySelector("#emSavedWrap");
  const box = root.querySelector("#emSaved");

  function saveClosure(state) {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem("praxis_lite_last_closure", JSON.stringify({ flow: "emergency", state, stamp }));
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
    btn.addEventListener("click", () => saveClosure(btn.getAttribute("data-close")));
  });
};
