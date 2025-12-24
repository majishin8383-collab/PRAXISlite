import { renderSimpleFlow } from "../../ui.js";

export function renderEmergency() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Emergency</h3>
    <p>Fast stabilization. Pick one and do it now.</p>
    <div class="hr"></div>
    <ul class="list">
      <li class="item"><strong>Cold</strong><span>Splash cold water or cold pack 20–30s.</span></li>
      <li class="item"><strong>Move</strong><span>30 squats or brisk walk 2 minutes.</span></li>
      <li class="item"><strong>Orient</strong><span>Name 5 objects. Hear 3 sounds. Feel your feet.</span></li>
    </ul>
  `;

  return renderSimpleFlow(
    "Emergency",
    "Fast stabilization tools.",
    "Emergency ready",
    block,
    "Back to Home",
    "#/home"
  );
}
