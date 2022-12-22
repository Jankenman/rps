import { settings } from "./settings.js";
import { words } from "./words.js";
import {
  HistoryManager,
  QuizManager,
} from "../../scripts/quizmanager/index.js";

const $historyTable = document.getElementById("js-history-table-body");
const $detailTable = document.getElementById("js-history-detail-table-body");
const $detailDialog = document.getElementById("js-detail-dialog");

const historyManager = new HistoryManager({
  id: settings.id,
  questionLength: settings.questionsLegth,
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const viewHistoryByWords = () => {
  if (historyManager.questionLength === 0) {
    $historyTable.innerHTML = `<td colspan="4" style="opacity: 0.6;">学習記録がありません。<br /><a href="/loungegame.site/irregular-verbs/learn.html">さぁ あなたも始めましょう!!</a></td>`;
    return;
  }

  const score = historyManager.getWordsScore(
    Math.max(historyManager.historyLength - 5, 0)
  );

  let html = "";

  for (let i = 0; i < words.length; i++) {
    const collect = Math.floor(score[i].collect * 100);
    const incollect = Math.floor(score[i].incollect * 100);
    const unanswered = Math.floor(score[i].unanswered * 100);
    const maxVal = Math.max(collect, incollect, unanswered);

    html += "<tr>";
    html += `<th><a href="#/word/${i}/">${words[i].japanese}</a></th>`;
    html += `<td class="${
      maxVal === collect ? "max-value" : ""
    }">${collect}%</td>`;
    html += `<td class="${
      maxVal === incollect ? "max-value" : ""
    }">${incollect}%</td>`;
    html += `<td class="${
      maxVal === unanswered ? "max-value" : ""
    }">${unanswered}%</td>`;
    html += "</tr>";
  }

  $historyTable.innerHTML = html;
};

const viewDayAverage = () => {
  if (historyManager.historyLength === 0) {
    $historyTable.innerHTML = `<td colspan="4" style="opacity: 0.6;">学習記録がありません。<br /><a href="/loungegame.site/irregular-verbs/learn.html">さぁ あなたも始めましょう!!</a></td>`;
    return;
  }

  let html = "";

  const histories = historyManager.getDaysScore();

  for (let i = 0; i < historyManager.historyLength; i++) {
    const score = histories[i];

    const collect = Math.floor(score.collect* 100);
    const incollect = Math.floor(score.incollect* 100);
    const unanswered = Math.floor(score.unanswered* 100);
    const maxVal = Math.max(collect, incollect, unanswered);

    html += "<tr>";

    console.log(score);

    html += `<th><a href="#/day/${i}/">${formatDate(score.date)}</a></th>`;

    html += `<td class="${
      maxVal === collect ? "max-value" : ""
    }">${collect}%</td>`;
    html += `<td class="${
      maxVal === incollect ? "max-value" : ""
    }">${incollect}%</td>`;
    html += `<td class="${
      maxVal === unanswered ? "max-value" : ""
    }">${unanswered}%</td>`;
    html += "</tr>";
  }

  $historyTable.innerHTML = html;
};

const viewWordDetail = (index) => {
  $detailDialog.dataset.type = "word";

  document.getElementById("js-detail-dialog-title").innerHTML =
    words[index].japanese;
  document.getElementById("js-original-form").innerHTML =
    words[index].originalForm;
  document.getElementById("js-past-tense").innerHTML = words[index].pastTense;
  document.getElementById("js-past-participle").innerHTML =
    words[index].pastParticiple;

  let html = "";

  for (let i = 0; i < historyManager.getHistoryLength(); i++) {
    const historyData = historyManager.getHistoryByIndex(i);
    const judge = historyData.data[i];

    const collect = judge === "1";
    const incollect = judge === "2";
    const unanswered = judge === "0";

    html += "<tr>";
    html += `<td>${formatDate(historyData.date)}</td>`;
    html += `<td ${collect ? 'class="max-value"' : ""}>${
      collect ? "○" : ""
    }</td>`;
    html += `<td ${incollect ? 'class="max-value"' : ""}>${
      incollect ? "○" : ""
    }</td>`;
    html += `<td ${unanswered ? 'class="max-value"' : ""}>${
      unanswered ? "○" : ""
    }</td>`;
    html += "</tr>";
  }

  $detailTable.innerHTML = html;
  $detailDialog.showModal();
};

const viewDayDetail = (index) => {
  $detailDialog.dataset.type = "day";

  const historyData = historyManager.historyData.history[index];

  console.log(historyData)

  document.getElementById("js-detail-dialog-title").innerHTML = formatDate(
    historyData.date
  );

  let html = "";

  for (let i = 0; i < historyData.data.length; i++) {
    const judge = historyData.data[i];

    const collect = judge === 1;
    const incollect = judge === 2;
    const unanswered = judge === 0;

    html += "<tr>";
    html += `<td>${words[i].japanese}</td>`;
    html += `<td ${collect ? 'class="max-value"' : ""}>${
      collect ? "○" : ""
    }</td>`;
    html += `<td ${incollect ? 'class="max-value"' : ""}>${
      incollect ? "○" : ""
    }</td>`;
    html += `<td ${unanswered ? 'class="max-value"' : ""}>${
      unanswered ? "○" : ""
    }</td>`;
    html += "</tr>";
  }

  $detailTable.innerHTML = html;

  $detailDialog.showModal();
};

const changeView = () => {
  const dialogs = document.querySelectorAll("dialog");

  for (let i = 0; i < dialogs.length; i++) {
    dialogs[i].close();
  }

  const hash = location.hash;

  if (hash === "#/day/") {
    viewDayAverage();
  } else if (/^#\/word\/([0-9]{1,2})\/$/.test(hash)) {
    viewWordDetail(Number(hash.replace(/^#\/word\/([0-9]{1,2})\/$/, "$1")));
  } else if (/^#\/day\/([0-9])\/$/.test(hash)) {
    viewDayDetail(Number(hash.replace(/^#\/day\/([0-9])\/$/, "$1")));
  } else if (hash === "#/word/") {
    viewHistoryByWords();
  } else if (hash === "#" || hash === "#/" || hash === "") {
    location.hash = "/word/";
  } else {
    alert("URLが不正です。");
    location.hash = "/word/";
  }
};

const main = () => {
  changeView();
  window.onhashchange = changeView;

  $detailDialog.onclose = () => {
    const hash = location.hash;

    if (hash.startsWith("#/word/")) location.hash = "#/word/";
    if (hash.startsWith("#/day/")) location.hash = "#/day/";
  };
};

main();
