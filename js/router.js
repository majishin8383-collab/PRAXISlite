import { setMain, renderHome } from "./ui.js";

import { renderFocusSprint } from "./zones/green/focusSprint.js";
import { renderMoveForward } from "./zones/green/moveForward.js";

import { renderCalm } from "./zones/yellow/calm.js";
import { renderStopUrge } from "./zones/yellow/stopUrge.js";

import { renderEmergency } from "./zones/red/emergency.js";

const routes = new Map([
  ["#/home", () => renderHome()],
  ["#/green/focus", () => renderFocusSprint()],
  ["#/green/move", () => renderMoveForward()],
  ["#/yellow/calm", () => renderCalm()],
  ["#/yellow/urge", () => renderStopUrge()],
  ["#/red/emergency", () => renderEmergency()],
]);

function getRoute() {
  const hash = location.hash || "#/home";
  return routes.get(hash) || routes.get("#/home");
}

function onRouteChange() {
  const view = getRoute()();
  setMain(view);
  window.scrollTo(0, 0);
}

export function initRouter() {
  document.getElementById("navHome")?.addEventListener("click", () => (location.hash = "#/home"));
  if (!location.hash) location.hash = "#/home";
  window.addEventListener("hashchange", onRouteChange);
  onRouteChange();
}
