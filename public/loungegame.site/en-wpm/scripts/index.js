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

  recognition.onspeechstart = () => {
    startTime = Date.now();
    endTime = startTime + time;

    const interval = setInterval(() => {
      const nowDate = Date.now();
      const last = Math.round((endTime - nowDate) / 1000);

      $wpm.textContent = Math.round(
        (count / ((nowDate - startTime) / 1000)) * 60
      );
      $seconds.textContent = `残り ${last}秒`;

      const percentage = ((nowDate - startTime) / time) * 100;
      console.log(percentage);

      $graph.style.backgroundImage = `radial-gradient(white 62%, transparent 31%),conic-gradient(#84cc16 0, #84cc16 ${percentage}%, #d9f99d ${percentage}%, #d9f99d 100%)`;
      // $graph.style.backgroundImage = "none";

      if (last <= 0) {
        recognition.stop();
        clearInterval(interval);
        return;
      }
    }, 1000);
  };

  recognition.onresult = (event) => {
    let _count = 0;

    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      console.log(transcript.match(/\S+/g));
      const words = transcript.match(/\S+/g).length;
      _count += words;
    }

    count = _count;
  };

  recognition.start();
};

const main = () => {
  document.getElementById("js-wpm-start").onclick = start;
};

main();
