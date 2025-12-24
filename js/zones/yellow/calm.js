export function renderCalm() {
  const d = document.createElement("div");
  d.className = "flowShell";
  d.innerHTML = `
    <div class="card cardPad">
      <h2 class="h2">Calm Me Down</h2>
      <p class="p">Placeholder loaded. Routing works.</p>
    </div>
  `;
  return d;
}
