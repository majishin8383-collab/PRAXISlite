window.addEventListener("error", (e) => {
  const main = document.getElementById("main");
  if (main) {
    main.innerHTML = `
      <div style="padding:16px;border:1px solid rgba(255,0,0,.35);border-radius:14px;background:rgba(255,0,0,.08)">
        <div style="font-weight:900;margin-bottom:6px">Praxis Debug Error</div>
        <div style="font-family:monospace;white-space:pre-wrap">${e.message}</div>
      </div>
    `;
  }
});

window.addEventListener("unhandledrejection", (e) => {
  const main = document.getElementById("main");
  const msg = (e.reason && e.reason.message) ? e.reason.message : String(e.reason);
  if (main) {
    main.innerHTML = `
      <div style="padding:16px;border:1px solid rgba(255,0,0,.35);border-radius:14px;background:rgba(255,0,0,.08)">
        <div style="font-weight:900;margin-bottom:6px">Praxis Debug Error</div>
        <div style="font-family:monospace;white-space:pre-wrap">${msg}</div>
      </div>
    `;
  }
});

import { renderHome, setMain } from "./ui.js";

function boot() {
  const homeBtn = document.getElementById("navHome");
  homeBtn?.addEventListener("click", () => setMain(renderHome()));
  setMain(renderHome());
}

boot();
