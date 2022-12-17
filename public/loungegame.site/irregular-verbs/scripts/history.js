export class historyManager {
  static getHistoryLength() {
    const _historyLength = Number(localStorage.getItem("iv-history-length"));
    const historyLength = _historyLength ? _historyLength : 0;

    return historyLength;
  }

  static pushHistory(data) {
    const historyData = new Date() + "@" + data.join("");

    const historyLength = historyManager.getHistoryLength();

    localStorage.setItem("iv-history-" + historyLength, historyData);
    localStorage.setItem("iv-history-length", historyLength + 1);
  }

  static getHistoryByIndex(index) {
    const storageData = localStorage.getItem("iv-history-" + index);
    const data = storageData.split("@");

    return {
      date: new Date(data[0]),
      data: [...data[1]],
    };
  }

  static getDayScore(historyData) {
    let unanswered = 0;
    let collect = 0;
    let uncollect = 0;

    historyData.data.forEach((judge) => {
      if (judge === "0") unanswered++;
      else if (judge === "1") collect++;
      else if (judge === "2") uncollect++;
    });

    return {
      unanswered,
      collect,
      uncollect,
    };
  }

  static getAverageByDay(
    startIndex = 0,
    endIndex = historyManager.getHistoryLength()
  ) {
    if (historyManager.getHistoryLength() <= 0) {
      return {
        unanswered: 0,
        collect: 0,
        uncollect: 0,
      };
    }

    let sumUnanswered = 0;
    let sumCollect = 0;
    let sumUncollect = 0;

    let fullScore = 0;

    for (let i = startIndex; i < endIndex; i++) {
      const historyData = historyManager.getHistoryByIndex(i);
      const score = this.getDayScore(historyData);

      sumUnanswered += score.unanswered;
      sumCollect += score.collect;
      sumUncollect += score.uncollect;
      fullScore += score.unanswered + score.collect + score.uncollect;
    }

    return {
      unanswered: sumUnanswered / fullScore,
      collect: sumCollect / fullScore,
      uncollect: sumUncollect / fullScore,
    };
  }

  static getWordsAverage(
    startIndex = 0,
    endIndex = historyManager.getHistoryLength()
  ) {
    const historyLength = historyManager.getHistoryLength();
    if (
      startIndex >= historyLength ||
      endIndex > historyLength ||
      startIndex > endIndex
    ) {
      throw new Error(`引数が不正な値です。startIndex: ${startIndex}, endIndex: ${endIndex}`);
    }

    const indexLength = endIndex - startIndex;

    const sumScore = new Array(61);
    for (let i = 0; i < sumScore.length; i++) {
      sumScore[i] = {
        unanswered: 0,
        collect: 0,
        uncollect: 0,
      };
    }

    if (indexLength === 0) {
      return sumScore;
    }

    // スコアの合計値を求める。

    for (let i = startIndex; i < endIndex; i++) {
      const dayScore = historyManager.getHistoryByIndex(i);

      for (let j = 0; j < dayScore.data.length; j++) {
        const judge = dayScore.data[j];
        if (judge === "0") sumScore[j].unanswered++;
        else if (judge === "1") sumScore[j].collect++;
        else if (judge === "2") sumScore[j].uncollect++;
        else throw new Error("judgeの記録が不正な値です。");
      }
    }

    // 平均を求める

    const average = [];

    for (let i = 0; i < sumScore.length; i++) {
      average.push({
        unanswered: sumScore[i].unanswered / indexLength,
        collect: sumScore[i].collect / indexLength,
        uncollect: sumScore[i].uncollect / indexLength,
      });
    }

    return average;
  }
}
