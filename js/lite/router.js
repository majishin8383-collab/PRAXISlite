// js/lite/router.js
// Allowed routes for Praxis Lite ONLY.

export const router = (() => {
  let onRoute = null;
  let defaultRoute = "home";

  const ALLOWED = new Set([
    "home",
    "stabilize",
    "stopurge",
    "emergency",
    "moveforward",
    "closure",
  ]);

  function clean(route) {
    const r = String(route || "").toLowerCase().trim();
    return ALLOWED.has(r) ? r : defaultRoute;
  }

  function current() {
    const hash = window.location.hash || "";
    return clean(hash.replace("#", ""));
  }

  function go(route) {
    const r = clean(route);
    window.location.hash = `#${r}`;
  }

  function handle() {
    const r = current();
    try { onRoute?.(r); } catch (e) { console.warn(e); }
  }

  function init(opts = {}) {
    onRoute = opts.onRoute || null;
    defaultRoute = opts.defaultRoute || "home";
    window.addEventListener("hashchange", handle);
    handle();
  }

  return { init, go, current };
})();
