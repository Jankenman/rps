import { settings } from "./settings.js";
import { HistoryManager } from "../../scripts/quizmanager/index.js";

const historyManager = new HistoryManager({
  id: settings.id,
  questionLength: settings.questionsLegth,
});

const average = historyManager.getScoreAverage(
  Math.max(0, historyManager.historyLength - 5)
);

const collect = Math.floor(average.collect * 100);
const incollect = Math.floor(average.incollect * 100);
const unanswered = Math.floor(average.unanswered * 100);

document.getElementById("js-graph").innerHTML = `<section class="iv-graph-area">
<div>
  <h2>直近5回の平均記録</h2>
  <div class="iv-details">
    <dl>
      <div class="iv-rate-info">
        <dt>正答率</dt>
        <dd>${collect}%</dd>
      </div>
      <div class="iv-rate-info">
        <dt>誤答率</dt>
        <dd>${incollect}%</dd>
      </div>
      <div class="iv-rate-info">
        <dt>無回答率</dt>
        <dd>${unanswered}%</dd>
      </div>
    </dl>
  </div>
</div>
<div
  class="iv-graph"
  style="
    background-image: radial-gradient(white 50%, transparent 31%),
      conic-gradient(
        #16a34a 0,
        #16a34a ${collect}%,
        #dc2626 ${collect}%,
        #dc2626 ${collect + incollect}%,
        #cbd5e1 ${collect + incollect}%,
        #cbd5e1 100%
      );
  "
>
  <span>正答率</span>${collect}%
</div>
</section>
`;
