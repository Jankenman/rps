export class HistoryManager {
  #id;
  #questionLength;
  #historyData;

  get historyData() {
    return this.#historyData;
  }
  get historyLength() {
    return this.#historyData.history.length;
  }

  constructor({ id, questionLength }) {
    if (!id || !questionLength) {
      throw new Error("引数が不正です。");
    }

    this.#id = "historyManager-" + id;
    this.#questionLength = questionLength;

    const localStorageData = localStorage.getItem(this.#id);

    // 何もデータが保存されていないとき (≒そのidで初めて履歴を保存するとき)
    if (!localStorageData) {
      localStorage.setItem(
        this.#id,
        JSON.stringify({
          questionLength: this.#questionLength,
          history: [],
        })
      );
    } else if (
      JSON.parse(localStorageData).questionLength !== this.#questionLength
    ) {
      throw new Error(
        "指定されたIDには長さが違う履歴データが保存されています。"
      );
    }

    this.#historyData = this.#get();
  }

  // 履歴をすべて取得する
  #get() {
    const json = JSON.parse(localStorage.getItem(this.#id));

    for (let i = 0; i < json.history.length; i++) {
      json.history.date = new Date(json.history.date);
    }

    return json;
  }

  // 履歴を追加する
  push(historyData) {
    if (historyData.length !== this.#questionLength) {
      throw new Error(
        `履歴の長さが不正です。${historyData.length} ${this.#questionLength}`
      );
    }

    const data = {
      date: new Date(),
      data: historyData,
    };

    this.#historyData.history.push(data);
    localStorage.setItem(this.#id, JSON.stringify(this.#historyData));
  }

  // 指定された期間の単語別成績を取得する。
  getWordsScore(start = 0, end = this.historyLength) {
    if (start < 0 || end > this.historyLength) {
      throw new Error("引数が不正です。");
    }
    // 履歴が何もない場合
    else if (this.historyLength === 0) {
      const score = [];

      for (let i = 0; i < this.#questionLength; i++) {
        score.push({
          collect: 0,
          incollect: 0,
          unanswered: 0,
        });
      }
    }

    const historyLength = end - start;

    const sumScore = new Array(this.#questionLength);
    for (let i = 0; i < sumScore.length; i++) {
      sumScore[i] = {
        unanswered: 0,
        collect: 0,
        incollect: 0,
      };
    }

    if (historyLength === 0) {
      return sumScore;
    }

    // スコアの合計値を求める。

    for (let i = start; i < end; i++) {
      const dayScore = this.#historyData.history[i];

      for (let j = 0; j < dayScore.data.length; j++) {
        const judge = dayScore.data[j];
        if (judge === 0) sumScore[j].unanswered++;
        else if (judge === 1) sumScore[j].collect++;
        else if (judge === 2) sumScore[j].incollect++;
        else throw new Error("judgeの記録が不正な値です。");
      }
    }

    // パーセンテージを求める

    const percentage = [];

    for (let i = 0; i < sumScore.length; i++) {
      percentage.push({
        unanswered: sumScore[i].unanswered / historyLength,
        collect: sumScore[i].collect / historyLength,
        incollect: sumScore[i].incollect / historyLength,
      });
    }

    return percentage;
  }

  // 指定された期間の日別成績を取得する。
  getDaysScore(start = 0, end = this.historyLength) {
    if (start < 0 || end > this.historyLength) {
      throw new Error("引数が不正です。");
    }
    // 履歴が何もない場合
    else if (this.historyLength === 0) {
      return [];
    }

    const result = new Array();

    for (let i = start; i < end; i++) {
      const historyData = this.#historyData.history[i];

      let unanswered = 0;
      let collect = 0;
      let incollect = 0;

      historyData.data.forEach((judge) => {
        if (judge === 0) unanswered++;
        else if (judge === 1) collect++;
        else if (judge === 2) incollect++;
        else throw new Error("judgeの記録が不正な値です。");
      });

      result.push({
        unanswered: unanswered / this.#questionLength,
        collect: collect / this.#questionLength,
        incollect: incollect / this.#questionLength,
        date: historyData.date,
      });
    }

    return result;
  }

  // 指定された期間のスコアの平均を取得する
  getScoreAverage(start = 0, end = this.historyLength) {
    if (start < 0 || end > this.historyLength) {
      throw new Error("引数が不正です。");
    }
    // 履歴が何もない場合
    else if (this.historyLength === 0) {
      return {
        collect: 0,
        incollect: 0,
        unanswered: 0,
      };
    }

    let sumCollect = 0;
    let sumIncollect = 0;
    let sumUnanswered = 0;

    const score = this.getDaysScore(start, end);

    score.forEach((val) => {
      sumCollect += val.collect;
      sumIncollect += val.incollect;
      sumUnanswered += val.unanswered;
    });

    const length = end - start;

    return {
      collect: sumCollect / length,
      incollect: sumIncollect / length,
      unanswered: sumUnanswered / length,
    };
  }
}

export class QuizManager {
  #index = -1;
  #questionId;
  #shuffled;
  #result;
  #id;

  get index() {
    return this.#index;
  }

  get questionId() {
    return this.#questionId;
  }

  get shuffled() {
    return this.#shuffled;
  }

  get result() {
    return this.#result;
  }

  constructor({ shuffle = true, questionLength, id } = {}) {
    this.#shuffled = [...new Array(questionLength)].map((val, i) => i);

    if (shuffle) {
      // シャッフル
      for (let i = this.#shuffled.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.#shuffled[i], this.#shuffled[j]] = [
          this.#shuffled[j],
          this.#shuffled[i],
        ];
      }
    }

    this.#result = Array(this.shuffled.length).fill(0);
    this.#id = id;
  }

  judge(isCorrect, index) {
    this.#result[index] = isCorrect ? 1 : 2;
  }

  next() {
    if (this.#index + 1 >= this.#shuffled.length) return false;
    this.#index++;
    this.#questionId = this.#shuffled[this.#index];
    return {
      questionIndex: this.#index,
      questionId: this.#questionId,
    };
  }

  save() {
    const historyManager = new HistoryManager({
      id: this.#id,
      questionLength: this.#shuffled.length,
    });
    historyManager.push(this.#result);
    return historyManager.historyLength - 1;
  }
}
