const mainEl = () => document.getElementById("main");

export function setMain(node) {
  const main = mainEl();
  if (!main) return;
  main.innerHTML = "";
  if (node) main.appendChild(node);
}

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

function card(title, subtitle) {
  const wrap = el("section", "card");
  const head = el("div", "cardHead");
  head.appendChild(el("h1", "h1", title));
  head.appendChild(el("p", "sub", subtitle));
  wrap.appendChild(head);

  const body = el("div", "cardBody");
  wrap.appendChild(body);

  return { wrap, body };
}

function navTo(hash) {
  location.hash = hash;
}

export function renderHome() {
  // Home = Reset (top button). 6-button home screen.
  const { wrap, body } = card(
    "Reset",
    "Home. Start here when you’re spun up."
  );

  // Reset content block
  const reset = el("div", "block");
  reset.appendChild(el("h3", "", "30-second reset"));
  reset.appendChild(el("p", "", "Exhale longer than you inhale. Shoulders down. Feet on the floor."));
  reset.appendChild(el("div", "hr"));

  const ul = el("ul", "list");
  const li1 = el("li", "item");
  li1.innerHTML = "<strong>Step 1</strong><span>Name 5 things you see.</span>";
  const li2 = el("li", "item");
  li2.innerHTML = "<strong>Step 2</strong><span>Feet into the ground for 10 seconds.</span>";
  const li3 = el("li", "item");
  li3.innerHTML = "<strong>Step 3</strong><span>Exhale 6 / Inhale 4 × 5.</span>";
  ul.appendChild(li1); ul.appendChild(li2); ul.appendChild(li3);
  reset.appendChild(ul);

  body.appendChild(reset);

  // Home buttons (Reset at top, plus 5 others = 6 total)
  const homeStack = el("div", "homeStack");

  const resetBtn = el("button", "homePrimary");
  resetBtn.type = "button";
  resetBtn.innerHTML = `Reset <span class="hint">Interrupt the spiral fast.</span>`;
  resetBtn.addEventListener("click", () => navTo("#/home"));
  homeStack.appendChild(resetBtn);

  const grid = el("div", "homeGrid");

  const buttons = [
    { label: "Calm Me Down", hint: "Reduce intensity. Regain choice.", hash: "#/yellow/calm" },
    { label: "Stop the Urge", hint: "Delay → distance → redirect.", hash: "#/yellow/urge" },
    { label: "Move Forward", hint: "One small step that improves today.", hash: "#/green/move" },
    { label: "Get Something Done", hint: "Activate body movement quickly.", hash: "#/green/focus" },
    { label: "Emergency", hint: "Fast stabilization tools.", hash: "#/red/emergency" },
  ];

  for (const b of buttons) {
    const btn = el("button", "homeBtn");
    btn.type = "button";
    btn.innerHTML = `${b.label} <span class="hint">${b.hint}</span>`;
    btn.addEventListener("click", () => navTo(b.hash));
    grid.appendChild(btn);
  }

  homeStack.appendChild(grid);
  wrap.appendChild(homeStack);

  return wrap;
}

export function renderSimpleFlow(title, subtitle, status, contentNode, primaryLabel, primaryHash) {
  const { wrap, body } = card(title, subtitle);

  if (contentNode) body.appendChild(contentNode);

  const foot = el("div", "cardFoot");
  const pill = el("span", "pill", status || "Ready");

  const actions = el("div", "actions");
  const home = el("button", "linkBtn");
  home.type = "button";
  home.textContent = "Reset (Home)";
  home.addEventListener("click", () => navTo("#/home"));

  const primary = el("button", "btn");
  primary.type = "button";
  primary.textContent = primaryLabel || "Continue";
  primary.addEventListener("click", () => navTo(primaryHash || "#/home"));

  actions.appendChild(home);
  actions.appendChild(primary);

  foot.appendChild(pill);
  foot.appendChild(actions);

  wrap.appendChild(foot);

  return wrap;
}
