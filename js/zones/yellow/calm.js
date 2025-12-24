import { appendLog, readLog } from "../../storage.js";
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

export function renderCalm() {
  const wrap = el("div", { class: "flowShell" });

  let running = false;
  let durationMin = 2;
  let endAt = 0;
  let tick = null;

  // 0–10 rating (optional but useful)
  let relief = 5;

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

  function start(min) {
    running = true;
    durationMin = min;
    endAt = Date.now() + min * 60 * 1000;

    stopTick();
    tick = window.setInterval(() => {
      if (!running) return;
      const remaining = endAt - Date.now();
      if (remaining <= 0) {
        stopTick();
        running = false;
        rerender("done");
      } else {
        updateTimerUI();
      }
    }, 250);

    rerender("running");
  }

  function log(minutes, reliefRating) {
    appendLog({
      kind: "calm",
      when: nowISO(),
      minutes,
      relief: reliefRating,
      note: "Completed Calm flow.",
    });
  }

  function recentCalmLogs() {
    const log = readLog().filter(e => e.kind === "calm").slice(0, 6);

    if (!log.length) {
      return el("div", {}, [
        el("h2", { class: "h2" }, ["Recent calm sessions"]),
        el("p", { class: "p" }, ["No entries yet. Complete one calm session to create history automatically."]),
      ]);
    }

    return el("div", {}, [
      el("h2", { class: "h2" }, ["Recent calm sessions"]),
      ...log.map(e =>
        el("div", { style: "padding:10px 0;border-bottom:1px solid var(--line);" }, [
          el("div", { style: "font-weight:900;" }, ["Calm"]),
          el("div", { class: "small" }, [
            `${new Date(e.when).toLocaleString()} • ${e.minutes ?? ""} min • relief ${typeof e.relief === "number" ? e.relief : "—"}/10`
          ]),
        ])
      )
    ]);
  }

  function header() {
    return el("div", { class: "flowHeader" }, [
      el("div", {}, [
        el("h1", { class: "h1" }, ["Calm Me Down"]),
        el("p", { class: "p" }, ["Start with 2 minutes. Continue longer inside if needed."]),
      ]),
      el("div", { class: "flowMeta" }, [
        el("button", { class: "linkBtn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back"]),
      ])
    ]);
  }

  function runningPanel() {
    const remaining = clamp(endAt - Date.now(), 0, durationMin * 60 * 1000);

    return el("div", { class: "timerBox" }, [
      el("div", { class: "badge" }, [`Active • ${durationMin} min`]),
      el("div", { class: "timerReadout", "data-timer-readout": "1" }, [formatMMSS(remaining)]),
      el("div", { class: "progressBar" }, [
        el("div", { class: "progressFill", "data-progress-fill": "1" }, []),
      ]),
      el("p", { class: "p" }, ["Breathe slower than you want to. Relax your jaw. Drop your shoulders."]),
      el("div", { class: "btnRow" }, [
        el("button", {
          class: "btn",
          type: "button",
          onClick: () => { running = false; stopTick(); rerender("stopped"); }
        }, ["Stop"]),
      ]),
      el("p", { class: "small" }, ["Two minutes is enough to shift direction. More is allowed."]),
    ]);
  }

  function reliefPanel() {
    const label = `Relief now: ${relief}/10`;

    return el("div", { class: "flowShell" }, [
      el("h2", { class: "h2" }, ["Quick check"]),
      el("p", { class: "p" }, ["How relieved do you feel right now? (0 = none, 10 = strong relief)"]),
      el("div", { class: "badge" }, [label]),
      el("input", {
        type: "range",
        min: "0",
        max: "10",
        value: String(relief),
        onInput: (e) => { relief = Number(e.target.value); rerender("done"); },
        style: "width:100%;"
      }),
      el("p", { class: "small" }, ["This helps Praxis learn what works without turning into journaling."]),
    ]);
  }

  function donePanel() {
    return el("div", { class: "flowShell" }, [
      el("div", { class: "badge" }, ["2 minutes complete"]),
      el("p", { class: "p" }, ["Continue if the anxiety is persistent. Keep it simple."]),
      reliefPanel(),
      el("div", { class: "btnRow" }, [
        el("button", {
          class: "btn btnPrimary",
          type: "button",
          onClick: () => start(5)
        }, ["Continue 5 min"]),
        el("button", {
          class: "btn btnPrimary",
          type: "button",
          onClick: () => start(10)
        }, ["Continue 10 min"]),
        el("button", {
          class: "btn",
          type: "button",
          onClick: () => { log(durationMin, relief); rerender("logged"); }
        }, ["I’m okay (save)"]),
      ]),
    ]);
  }

  function loggedPanel() {
    return el("div", { class: "flowShell" }, [
      el("div", { class: "badge" }, ["Saved"]),
      el("p", { class: "p" }, ["Logged. Return Home or run it again."]),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: () => (location.hash = "#/home") }, ["Back to Home"]),
        el("button", { class: "btn", type: "button", onClick: () => rerender("idle") }, ["Run again"]),
      ]),
    ]);
  }

  function idlePanel() {
    return el("div", { class: "flowShell" }, [
      el("div", { class: "badge" }, ["Default: 2 minutes"]),
      el("p", { class: "p" }, ["No thinking. Start. Let your nervous system settle."]),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: () => start(2) }, ["Begin 2-minute reset"]),
      ]),
      el("p", { class: "small" }, ["Continuation appears after the 2-minute completion screen."]),
    ]);
  }

  function rerender(mode) {
    wrap.innerHTML = "";
    wrap.appendChild(header());

    const mainCard = el("div", { class: "card cardPad" }, [
      mode === "running" ? runningPanel()
      : mode === "done" ? donePanel()
      : mode === "logged" ? loggedPanel()
      : idlePanel()
    ]);

    const logCard = el("div", { class: "card cardPad" }, [recentCalmLogs()]);

    wrap.appendChild(mainCard);
    wrap.appendChild(logCard);

    if (running) updateTimerUI();
  }

  rerender("idle");
  return wrap;
}
