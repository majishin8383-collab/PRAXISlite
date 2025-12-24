import { renderSimpleFlow } from "../../ui.js";

export function renderCalm() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Calm Me Down</h3>
    <p>Reduce intensity. Regain choice.</p>
    <div class="hr"></div>
    <ul class="list">
      <li class="item"><strong>Round 1</strong><span>In 4 / Out 6</span></li>
      <li class="item"><strong>Round 2</strong><span>In 4 / Out 7</span></li>
      <li class="item"><strong>Round 3</strong><span>In 4 / Out 8</span></li>
    </ul>
    <div class="hr"></div>
    <label>Where is it strongest?</label>
    <input class="input" placeholder="e.g., chest, jaw, stomach" />
  `;

  return renderSimpleFlow(
    "Calm Me Down",
    "Reduce intensity. Regain choice.",
    "Calm engaged",
    block,
    "Continue",
    "#/yellow/urge"
  );
}
