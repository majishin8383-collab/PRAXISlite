import { renderHome, setMain } from "./ui.js";

function boot() {
  const homeBtn = document.getElementById("navHome");
  homeBtn?.addEventListener("click", () => setMain(renderHome()));

  setMain(renderHome());
}

boot();
