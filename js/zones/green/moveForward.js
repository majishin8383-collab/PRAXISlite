import { renderSimpleFlow } from "../../ui.js";

export function renderMoveForward() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Move Forward</h3>
    <p>One small step that improves today.</p>
    <div class="hr"></div>

    <label>Smallest next action (2–10 minutes)</label>
    <input class="input" id="mfStep" placeholder="e.g., 10 push-ups, take out trash, 1 email…" />

    <div class="hr"></div>

    <label>Start time</label>
    <input class="input" id="mfWhen" placeholder="e.g., now / 9:10am / after coffee" />
  `;

  return renderSimpleFlow(
    "Move Forward",
    "One small step. Then another.",
    "Ready to act",
    block,
    "Commit",
    "#/home"
  );
}
