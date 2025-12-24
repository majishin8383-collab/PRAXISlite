(() => {
  "use strict";

  // ===== Cache buster / version =====
  const APP_VERSION = "2025-12-24-02"; // bump to bust cache

  // ===== Storage keys =====
  const KEY = {
    state: "praxis_state_v1",
    log: "praxis_log_v1",
  };

  // ===== Routes =====
  const ROUTES = ["home", "step1", "step2", "step3", "step4"];

  // ===== State =====
  const defaultState = {
    route: "home",
    lastVisited: null,

    // NEW: "Continue where you left off"
    lastNonHomeRoute: "step4",          // default bias: move forward
    lastNonHomeLabel: "Move Forward",   // display label
    lastNonHomeAt: null,                // stamp when last set
    // Optional subview within a step (used for Step 4)
    lastSubRoute: null,                 // e.g., "step4_plan", "step4_clarify"

    // Step 4 user preferences (light personalization without overfitting)
    moveForward: {
      preferredMode: "balanced", // "movement" | "productivity" | "balanced"
      lastPlanChoice: null,
    },
  };

  function safeClone(obj) {
    return typeof structuredClone === "function"
      ? structuredClone(obj)
      : JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY.state);
      if (!raw) return safeClone(defaultState);
      const parsed = JSON.parse(raw);
      return {
        ...safeClone(defaultState),
        ...parsed,
        moveForward: {
          ...safeClone(defaultState.moveForward),
          ...(parsed.moveForward || {}),
        },
      };
    } catch {
      return safeClone(defaultState);
    }
  }

  function saveState(next) {
    localStorage.setItem(KEY.state, JSON.stringify(next));
  }

  function loadLog() {
    try {
      const raw = localStorage.getItem(KEY.log);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveLog(items) {
    localStorage.setItem(KEY.log, JSON.stringify(items));
  }

  function nowStamp() {
    const d = new Date();
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function uid() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  function addLog(type, title, note = "") {
    const items = loadLog();
    const entry = {
      id: uid(),
      at: nowStamp(),
      type,
      title,
      note: (note || "").trim(),
    };
    items.unshift(entry);
    saveLog(items);
    return entry;
  }

  // ===== DOM helpers =====
  const $app = document.getElementById("app");
  const $versionLine = document.getElementById("versionLine");

  function setVersionLine(state) {
    const last = state.lastVisited ? ` • last: ${state.lastVisited}` : "";
    $versionLine.textContent = `v${APP_VERSION}${last}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function routeLabel(route) {
    switch (route) {
      case "step1": return "Reset";
      case "step2": return "Calm";
      case "step3": return "Stop Urge";
      case "step4": return "Move Forward";
      default: return "Home";
    }
  }

  // NEW: record last meaningful route (non-home)
  function rememberLastNonHome(state, route, subRoute = null) {
    if (!ROUTES.includes(route) || route === "home") return state;

    const next = { ...state };
    next.lastNonHomeRoute = route;
    next.lastNonHomeLabel = routeLabel(route);
    next.lastNonHomeAt = nowStamp();
    next.lastSubRoute = subRoute; // may be null
    return next;
  }

  function setRoute(route) {
    const state = loadState();
    const nextRoute = ROUTES.includes(route) ? route : "home";
    let next = { ...state, route: nextRoute, lastVisited: nowStamp() };

    // Only update "continue" tracker when leaving Home
    if (nextRoute !== "home") {
      next = rememberLastNonHome(next, nextRoute, null);
    }
    saveState(next);
    render();
  }

  function syncTabs(route) {
    ROUTES.forEach(r => {
      const btn = document.querySelector(`[data-route="${r}"]`);
      if (!btn) return;
      if (r === route) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function renderCard({ title, subtitle, body }) {
    return `
      <section class="card">
        <h1 class="h1">${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="p">${escapeHtml(subtitle)}</p>` : ""}
        ${body || ""}
      </section>
    `;
  }

  // ===== Views =====

  function viewHome(state) {
    const log = loadLog().slice(0, 6);

    const continueRoute = ROUTES.includes(state.lastNonHomeRoute) ? state.lastNonHomeRoute : "step4";
    const continueLabel = state.lastNonHomeLabel || routeLabel(continueRoute);
    const continueAt = state.lastNonHomeAt ? `Last: ${state.lastNonHomeAt}` : "Pick up momentum.";

    const continueCard = renderCard({
      title: "Continue",
      subtitle: "Where you left off — one click back into motion.",
      body: `
        <div class="row">
          <span class="pill">${escapeHtml(continueAt)}</span>
        </div>
        <div class="hr"></div>
        <button class="btn" data-continue type="button">
          <div>
            Continue: ${escapeHtml(continueLabel)}
            <small>Jump back to your last step instead of restarting.</small>
          </div>
          <span class="badge">go</span>
        </button>
      `,
    });

    const logHtml = log.length
      ? log.map(item => `
          <div class="logItem">
            <div class="logTop">
              <div class="logTitle">${escapeHtml(item.title)}</div>
              <div class="logTime">${escapeHtml(item.at)}</div>
            </div>
            <div class="logNote">${escapeHtml(item.note || item.type)}</div>
          </div>
        `).join("")
      : `<div class="pill">No log entries yet.</div>`;

    return `
      ${continueCard}

      ${renderCard({
        title: "Home",
        subtitle: "Or choose a step manually.",
        body: `
          <div class="grid two">
            <button class="btn" data-go="step1" type="button">
              <div>
                Reset (Step 1)
                <small>Back to baseline. Reduce chaos.</small>
              </div>
              <span class="badge">done</span>
            </button>

            <button class="btn" data-go="step2" type="button">
              <div>
                Calm (Step 2)
                <small>Downshift your nervous system.</small>
              </div>
              <span class="badge">done</span>
            </button>

            <button class="btn" data-go="step3" type="button">
              <div>
                Stop the Urge (Step 3)
                <small>Interrupt the spiral. Choose safety.</small>
              </div>
              <span class="badge">v2</span>
            </button>

            <button class="btn" data-go="step4" type="button">
              <div>
                Move Forward (Step 4)
                <small>Body + action. Convert calm into progress.</small>
              </div>
              <span class="badge">new</span>
            </button>
          </div>

          <div class="hr"></div>

          <div class="row">
            <span class="pill">If you’re stuck: hit Continue, then press the smallest button on Step 4.</span>
          </div>
        `
      })}

      ${renderCard({
        title: "Recent Log",
        subtitle: "A simple trail proves momentum.",
        body: logHtml
      })}
    `;
  }

  function viewStep1() {
    return renderCard({
      title: "Reset (Step 1)",
      subtitle: "Complete.",
      body: `<div class="pill">Reset UX is locked as complete.</div>`
    });
  }

  function viewStep2() {
    return renderCard({
      title: "Calm (Step 2)",
      subtitle: "Complete.",
      body: `<div class="pill">Calm UX is locked as complete.</div>`
    });
  }

  function viewStep3() {
    return renderCard({
      title: "Stop the Urge (Step 3)",
      subtitle: "v2 is in progress with a live stamp.",
      body: `
        <div class="pill">Step 3 remains as-is. Step 4 is active.</div>
        <div class="hr"></div>
        <div class="kbd">Next upgrade option: unify Step 3 “live stamp” entries into the same log feed.</div>
      `
    });
  }

  // ===== Step 4: Move Forward =====

  const SUGGESTIONS = [
    { title: "Do the next 2 minutes", note: "Set a timer. Start imperfect. Don’t optimize." },
    { title: "Make it smaller", note: "Cut the task to one visible action you can finish." },
    { title: "Move first, think second", note: "10 body-weight squats or a short walk in place." },
    { title: "Clean one surface", note: "Desk, counter, or floor patch. Stop at 5 minutes." },
    { title: "Send one message", note: "One email/text that removes a stuck point." },
    { title: "Open the file", note: "No work required—just open it and name the next step." },
  ];

  function viewStep4(state) {
    const pref = state.moveForward.preferredMode;

    return `
      ${renderCard({
        title: "Move Forward (Step 4)",
        subtitle: "Convert stability into motion. Choose one button. Complete it. Log it.",
        body: `
          <div class="row">
            <span class="pill">Mode: ${escapeHtml(pref)}</span>
            <button class="btn" data-mode="movement" type="button">
              <div>
                Prefer Movement
                <small>Body first. Nervous system leads.</small>
              </div>
              <span class="badge">set</span>
            </button>
            <button class="btn" data-mode="productivity" type="button">
              <div>
                Prefer Productivity
                <small>Action first. Get a win.</small>
              </div>
              <span class="badge">set</span>
            </button>
            <button class="btn" data-mode="balanced" type="button">
              <div>
                Balanced
                <small>One body + one action.</small>
              </div>
              <span class="badge">set</span>
            </button>
          </div>
        `
      })}

      ${renderCard({
        title: "Start Here",
        subtitle: "If you’re foggy, do the smallest thing that changes your body.",
        body: `
          <div class="grid two">
            <button class="btn" data-action="move60" type="button">
              <div>
                60-Second Body Shift
                <small>Stand up. Shoulder rolls + slow exhale.</small>
              </div>
              <span class="badge">60s</span>
            </button>

            <button class="btn" data-action="walk3" type="button">
              <div>
                3-Minute Walk-in-Place
                <small>Move now. Don’t negotiate.</small>
              </div>
              <span class="badge">3m</span>
            </button>

            <button class="btn" data-action="tidy5" type="button">
              <div>
                5-Minute Reset Tidy
                <small>One surface. Stop at 5.</small>
              </div>
              <span class="badge">5m</span>
            </button>

            <button class="btn" data-action="oneTask10" type="button">
              <div>
                10-Minute Focus Sprint
                <small>Choose one micro-task. Timer on.</small>
              </div>
              <span class="badge">10m</span>
            </button>
          </div>

          <div class="hr"></div>

          <div class="row">
            <button class="btn" data-action="planToday" type="button">
              <div>
                Plan Today (choose 1)
                <small>Pick the lane. Don’t over-plan.</small>
              </div>
              <span class="badge">pick</span>
            </button>

            <button class="btn" data-action="clarifyNext" type="button">
              <div>
                Clarify the Next Move
                <small>Suggestions if you don’t know where to start.</small>
              </div>
              <span class="badge">help</span>
            </button>
          </div>
        `
      })}

      ${renderCard({
        title: "Log a Win",
        subtitle: "Write one sentence. That’s enough.",
        body: `
          <label class="kbd" for="winNote">Optional note (one sentence):</label>
          <textarea id="winNote" placeholder="Example: Did 3 minutes walking. Now I’m opening the file."></textarea>
          <div class="hr"></div>
          <div class="row">
            <button class="btn" data-action="logCustom" type="button">
              <div>
                Log This As Done
                <small>Adds a live stamp to your log.</small>
              </div>
              <span class="badge">stamp</span>
            </button>
          </div>
        `
      })}
    `;
  }

  function openPlanToday(state) {
    // NEW: mark subroute so Continue goes back properly
    let next = rememberLastNonHome(state, "step4", "step4_plan");
    saveState(next);

    const options = [
      { key: "body", title: "Body First", note: "Movement + hydration + food." },
      { key: "task", title: "One Task", note: "A single concrete deliverable." },
      { key: "people", title: "People & Admin", note: "Calls, messages, appointments, bills." },
    ];

    $app.innerHTML = renderCard({
      title: "Plan Today",
      subtitle: "Pick one lane. You can still do other things—this is just your anchor.",
      body: `
        <div class="grid two">
          ${options.map(o => `
            <button class="btn" data-plan="${o.key}" type="button">
              <div>
                ${escapeHtml(o.title)}
                <small>${escapeHtml(o.note)}</small>
              </div>
              <span class="badge">choose</span>
            </button>
          `).join("")}
        </div>

        <div class="hr"></div>

        <button class="ghost" data-back-step4 type="button">Back to Step 4</button>
      `
    });

    $app.querySelectorAll("[data-plan]").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-plan");
        const note = (document.getElementById("winNote")?.value || "").trim();
        addLog("step4_plan", "Plan Today", `Chose: ${choice}${note ? ` • ${note}` : ""}`);

        const s = loadState();
        s.moveForward.lastPlanChoice = choice;
        // After choosing, "continue" should bring you back to Step 4 (main)
        const s2 = rememberLastNonHome(s, "step4", null);
        saveState(s2);

        setRoute("home");
      });
    });

    $app.querySelector("[data-back-step4]")?.addEventListener("click", () => {
      const s = loadState();
      saveState(rememberLastNonHome(s, "step4", null));
      setRoute("step4");
    });
  }

  function openClarifyNext(state) {
    // NEW: mark subroute so Continue goes back properly
    let next = rememberLastNonHome(state, "step4", "step4_clarify");
    saveState(next);

    $app.innerHTML = renderCard({
      title: "Clarify the Next Move",
      subtitle: "Pick one suggestion and do it for 2–10 minutes. Then log it.",
      body: `
        <div class="grid">
          ${SUGGESTIONS.map((s, idx) => `
            <button class="btn" data-suggest="${idx}" type="button">
              <div>
                ${escapeHtml(s.title)}
                <small>${escapeHtml(s.note)}</small>
              </div>
              <span class="badge">do</span>
            </button>
          `).join("")}
        </div>
        <div class="hr"></div>
        <button class="ghost" data-back-step4 type="button">Back to Step 4</button>
      `
    });

    $app.querySelectorAll("[data-suggest]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-suggest"));
        const s = SUGGESTIONS[idx];
        addLog("step4_clarify", "Clarified Next Move", `${s.title} • ${s.note}`);

        const st = loadState();
        saveState(rememberLastNonHome(st, "step4", null));
        setRoute("home");
      });
    });

    $app.querySelector("[data-back-step4]")?.addEventListener("click", () => {
      const s = loadState();
      saveState(rememberLastNonHome(s, "step4", null));
      setRoute("step4");
    });
  }

  function handleStep4Action(action) {
    const note = (document.getElementById("winNote")?.value || "").trim();

    const map = {
      move60: { title: "60-Second Body Shift", base: "Stood up and shifted state." },
      walk3: { title: "3-Minute Walk-in-Place", base: "Moved body for 3 minutes." },
      tidy5: { title: "5-Minute Reset Tidy", base: "Reset one surface for 5 minutes." },
      oneTask10: { title: "10-Minute Focus Sprint", base: "Focused on one micro-task for 10 minutes." },
    };

    if (action === "planToday") {
      openPlanToday(loadState());
      return;
    }

    if (action === "clarifyNext") {
      openClarifyNext(loadState());
      return;
    }

    if (action === "logCustom") {
      const finalNote = note || "Logged a win.";
      addLog("step4_win", "Move Forward Win", finalNote);
      const s = loadState();
      saveState(rememberLastNonHome(s, "step4", null));
      setRoute("home");
      return;
    }

    const item = map[action];
    if (!item) return;

    addLog("step4_action", item.title, `${item.base}${note ? ` • ${note}` : ""}`);
    const s = loadState();
    saveState(rememberLastNonHome(s, "step4", null));
    setRoute("home");
  }

  // ===== Render =====
  function render() {
    const state = loadState();
    setVersionLine(state);

    syncTabs(state.route);

    let html = "";
    switch (state.route) {
      case "home": html = viewHome(state); break;
      case "step1": html = viewStep1(); break;
      case "step2": html = viewStep2(); break;
      case "step3": html = viewStep3(); break;
      case "step4": html = viewStep4(state); break;
      default: html = viewHome(state);
    }

    $app.innerHTML = html;

    // Home quick nav buttons
    $app.querySelectorAll("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => setRoute(btn.getAttribute("data-go")));
    });

    // NEW: Continue button
    $app.querySelector("[data-continue]")?.addEventListener("click", () => {
      const s = loadState();
      const r = ROUTES.includes(s.lastNonHomeRoute) ? s.lastNonHomeRoute : "step4";

      // If you left off inside a Step 4 subview, restore it
      if (r === "step4" && s.lastSubRoute === "step4_plan") {
        openPlanToday(s);
        return;
      }
      if (r === "step4" && s.lastSubRoute === "step4_clarify") {
        openClarifyNext(s);
        return;
      }

      setRoute(r);
    });

    // Step 4 mode buttons
    $app.querySelectorAll("[data-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        const next = loadState();
        next.moveForward.preferredMode = mode;
        next.lastVisited = nowStamp();
        // Setting a mode counts as "meaningful engagement" with step4
        const next2 = rememberLastNonHome(next, "step4", null);
        saveState(next2);
        addLog("step4_mode", "Set Move Forward Mode", `Mode: ${mode}`);
        render();
      });
    });

    // Step 4 action buttons
    $app.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => handleStep4Action(btn.getAttribute("data-action")));
    });
  }

  // ===== Header tab navigation =====
  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => setRoute(btn.getAttribute("data-route")));
  });

  // ===== Footer actions =====
  document.getElementById("btn-clear")?.addEventListener("click", () => {
    localStorage.removeItem(KEY.state);
    localStorage.removeItem(KEY.log);

    // Re-init cleanly
    localStorage.setItem(KEY.state, JSON.stringify(safeClone(defaultState)));
    localStorage.setItem(KEY.log, JSON.stringify([]));

    addLog("system", "Cleared Data", "Local data was cleared.");
    render();
  });

  document.getElementById("btn-export")?.addEventListener("click", () => {
    const items = loadLog();
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `praxis-log-${APP_VERSION}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // ===== Boot =====
  if (!localStorage.getItem(KEY.state)) {
    localStorage.setItem(KEY.state, JSON.stringify(safeClone(defaultState)));
  }
  if (!localStorage.getItem(KEY.log)) {
    localStorage.setItem(KEY.log, JSON.stringify([]));
  }
  render();

})();
