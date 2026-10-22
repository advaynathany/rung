// Rung prototype: check, group, teach, recheck. Everything stays on this device.

(function () {
  const L = window.RUNG_LADDERS;
  const KEY = "rung.prototype.v1";
  const RECHECK_DAYS = 10; // school days, per METHOD.md
  const BIG_GROUP = 15;
  const app = document.getElementById("app");

  // ---------- storage ----------
  let mem = { classes: [] };
  let stored = true;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) mem = JSON.parse(raw);
      if (!mem || !Array.isArray(mem.classes)) mem = { classes: [] };
    } catch (e) { stored = false; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(mem)); stored = true; } catch (e) { stored = false; }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const nice = (s) => parse(s).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  function schoolDaysSince(s) {
    const a = parse(s), b = parse(today());
    let n = 0;
    for (const d = new Date(a); d < b; d.setDate(d.getDate() + 1)) {
      const w = d.getDay();
      if (w !== 0 && w !== 6) n++;
    }
    return n;
  }
  const ladderOf = (c) => L[c.ladder];
  const top = (ld) => ld.rungs.length - 1;
  const findClass = (id) => mem.classes.find((c) => c.id === id);

  // A child's rung is their latest check. Checks never move a child down (METHOD.md §5).
  const rungOf = (ch) => (ch.checks.length ? ch.checks[ch.checks.length - 1].r : null);
  const checkedIn = (ch, round) => ch.checks.some((k) => k.round === round);
  const toCheck = (c) => c.children.filter((ch) => !checkedIn(ch, c.round) && !(c.absent || []).includes(ch.id) && !(rungOf(ch) === top(ladderOf(c)) && c.round > 1));
  const roundStart = (c) => (c.rounds && c.rounds[c.round - 1]) || today();

  function groupsOf(c) {
    const ld = ladderOf(c);
    const g = ld.rungs.map(() => []);
    c.children.forEach((ch) => { const r = rungOf(ch); if (r !== null) g[r].push(ch); });
    return g;
  }

  // ---------- routing ----------
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener("hashchange", render);

  function render() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    let html = "";
    let after = null;
    if (parts[0] === "new") [html, after] = viewNew();
    else if (parts[0] === "c" && findClass(parts[1])) {
      const c = findClass(parts[1]);
      if (parts[2] === "check") [html, after] = viewCheck(c);
      else if (parts[2] === "progress") [html, after] = viewProgress(c);
      else if (parts[2] === "edit") [html, after] = viewEdit(c);
      else [html, after] = viewClass(c);
    } else [html, after] = viewHome();
    app.innerHTML = (stored ? "" : `<p class="warn wrap">This browser isn’t saving data, so your classes will be lost when you close the page.</p>`) + html;
    window.scrollTo(0, 0);
    if (after) after();
    const h = app.querySelector("h1");
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }

  // ---------- home ----------
  function viewHome() {
    const list = mem.classes.map((c) => {
      const ld = ladderOf(c), n = c.children.length, left = toCheck(c).length;
      const state = left ? `${left} of ${n} still to check` : `${n} children, round ${c.round}`;
      return `<li><a class="row" href="#/c/${c.id}"><span class="row-name">${esc(c.name)}</span><span class="row-meta">${esc(ld.short)}. ${state}</span></a></li>`;
    }).join("");
    const html = `
      <section class="wrap">
        <h1>${mem.classes.length ? "Your classes" : "Teach every child from their rung"}</h1>
        ${mem.classes.length ? `<ul class="rows">${list}</ul>` : `
          <ol class="intro">
            <li><b>Check</b> each child in about a minute.</li>
            <li><b>Group</b> the class by the rung they’re on, not their grade.</li>
            <li><b>Teach</b> today’s lesson for every group, then recheck every two weeks.</li>
          </ol>`}
        <div class="actions">
          <a class="btn primary" href="#/new">Add a class</a>
          <button class="btn" type="button" id="sample">Try a sample class</button>
        </div>
        <p class="fine">This is a prototype of the <a href="https://github.com/advaynathany/rung/blob/main/METHOD.md">Rung method</a>. Everything you enter stays on this device and is never sent anywhere. It hasn’t been tested with children yet.</p>
      </section>`;
    return [html, () => { document.getElementById("sample").addEventListener("click", makeSample); }];
  }

  function makeSample() {
    const names = ["Asha", "Ravi", "Mina", "Imran", "Sita", "Arjun", "Fatima", "Kiran", "Joseph", "Lata", "Vikram", "Neha", "Sameer", "Priya", "Anil", "Rekha"];
    const spread = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 1];
    const d = new Date(); d.setDate(d.getDate() - 3);
    const c = {
      id: uid(), name: "Sample class, grade 4", ladder: "read-en", round: 1, rounds: [iso(d)], absent: [], sample: true,
      children: names.map((n, i) => ({ id: uid(), name: n, checks: [{ round: 1, d: iso(d), r: spread[i] }] })),
    };
    mem.classes.unshift(c); save(); go(`#/c/${c.id}`);
  }

  // ---------- new class ----------
  function viewNew() {
    const opts = Object.values(L).map((ld, i) => `
      <label class="choice"><input type="radio" name="ladder" value="${ld.id}" ${i === 0 ? "checked" : ""}>
        <span><b>${esc(ld.name)}</b> <span class="choice-rungs">${ld.rungs.map((r) => esc(r.name)).join(", ")}</span>${ld.draft ? `<span class="choice-note">Draft cards: not yet reviewed by a native speaker.</span>` : ""}</span></label>`).join("");
    const html = `
      <section class="wrap narrow">
        <a class="back" href="#/">Your classes</a>
        <h1>Add a class</h1>
        <form id="f" class="form" novalidate>
          <label class="field"><span>Class name</span><input name="name" required placeholder="Grade 4 B" autocomplete="off"></label>
          <fieldset class="field"><legend>What will you teach?</legend>${opts}</fieldset>
          <label class="field"><span>Children’s first names, one per line</span>
            <textarea name="names" rows="7" placeholder="Asha&#10;Ravi&#10;Mina"></textarea>
            <small>Or leave this empty and give a number of children below. They’ll be called Child 1, Child 2 and so on.</small></label>
          <label class="field short"><span>Number of children</span><input name="count" type="number" min="1" max="120" inputmode="numeric"></label>
          <p class="error" id="err" role="alert" hidden></p>
          <button class="btn primary" type="submit">Add class and start checking</button>
        </form>
      </section>`;
    return [html, () => {
      document.getElementById("f").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target, err = document.getElementById("err");
        const name = f.name.value.trim();
        let names = f.names.value.split("\n").map((s) => s.trim()).filter(Boolean);
        const count = parseInt(f.count.value, 10);
        if (!names.length && count > 0) names = Array.from({ length: Math.min(count, 120) }, (_, i) => `Child ${i + 1}`);
        if (!name) { err.textContent = "Give the class a name, such as Grade 4 B."; err.hidden = false; f.name.focus(); return; }
        if (!names.length) { err.textContent = "Add the children’s names, or a number of children."; err.hidden = false; f.names.focus(); return; }
        const c = { id: uid(), name, ladder: f.ladder.value, round: 1, rounds: [today()], absent: [], children: names.map((n) => ({ id: uid(), name: n, checks: [] })) };
        mem.classes.unshift(c); save(); go(`#/c/${c.id}/check`);
      });
    }];
  }

  // ---------- the check ----------
  let session = null; // { classId, childId, t, best, fail, floor }
  let toast = "";

  function begin(c, ch) {
    const prev = rungOf(ch);
    const ld = ladderOf(c);
    session = prev === null
      ? { classId: c.id, childId: ch.id, t: ld.start, best: null, fail: null, floor: null }
      : { classId: c.id, childId: ch.id, t: Math.min(prev + 1, top(ld)), best: null, fail: null, floor: prev };
  }

  function answer(c, passed) {
    const ld = ladderOf(c), s = session;
    let place = null;
    if (passed) {
      s.best = s.t;
      if (s.t === top(ld) || s.fail === s.t + 1) place = s.t;
      else s.t++;
    } else {
      s.fail = s.t;
      if (s.best !== null) place = s.best;
      else if (s.floor !== null) place = s.floor;
      else if (s.t === 1) place = 0;
      else s.t--;
    }
    if (place !== null) {
      const ch = c.children.find((x) => x.id === s.childId);
      ch.checks.push({ round: c.round, d: today(), r: place });
      c.last = ch.id;
      save();
      session = null;
      return { ch, place };
    }
    return null;
  }

  function card(ld, rung, version) {
    const v = ld.cards[rung][version % ld.cards[rung].length];
    const lang = ld.lang === "hi" ? ' lang="hi"' : "";
    if (typeof v === "string") return `<p class="card-text r${rung}"${lang}>${esc(v)}</p>`;
    return `<ul class="card-items r${rung}${ld.id === "maths" && rung >= 3 ? " sums" : ""}"${lang}>${v.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }

  function viewCheck(c) {
    const ld = ladderOf(c), queue = toCheck(c);
    if (!session || session.classId !== c.id || !queue.some((x) => x.id === session.childId)) {
      session = null;
      if (queue.length) begin(c, queue[0]);
    }
    const done = c.children.length - queue.length;
    if (!session) {
      const html = `
        <section class="wrap narrow center">
          <h1>Everyone’s checked</h1>
          <p>${c.round === 1 ? "The class is grouped by rung." : "The groups are updated."} Today’s lessons are ready.</p>
          <a class="btn primary" href="#/c/${c.id}">See the groups</a>
        </section>`;
      return [html, null];
    }
    const ch = c.children.find((x) => x.id === session.childId);
    const r = ld.rungs[session.t];
    const idx = c.children.indexOf(ch);
    const html = `
      <section class="check">
        <div class="wrap">
          <a class="back" href="#/c/${c.id}">${esc(c.name)}</a>
          <p class="count">${done + 1} of ${c.children.length}${c.round > 1 ? `, recheck round ${c.round}` : ""}</p>
          <h1 class="who-check">${esc(ch.name)}</h1>
          <p class="ask"><b class="rung-pill" style="--c: var(--g${session.t})">${esc(r.name)}</b> ${esc(r.ask)}</p>
        </div>
        <div class="card" aria-label="Show this to ${esc(ch.name)}">${card(ld, session.t, c.round - 1 + idx)}</div>
        <div class="wrap">
          <p class="rule">${esc(r.rule)}</p>
          <div class="answer">
            <button class="btn big" type="button" data-a="no">Not yet</button>
            <button class="btn big solid" type="button" data-a="yes">Passed</button>
          </div>
          <p class="minor">
            <button class="link" type="button" data-a="absent">${esc(ch.name)} is absent today</button>
          </p>
          <p class="toast" id="toast" role="status" aria-live="polite"></p>
        </div>
      </section>`;
    return [html, () => {
      const t = app.querySelector("#toast");
      if (toast) { t.textContent = toast; toast = ""; }
      app.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const a = b.dataset.a;
        if (a === "absent") {
          c.absent = (c.absent || []).concat(ch.id); save(); session = null;
          toast = `${ch.name} skipped. You can check them later from the class page.`;
          render(); return;
        }
        const res = answer(c, a === "yes");
        if (res) toast = `${res.ch.name}: ${ld.rungs[res.place].name}`;
        render();
      }));
    }];
  }

  // ---------- class: groups and today's lessons ----------
  let dayShift = 0, shiftFor = null;
  function viewClass(c) {
    if (shiftFor !== c.id) { dayShift = 0; shiftFor = c.id; }
    const ld = ladderOf(c), g = groupsOf(c), left = toCheck(c).length;
    const checked = c.children.filter((ch) => rungOf(ch) !== null).length;
    const days = schoolDaysSince(roundStart(c));
    const absent = (c.absent || []).map((id) => c.children.find((x) => x.id === id)).filter(Boolean);
    let call = "";
    if (left) call = `<div class="call"><p><b>${left} ${left === 1 ? "child" : "children"}</b> still to check${c.round > 1 ? ` in round ${c.round}` : ""}.</p><a class="btn primary" href="#/c/${c.id}/check">${checked ? "Continue checking" : "Start checking"}</a></div>`;
    else if (days >= RECHECK_DAYS) call = `<div class="call"><p><b>Recheck due.</b> It’s been ${days} school days since the last check. Recheck everyone and move children up.</p><button class="btn primary" type="button" id="recheck">Start recheck</button></div>`;
    if (absent.length && !left) call += `<div class="call quiet"><p>Absent during the check: ${absent.map((a) => esc(a.name)).join(", ")}.</p><button class="btn" type="button" id="retry">Check them now</button></div>`;

    const cols = ld.rungs.map((r, i) => `
      <li class="g-col${g[i].length ? "" : " empty"}" style="--c: var(--g${i})">
        <h3>${esc(r.name)} <span class="n">${g[i].length}</span></h3>
        <ul>${g[i].map((ch) => `<li>${esc(ch.name)}</li>`).join("")}</ul>
      </li>`).join("");

    const day = Math.max(0, days + dayShift);
    const lessons = ld.rungs.map((r, i) => {
      if (!g[i].length) return "";
      const plans = ld.lessons[r.key], plan = plans[day % plans.length];
      return `
        <article class="lesson" style="--c: var(--g${i})">
          <header><h3>${esc(r.name)} group</h3><p class="lesson-who">${g[i].length} ${g[i].length === 1 ? "child" : "children"}: ${g[i].map((ch) => esc(ch.name)).join(", ")}</p></header>
          ${i === top(ld) ? `<p class="lesson-note">These children are on the top rung. They can go back to grade-level work, or use these plans to keep practising.</p>` : ""}
          ${g[i].length > BIG_GROUP ? `<p class="lesson-note">This group has ${g[i].length} children. Think about splitting it into two groups at the same rung.</p>` : ""}
          <h4>${esc(plan.title)}</h4>
          <ol class="parts">${plan.parts.map(([who, min, what]) => `<li><span class="part-head">${who}, about ${min} min</span> ${esc(what)}</li>`).join("")}</ol>
          <p class="need"><b>You need:</b> ${esc(plan.need)}</p>
        </article>`;
    }).join("");

    const html = `
      <section class="wrap">
        <a class="back" href="#/">Your classes</a>
        <div class="class-head">
          <h1>${esc(c.name)}</h1>
          <p class="meta">${esc(ld.name)}. ${c.children.length} children. Round ${c.round}, started ${nice(roundStart(c))}.${c.sample ? " This is a sample class with made-up children." : ""}</p>
        </div>
        ${call}
        <h2>Groups</h2>
        <ol class="g-board">${cols}</ol>
        ${checked ? `
        <div class="today-head">
          <h2>Today’s lessons</h2>
          <div class="day-nav" role="group" aria-label="Choose a day">
            <button class="btn small" type="button" id="prev" ${day === 0 ? "disabled" : ""}>Previous day</button>
            <span>Day ${day + 1} of this round</span>
            <button class="btn small" type="button" id="next">Next day</button>
          </div>
        </div>
        <p class="fine">A 45-minute block: together, then small groups, then on their own. Every activity needs only chalk, paper and things in the classroom.</p>
        <div class="lessons">${lessons}</div>
        <div class="actions">
          <button class="btn" type="button" id="print">Print today’s lessons</button>
          ${!left && days < RECHECK_DAYS ? `<button class="btn" type="button" id="recheck">Recheck now</button>` : ""}
        </div>` : ""}
        <nav class="sub-nav" aria-label="Class">
          <a href="#/c/${c.id}/progress">Progress</a>
          <a href="#/c/${c.id}/edit">Edit class</a>
          <button class="link" type="button" id="csv">Download as CSV</button>
        </nav>
      </section>`;
    return [html, () => {
      const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
      on("recheck", () => { c.round++; c.rounds = (c.rounds || []).concat(today()); c.absent = []; dayShift = 0; save(); go(`#/c/${c.id}/check`); });
      on("retry", () => { c.absent = []; save(); go(`#/c/${c.id}/check`); });
      on("prev", () => { dayShift--; render(); });
      on("next", () => { dayShift++; render(); });
      on("print", () => window.print());
      on("csv", () => downloadCsv(c));
    }];
  }

  function downloadCsv(c) {
    const ld = ladderOf(c);
    const rows = [["child", "round", "date", "rung"]];
    c.children.forEach((ch) => ch.checks.forEach((k) => rows.push([ch.name, k.round, k.d, ld.rungs[k.r].name])));
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${c.name.replace(/[^\w-]+/g, "-")}-rung.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- progress ----------
  function viewProgress(c) {
    const ld = ladderOf(c), n = c.children.length;
    const rows = [];
    for (let round = 1; round <= c.round; round++) {
      // a child's rung at the end of a round is their latest check up to that round
      const counts = ld.rungs.map(() => 0);
      let unknown = 0;
      c.children.forEach((ch) => {
        const ks = ch.checks.filter((k) => k.round <= round);
        if (ks.length) counts[ks[ks.length - 1].r]++; else unknown++;
      });
      rows.push({ round, counts, unknown, date: (c.rounds || [])[round - 1] });
    }
    const bars = rows.map((row) => `
      <li>
        <p class="p-label">Round ${row.round}${row.date ? `, ${nice(row.date)}` : ""}</p>
        <div class="p-bar" role="img" aria-label="${row.counts.map((k, i) => `${k} on ${ld.rungs[i].name}`).join(", ")}${row.unknown ? `, ${row.unknown} not checked` : ""}">
          ${row.counts.map((k, i) => k ? `<span style="--c: var(--g${i}); flex: ${k}" title="${esc(ld.rungs[i].name)}: ${k}">${k}</span>` : "").join("")}
          ${row.unknown ? `<span class="unk" style="flex: ${row.unknown}">${row.unknown}</span>` : ""}
        </div>
      </li>`).join("");
    const last = rows[rows.length - 1];
    const html = `
      <section class="wrap">
        <a class="back" href="#/c/${c.id}">${esc(c.name)}</a>
        <h1>Progress</h1>
        <p class="big-stat"><b>${last.counts[top(ld)]} of ${n}</b> children are on the top rung, ${esc(ld.rungs[top(ld)].name)}.</p>
        <ul class="key">${ld.rungs.map((r, i) => `<li style="--c: var(--g${i})">${esc(r.name)}</li>`).join("")}</ul>
        <ol class="p-rows">${bars}</ol>
        <p class="fine">Each bar shows where every child was after that round of checks. If the block is working, the bars move right over time.</p>
      </section>`;
    return [html, null];
  }

  // ---------- edit ----------
  function viewEdit(c) {
    const html = `
      <section class="wrap narrow">
        <a class="back" href="#/c/${c.id}">${esc(c.name)}</a>
        <h1>Edit class</h1>
        <form id="rename" class="form">
          <label class="field"><span>Class name</span><input name="name" value="${esc(c.name)}" required></label>
          <button class="btn" type="submit">Save name</button>
        </form>
        <h2>Children</h2>
        <ul class="kids">${c.children.map((ch) => `<li><span>${esc(ch.name)}</span><button class="link" type="button" data-rm="${ch.id}">Remove</button></li>`).join("")}</ul>
        <form id="add" class="form">
          <label class="field"><span>Add children, one first name per line</span><textarea name="names" rows="3"></textarea></label>
          <button class="btn" type="submit">Add children</button>
        </form>
        <div class="danger">
          <button class="btn" type="button" id="del">Delete this class</button>
          <p id="confirm" hidden>This deletes the class and all its checks from this device. <button class="btn solid-danger" type="button" id="del-yes">Yes, delete it</button></p>
        </div>
      </section>`;
    return [html, () => {
      document.getElementById("rename").addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.name.value.trim(); if (v) { c.name = v; save(); go(`#/c/${c.id}`); } });
      document.getElementById("add").addEventListener("submit", (e) => {
        e.preventDefault();
        e.target.names.value.split("\n").map((s) => s.trim()).filter(Boolean).forEach((n) => c.children.push({ id: uid(), name: n, checks: [] }));
        save(); render();
      });
      app.querySelectorAll("[data-rm]").forEach((b) => b.addEventListener("click", () => { c.children = c.children.filter((x) => x.id !== b.dataset.rm); save(); render(); }));
      document.getElementById("del").addEventListener("click", () => { document.getElementById("confirm").hidden = false; document.getElementById("del-yes").focus(); });
      document.getElementById("del-yes").addEventListener("click", () => { mem.classes = mem.classes.filter((x) => x.id !== c.id); save(); go("#/"); });
    }];
  }

  // ---------- start ----------
  load();
  render();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
