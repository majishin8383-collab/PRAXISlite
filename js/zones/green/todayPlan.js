import { appendLog } from "../../storage.js";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      node.setAttribute(k, v);
    }
  }
  for (const child of children) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function dayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const KEY_PREFIX = "praxis_today_";

function loadToday() {
  const key = KEY_PREFIX + dayKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToday(state) {
  const key = KEY_PREFIX + dayKey();
  localStorage.setItem(key, JSON.stringify(state));
}

function nowISO() {
  return new Date().toISOString();
}

function sanitize(s) {
  return (s || "").toString().trim().slice(0, 140);
}

export function renderTodayPlan() {
  const wrap = el("div", { class: "flowShell" });

  let state = loadToday() || {
    createdAt: nowISO(),
    steps: ["", "", ""],
    done: [false, false, false],
    committed: false,
  };

  function header() {
    return el("div", { class: "flowHeader" }, [
      el("div", {}, [
        el("h1", { class: "h1" }, ["Today’s Plan"]),
        el("p", { class: "p" }, ["Only 3 steps. Small enough to do. Specific enough to matter."]),
      ]),
      el("div", { class: "flowMeta" }, [
        el("button", { class: "linkBtn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back"]),
        el("div", { class: "badge" }, [dayKey()]),
      ]),
    ]);
  }

  function commitPlan() {
    state.steps = state.steps.map(sanitize);
    // Basic guard: at least one non-empty step
    if (!state.steps.some(s => s.length > 0)) {
      alert("Add at least one step (even tiny).");
      return;
    }
    state.committed = true;
    saveToday(state);
    appendLog({ kind: "today_plan", when: nowISO(), action: "committed", steps: state.steps });
    rerender();
  }

  function resetPlan() {
    if (!confirm("Reset today’s plan?")) return;
    state = {
      createdAt: nowISO(),
      steps: ["", "", ""],
      done: [false, false, false],
      committed: false,
    };
    saveToday(state);
    appendLog({ kind: "today_plan", when: nowISO(), action: "reset" });
    rerender();
  }

  function toggleDone(i) {
    state.done[i] = !state.done[i];
    saveToday(state);

    appendLog({
      kind: "today_plan",
      when: nowISO(),
      action: state.done[i] ? "step_done" : "step_undone",
      index: i,
      step: state.steps[i]
    });

    // If all done, log completion
    if (state.committed && state.done.every(Boolean)) {
      appendLog({ kind: "today_plan", when: nowISO(), action: "all_done" });
    }

    rerender();
  }

  function onStepInput(i, value) {
    state.steps[i] = value;
    saveToday(state);
  }

  function stepsEditor() {
    return el("div", { class: "flowShell" }, [
      el("h2", { class: "h2" }, ["Your 3 steps"]),
      el("p", { class: "p" }, ["Write them like you’re making it easy for Future You."]),
      ...[0, 1, 2].map(i => el("div", { style: "display:flex;gap:10px;align-items:center;margin:10px 0;" }, [
        el("div", { class: "badge" }, [`Step ${i + 1}`]),
        el("input", {
          type: "text",
          value: state.steps[i],
          placeholder: i === 0 ? "One small move…" : "Next small move…",
          onInput: (e) => onStepInput(i, e.target.value),
          style: "flex:1;padding:12px 12px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--text);"
        }),
      ])),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: commitPlan }, ["Lock plan (commit)"]),
        el("button", { class: "btn", type: "button", onClick: resetPlan }, ["Reset"]),
      ]),
      el("p", { class: "small" }, ["Tip: if you can’t do it in 15 minutes, it’s too big for a ‘today step’."]),
    ]);
  }

  function checklist() {
    const steps = state.steps.map(sanitize);
    const doneCount = state.done.filter(Boolean).length;

    return el("div", { class: "flowShell" }, [
      el("div", { class: "badge" }, [`Progress: ${doneCount}/3`]),
      el("h2", { class: "h2" }, ["Do the next step"]),
      el("p", { class: "p" }, ["No planning. Just action."]),
      ...[0, 1, 2].map(i => el("button", {
        class: "actionTile",
        type: "button",
        onClick: () => toggleDone(i),
        style: state.done[i] ? "opacity:.85;border-color:rgba(45,212,191,.35);background:rgba(45,212,191,.08);" : ""
      }, [
        el("div", { class: "tileTop" }, [
          el("div", {}, [
            el("div", { class: "tileTitle" }, [steps[i] || `Step ${i + 1} (empty)`]),
            el("div", { class: "tileSub" }, [state.done[i] ? "Done (tap to undo)" : "Tap to mark done"]),
          ]),
          el("div", { class: `zoneDot ${state.done[i] ? "dotGreen" : "dotYellow"}` }, []),
        ]),
        el("p", { class: "tileHint" }, [i === 0 ? "Start here." : "Only after the previous step is done."]),
      ])),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn", type: "button", onClick: () => { state.committed = false; saveToday(state); rerender(); } }, ["Edit steps"]),
        el("button", { class: "btn", type: "button", onClick: resetPlan }, ["Reset"]),
      ]),
      state.done.every(Boolean)
        ? el("div", { class: "card cardPad" }, [
            el("h2", { class: "h2" }, ["All 3 done ✅"]),
            el("p", { class: "p" }, ["That counts. Momentum beats perfection."]),
            el("div", { class: "btnRow" }, [
              el("button", { class: "btn btnPrimary", type: "button", onClick: () => (location.hash = "#/green/focus") }, ["Run a Focus Sprint"]),
              el("button", { class: "btn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back Home"]),
            ]),
          ])
        : null
    ]);
  }

  function rerender() {
    wrap.innerHTML = "";
    wrap.appendChild(header());

    wrap.appendChild(el("div", { class: "card cardPad" }, [
      state.committed ? checklist() : stepsEditor()
    ]));
  }

  rerender();
  return wrap;
}
