import { renderSimpleFlow } from "../../ui.js";

export function renderStopUrge() {
  const block = document.createElement("div");
  block.className = "block";
  block.innerHTML = `
    <h3>Stop the Urge</h3>
    <p>Delay → distance → redirect.</p>
    <div class="hr"></div>
    <ul class="list">
      <li class="item"><strong>1) Name it</strong><span>“This is an urge, not a command.”</span></li>
      <li class="item"><strong>2) Delay</strong><span>Set a 10-minute timer. No action until it ends.</span></li>
      <li class="item"><strong>3) Redirect</strong><span>Do one body action: water, walk, shower, push-ups.</span></li>
    </ul>
  `;

  return renderSimpleFlow(
    "Stop the Urge",
    "Delay → distance → redirect.",
    "Urge contained",
    block,
    "Continue",
    "#/green/move"
  );
}
