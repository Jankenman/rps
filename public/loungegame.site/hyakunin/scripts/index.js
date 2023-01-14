"use strict";

import { hyakunin } from "./hyakun-isshu-list.js";

let shuffledIndex = [];
let count = -1;
let audio = new Audio(undefined);
let stepId;

const shuffle = (length) => {
  let shuffled = Array(length);
  for (let i = 0; i < shuffled.length; i++) {
    shuffled[i] = i;
  }

  for (let i = shuffled.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const next = (steps = 1) => {
  audio.pause();

  let _count = count + steps;

  if (!(_count < 100 && _count >= 0)) {
    return;
  }

  count += steps;

  let index = shuffledIndex[count];

  document.getElementById("js-index").innerText = count + 1;
  const $text = document.getElementById("js-hyakunin-text");

  audio = new Audio(hyakunin[index].audio);
  audio.play();

  const _id = Math.random();
  stepId = _id;

  setTimeout(() => {
    if (stepId !== _id) return;
    audio.pause();
  }, 20000);

  const yomi = hyakunin[index].yomi;

  $text.innerText = "…";
  setTimeout(() => {
    if (stepId !== _id) return;
    $text.innerText = yomi[0] + "\n…";
  }, 2000);
  setTimeout(() => {
    if (stepId !== _id) return;
    $text.innerText = yomi.slice(0, 2).join("\n") + "\n…";
  }, 4500);
  setTimeout(() => {
    if (stepId !== _id) return;
    $text.innerText = yomi.slice(0, 3).join("\n") + "\n…";
  }, 8000);
  setTimeout(() => {
    if (stepId !== _id) return;
    $text.innerText = yomi.slice(0, 4).join("\n") + "\n…"
  }, 14000);
  setTimeout(() => {
    if (stepId !== _id) return;
    $text.innerText = yomi.join("\n")
  }, 18000);
};

const start = () => {
  document.getElementById("js-settings").style.display = "none";
  document.getElementById("js-main").style.display = "block";

  document.getElementById("js-back-button").onclick = () => {
    next(-1);
  };
  document.getElementById("js-next-button").onclick = () => {
    next();
  };

  next();
};

const main = () => {
  document.getElementById("js-start-button").onclick = () => {
    start();
  };

  document.getElementById("js-toggle-fullscreen").onclick = () => {
    if (!document.fullscreenElement) {
      document.getElementById("js-app").requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  shuffledIndex = shuffle(100);
};

main();
