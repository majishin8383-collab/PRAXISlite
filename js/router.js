import { setMain, renderHome } from "./ui.js";

// Existing working flows (these should exist)
import { renderFocusSprint } from "./zones/green/focusSprint.js";
import { renderTodayPlan } from "./zones/green/todayPlan.js";
import { renderCalm } from "./zones/yellow/calm.js";
import { renderNoContact } from "./zones/yellow/noContactShield.js";
import { renderEmergency } from "./zones/red/emergency.js";
import { renderReflect } from "./zones/reflect.js";

// Temporary bridges so new Reset tiles never dead-end
function renderMoveForwardBridge() { return renderFocusSprint(); }
function renderDirectionBridge() { return renderTodayPlan(); }
function renderNextStepBridge() { return renderHome(); }

const routes = new Map([
  ["#/home", () => renderHome()],

  ["#/green/focus", () => renderFocusSprint()],
  ["#/green/today", () => renderTodayPlan()],
  ["#/yellow/calm", () => renderCalm()],
  ["#/yellow/nocontact", () => renderNoContact()],
  ["#/red/emergency", () => renderEmergency()],
  ["#/reflect", () => renderReflect()],

  ["#/green/move", () => renderMoveForwardBridge()],
  ["#/green/direction", () => renderDirectionBridge()],
  ["#/green/next", () => renderNextStepBridge()],
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
  const homeBtn = document.getElementById("navHome");
  homeBtn?.addEventListener("click", () => (location.hash = "#/home"));

  if (!location.hash) location.hash = "#/home";

  window.addEventListener("hashchange", onRouteChange);
  onRouteChange();
}
