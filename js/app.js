/* PRAXIS Lite — Stable GitHub Pages build
   - Hash routing: #/reset, #/calm, #/urge, #/move
   - Works under /PRAXISlite/ with no base-path config
*/

(() => {
  const $ = (sel) => document.querySelector(sel);

  const viewTitle = $("#viewTitle");
  const viewSubtitle = $("#viewSubtitle");
  const viewBody = $("#viewBody");
  const btnPrimary = $("#btnPrimary");
  const btnHome = $("#btnHome");
  const statusPill = $("#statusPill");

  const routes = {
    "/reset": {
      title: "Reset",
      subtitle: "Interrupt the spiral. Get back into your body.",
      render: () => `
        <div class="grid">
          <div class="col-12">
            <div class="block">
              <h3>30-second reset</h3>
              <p>Exhale longer than you inhale. Shoulders down. Feet on the floor.</p>
              <div class="hr"></div>
              <ul class="list">
                <li class="item"><strong>Step 1</strong><span>Look around and name 5 things you see.</span></li>
                <li class="item"><strong>Step 2</strong><span>Press your feet into the ground for 10 seconds.</span></li>
                <li class="item"><strong>Step 3</strong><span>Slow exhale: 6 seconds out, 4 seconds in × 5.</span></li>
              </ul>
            </div>
          </div>
        </div>
      `,
      primary: { label: "Continue", next: "/calm" },
      status: "Reset ready"
    },

    "/calm": {
      title: "Calm",
      subtitle: "Reduce intensity. Regain choice.",
      render: () => `
        <div class="grid">
          <div class="col-6">
            <div class="block">
              <h3>Breath ladder</h3>
              <p>Do 3 rounds. Keep it simple. Don’t force it.</p>
              <div class="hr"></div>
              <ul class="list">
                <li class="item"><strong>Round 1</strong><span>In 4 / Out 6</span></li>
                <li class="item"><strong>Round 2</strong><span>In 4 / Out 7</span></li>
                <li class="item"><strong>Round 3</strong><span>In 4 / Out 8</span></li>
              </ul>
            </div>
          </div>
          <div class="col-6">
            <div class="block">
              <h3>Body signal</h3>
              <p>Name where you feel it (chest, throat, gut). This reduces fusion.</p>
              <div class="hr"></div>
              <label for="signal">Where is it strongest?</label>
              <input class="input" id="signal" placeholder="e.g., chest, jaw, stomach" />
            </div>
          </div>
        </div>
      `,
      primary: { label: "Continue", next: "/urge" },
      status: "Calm engaged"
    },

    "/urge": {
      title: "Stop the Urge",
      subtitle: "Don’t feed the loop. Create distance and choose the next right move.",
      render: () => `
        <div class="grid">
          <div class="col-12">
            <div class="block">
              <h3>Urge protocol (90 seconds)</h3>
              <p>We don’t negotiate with urges. We observe, delay, redirect.</p>
              <div class="hr"></div>
              <ul class="list">
                <li class="item"><strong>1) Name it</strong><span>“This is an urge, not a command.”</span></li>
                <li class="item"><strong>2) Delay</strong><span>Set a 10-minute timer. No action until it ends.</span></li>
                <li class="item"><strong>3) Replace</strong><span>Do a small physical action: water, walk, push-ups, shower.</span></li>
              </ul>
            </div>
          </div>
        </div>
      `,
      primary: { label: "Continue", next: "/move" },
      status: "Urge contained"
    },

    "/move": {
      title: "Move Forward",
      subtitle: "One small step that improves your life today.",
      render: () => `
        <div class="grid">
          <div class="col-6">
            <div class="block">
              <h3>Choose a direction</h3>
              <label for="domain">What needs a next step?</label>
              <select class="select" id="domain">
                <option value="body">Body / energy</option>
                <option value="home">Home / environment</option>
                <option value="work">Work / money</option>
                <option value="people">Relationships</option>
                <option value="mind">Mind / clarity</option>
              </select>
              <div class="hr"></div>
              <label for="step">Smallest next action (2–10 minutes)</label>
              <input class="input" id="step" placeholder="e.g., 10 push-ups, take out trash, 1 email…" />
            </div>
          </div>
          <div class="col-6">
            <div class="block">
              <h3>Make it real</h3>
              <p>Finish by committing to a start time.</p>
              <div class="hr"></div>
              <label for="when">Start time</label>
              <input class="input" id="when" placeholder="e.g., now / 9:10am / after coffee" />
              <div class="hr"></div>
              <label for="note">Optional note</label>
              <textarea class="textarea" id="note" placeholder="What might sabotage this? What will you do instead?"></textarea>
            </div>
          </div>
        </div>
      `,
      primary: { label: "Commit", next: "/reset" },
      status: "Ready to act"
    }
  };

  function getRoute() {
    const raw = (location.hash || "#/reset").replace(/^#/, "");
    return routes[raw] ? raw : "/reset";
  }

  function setActiveTab(route) {
    document.querySelectorAll(".tab").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
  }

  function render(route) {
    const r = routes[route];
    setActiveTab(route);

    viewTitle.textContent = r.title;
    viewSubtitle.textContent = r.subtitle;
    viewBody.innerHTML = r.render();

    statusPill.textContent = r.status || "Ready";

    btnPrimary.textContent = r.primary?.label || "Continue";
    btnPrimary.onclick = () => {
      const next = r.primary?.next || "/reset";
      location.hash = `#${next}`;
    };
  }

  btnHome.onclick = () => { location.hash = "#/reset"; };

  $("#year").textContent = new Date().getFullYear();

  window.addEventListener("hashchange", () => render(getRoute()));

  // boot
  render(getRoute());
})();
