// js/lite/app.js
import { router } from "./router.js";

import { screenHome } from "./screens.home.js";
import { screenStabilize } from "./screens.stabilize.js";
import { screenStopUrge } from "./screens.stopurge.js";
import { screenEmergency } from "./screens.emergency.js";
import { screenMoveForward } from "./screens.moveforward.js";
import { screenClosure } from "./screens.closure.js";

// ✅ Boot lock: prevents double-init (most common cause of “flash then disappear”)
if (window.__PRAXIS_LITE_BOOTED__) {
  console.warn("[Praxis Lite] Boot blocked: already initialized.");
} else {
  window.__PRAXIS_LITE_BOOTED__ = true;

  const SCREENS = {
    home: screenHome,
    stabilize: screenStabilize,
    stopurge: screenStopUrge,
    emergency: screenEmergency,
    moveforward: screenMoveForward,
    closure: screenClosure,
  };

  function getHook(name) {
    return (window.__LITE_HOOKS && window.__LITE_HOOKS[name]) || null;
  }

  function render(route) {
    const main = document.getElementById("main");
    if (!main) return;

    const fn = SCREENS[route] || SCREENS.home;
    main.innerHTML = fn();

    const hook = getHook(route);
    if (hook) hook(main, router);

    const reset = document.getElementById("navHome");
    if (reset) reset.onclick = () => router.go("home");
  }

  router.init({
    defaultRoute: "home",
    onRoute: render,
  });

  console.log("[Praxis Lite] Booted.");
}
