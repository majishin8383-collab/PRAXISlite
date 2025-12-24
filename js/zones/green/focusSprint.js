export function renderFocusSprint() {
  const d = document.createElement("div");
  d.className = "flowShell";
  d.innerHTML = `
    <div class="card cardPad">
      <h2 class="h2">Focus Sprint</h2>
      <p class="p">Placeholder loaded. Routing works.</p>
      <p class="small">Next: we’ll paste the full timer + logging version.</p>
    </div>
  `;
  return d;
}
