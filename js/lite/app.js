// js/lite/app.js
import { router } from "./router.js";
import { screenHome } from "./screens.home.js";
import { screenStabilize } from "./screens.stabilize.js";
import { screenAct } from "./screens.act.js";
import { screenMoveForward } from "./screens.moveforward.js";

const SCREENS = {
  home: screenHome,
  stabilize: screenStabilize,
  act: screenAct,
  moveforward: screenMoveForward,
};

function ensureShell() {
  const main = document.getElementById("main");
  if (!main) throw new Error("Missing #main container");
  return main;
}

function setResetBehavior() {
  const btn = document.getElementById("navHome");
  if (!btn) return;
  btn.onclick = () => router.go("home");
}

function render(name) {
  const main = ensureShell();
  const fn = SCREENS[name] || SCREENS.home;
  main.innerHTML = fn();
  main.scrollTop = 0;

  // Screen-specific wiring (optional hooks)
  const hook = window.__LITE_HOOKS?.[name];
  try { hook?.(main, router); } catch (e) { console.warn(e); }
}

function init() {
  setResetBehavior();

  router.init({
    defaultRoute: "home",
    onRoute: (routeName) => render(routeName),
  });
}

init();
