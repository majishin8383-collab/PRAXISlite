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

  function normalize(raw) {
    let r = String(raw || "").trim().toLowerCase();

    // remove querystring if any
    const q = r.indexOf("?");
    if (q !== -1) r = r.slice(0, q);

    // remove leading slashes (handles "#/closure")
    while (r.startsWith("/")) r = r.slice(1);

    // remove trailing slashes
    while (r.endsWith("/")) r = r.slice(0, -1);

    return r;
  }

  function clean(route) {
    const r = normalize(route);
    return ALLOWED.has(r) ? r : defaultRoute;
  }

  function current() {
    const hash = window.location.hash || "";
    // hash is "#something" or "#/something"
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    return clean(raw);
  }

  function go(route) {
    const r = clean(route);
    const target = `#${r}`;

    // If already on this route, force a rerender anyway.
    if (window.location.hash === target) {
      try { onRoute?.(r); } catch (e) { console.warn(e); }
      return;
    }

    window.location.hash = target;
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
