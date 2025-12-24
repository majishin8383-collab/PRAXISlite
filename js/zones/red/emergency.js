export function renderEmergency() {
  const d = document.createElement("div");
  d.className = "flowShell";
  d.innerHTML = `
    <div class="card cardPad redzone">
      <h2 class="h2 redTitle">Emergency</h2>
      <p class="p">Placeholder loaded. Routing works.</p>
      <p class="small">Next: we’ll paste the full Red Zone copy flow.</p>
    </div>
  `;
  return d;
}
