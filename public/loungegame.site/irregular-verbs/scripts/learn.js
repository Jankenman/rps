import { settings } from "./settings.js";
import { words } from "./words.js";
import { QuizManager } from "../../scripts/quizmanager/index.js";

const $answerArea = document.getElementById("js-answer");
const $correctButton = document.getElementById("js-correct-button");
const $optArea = document.getElementById("js-options");
const $questionArea = document.getElementById("js-question");
const $uncorrectButton = document.getElementById("js-uncorrect-button");
const $viewAnswer = document.getElementById("js-view-answer");

let quizManager;

const finish = () => {
  location.href = `/loungegame.site/irregular-verbs/history.html#/day/${quizManager.save()}/`;
};

const next = () => {
  const question = quizManager.next();
  const questionId = question.questionId;

  console.log(question)

  if (!question) {
    finish();
    return;
  }

  document.getElementById("iv-index").innerHTML = question.questionIndex + 1;
  document.getElementById("js-japanese").innerHTML = words[questionId].japanese;
  document.getElementById("js-original-form").innerHTML =
    words[questionId].originalForm;
  document.getElementById("js-past-tense").innerHTML =
    words[questionId].pastTense;
  document.getElementById("past-participle").innerHTML =
    words[questionId].pastParticiple;
};

const gameStart = () => {
  quizManager = new QuizManager({
    shuffle: document.getElementById("js-shuffle").checked,
    questionLength: settings.questionsLegth,
    id: settings.id,
  });
  document.getElementById("iv-length").innerText =
    settings.questionsLegth + "問目";

  next();
  $optArea.style.display = "none";
  $questionArea.style.display = "block";
};

const viewAnswer = () => {
  $answerArea.style.display = "block";
  $viewAnswer.style.display = "none";
};

const judge = (isCorrect) => {
  $answerArea.style.display = "none";

  quizManager.judge(isCorrect, quizManager.questionId);
  next();

  $viewAnswer.style.display = "block";
};

const main = () => {
  $questionArea.style.display = "none";
  $answerArea.style.display = "none";
  $viewAnswer.onclick = viewAnswer;
  $correctButton.onclick = () => {
    judge(true);
  };
  $uncorrectButton.onclick = () => {
    judge(false);
  };
  document.getElementById("js-start-button").onclick = gameStart;
  document.getElementById("js-finish").onclick = () => {
    if (confirm("本当に終了しますか?")) {
      finish();
    }
  };
};

main();
