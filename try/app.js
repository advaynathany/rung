// Rung prototype: several ladders per class, each with its own check, groups and lessons.
// Everything stays on this device, except a photo of a child's page when AI marking is switched on.

(function () {
  const L = window.RUNG_LADDERS;
  const KEY = "rung.prototype.v1";
  const SKEY = "rung.settings.v1";
  const RECHECK_DAYS = 10; // school days, per METHOD.md
  const BIG_GROUP = 15;
  const app = document.getElementById("app");

  // ---------- storage ----------
  let mem = { classes: [] };
  let settings = { key: "", model: "claude-opus-5-5" };
  let stored = true;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) mem = JSON.parse(raw);
      if (!mem || !Array.isArray(mem.classes)) mem = { classes: [] };
      const s = localStorage.getItem(SKEY);
      if (s) settings = Object.assign(settings, JSON.parse(s));
    } catch (e) { stored = false; }
    mem.classes.forEach(migrate);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(mem)); stored = true; } catch (e) { stored = false; }
  }
  function saveSettings() {
    try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch (e) { stored = false; }
  }
  // v0.1 classes had one ladder; give their state and checks a ladder id.
  function migrate(c) {
    if (c.ladders) return;
    c.ladders = [c.ladder];
    c.state = { [c.ladder]: { round: c.round || 1, starts: c.rounds || [today()], absent: c.absent || [] } };
    c.children.forEach((ch) => ch.checks.forEach((k) => { k.l = c.ladder; }));
    delete c.ladder; delete c.round; delete c.rounds; delete c.absent;
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
  const top = (ld) => ld.rungs.length - 1;
  const findClass = (id) => mem.classes.find((c) => c.id === id);
  const st = (c, lid) => (c.state[lid] = c.state[lid] || { round: 1, starts: [today()], absent: [] });
  const roundStart = (c, lid) => st(c, lid).starts[st(c, lid).round - 1] || today();
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  // A child's rung on a ladder is their latest check on it. Checks never move a child down (METHOD.md §5).
  const lastCheck = (ch, lid) => { for (let i = ch.checks.length - 1; i >= 0; i--) if (ch.checks[i].l === lid) return ch.checks[i]; return null; };
  const rungOf = (ch, lid) => { const k = lastCheck(ch, lid); return k ? k.r : null; };
  const checkedIn = (ch, lid, round) => ch.checks.some((k) => k.l === lid && k.round === round);

  // Comprehension and writing start once a child has reached the top of foundations reading (METHOD.md rule 8).
  function foundation(c) { return c.ladders.find((id) => L[id].family === "read"); }
  function eligible(c, ch, ld) {
    if (ld.family !== "upper") return true;
    const f = foundation(c);
    if (!f) return true;
    const r = rungOf(ch, f);
    return r === null || r === top(L[f]);
  }
  const toCheck = (c, ld) => {
    const s = st(c, ld.id);
    return c.children.filter((ch) => eligible(c, ch, ld) && !checkedIn(ch, ld.id, s.round) && !s.absent.includes(ch.id) && !(s.round > 1 && rungOf(ch, ld.id) === top(ld)));
  };
  function groupsOf(c, ld) {
    const g = ld.rungs.map(() => []);
    c.children.forEach((ch) => { const r = rungOf(ch, ld.id); if (r !== null && eligible(c, ch, ld)) g[r].push(ch); });
    return g;
  }

  // ---------- routing ----------
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener("hashchange", render);

  function render() {
    if (toastAt !== location.hash) toast = "";
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    let view = viewHome, args = [];
    if (parts[0] === "new") view = viewNew;
    else if (parts[0] === "settings") view = viewSettings;
    else if (parts[0] === "c" && findClass(parts[1])) {
      const c = findClass(parts[1]);
      args = [c];
      if (parts[2] === "l" && L[parts[3]] && c.ladders.includes(parts[3])) {
        args.push(L[parts[3]]);
        view = parts[4] === "check" ? viewCheck : parts[4] === "progress" ? viewProgress : viewLadder;
      } else if (parts[2] === "k" && c.children.find((x) => x.id === parts[3])) {
        view = viewChild; args.push(c.children.find((x) => x.id === parts[3]));
      } else view = parts[2] === "edit" ? viewEdit : viewClass;
    }
    const [html, after] = view(...args);
    app.innerHTML = (stored ? "" : `<p class="warn wrap">This browser isn’t saving data, so your classes will be lost when you close the page.</p>`) + html;
    window.scrollTo(0, 0);
    if (after) after();
    const h = app.querySelector("h1");
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }
  const on = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };

  // ---------- home ----------
  function viewHome() {
    const list = mem.classes.map((c) => {
      const left = c.ladders.reduce((n, id) => n + toCheck(c, L[id]).length, 0);
      return `<li><a class="row" href="#/c/${c.id}"><span class="row-name">${esc(c.name)}</span><span class="row-meta">${plural(c.children.length, "child", "children")}. ${c.ladders.map((id) => esc(L[id].short)).join(", ")}.${left ? ` ${left} checks to do.` : ""}</span></a></li>`;
    }).join("");
    const html = `
      <section class="wrap">
        <h1>${mem.classes.length ? "Your classes" : "Teach every child from their rung"}</h1>
        ${mem.classes.length ? `<ul class="rows">${list}</ul>` : `
          <ol class="intro">
            <li><b>Check</b> each child on a ladder: reading, maths, comprehension or writing.</li>
            <li><b>Group</b> the class by the rung they’re on, not their grade.</li>
            <li><b>Teach</b> today’s lesson for every group, then recheck every two weeks.</li>
          </ol>`}
        <div class="actions">
          <a class="btn primary" href="#/new">Add a class</a>
          <button class="btn" type="button" id="sample">Try a sample class</button>
        </div>
        <p class="fine">This is a prototype of the <a href="https://github.com/advaynathany/rung/blob/main/METHOD.md">Rung method</a>. Everything you enter stays on this device. It hasn’t been tested with children yet. <a href="#/settings">AI marking for writing: ${settings.key ? "on" : "off"}</a>.</p>
      </section>`;
    return [html, () => on("sample", "click", makeSample)];
  }

  function makeSample() {
    const names = ["Asha", "Ravi", "Mina", "Imran", "Sita", "Arjun", "Fatima", "Kiran", "Joseph", "Lata", "Vikram", "Neha", "Sameer", "Priya", "Anil", "Rekha"];
    const read = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 4, 4, 1];
    const comp = [1, 1, 2, 2, 2, 3, 3, 4, 0, 2, null, null, null, 3, 2, null];
    const write = [1, 2, 2, 2, 3, 3, 4, 3, 0, 2, null, null, null, 3, 1, null];
    const maths = [3, 2, 3, 2, 4, 3, 4, 3, 1, 2, 2, 1, 1, 4, 3, 0];
    const NEXT = [
      ["Write one whole sentence that says who did something and what they did."],
      ["Join two of your sentences with because or so.", "Start every new sentence with a capital letter."],
      ["Keep every verb in the past tense when you write about something that already happened.", "Check the spelling of words that end in -ed.", "Use a full stop where one idea ends, instead of and then."],
      ["Swap words like nice and good for words that say exactly what you mean.", "Start your sentences in different ways, not always with I or Then."],
      ["Try one very short sentence at the most exciting moment."],
    ];
    const d = new Date(); d.setDate(d.getDate() - 3);
    const day = iso(d);
    const c = {
      id: uid(), name: "Sample class, grade 4", sample: true, ladders: ["read-en", "comp-en", "write-en", "maths"],
      state: {}, children: [],
    };
    c.ladders.forEach((id) => { c.state[id] = { round: 1, starts: [day], absent: [] }; });
    names.forEach((n, i) => {
      const checks = [{ l: "read-en", round: 1, d: day, r: read[i] }, { l: "maths", round: 1, d: day, r: maths[i] }];
      if (comp[i] !== null) checks.push({ l: "comp-en", round: 1, d: day, r: comp[i] });
      if (write[i] !== null) {
        const opts = NEXT[write[i]];
        checks.push({ l: "write-en", round: 1, d: day, r: write[i], fb: { next: opts[i % opts.length], by: "sample" } });
      }
      c.children.push({ id: uid(), name: n, checks });
    });
    mem.classes.unshift(c); save(); go(`#/c/${c.id}`);
  }

  // ---------- new class ----------
  function ladderChoices(selected, name) {
    return Object.values(L).map((ld) => `
      <label class="choice"><input type="checkbox" name="${name}" value="${ld.id}" ${selected.includes(ld.id) ? "checked" : ""}>
        <span><b>${esc(ld.name)}</b> <span class="choice-rungs">${ld.rungs.map((r) => esc(r.name)).join(", ")}</span>${ld.draft ? `<span class="choice-note">Draft cards: not yet reviewed by a native speaker.</span>` : ""}${ld.kind === "writing" ? `<span class="choice-note">Checked from each child’s own page. AI can read the page for you.</span>` : ""}</span></label>`).join("");
  }
  function viewNew() {
    const html = `
      <section class="wrap narrow">
        <a class="back" href="#/">Your classes</a>
        <h1>Add a class</h1>
        <form id="f" class="form" novalidate>
          <label class="field"><span>Class name</span><input name="name" required placeholder="Grade 4 B" autocomplete="off"></label>
          <fieldset class="field"><legend>Which ladders?</legend>
            <small>Pick one or more. Comprehension and writing start once a child reaches the top of foundations reading.</small>
            ${ladderChoices(["read-en"], "ladders")}</fieldset>
          <label class="field"><span>Children’s first names, one per line</span>
            <textarea name="names" rows="7" placeholder="Asha&#10;Ravi&#10;Mina"></textarea>
            <small>Or leave this empty and give a number of children below. They’ll be called Child 1, Child 2 and so on.</small></label>
          <label class="field short"><span>Number of children</span><input name="count" type="number" min="1" max="120" inputmode="numeric"></label>
          <p class="error" id="err" role="alert" hidden></p>
          <button class="btn primary" type="submit">Add class</button>
        </form>
      </section>`;
    return [html, () => on("f", "submit", (e) => {
      e.preventDefault();
      const f = e.target, err = document.getElementById("err");
      const fail = (msg, el) => { err.textContent = msg; err.hidden = false; if (el) el.focus(); };
      const name = f.name.value.trim();
      const ladders = [...f.querySelectorAll("input[name=ladders]:checked")].map((x) => x.value);
      let names = f.names.value.split("\n").map((s) => s.trim()).filter(Boolean);
      const count = parseInt(f.count.value, 10);
      if (!names.length && count > 0) names = Array.from({ length: Math.min(count, 120) }, (_, i) => `Child ${i + 1}`);
      if (!name) return fail("Give the class a name, such as Grade 4 B.", f.name);
      if (!ladders.length) return fail("Pick at least one ladder.", f.querySelector("input[name=ladders]"));
      if (!names.length) return fail("Add the children’s names, or a number of children.", f.names);
      const c = { id: uid(), name, ladders, state: {}, children: names.map((n) => ({ id: uid(), name: n, checks: [] })) };
      ladders.forEach((id) => st(c, id));
      mem.classes.unshift(c); save(); go(`#/c/${c.id}`);
    })];
  }

  // ---------- class overview: every child on every ladder ----------
  function ladderStatus(c, ld) {
    const left = toCheck(c, ld).length, s = st(c, ld.id);
    const days = schoolDaysSince(roundStart(c, ld.id));
    const any = c.children.some((ch) => rungOf(ch, ld.id) !== null);
    if (left) return { text: `${plural(left, "child", "children")} to check${s.round > 1 ? ` in round ${s.round}` : ""}`, due: true };
    if (any && days >= RECHECK_DAYS) return { text: "Recheck due", due: true };
    return { text: `Round ${s.round}. Day ${days + 1} of teaching`, due: false };
  }

  function viewClass(c) {
    const lads = c.ladders.map((id) => L[id]);
    const rows = lads.map((ld) => {
      const s = ladderStatus(c, ld);
      return `<li><a class="row" href="#/c/${c.id}/l/${ld.id}"><span class="row-name">${esc(ld.name)}</span><span class="row-meta${s.due ? " due" : ""}">${esc(s.text)}</span></a></li>`;
    }).join("");
    const head = lads.map((ld) => `<th scope="col">${esc(ld.short)}</th>`).join("");
    const body = c.children.map((ch) => `<tr><th scope="row"><a href="#/c/${c.id}/k/${ch.id}">${esc(ch.name)}</a></th>${lads.map((ld) => {
      if (!eligible(c, ch, ld)) return `<td class="na">After reading</td>`;
      const r = rungOf(ch, ld.id);
      return r === null ? `<td class="na">Not checked</td>` : `<td><span class="chip" style="--c: var(--g${r})">${esc(ld.rungs[r].name)}</span></td>`;
    }).join("")}</tr>`).join("");
    const html = `
      <section class="wrap">
        <a class="back" href="#/">Your classes</a>
        <div class="class-head">
          <h1>${esc(c.name)}</h1>
          <p class="meta">${plural(c.children.length, "child", "children")}.${c.sample ? " This is a sample class with made-up children." : ""}</p>
        </div>
        <h2>Ladders</h2>
        <ul class="rows">${rows}</ul>
        <h2>Every child, every ladder</h2>
        <p class="fine">Each child sits on a different rung of each ladder. Open a ladder to see its groups and today’s lessons, or a child to see their profile.</p>
        <div class="table-wrap" tabindex="0" role="region" aria-label="Children’s rungs on each ladder">
          <table class="profile"><thead><tr><th scope="col">Child</th>${head}</tr></thead><tbody>${body}</tbody></table>
        </div>
        <nav class="sub-nav" aria-label="Class">
          <a href="#/c/${c.id}/edit">Edit class and ladders</a>
          <button class="link" type="button" id="csv">Download as CSV</button>
        </nav>
      </section>`;
    return [html, () => on("csv", "click", () => downloadCsv(c))];
  }

  // ---------- one ladder: groups and today's lessons ----------
  let dayShift = 0, shiftFor = null;
  function viewLadder(c, ld) {
    if (shiftFor !== c.id + ld.id) { dayShift = 0; shiftFor = c.id + ld.id; }
    const s = st(c, ld.id), g = groupsOf(c, ld), left = toCheck(c, ld).length;
    const checked = g.reduce((n, x) => n + x.length, 0);
    const days = schoolDaysSince(roundStart(c, ld.id));
    const waiting = c.children.filter((ch) => !eligible(c, ch, ld));
    const absent = s.absent.map((id) => c.children.find((x) => x.id === id)).filter(Boolean);
    const base = `#/c/${c.id}/l/${ld.id}`;
    let call = "";
    if (left) call = `<div class="call"><p><b>${plural(left, "child", "children")}</b> still to check${s.round > 1 ? ` in round ${s.round}` : ""}.</p><a class="btn primary" href="${base}/check">${checked ? "Continue checking" : "Start checking"}</a></div>`;
    else if (checked && days >= RECHECK_DAYS) call = `<div class="call"><p><b>Recheck due.</b> It’s been ${days} school days since the last check. Recheck everyone and move children up.</p><button class="btn primary" type="button" id="recheck">Start recheck</button></div>`;
    if (absent.length && !left) call += `<div class="call quiet"><p>Absent during the check: ${absent.map((a) => esc(a.name)).join(", ")}.</p><button class="btn" type="button" id="retry">Check them now</button></div>`;

    const cols = ld.rungs.map((r, i) => `
      <li class="g-col${g[i].length ? "" : " empty"}" style="--c: var(--g${i})">
        <h3>${esc(r.name)} <span class="n">${g[i].length}</span></h3>
        <ul>${g[i].map((ch) => `<li><a href="#/c/${c.id}/k/${ch.id}">${esc(ch.name)}</a></li>`).join("")}</ul>
      </li>`).join("");

    const day = Math.max(0, days + dayShift);
    const lessons = ld.rungs.map((r, i) => {
      if (!g[i].length) return "";
      const plans = ld.lessons[r.key], plan = plans[day % plans.length];
      const steps = ld.kind === "writing" ? g[i].map((ch) => { const k = lastCheck(ch, ld.id); return k && k.fb && k.fb.next ? `<li><b>${esc(ch.name)}:</b> ${esc(k.fb.next)}</li>` : ""; }).join("") : "";
      return `
        <article class="lesson" style="--c: var(--g${i})">
          <header><h3>${esc(r.name)} group</h3><p class="lesson-who">${plural(g[i].length, "child", "children")}: ${g[i].map((ch) => esc(ch.name)).join(", ")}</p></header>
          ${i === top(ld) ? `<p class="lesson-note">These children are on the top rung. They can go back to grade-level work, or use these plans to keep going.</p>` : ""}
          ${g[i].length > BIG_GROUP ? `<p class="lesson-note">This group has ${g[i].length} children. Think about splitting it into two groups at the same rung.</p>` : ""}
          <h4>${esc(plan.title)}</h4>
          <ol class="parts">${plan.parts.map(([who, min, what]) => `<li><span class="part-head">${who}, about ${min} min</span> ${esc(what)}</li>`).join("")}</ol>
          <p class="need"><b>You need:</b> ${esc(plan.need)}</p>
          ${steps ? `<div class="steps-own"><p class="part-head">Each child’s next step, for the “on their own” part</p><ul>${steps}</ul></div>` : ""}
        </article>`;
    }).join("");

    const html = `
      <section class="wrap">
        <a class="back" href="#/c/${c.id}">${esc(c.name)}</a>
        <div class="class-head">
          <h1>${esc(ld.name)}</h1>
          <p class="meta">Round ${s.round}, started ${nice(roundStart(c, ld.id))}.${waiting.length ? ` ${plural(waiting.length, "child is", "children are")} still on foundations reading and will join this ladder when they reach the top.` : ""}</p>
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
        <nav class="sub-nav" aria-label="Ladder">
          <a href="${base}/progress">Progress</a>
          <a href="#/c/${c.id}">All ladders</a>
        </nav>
      </section>`;
    return [html, () => {
      on("recheck", "click", () => { s.round++; s.starts.push(today()); s.absent = []; dayShift = 0; save(); go(`${base}/check`); });
      on("retry", "click", () => { s.absent = []; save(); go(`${base}/check`); });
      on("prev", "click", () => { dayShift--; render(); });
      on("next", "click", () => { dayShift++; render(); });
      on("print", "click", () => window.print());
    }];
  }

  // ---------- the check ----------
  let session = null; // oral: { key, childId, t, best, fail, floor }
  let wsession = null; // writing: { key, childId, ai, busy, err }
  let toast = "", toastAt = "";
  const say = (m) => { toast = m; toastAt = location.hash; };

  function begin(c, ld, ch) {
    const prev = rungOf(ch, ld.id);
    session = prev === null
      ? { key: c.id + ld.id, childId: ch.id, t: ld.start, best: null, fail: null, floor: null }
      : { key: c.id + ld.id, childId: ch.id, t: Math.min(prev + 1, top(ld)), best: null, fail: null, floor: prev };
  }

  function answer(c, ld, passed) {
    const s = session;
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
    if (place === null) return null;
    const ch = c.children.find((x) => x.id === s.childId);
    ch.checks.push({ l: ld.id, round: st(c, ld.id).round, d: today(), r: place });
    save();
    session = null;
    return { ch, place };
  }

  function card(ld, rung, version) {
    if (ld.comp) {
      const v = ld.comp[version % ld.comp.length];
      const [q, good] = v.q[rung];
      return `<div class="card"><p class="card-text story">${esc(v.story)}</p></div>
        <div class="wrap"><div class="teacher-q"><p><b>Ask:</b> ${esc(q)}</p><p class="good"><b>A passing answer:</b> ${esc(good)}</p></div></div>`;
    }
    const v = ld.cards[rung][version % ld.cards[rung].length];
    const lang = ld.lang === "hi" ? ' lang="hi"' : "";
    const inner = typeof v === "string"
      ? `<p class="card-text r${rung}"${lang}>${esc(v)}</p>`
      : `<ul class="card-items r${rung}${ld.id === "maths" && rung >= 3 ? " sums" : ""}"${lang}>${v.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    return `<div class="card">${inner}</div>`;
  }

  function doneView(c, ld) {
    return [`
      <section class="wrap narrow center">
        <h1>Everyone’s checked</h1>
        <p>${st(c, ld.id).round === 1 ? "The class is grouped by rung." : "The groups are updated."} Today’s lessons are ready.</p>
        <a class="btn primary" href="#/c/${c.id}/l/${ld.id}">See the groups</a>
      </section>`, null];
  }

  function viewCheck(c, ld) {
    return ld.kind === "writing" ? viewWriteCheck(c, ld) : viewOralCheck(c, ld);
  }

  function absentBtn(c, ld, ch) {
    return () => on("absent", "click", () => {
      st(c, ld.id).absent.push(ch.id); save(); session = null; wsession = null;
      say(`${ch.name} skipped. You can check them later from the ladder page.`);
      render();
    });
  }

  function viewOralCheck(c, ld) {
    const queue = toCheck(c, ld);
    if (!session || session.key !== c.id + ld.id || !queue.some((x) => x.id === session.childId)) {
      session = null;
      if (queue.length) begin(c, ld, queue[0]);
    }
    if (!session) return doneView(c, ld);
    const s = st(c, ld.id);
    const ch = c.children.find((x) => x.id === session.childId);
    const r = ld.rungs[session.t];
    const total = c.children.filter((x) => eligible(c, x, ld)).length;
    const html = `
      <section class="check">
        <div class="wrap">
          <a class="back" href="#/c/${c.id}/l/${ld.id}">${esc(ld.name)}</a>
          <p class="count">${total - queue.length + 1} of ${total}${s.round > 1 ? `, recheck round ${s.round}` : ""}</p>
          <h1 class="who-check">${esc(ch.name)}</h1>
          <p class="ask"><b class="rung-pill" style="--c: var(--g${session.t})">${esc(r.name)}</b> ${esc(r.ask)}</p>
        </div>
        ${card(ld, session.t, s.round - 1 + c.children.indexOf(ch))}
        <div class="wrap">
          <p class="rule">${esc(r.rule)}</p>
          <div class="answer">
            <button class="btn big" type="button" data-a="no">Not yet</button>
            <button class="btn big solid" type="button" data-a="yes">Passed</button>
          </div>
          <p class="minor"><button class="link" type="button" id="absent">${esc(ch.name)} is absent today</button></p>
          <p class="toast" id="toast" role="status" aria-live="polite"></p>
        </div>
      </section>`;
    return [html, () => {
      if (toast) { document.getElementById("toast").textContent = toast; toast = ""; }
      absentBtn(c, ld, ch)();
      app.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const res = answer(c, ld, b.dataset.a === "yes");
        if (res) say(`${res.ch.name}: ${ld.rungs[res.place].name}`);
        render();
      }));
    }];
  }

  // ---------- writing check: each child's own page ----------
  function viewWriteCheck(c, ld) {
    const queue = toCheck(c, ld);
    if (!wsession || wsession.key !== c.id + ld.id || !queue.some((x) => x.id === wsession.childId)) {
      wsession = queue.length ? { key: c.id + ld.id, childId: queue[0].id, ai: null, busy: false, err: "" } : null;
    }
    if (!wsession) return doneView(c, ld);
    const s = st(c, ld.id), w = wsession;
    const ch = c.children.find((x) => x.id === w.childId);
    const prompt = ld.prompts[(s.round - 1) % ld.prompts.length];
    const total = c.children.filter((x) => eligible(c, x, ld)).length;
    const first = total === queue.length;
    const ai = w.ai;
    const pick = ai && Number.isInteger(ai.rung) ? ai.rung : null;
    const dims = ai && ai.dims ? Object.entries(ai.dims).filter(([, v]) => v).map(([k, v]) => `<li><b>${esc(k[0].toUpperCase() + k.slice(1))}:</b> ${esc(v)}</li>`).join("") : "";
    const html = `
      <section class="check">
        <div class="wrap narrow">
          <a class="back" href="#/c/${c.id}/l/${ld.id}">${esc(ld.name)}</a>
          ${first ? `<div class="call quiet"><p><b>Before you start:</b> give the whole class this prompt and about 15 minutes to write. Ask children to put only their first name on the page, or nothing.</p></div>` : ""}
          <p class="prompt">“${esc(prompt)}”</p>
          <p class="count">${total - queue.length + 1} of ${total}${s.round > 1 ? `, recheck round ${s.round}` : ""}</p>
          <h1 class="who-check">${esc(ch.name)}</h1>

          <div class="photo">
            ${settings.key ? `
              <label class="btn primary file"><input type="file" id="photo" accept="image/*" capture="environment" ${w.busy ? "disabled" : ""}>${ai ? "Photograph again" : `Photograph ${esc(ch.name)}’s page`}</label>
              <p class="fine">Rung reads the page and suggests a rung. The photo goes to Anthropic to be read, without the child’s name, and isn’t kept.</p>`
            : `<p class="fine">Read the page and pick the rung that fits best. To have Rung read the page for you, <a href="#/settings">turn on AI marking</a>.</p>`}
            <p class="status" id="status" role="status" aria-live="polite">${w.busy ? "Reading the page…" : w.err ? `<span class="error">${esc(w.err)}</span>` : ""}</p>
          </div>

          ${ai ? `
          <div class="ai">
            ${ai.readable === false ? `<p class="error">The page was hard to read. Try another photo in good light, or mark it yourself.</p>` : ""}
            ${ai.why ? `<p><b>Suggested: ${esc(ld.rungs[pick] ? ld.rungs[pick].name : "")}.</b> ${esc(ai.why)}</p>` : ""}
            ${ai.strength ? `<p><b>Strength:</b> ${esc(ai.strength)}</p>` : ""}
            ${dims ? `<ul class="dims">${dims}</ul>` : ""}
            ${ai.transcript ? `<details><summary>What Rung read on the page</summary><p class="transcript">${esc(ai.transcript)}</p></details>` : ""}
          </div>` : ""}

          <form id="mark" class="form">
            <fieldset class="field"><legend>Which rung fits this page?</legend>
              ${ld.rungs.map((r, i) => `<label class="choice"><input type="radio" name="rung" value="${i}" ${pick === i ? "checked" : ""}><span><b style="color: var(--g${i})">${esc(r.name)}</b> <span class="choice-rungs">${esc(r.look)}</span></span></label>`).join("")}
            </fieldset>
            <label class="field"><span>Next step for ${esc(ch.name)}</span>
              <textarea name="next" rows="2" placeholder="One thing to work on, such as “keep every verb in the past tense”.">${esc((ai && ai.next) || "")}</textarea></label>
            <p class="error" id="err" role="alert" hidden></p>
            <button class="btn primary" type="submit">Save and go to the next child</button>
          </form>
          <p class="minor"><button class="link" type="button" id="absent">${esc(ch.name)} is absent today</button></p>
          <p class="toast" id="toast" role="status" aria-live="polite"></p>
        </div>
      </section>`;
    return [html, () => {
      if (toast) { document.getElementById("toast").textContent = toast; toast = ""; }
      absentBtn(c, ld, ch)();
      on("photo", "change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const mine = w;
        mine.busy = true; mine.err = ""; render();
        try { mine.ai = await readPage(file, prompt, ld); }
        catch (err) { mine.err = err.message || "Rung couldn’t read the page. Mark it yourself, or try again."; }
        mine.busy = false;
        if (wsession === mine) render();
      });
      on("mark", "submit", (e) => {
        e.preventDefault();
        const f = e.target, r = f.querySelector("input[name=rung]:checked");
        if (!r) { const err = document.getElementById("err"); err.textContent = "Pick the rung that fits this page."; err.hidden = false; return; }
        const rung = Number(r.value);
        const next = f.next.value.trim();
        const fb = { next, by: ai ? (ai.rung === rung ? "ai" : "teacher") : "teacher" };
        if (ai) { fb.strength = ai.strength || ""; fb.dims = ai.dims || null; }
        ch.checks.push({ l: ld.id, round: s.round, d: today(), r: rung, fb });
        save();
        say(`${ch.name}: ${ld.rungs[rung].name}`);
        wsession = null;
        render();
      });
    }];
  }

  // Shrink the photo so it's quick to send on a slow connection, then ask Claude to read it against the ladder.
  async function readPage(file, prompt, ld) {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("That file isn’t a photo Rung can open. Try taking the photo again."));
      i.src = URL.createObjectURL(file);
    });
    const scale = Math.min(1, 1568 / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement("canvas");
    cv.width = Math.round(img.naturalWidth * scale); cv.height = Math.round(img.naturalHeight * scale);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    const data = cv.toDataURL("image/jpeg", 0.85).split(",")[1];
    URL.revokeObjectURL(img.src);

    const rubric = ld.rungs.map((r, i) => `${i} ${r.name}: ${r.look}`).join("\n");
    const system = `You assess handwritten writing by children aged about 8 to 11, many writing in a second language, for a teacher using the Rung method. Judge only what is on the page, kindly and precisely.

The writing ladder:
${rubric}

Place the writing on the highest rung it clearly reaches. Reply with JSON only, no other text:
{"readable": true or false, "transcript": "what the page says, spelling kept as written", "rung": 0-4, "why": "one sentence a teacher can read quickly", "strength": "one specific thing the child does well", "dims": {"sentences": "...", "organisation": "...", "grammar and tense": "...", "spelling and punctuation": "...", "vocabulary": "..."}, "next": "one concrete next step for the child, in words a child understands"}
Each dims value is one short, specific observation quoting the child's writing where it helps. If the page can't be read, set readable to false and give your best attempt at the rest.`;

    let res;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": settings.key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: settings.model,
          max_tokens: 1500,
          system,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data } },
            { type: "text", text: `The prompt the class wrote to was: "${prompt}"` },
          ] }],
        }),
      });
    } catch (e) {
      throw new Error("No connection. Mark this page yourself, or try again when you’re online.");
    }
    if (res.status === 401) throw new Error("The API key wasn’t accepted. Check it in Settings.");
    if (!res.ok) throw new Error(`Rung couldn’t read the page (error ${res.status}). Mark it yourself, or try again.`);
    const out = await res.json();
    const text = (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Rung couldn’t make sense of the reply. Mark this page yourself.");
    const j = JSON.parse(m[0]);
    j.rung = Math.max(0, Math.min(top(ld), parseInt(j.rung, 10)));
    if (Number.isNaN(j.rung)) j.rung = null;
    return j;
  }

  // ---------- a child's profile ----------
  function viewChild(c, ch) {
    const blocks = c.ladders.map((id) => {
      const ld = L[id];
      if (!eligible(c, ch, ld)) return `<section class="pf"><h2>${esc(ld.name)}</h2><p class="fine">Starts once ${esc(ch.name)} reaches the top of foundations reading.</p></section>`;
      const ks = ch.checks.filter((k) => k.l === id);
      if (!ks.length) return `<section class="pf"><h2>${esc(ld.name)}</h2><p class="fine">Not checked yet.</p></section>`;
      const k = ks[ks.length - 1];
      const ladder = ld.rungs.map((r, i) => `<li class="${i === k.r ? "on" : i < k.r ? "below" : ""}" style="--c: var(--g${i})">${esc(r.name)}</li>`).join("");
      const fb = k.fb || {};
      const dims = fb.dims ? Object.entries(fb.dims).filter(([, v]) => v).map(([n, v]) => `<li><b>${esc(n[0].toUpperCase() + n.slice(1))}:</b> ${esc(v)}</li>`).join("") : "";
      return `
        <section class="pf">
          <h2>${esc(ld.name)}</h2>
          <ol class="mini-ladder">${ladder}</ol>
          <p>${esc(ch.name)} ${esc(ld.rungs[k.r].can)}</p>
          ${fb.strength ? `<p><b>Strength:</b> ${esc(fb.strength)}</p>` : ""}
          ${fb.next ? `<p><b>Next step:</b> ${esc(fb.next)}</p>` : ""}
          ${dims ? `<ul class="dims">${dims}</ul>` : ""}
          <p class="fine">${ks.map((x) => `${nice(x.d)}: ${esc(ld.rungs[x.r].name)}`).join(". ")}.</p>
        </section>`;
    }).join("");
    const html = `
      <section class="wrap narrow">
        <a class="back" href="#/c/${c.id}">${esc(c.name)}</a>
        <h1>${esc(ch.name)}</h1>
        ${blocks}
      </section>`;
    return [html, null];
  }

  // ---------- progress ----------
  function viewProgress(c, ld) {
    const s = st(c, ld.id), kids = c.children.filter((ch) => eligible(c, ch, ld));
    const rows = [];
    for (let round = 1; round <= s.round; round++) {
      // a child's rung at the end of a round is their latest check up to that round
      const counts = ld.rungs.map(() => 0);
      let unknown = 0;
      kids.forEach((ch) => {
        const ks = ch.checks.filter((k) => k.l === ld.id && k.round <= round);
        if (ks.length) counts[ks[ks.length - 1].r]++; else unknown++;
      });
      rows.push({ round, counts, unknown, date: s.starts[round - 1] });
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
        <a class="back" href="#/c/${c.id}/l/${ld.id}">${esc(ld.name)}</a>
        <h1>Progress</h1>
        <p class="big-stat"><b>${last.counts[top(ld)]} of ${kids.length}</b> children are on the top rung, ${esc(ld.rungs[top(ld)].name)}.</p>
        <ul class="key">${ld.rungs.map((r, i) => `<li style="--c: var(--g${i})">${esc(r.name)}</li>`).join("")}</ul>
        <ol class="p-rows">${bars}</ol>
        <p class="fine">Each bar shows where every child was after that round of checks. If the block is working, the bars move right over time.</p>
      </section>`;
    return [html, null];
  }

  function downloadCsv(c) {
    const rows = [["child", "ladder", "round", "date", "rung", "next step"]];
    c.children.forEach((ch) => ch.checks.forEach((k) => rows.push([ch.name, L[k.l].name, k.round, k.d, L[k.l].rungs[k.r].name, (k.fb && k.fb.next) || ""])));
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${c.name.replace(/[^\w-]+/g, "-")}-rung.csv`;
    document.body.appendChild(a); a.click(); a.remove();
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
        <h2>Ladders</h2>
        <form id="lads" class="form">
          <fieldset class="field"><legend class="sr">Ladders</legend>${ladderChoices(c.ladders, "ladders")}</fieldset>
          <p class="error" id="lerr" role="alert" hidden></p>
          <button class="btn" type="submit">Save ladders</button>
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
      on("rename", "submit", (e) => { e.preventDefault(); const v = e.target.name.value.trim(); if (v) { c.name = v; save(); go(`#/c/${c.id}`); } });
      on("lads", "submit", (e) => {
        e.preventDefault();
        const picked = [...e.target.querySelectorAll("input[name=ladders]:checked")].map((x) => x.value);
        if (!picked.length) { const er = document.getElementById("lerr"); er.textContent = "Keep at least one ladder."; er.hidden = false; return; }
        c.ladders = picked; picked.forEach((id) => st(c, id)); save(); go(`#/c/${c.id}`);
      });
      on("add", "submit", (e) => {
        e.preventDefault();
        e.target.names.value.split("\n").map((s) => s.trim()).filter(Boolean).forEach((n) => c.children.push({ id: uid(), name: n, checks: [] }));
        save(); render();
      });
      app.querySelectorAll("[data-rm]").forEach((b) => b.addEventListener("click", () => { c.children = c.children.filter((x) => x.id !== b.dataset.rm); save(); render(); }));
      on("del", "click", () => { document.getElementById("confirm").hidden = false; document.getElementById("del-yes").focus(); });
      on("del-yes", "click", () => { mem.classes = mem.classes.filter((x) => x.id !== c.id); save(); go("#/"); });
    }];
  }

  // ---------- settings ----------
  function viewSettings() {
    const models = [["claude-opus-5-5", "Claude Opus 5.5 (most accurate)"], ["claude-sonnet-5-5", "Claude Sonnet 5.5 (faster, cheaper)"], ["claude-haiku-5-5", "Claude Haiku 5.5 (fastest, cheapest)"]];
    const html = `
      <section class="wrap narrow">
        <a class="back" href="#/">Your classes</a>
        <h1>AI marking</h1>
        <p>With AI marking on, you photograph a child’s page and Rung reads it, suggests a rung on the writing ladder, and writes a strength and a next step. You always make the final choice.</p>
        <p class="fine">The prototype uses your own Anthropic API key, kept only in this browser. Each page costs a few cents at most. Use a key with a spending limit. The photo is sent to Anthropic to be read and isn’t stored by Rung; the child’s name is never sent.</p>
        <form id="s" class="form">
          <label class="field"><span>Anthropic API key</span><input name="key" type="password" autocomplete="off" value="${esc(settings.key)}" placeholder="sk-ant-…"></label>
          <label class="field"><span>Model</span><select name="model">${models.map(([v, t]) => `<option value="${v}" ${settings.model === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
          <div class="actions">
            <button class="btn primary" type="submit">Save</button>
            ${settings.key ? `<button class="btn" type="button" id="off">Turn off and forget the key</button>` : ""}
          </div>
          <p class="toast" id="toast" role="status" aria-live="polite"></p>
        </form>
      </section>`;
    return [html, () => {
      if (toast) { document.getElementById("toast").textContent = toast; toast = ""; }
      on("s", "submit", (e) => { e.preventDefault(); settings.key = e.target.key.value.trim(); settings.model = e.target.model.value; saveSettings(); say(settings.key ? "AI marking is on." : "AI marking is off."); render(); });
      on("off", "click", () => { settings.key = ""; saveSettings(); say("AI marking is off and the key is forgotten."); render(); });
    }];
  }

  // ---------- start ----------
  load();
  save();
  render();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
