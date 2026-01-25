// js/lite/screens.stabilize.js
export function screenStabilize() {
  return `
    <section class="card">
      <h2 class="h2">Stabilize</h2>
      <p class="muted">60 seconds. Lower the volume. Nothing has to be solved right now.</p>

      <div class="card" style="margin-top:12px;">
        <h3 class="h3">4–2–6 Breath</h3>
        <ol class="list">
          <li>Inhale through the nose for <strong>4</strong></li>
          <li>Hold for <strong>2</strong></li>
          <li>Exhale slowly for <strong>6</strong></li>
          <li>Repeat 5 cycles</li>
        </ol>
        <p class="muted" style="margin-top:10px;">
          If your mind wanders, that’s normal. Come back to the exhale.
        </p>
      </div>

      <div class="btnRow" style="margin-top:12px;">
        <button class="ghostBtn" data-go="home" type="button">Back</button>
        <button class="primaryBtn" data-go="act" type="button">Next: Act (DOS)</button>
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
