// js/lite/router.js
// Tiny hash router: #home, #stabilize, #act, #moveforward
export const router = (() => {
  let onRoute = null;
  let defaultRoute = "home";

  function clean(route) {
    const r = String(route || "").toLowerCase().trim();
    if (!r) return defaultRoute;

    // Hard-lock to Lite routes only
    if (r === "home" || r === "stabilize" || r === "act" || r === "moveforward") return r;
    return defaultRoute;
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
