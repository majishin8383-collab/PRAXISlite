import { renderSimpleFlow } from "../../ui.js";

export function renderCalm() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Calm Me Down</h3>
    <p>Slow the body. Reduce intensity. Nothing else matters right now.</p>

    <div class="hr"></div>

    <ul class="list">
      <li class="item">
        <strong>Breathing</strong>
        <span>Inhale 4 seconds · Exhale 6 seconds (5 rounds)</span>
      </li>
      <li class="item">
        <strong>Posture</strong>
        <span>Drop your shoulders. Unclench your jaw.</span>
      </li>
      <li class="item">
        <strong>Orientation</strong>
        <span>Name 3 things you can see. Feel your feet.</span>
      </li>
    </ul>
  `;

  return renderSimpleFlow(
    "Calm Me Down",
    "Lower the intensity so you can choose your next move.",
    "Calming",
    block,
    "Continue",
    "#/yellow/urge"
  );
}
