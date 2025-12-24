import { setMain, renderHome } from "./ui.js";

import { renderFocusSprint } from "./zones/green/focusSprint.js";
import { renderCalm } from "./zones/yellow/calm.js";
import { renderNoContact } from "./zones/yellow/noContactShield.js";
import { renderEmergency } from "./zones/red/emergency.js";

const routes = new Map([
  ["#/home", () => renderHome()],
  ["#/green/focus", () => renderFocusSprint()],
  ["#/yellow/calm", () => renderCalm()],
  ["#/yellow/nocontact", () => renderNoContact()],
  ["#/red/emergency", () => renderEmergency()],
]);

export function navigate(hash) {
  location.hash = hash;
}

function getRoute() {
  const hash = location.hash || "#/home";
  return routes.get(hash) || routes.get("#/home");
}

function onRouteChange() {
  const view = getRoute()();
  setMain(view);
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function initRouter() {
  // Top nav Home button
  const homeBtn = document.getElementById("navHome");
  homeBtn?.addEventListener("click", () => navigate("#/home"));

  // Ensure we always have a route
  if (!location.hash) location.hash = "#/home";

  window.addEventListener("hashchange", onRouteChange);
  onRouteChange();
}
