import { historyManager as history } from "./history.js";

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
            ><span>正答率</span>${Math.floor(history.getAverageByDay().collect * 100)}%</a
          >
        </li>
      </ul>
    </nav>
  </div>
</header>`;
