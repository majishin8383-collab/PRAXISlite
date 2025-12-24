import { renderSimpleFlow } from "../../ui.js";

export function renderFocusSprint() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Get Something Done</h3>
    <p>Body movement first. Then one small action.</p>
    <div class="hr"></div>
    <ul class="list">
      <li class="item"><strong>Step 1</strong><span>60 seconds: walk in place / pace / stairs.</span></li>
      <li class="item"><strong>Step 2</strong><span>Pick 1 task that takes 2–10 minutes.</span></li>
      <li class="item"><strong>Step 3</strong><span>Start now. No optimizing.</span></li>
    </ul>
  `;

  return renderSimpleFlow(
    "Get Something Done",
    "Activate the body. Break the freeze.",
    "Activation ready",
    block,
    "Next: Move Forward",
    "#/green/move"
  );
}
