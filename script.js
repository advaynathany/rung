// Rung: the divided blackboard.

(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Material, drawn once into images so scrolling costs nothing. ----
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
  const setImg = (el, prop, c) => { try { el.style.setProperty(prop, `url(${c.toDataURL("image/png")})`); return true; } catch (e) { return false; } };

  // Slate: duster swipes (broad wiped arcs) and stray chalk specks.
  (function slate() {
    const board = document.querySelector(".board");
    const [c, x] = canvas(1400, 2400);
    if (!board || !x) return;
    x.lineCap = "round";
    for (let i = 0; i < 34; i++) {
      const cx = rnd() * 1400, cy = rnd() * 2400, r = 140 + rnd() * 360;
      const a0 = rnd() * Math.PI * 2, sweep = 0.5 + rnd() * 1.1;
      x.strokeStyle = `rgba(236,238,230,${0.03 + rnd() * 0.045})`;
      x.lineWidth = 40 + rnd() * 80;
      const edge = `rgba(236,238,230,${0.03 + rnd() * 0.04})`, wide = x.lineWidth, sw = x.strokeStyle;
      // draw each swipe at its place and one tile above and below, so the image repeats without a seam
      for (const dy of [-2400, 0, 2400]) {
        x.filter = "blur(14px)"; x.lineWidth = wide; x.strokeStyle = sw;
        x.beginPath(); x.arc(cx, cy + dy, r, a0, a0 + sweep); x.stroke();
        // the dry edge a duster leaves along each swipe
        x.filter = "blur(2px)"; x.lineWidth = 2; x.strokeStyle = edge;
        x.beginPath(); x.arc(cx, cy + dy, r + 40, a0, a0 + sweep * 0.8); x.stroke();
      }
    }
    x.filter = "none";
    for (let i = 0; i < 2600; i++) {
      x.fillStyle = `rgba(236,238,230,${0.05 + rnd() * 0.12})`;
      x.fillRect(rnd() * 1400, rnd() * 2400, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
    }
    setImg(board, "--dust", c);
  })();

  // Raw wood for the frame and ledge: long wavy grain lines with a few knots.
  (function wood() {
    const [c, x] = canvas(900, 160);
    if (!x) return;
    x.fillStyle = "#8b5a33"; x.fillRect(0, 0, 900, 160);
    for (let y = 0; y < 160; y += 1.6) {
      const tone = rnd();
      x.strokeStyle = tone > 0.5 ? `rgba(60,34,15,${0.05 + rnd() * 0.18})` : `rgba(196,140,86,${0.04 + rnd() * 0.14})`;
      x.lineWidth = 0.6 + rnd() * 1.6;
      x.beginPath();
      const amp = 1 + rnd() * 3, f = 0.004 + rnd() * 0.01, ph = rnd() * 6;
      for (let px = 0; px <= 900; px += 12) x.lineTo(px, y + Math.sin(px * f + ph) * amp);
      x.stroke();
    }
    for (let k = 0; k < 3; k++) {
      const kx = 120 + rnd() * 660, ky = 30 + rnd() * 100;
      for (let r = 2; r < 18; r += 2.5) {
        x.strokeStyle = `rgba(60,34,15,${0.35 - r / 70})`; x.lineWidth = 1;
        x.beginPath(); x.ellipse(kx, ky, r * 2.4, r, 0, 0, Math.PI * 2); x.stroke();
      }
    }
    setImg(root, "--woodgrain", c);
  })();

  // Chalk grain: a speck tile used as a mask so lettering and strokes break at the edges.
  (function grain() {
    const [c, x] = canvas(180, 180);
    if (!x) return;
    x.fillStyle = "#000"; x.fillRect(0, 0, 180, 180);
    x.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 900; i++) {
      x.fillStyle = `rgba(0,0,0,${0.25 + rnd() * 0.6})`;
      const s = 0.6 + rnd() * 1.6;
      x.fillRect(rnd() * 180, rnd() * 180, s, s);
    }
    if (setImg(root, "--grain", c)) root.classList.add("chalky");
  })();

  // ---- One authored moment: the board divides. ----
  const cols = document.querySelector(".cols");
  const start = () => {
    root.classList.add("ready");
    setTimeout(() => cols && cols.classList.add("drawn"), reduce ? 0 : 900);
  };
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(start);
  } else {
    start();
  }

  // The circle round the sentence is drawn when it comes into view.
  const problem = document.querySelector(".problem");
  if (problem && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { problem.classList.add("seen"); io.disconnect(); } });
    }, { threshold: 0.45 });
    io.observe(problem);
  } else if (problem) {
    problem.classList.add("seen");
  }

  // ---- The groups: pick one to read its lesson; the others dim. ----
  const GROUPS = {
    beginning: {
      can: "recognises some shapes and sounds but can’t yet name most letters.",
      do: "Ten minutes of sound games and songs, then tracing letters in chalk on the floor, until each letter has a name and a sound.",
    },
    letters: {
      can: "names most letters but can’t yet join them into words.",
      do: "Blending with letter cards: two sounds, then three, until the cards spell a word the child already says every day.",
    },
    words: {
      can: "reads simple words one at a time but stumbles when they’re joined into sentences.",
      do: "Build short sentences from word cards, read them to a partner, and reread the same short text until it’s smooth.",
    },
    paragraph: {
      can: "reads a few connected sentences slowly and can say what they were about.",
      do: "Read a short story aloud in pairs, retell it in their own words, and answer what happened and why.",
    },
    story: {
      can: "reads a grade 2 story with understanding, the level every child should reach by about age ten.",
      do: "Write and read out their own short stories, then move on to the grade textbook.",
    },
  };

  const tabs = Array.from(document.querySelectorAll('.cols [role="tab"]'));
  const panel = document.getElementById("detail");
  const dCan = document.getElementById("d-can");
  const dDo = document.getElementById("d-do");
  let touched = false;

  function show(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const g = GROUPS[tab.dataset.g];
    dCan.textContent = g.can;
    dDo.textContent = g.do;
    panel.setAttribute("aria-labelledby", tab.id);
    if (touched) cols.classList.add("dim");
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      touched = true;
      if (tab.getAttribute("aria-selected") === "true" && cols.classList.contains("dim")) {
        cols.classList.remove("dim"); // a second tap on the open group shows the whole board again
        return;
      }
      show(tab, false);
    });
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let j = null;
      if (e.key in keys) j = (i + keys[e.key] + tabs.length) % tabs.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); touched = true; show(tabs[j], true); }
      if (e.key === "Escape") cols.classList.remove("dim");
    });
  });
  const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
  if (initial) show(initial, false);

  // ---- Sample language ----
  const langBtns = Array.from(document.querySelectorAll(".lang button"));
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      langBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      document.querySelectorAll(".g-sample").forEach((s) => {
        s.textContent = s.dataset[lang];
        if (lang === "hi") s.setAttribute("lang", "hi"); else s.removeAttribute("lang");
      });
    });
  });
})();
