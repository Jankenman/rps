import { historyManager as history } from "./history.js";

const historyLength = history.getHistoryLength();
const average = history.getAverageByDay(Math.max(historyLength - 5, 0), historyLength)

const collect = Math.floor(average.collect * 100);
const uncollect = Math.floor(average.uncollect * 100);
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
        <dd>${uncollect}%</dd>
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
        #dc2626 ${collect + uncollect}%,
        #cbd5e1 ${collect + uncollect}%,
        #cbd5e1 100%
      );
  "
>
  <span>正答率</span>${collect}%
</div>
</section>
`;
