// The hero sentence is "read aloud" once: an underline follows each word,
// the way a child tracks with a finger during a reading check.
(function readSentence() {
  const sentence = document.getElementById("sentence");
  if (!sentence) return;
  const words = sentence.querySelectorAll("span");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let i = 0;
  const step = () => {
    if (i > 0) words[i - 1].classList.remove("read");
    if (i < words.length) {
      words[i].classList.add("read");
      i += 1;
      setTimeout(step, 340);
    } else {
      sentence.classList.add("done");
    }
  };
  setTimeout(step, 600);
})();

// The ladder: pick a rung to see a sample and what that group does next.
(function ladder() {
  const LEVELS = {
    beginner: {
      sample: { en: "Not yet naming letters", hi: "अभी अक्षर नहीं पहचानते" },
      empty: true,
      can: "recognises some shapes and sounds but can’t yet name most letters.",
      next: "Songs, sound games and tracing letters in chalk or sand, ten minutes at a time, until each letter has a name and a sound.",
    },
    letter: {
      sample: { en: "m t s a p", hi: "क म र स ल" },
      cls: "letters",
      can: "names most letters but can’t yet put them together into words.",
      next: "Blending games with letter cards: two sounds, then three, until the cards say a word the child already knows.",
    },
    word: {
      sample: { en: "cat sun ship rice", hi: "घर पानी कमल आम" },
      cls: "",
      can: "reads simple words one at a time but stumbles when they’re joined into sentences.",
      next: "Reading short sentences in pairs, building sentences from word cards, and reading the same short text aloud until it’s fluent.",
    },
    paragraph: {
      sample: {
        en: "Mina has a red bag. She puts her book in it. Then she walks to school.",
        hi: "मीना के पास एक लाल थैला है। वह उसमें अपनी किताब रखती है। फिर वह स्कूल जाती है।",
      },
      cls: "small",
      can: "reads a few connected sentences, slowly, and can say what they were about.",
      next: "Longer stories read aloud in small groups, retelling them in their own words, and answering questions about what happened and why.",
    },
    story: {
      sample: {
        en: "It rained all night. In the morning the lane was full of water. Ravi folded a paper boat and watched it float to the end of the lane. His sister laughed and made one too.",
        hi: "रात भर बारिश हुई। सुबह गली पानी से भर गई। रवि ने काग़ज़ की नाव बनाई और उसे गली के आख़िर तक तैरते देखा। उसकी बहन हँसी और उसने भी एक नाव बनाई।",
      },
      cls: "small",
      can: "reads a grade 2 story with understanding. This is the rung every child should reach by about age ten.",
      next: "Writing their own short stories, reading new texts independently, and moving on to the grade-level textbook.",
    },
  };

  const tabs = Array.from(document.querySelectorAll('.rungs [role="tab"]'));
  const panel = document.getElementById("panel");
  const sample = document.getElementById("sample");
  const can = document.getElementById("can");
  const next = document.getElementById("next");
  const langBtns = Array.from(document.querySelectorAll(".lang-btn"));
  if (!tabs.length || !panel) return;

  let lang = "en";
  let current = "word";

  function render() {
    const level = LEVELS[current];
    sample.className = "sample" + (level.cls ? " " + level.cls : "") + (level.empty ? " empty" : "");
    sample.lang = lang;
    sample.textContent = level.sample[lang];
    can.textContent = "…" + level.can;
    next.textContent = level.next;
  }

  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    current = tab.dataset.level;
    render();
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, false));
    tab.addEventListener("keydown", (e) => {
      let j = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });

  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.dataset.lang;
      langBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      render();
    });
  });

  render();
})();
