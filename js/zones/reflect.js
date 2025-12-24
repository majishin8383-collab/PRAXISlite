import { appendLog } from "../storage.js";

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

function nowISO() {
  return new Date().toISOString();
}

const KEY = "praxis_reflect_draft";

export function renderReflect() {
  const wrap = el("div", { class: "flowShell" });

  let text = "";
  try {
    text = localStorage.getItem(KEY) || "";
  } catch {}

  function header() {
    return el("div", { class: "flowHeader" }, [
      el("div", {}, [
        el("h1", { class: "h1" }, ["Reflect (Optional)"]),
        el("p", { class: "p" }, ["Short. Useful. No journaling required."]),
      ]),
      el("div", { class: "flowMeta" }, [
        el("button", { class: "linkBtn", type: "button", onClick: () => (location.hash = "#/home") }, ["Back"]),
      ])
    ]);
  }

  function saveDraft(val) {
    text = val;
    try { localStorage.setItem(KEY, text); } catch {}
  }

  function saveEntry() {
    const cleaned = (text || "").trim();
    if (!cleaned) {
      alert("Write one sentence (or skip).");
      return;
    }

    appendLog({
      kind: "reflect",
      when: nowISO(),
      text: cleaned.slice(0, 1200),
      note: "Saved reflection.",
    });

    // clear draft
    text = "";
    try { localStorage.removeItem(KEY); } catch {}

    rerender("saved");
  }

  function rerender(mode = "edit") {
    wrap.innerHTML = "";
    wrap.appendChild(header());

    const editor = el("div", { class: "card cardPad" }, [
      el("div", { class: "badge" }, ["1–3 sentences max"]),
      el("p", { class: "p" }, ["Prompt: What’s the next right move?"]),
      el("textarea", {
        style: "width:100%;min-height:120px;padding:12px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.04);color:var(--text);",
        placeholder: "Example: I’m anxious, so I’ll do a 2-min calm reset, then a 10-min focus sprint.",
        onInput: (e) => saveDraft(e.target.value)
      }, []),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn btnPrimary", type: "button", onClick: saveEntry }, ["Save"]),
        el("button", {
          class: "btn",
          type: "button",
          onClick: () => { text = ""; try { localStorage.removeItem(KEY); } catch {} ; rerender("edit"); }
        }, ["Clear"]),
      ]),
      el("p", { class: "small" }, ["If reflection makes you spiral, skip it. Focus on Calm / Shield / Sprint instead."]),
    ]);

    // restore textarea value after mount
    setTimeout(() => {
      const ta = wrap.querySelector("textarea");
      if (ta) ta.value = text;
    }, 0);

    const saved = el("div", { class: "card cardPad" }, [
      el("div", { class: "badge" }, [mode === "saved" ? "Saved ✅" : "Optional"]),
      el("p", { class: "p" }, [mode === "saved" ? "Nice. Back to action." : "You can leave this blank."]),
      el("div", { class: "btnRow" }, [
        el("button", { class: "btn", type: "button", onClick: () => (location.hash = "#/green/today") }, ["Today’s Plan"]),
        el("button", { class: "btn", type: "button", onClick: () => (location.hash = "#/green/focus") }, ["Focus Sprint"]),
      ]),
    ]);

    wrap.appendChild(editor);
    wrap.appendChild(saved);
  }

  rerender("edit");
  return wrap;
}
