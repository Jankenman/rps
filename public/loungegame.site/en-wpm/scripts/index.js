const start = () => {
  document.getElementById("js-wpm-settings").style.display = "none";
  document.getElementById("js-wpm-app-main").style.display = "block";

  const $wpm = document.getElementById("wpm");
  const $seconds = document.getElementById("seconds");
  const $graph = document.getElementById("js-wpm-app-graph");

  const time = document.getElementById("js-wpm-time").value * 1000;

  let count = 0;

  let startTime;
  let endTime;

  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  const tick = () => {
    const nowDate = Date.now();

    const elapsedTime = nowDate - startTime; // 経過時間
    const timeRemaining = endTime - nowDate; // 残り時間

    $wpm.textContent = Math.round((count / (elapsedTime / 1000)) * 60);
    $seconds.textContent = `残り ${Math.max(
      Math.round(timeRemaining / 1000),
      0
    )}秒`;

    const percentage = (elapsedTime / time) * 100;

    $graph.style.backgroundImage = `radial-gradient(white 62%, transparent 31%),conic-gradient(#84cc16 0, #84cc16 ${percentage}%, #d9f99d ${percentage}%, #d9f99d 100%)`;
  };

  recognition.onspeechstart = () => {
    startTime = Date.now();
    endTime = startTime + time;

    const interval = setInterval(() => {
      const nowDate = Date.now();
      const last = endTime - nowDate;

      if (last <= 500) {
        recognition.stop();
        clearInterval(interval);
        return;
      }

      tick();
    }, 1000);
  };

  recognition.onresult = (event) => {
    let _count = 0;

    let paragraph = "";

    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      paragraph += transcript;
      console.log(transcript.match(/\S+/g));
      const words = transcript.match(/\S+/g).length;
      _count += words;
    }

    count = _count;
    document.getElementById("js-wpm-words").textContent = `${count}語`;
    const $paragraph = document.getElementById("js-wpm-paragraph");
    $paragraph.textContent = paragraph;
    $paragraph.scrollTo({
      top: $paragraph.scrollHeight - $paragraph.clientHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  recognition.onend = tick;

  recognition.onerror = (event) => {
    alert(
      `エラーが発生しました。再読み込みします。\n\n[詳細]\nError: ${event.error}\nMessage: ${event.message}`
    );
    location.reload();
  };

  recognition.start();
};

const main = () => {
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

  if(!SpeechRecognition) {
    alert("あなたのブラウザは対応していません。\nMicrosoft Edge(PCのみ対応)，Safari，Google Chrome，Chromebook等でお試しください。")
  }

  document.getElementById("js-wpm-start").onclick = start;
};

main();
