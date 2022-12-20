export class HistoryManager {
  #id;
  #questionLength;
  #historyData;

  get historyData() {
    return this.#historyData;
  }
  get historyLength() {
    return this.#historyData.length;
  }

  constructor({ id, questionLength }) {
    if (!id || !questionLength) {
      throw new Error("引数が不正です。");
    }

    this.#id = "historyManager-" + id;
    this.#questionLength = questionLength;

    localStorageData = localStorage.getItem(this.#id);

    // 何もデータが保存されていないとき (≒そのidで初めて履歴を保存するとき)
    if (!localStorage) {
      localStorage.setItem(
        this.#id,
        JSON.stringify({
          questionLength: this.#questionLength,
          history: [],
        })
      );
    } else if (JSON.parse(localStorageData).length !== this.#questionLength) {
      throw new Error(
        "指定されたIDには長さが違う履歴データが保存されています。"
      );
    }

    this.#historyData = this.#get();
  }

  // 履歴をすべて取得する
  #get() {
    const json = JSON.parse(localStorage.getItem(id));

    for (let i = 0; i < json.history.length; i++) {
      json.history.date = new Date(json.history.date);
    }

    return json;
  }

  // 履歴を追加する
  push(historyData) {
    if (historyData.length !== this.#questionLength) {
      throw new Error("履歴の長さが不正です。");
    }

    const data = {
      date: new Date(),
      data: historyData,
    };

    this.#historyData.history.push(data);
    localStorage.setItem(this.#id, JSON.parse(this.#historyData));
  }

  // 指定された期間の単語別成績を取得する。
  getWordsScore(start = 0, end = this.#historyLength) {
    if (start > 0 || end > this.#questionLength) {
      throw new Error("引数が不正です。");
    }
    // 履歴が何もない場合
    else if (this.#questionLength === 0) {
      return {
        collect: 0,
        incollect: 0,
        unanswered: 0,
      };
    }

    const historyLength = endIndex - startIndex;

    const sumScore = new Array(61);
    for (let i = 0; i < sumScore.length; i++) {
      sumScore[i] = {
        unanswered: 0,
        collect: 0,
        uncollect: 0,
      };
    }

    if (historyLength === 0) {
      return sumScore;
    }

    // スコアの合計値を求める。

    for (let i = startIndex; i < endIndex; i++) {
      const dayScore = this.#historyData.history[i];

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
        unanswered: sumScore[i].unanswered / historyLength,
        collect: sumScore[i].collect / historyLength,
        uncollect: sumScore[i].uncollect / historyLength,
      });
    }

    return average;
  }

  // 指定された期間の日別成績を取得する。
  getDaysScore(start = 0, end = this.#historyLength) {
    if (start > 0 || end > this.#questionLength) {
      throw new Error("引数が不正です。");
    }
    // 履歴が何もない場合
    else if (this.#questionLength === 0) {
      return {
        collect: 0,
        incollect: 0,
        unanswered: 0,
      };
    }

    let sumUnanswered = 0;
    let sumCollect = 0;
    let sumUncollect = 0;

    for (let i = start; i < end; i++) {
      const historyData = this.#historyData.history[i];
      const score = this.getDayScore(historyData);

      sumUnanswered += score.unanswered;
      sumCollect += score.collect;
      sumUncollect += score.uncollect;
    }

    const fullScore = this.#questionLength * (end - start);

    return {
      unanswered: sumUnanswered / fullScore,
      collect: sumCollect / fullScore,
      uncollect: sumUncollect / fullScore,
    };
  }
}

export class QuizManager {
  #index = -1;
  #questionId;
  #shuffled;
  #result;

  get index() {
    return this.#index;
  }

  get questionId() {
    return 
  }

  get shuffled() {
    return this.#shuffled;
  }

  get result() {
    return this.#result;
  }

  constructor({ shuffle = true, length } = {}) {
    this.#shuffled = [...new Array(length)].map((val, i) => i);
    
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

    this.#result = Array(this.length).fill(0);
  }

  judge(isCorrect, index) {
    this.#result[index] = isCorrect ? 1 : 2;
  }

  next() {
    if (this.#index + 1 > this.length - 1) return false;
    this.#index++;
    this.#questionId = this.#shuffled[this.#index];
    return {
      questionIndex: this.#index,
      questionId: this.#questionId,
    };
  }

  save() {
    HistoryManager.pushHistory(this.#result);
    return HistoryManager.getHistoryLength() - 1;
  }
}
