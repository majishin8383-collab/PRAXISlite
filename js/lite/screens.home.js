// js/lite/screens.home.js
export function screenHome() {
  return `
    <section class="card">
      <h1 class="h1">Praxis Lite</h1>
      <p class="muted">
        Choose what you need right now. Keep it simple. Keep it moving.
      </p>

      <div class="btnGrid" style="margin-top:12px;">
        <button class="primaryBtn" data-go="stabilize" type="button">🟢 Stabilize</button>
        <button class="primaryBtn" data-go="act" type="button">🟡 Act (DOS)</button>
        <button class="primaryBtn" data-go="moveforward" type="button">🔵 Move Forward</button>
      </div>

      <div class="divider" style="margin:14px 0;"></div>

      <p class="muted" style="margin:0;">
        <strong>Goal:</strong> lower the volume → choose the safest next action → do one small useful thing.
      </p>
    </section>
  `;
}

// Hook wiring for this screen
window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.home = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });
};
