// Ladders beyond foundations: comprehension (oral check) and writing (assessed from a child's own page).
// A child works on these once they've reached the top of the foundations reading ladder. CC BY 4.0.

(function () {
  const p = (title, together, groups, own, need) => ({ title, parts: [["Together", 10, together], ["In small groups", 25, groups], ["On their own", 10, own]], need });

  // ---------- comprehension ----------
  const COMP_RUNGS = [
    { key: "beginning", name: "Beginning", can: "reads the story but can’t yet retell what happened." },
    { key: "retells", name: "Retells", can: "retells what happened but doesn’t yet explain why.",
      ask: "Let the child read the story, then ask the question.", rule: "Passes if the answer gets the main events right, in their own words." },
    { key: "infers", name: "Infers", can: "explains why things happen from clues in the story, but doesn’t yet look at how it’s written.",
      ask: "Ask the question. The story stays in front of the child.", rule: "Passes if the answer gives a reason the story supports, even though the story doesn’t say it." },
    { key: "analyses", name: "Analyses", can: "compares, traces change and explains the writer’s choices, but doesn’t yet judge or reimagine the story.",
      ask: "Ask the question. The story stays in front of the child.", rule: "Passes if the answer points to something in the story to back it up." },
    { key: "evaluates", name: "Evaluates", can: "takes a position on the story and defends it, or reimagines it. This is the top rung.",
      ask: "Ask the question. There’s no single right answer.", rule: "Passes if the child takes a clear position and gives a reason from the story or their own life." },
  ];

  const COMP_CARDS = [
    {
      story: "Every evening, Kabir’s grandfather sat on the step and fed the crows. Kabir thought it was a waste of good rice. One morning, Kabir lost the silver button from his school shirt. He searched the yard, the road and under the step, but it was gone. That evening, a crow landed beside his grandfather and dropped something shiny on the step. It was the button. Grandfather smiled and gave the crow an extra handful of rice. Kabir didn’t say anything, but the next evening he brought the rice out himself.",
      q: {
        1: ["What did Kabir lose, and how did he get it back?", "He lost a silver button. A crow dropped it on the step."],
        2: ["Why did Kabir bring the rice out himself the next evening?", "He’d changed his mind about the crows, or he was thankful to the crow."],
        3: ["How is Kabir at the start of the story different from Kabir at the end? What shows it?", "At first he thinks feeding crows is a waste; at the end he feeds them himself."],
        4: ["Do you think the crow meant to bring the button back? Why?", "Any clear yes or no with a reason, such as “crows like shiny things” or “it was a thank-you for the rice”."],
      },
    },
    {
      story: "Meera was the fastest runner in her class, and everyone expected her to win the school race. Halfway round the track, the girl beside her, Joy, tripped and fell hard. Meera heard her cry out. She slowed, looked back, then stopped and helped Joy up. By the time they reached the finish, four other children had crossed the line. Meera’s friends asked why she had thrown the race away. Meera shrugged. “There will be another race,” she said. Joy didn’t say thank you that day. But the next week, she saved Meera a seat at lunch, and every day after that.",
      q: {
        1: ["What happened to Joy in the race, and what did Meera do?", "Joy fell. Meera stopped and helped her up."],
        2: ["Why did Meera’s friends say she had “thrown the race away”?", "She would have won, but she lost because she chose to stop."],
        3: ["The writer never says Joy was grateful. How does the writer show it instead?", "Joy saves Meera a seat at lunch, every day after."],
        4: ["Was Meera right to stop? What would you have done, and why?", "Any clear position with a reason, ideally weighing the race against helping."],
      },
    },
    {
      story: "Asha’s mother made clay pots to sell at the Sunday market. On Saturday night, Asha knocked one off the shelf, and it cracked down the side. She was too scared to tell anyone. She filled the crack with mud and turned the pot so the crack faced the wall. At the market, a woman picked up that very pot. Asha’s heart thumped. Before the woman could pay, Asha said, “Wait, that one is broken.” Her mother looked at her for a long moment. Then she gave the woman a different pot and said, “My daughter is the most honest seller in this market.” On the way home, she taught Asha how to fix a crack properly.",
      q: {
        1: ["What did Asha do after she broke the pot?", "She hid the crack with mud and turned it to the wall, and told no one."],
        2: ["Why did Asha’s heart thump when the woman picked up the pot?", "She was afraid the crack would be found, or that the woman would be cheated."],
        3: ["Why do you think the writer ends with Asha’s mother teaching her to fix a crack?", "It shows her mother forgave her, or that mistakes can be put right."],
        4: ["Which matters more in this story: Asha’s mistake, or what she did after? Explain.", "Any clear position with a reason from the story."],
      },
    },
  ];

  const COMP_LESSONS = {
    beginning: [
      p("Story map", "Read a short story aloud. Draw who, where and what happened as three boxes on the board.", "Groups retell the story in order, passing a stone: whoever holds it tells the next part.", "Draw the beginning, middle and end, with one sentence under each.", "A short story, chalk"),
      p("Five-finger retell", "Show the five fingers: who, where, the problem, what happened, how it ended. Retell a story on your fingers together.", "Each group reads a new story and retells it on five fingers, one child per finger.", "Write the five parts of the story in five sentences.", "Short stories"),
      p("True or false", "Read a story, then say statements about it. Children show thumbs up for true, down for false.", "Each group writes three true-or-false statements about a story for another group to answer.", "Answer five who, what and where questions about the story.", "A short story, paper"),
    ],
    retells: [
      p("Reading between the lines", "Write “Ravi slammed the door.” Ask how Ravi feels and how we know. Clue plus what I know makes an inference.", "Groups find three clue sentences in a story and work out what each one tells us that the story doesn’t say.", "Write three inferences, each with its clue.", "A short story"),
      p("Why did they do that?", "Read a story and stop at a character’s choice. Ask why, and accept only answers the story supports.", "Groups get character-action cards and explain the reason for each, pointing to the line that shows it.", "Pick one character and explain one choice they made.", "A story, paper cards"),
      p("Predict and check", "Read a story in three parts. Before each part, the group predicts what happens and why.", "Groups read a new story, stopping twice to write a prediction with a reason, then check.", "Write which prediction was closest and what clue helped.", "A story cut into three parts"),
    ],
    infers: [
      p("Compare two characters", "Draw two overlapping circles. Fill in how two characters are alike and different, with lines from the story.", "Groups compare two characters from a new story and present one difference with evidence.", "Write a paragraph comparing the two characters.", "A story, chalk"),
      p("The writer’s choices", "Ask: why this title? Why does it end here? Why does the writer tell us this detail?", "Groups write two “why did the writer…” questions about a story and swap them with another group.", "Answer one question, quoting the story.", "A story, paper"),
      p("How a character changes", "Draw a line from start to end of a story. Mark how a character feels at each point and what changed them.", "Groups draw a change line for a character in a new story.", "Write what changed the character, with evidence.", "A story, paper"),
    ],
    analyses: [
      p("Agree or disagree", "Ask whether a character did the right thing. Children stand on one side of the room or the other and give reasons.", "Groups argue both sides of a question about a story and decide which reasons are strongest.", "Write your opinion with two reasons from the story.", "A story with a hard choice in it"),
      p("Change one thing", "Pick one event in a story and ask how everything after it would change if it went differently.", "Each group changes one event and retells the story from there.", "Write the new ending and explain why it follows.", "A story"),
      p("Two stories, one idea", "Read two short texts about the same idea, such as honesty or courage.", "Groups decide which text says it better and why, then present to the class.", "Write which you preferred and why.", "Two short texts"),
    ],
    evaluates: [
      p("Book talk", "Recommend a book or story you’ve read and say who would like it and why.", "Each child recommends a story to their group, and the group asks hard questions about it.", "Write a short review of a story you’ve read.", "Story books or texts"),
      p("Another point of view", "Ask whose voice isn’t heard in a story, such as the crow, the woman at the market or the other runners.", "Groups retell a story from another character’s point of view.", "Write the story from that character’s point of view.", "A story"),
      p("Can we trust it?", "Read a notice, advert or news item. Ask who wrote it, why, and what they want us to believe.", "Groups judge a text: what’s fact, what’s opinion, and what’s missing.", "Write whether you trust the text and why.", "A real notice, advert or news item"),
    ],
  };

  // ---------- writing ----------
  const WRITE_RUNGS = [
    { key: "beginning", name: "Beginning", can: "writes single words or copies text, but not yet whole sentences of their own.",
      look: "Single words, lists, or copied text. No complete sentences of the child’s own." },
    { key: "sentences", name: "Sentences", can: "writes complete simple sentences, but as separate thoughts.",
      look: "Complete simple sentences, each a separate thought. Few joining words." },
    { key: "paragraph", name: "Paragraph", can: "writes connected sentences on one topic, with frequent slips in tense, spelling or punctuation.",
      look: "Sentences that connect and stay on one topic, in order. Tense, spelling or punctuation often slip." },
    { key: "controlled", name: "Controlled", can: "organises writing with a clear beginning, middle and end, and mostly correct tense, spelling and punctuation.",
      look: "A clear beginning, middle and end. Tense mostly consistent; spelling and punctuation mostly correct; sentences start in different ways." },
    { key: "crafted", name: "Crafted", can: "chooses words and sentence shapes for effect, with a voice of their own. This is the top rung.",
      look: "Words and sentence shapes chosen for effect. A voice of its own. Few errors." },
  ];

  const WRITE_PROMPTS = [
    "Write about a time something surprised you.",
    "Write about a place you know well, so that someone who has never been there can picture it.",
    "Write about a problem in your town or village, and how you would solve it.",
  ];

  const WRITE_LESSONS = {
    beginning: [
      p("Say it, then write it", "Show a picture. Children say whole sentences about it; write them on the board and read them together.", "In pairs, children say a sentence about the picture, then write it, checking it says who and what they did.", "Write two sentences about yourself.", "A picture, chalk"),
      p("Who did what", "Say a “who” (“the dog”) and let the group add what it did (“ran to the gate”).", "Groups match “who” cards with “did what” cards to build sentences and copy their three best.", "Write three sentences about your morning.", "Paper cards"),
      p("Fix my sentence", "Write broken sentences on the board: no capital, no full stop, no doing word. Fix them together.", "Each group fixes five broken sentences, then writes one broken sentence for another group.", "Write three sentences and check each has a capital and a full stop.", "Chalk, paper"),
    ],
    sentences: [
      p("Joining words", "Join pairs of sentences with and, but, because and so. Read each one aloud.", "Groups join sentence cards using a joining word and read the new sentence to another group.", "Write four sentences about a festival, using two joining words.", "Sentence cards"),
      p("First, next, then, finally", "Retell how to make tea in order, using time words.", "Groups put jumbled sentence strips in order to make a paragraph, then read it aloud.", "Write how to do something you know well, using time words.", "Sentence strips"),
      p("One topic", "Show a paragraph with one sentence that doesn’t belong. Find it together.", "Each child writes a paragraph on one topic; partners swap and spot anything off-topic.", "Rewrite your paragraph with every sentence on topic.", "Paper"),
    ],
    paragraph: [
      p("Tense detectives", "Read a paragraph that mixes past and present. Fix every verb together.", "Groups rewrite a present-tense paragraph in the past tense and check each verb.", "Write about yesterday in the past tense and underline every verb.", "Paper"),
      p("Beginning, middle, end", "Plan a story on the board as three boxes.", "Groups plan a story in three boxes; each child writes one part, then they read it through.", "Write your own story from a three-box plan.", "Paper"),
      p("Spelling patterns", "Pick one pattern, such as -ed endings or double letters, and collect words that follow it.", "Groups sort word cards by pattern, then give each other a short dictation.", "Proofread your last piece and correct five spellings.", "Word cards"),
    ],
    controlled: [
      p("Better words", "Replace tired words like said, nice and went with sharper ones. Talk about how each changes the meaning.", "Groups rewrite a plain paragraph with precise verbs and describing words.", "Improve five words in your last piece.", "A plain paragraph"),
      p("Show, don’t tell", "Compare “She was scared” with “Her hands wouldn’t stop shaking.”", "Groups turn “tell” sentences into “show” sentences and read the best ones out.", "Write a paragraph that shows a feeling without naming it.", "Chalk"),
      p("Sentence shapes", "Short sentences for drama. Long ones for description. Starting with “When…” or “Suddenly…”.", "Groups rewrite a paragraph so that no two sentences start the same way.", "Describe rain using three different sentence shapes.", "Paper"),
    ],
    crafted: [
      p("Writer’s choices", "Read a strong passage from a book and talk about why the writer chose those words.", "Groups write the same scene twice in two different moods.", "Write a piece of your choice, then one sentence about a choice you made as a writer.", "A good book"),
      p("Edit like an editor", "Show how to give feedback: two things that work and one suggestion.", "Partners swap pieces and give feedback the same way, then revise.", "Revise your piece using the feedback.", "Recent writing"),
      p("Write for real readers", "Pick a real issue and a real reader, such as the head teacher or the local council.", "Groups plan the argument: the problem, the evidence, what should happen.", "Write the letter.", "Paper"),
    ],
  };

  Object.assign(window.RUNG_LADDERS, {
    "comp-en": { id: "comp-en", family: "upper", name: "Comprehension in English", short: "Comprehension", kind: "oral", rungs: COMP_RUNGS, start: 2, comp: COMP_CARDS, lessons: COMP_LESSONS, lang: "en" },
    "write-en": { id: "write-en", family: "upper", name: "Writing in English", short: "Writing", kind: "writing", rungs: WRITE_RUNGS, prompts: WRITE_PROMPTS, lessons: WRITE_LESSONS, lang: "en" },
  });
})();
