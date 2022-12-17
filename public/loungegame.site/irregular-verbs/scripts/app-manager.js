import { words } from "./words.js";
import { historyManager } from "./history.js";

export class manager {
  #index = -1;
  #shuffled;
  #result;

  get index() {
    return this.#index;
  }

  get questions() {
    return this.#shuffled;
  }

  get length() {
    return this.#shuffled.length;
  }

  get result() {
    return this.#result;
  }

  constructor({ shuffle = true } = {}) {
    this.#shuffled = [...words];
    for (let i = 0; i < this.#shuffled.length; i++) {
      this.#shuffled[i].index = i;
    }
    if (shuffle) {
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
    this.#index++;
    if (this.#index > this.length - 1) return false;
    return {
      questionIndex: this.#index,
      question: this.#shuffled[this.#index],
    };
  }

  save() {
    historyManager.pushHistory(this.#result);
    return historyManager.getHistoryLength() - 1;
  }
}
