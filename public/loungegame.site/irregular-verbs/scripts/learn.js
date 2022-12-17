import { manager } from "./app-manager.js";

const $answerArea = document.getElementById("js-answer");
const $correctButton = document.getElementById("js-correct-button");
const $optArea = document.getElementById("js-options");
const $questionArea = document.getElementById("js-question");
const $uncorrectButton = document.getElementById("js-uncorrect-button");
const $viewAnswer = document.getElementById("js-view-answer");

let questions;

const finish = () => {
  location.href = `/loungegame.site/irregular-verbs/history.html#/day/${questions.save()}/`;
};

const next = () => {
  const question = questions.next();

  if (!question) {
    finish();
    return;
  }

  document.getElementById("iv-index").innerHTML = question.questionIndex + 1;
  document.getElementById("js-japanese").innerHTML = question.question.japanese;
  document.getElementById("js-original-form").innerHTML =
    question.question.originalForm;
  document.getElementById("js-past-tense").innerHTML =
    question.question.pastTense;
  document.getElementById("past-participle").innerHTML =
    question.question.pastParticiple;
};

const gameStart = () => {
  questions = new manager({
    shuffle: document.getElementById("js-shuffle").checked,
  });
  document.getElementById("iv-length").innerText =
    questions.questions.length + "問目";

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

  questions.judge(isCorrect, questions.questions[questions.index].index);
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
