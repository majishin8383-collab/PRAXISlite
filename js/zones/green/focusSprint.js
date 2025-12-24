import { appendLog, readLog, clearLog } from "../../storage.js";
import { formatMMSS, clamp } from "../../components/timer.js";

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
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

function nowISO() {
  return new Date().toISOString();
}

const DURATIONS = [
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "25 min", minutes: 25 },
];

export function renderFocusSprint() {
  const wrap = el("div", { class: "flowShell" });

  let durationMin = 10;
  let running = false;
  let endAt = 0;
  let tick = null;

  function stopTick() {
    if (tick) window.clearInterval(tick);
    tick = null;
  }

  function updateTimerUI() {
    const remaining = clamp(endAt - Date.now(), 0, durationMin * 60 * 1000);
    const pct = 100 * (1 - remaining / (durationMin * 60 * 1000));
    const readout = wrap.querySelector("[data-timer-readout]");
    const fill = wrap.querySelector("[data-progress-fill]");
    if (readout) readout.textContent = formatMMSS(remaining);
    if (fill) fill.style.width = `${pct.toFixed(1)}%`;
  }

  function completeSprint(totalMin) {
    stopTick();
    running = false;
    endAt = 0;

    appendLog({
      kind: "focus_sprint",
      when: nowISO(),
      minutes: totalMin,
      note: "Completed Focus Sprint.",
    });

    rerender(true);
  }

  function startSprint(min) {
    running = true;
    durationMin = min;
    endAt = Date.now() + min * 60 * 1000;

    stopTick();
    tick = window.setInterval(() => {
      if (!running) return;
      const remaining = endAt - Date.now();
      if (remaining <= 0) {
        completeSprint(min);
      } else {
        updateTimerUI();
      }
    }, 250);

    rerender(false);
  }

  function renderHeader() {
    return el("div", { class: "flowHeader" }, [
      el("div", {}, [
        el("h1", { class: "h1" }, ["Focus Sprint"]),
        el("p", { class: "p" }, ["Pick a duration. Start. Finish. Log the win."]),
      ]),
      el("div", { class: "flowMeta" }, [
        el("button", { class: "linkBtn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back"]),
        el("button", {
          class: "linkBtn",
          type: "button",
          onClick: () => { clearLog(); rerender(false); }
        }, ["Clear log"]),
      ]),
    ]);
  }

  function renderPicker() {
    return el("div", { class: "btnRow" },
      DURATIONS.map(d =>
        el("button", {
          class: "btn",
          type: "button",
          onClick: () => { durationMin = d.minutes; rerender(false); }
        }, [d.label])
      )
    );
  }

  function renderIdleUI() {
    return el("div", { class: "flowShell" }, [
      el("div", { class: "badge" }, [`Selected: ${durationMin} min`]),
      renderPicker(),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: () => startSprint(durationMin) }, ["Start sprint"]),
        el("button", { class: "btn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back to Home"]),
      ]),
      el("p", { class: "small" }, ["Minimum viable win: start and finish. No reflection required."]),
    ]);
  }

  function renderRunningUI() {
    const remaining = clamp(endAt - Date.now(), 0, durationMin * 60 * 1000);

    return el("div", { class: "timerBox" }, [
      el("div", { class: "badge" }, [`Duration: ${durationMin} min`]),
      el("div", { class: "timerReadout", "data-timer-readout": "1" }, [formatMMSS(remaining)]),
      el("div", { class: "progressBar" }, [
        el("div", { class: "progressFill", "data-progress-fill": "1" }, []),
      ]),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: () => completeSprint(durationMin) }, ["Complete now"]),
        el("button", {
          class: "btn",
          type: "button",
          onClick: () => { running = false; stopTick(); rerender(false); }
        }, ["Stop"]),
      ]),
      el("p", { class: "small" }, ["Stay with the timer. Nothing else matters right now."]),
    ]);
  }

  function renderLog() {
    const log = readLog().slice(0, 8);

    if (!log.length) {
      return el("div", {}, [
        el("h2", { class: "h2" }, ["Recent wins"]),
        el("p", { class: "p" }, ["No entries yet. Complete one sprint to create history automatically."]),
      ]);
    }

    return el("div", {}, [
      el("h2", { class: "h2" }, ["Recent wins"]),
      ...log.map(e =>
        el("div", { style: "padding:10px 0;border-bottom:1px solid var(--line);" }, [
          el("div", { style: "font-weight:900;" }, ["Focus Sprint"]),
          el("div", { class: "small" }, [`${new Date(e.when).toLocaleString()} • ${e.minutes} min`]),
          e.note ? el("div", { class: "small" }, [e.note]) : null,
        ])
      ),
    ]);
  }

  function rerender(justCompleted) {
    wrap.innerHTML = "";
    wrap.appendChild(renderHeader());

    const card = el("div", { class: "card cardPad" }, [
      el("h2", { class: "h2" }, [justCompleted ? "Logged. Nice." : "Sprint"]),
      justCompleted ? el("p", { class: "p" }, ["Momentum counts. Run another sprint or return Home."]) : null,
      running ? renderRunningUI() : renderIdleUI(),
    ]);

    const logCard = el("div", { class: "card cardPad" }, [renderLog()]);

    wrap.appendChild(card);
    wrap.appendChild(logCard);

    if (running) updateTimerUI();
  }

  rerender(false);
  return wrap;
}
