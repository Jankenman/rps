import { settings } from "./settings.js";
import { HistoryManager } from "../../scripts/quizmanager/index.js";

const historyManager = new HistoryManager({
  id: settings.id,
  questionLength: settings.questionsLegth,
});

const score = Math.floor(
  historyManager.getScoreAverage(Math.max(0, historyManager.historyLength - 5))
    .collect * 100
);

document.getElementById("js-iv-header").innerHTML = `<header>
  <div class="wrapper iv-app-header">
    <h1><a href="/loungegame.site/irregular-verbs/">不規則動詞</a></h1>
    <nav>
      <ul class="iv-nav">
        <li>
          <a href="/loungegame.site/irregular-verbs/learn.html">学ぶ</a>
        </li>
        <li>
          <a href="/loungegame.site/irregular-verbs/history.html"
            >学習記録</a
          >
        </li>
        <li>
          <a
            href="/loungegame.site/irregular-verbs/history.html"
            class="iv-rate"
            ><span>正答率</span>${score}%</a
          >
        </li>
      </ul>
    </nav>
  </div>
</header>`;
