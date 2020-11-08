panel = document.querySelector('.App-header');

async function createModel() {
  let URL = 'https://teachablemachine.withgoogle.com/models/haIDdEEtd/';
  const checkpointURL = URL + 'model.json'; // model topology
  const metadataURL = URL + 'metadata.json'; // model metadata
  let recognizer = speechCommands.create(
    'BROWSER_FFT', // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );
  await recognizer.ensureModelLoaded().then();
  return recognizer;
  // predictWord();
}

async function predictWord() {
  const recognizer = await createModel();
  const words = recognizer.wordLabels();
  console.log(words);
  recognizer.listen(
    ({ scores }) => {
      scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));
      scores.sort((s1, s2) => s2.score - s1.score);
      document.querySelector('#console').textContent = scores[0].word;
      changeBackground(scores[0].word);
    },
    { probabilityThreshold: 0.6 }
  );
}

function changeBackground(output) {
  if (output == 'Background Noise') {
    panel.style.backgroundColor = 'grey';
    return;
  }
  output = parseInt(output);
  if (output < 4) {
    panel.style.backgroundColor = 'green';
  } else if (output < 7) {
    panel.style.backgroundColor = 'orange';
  } else {
    panel.style.backgroundColor = 'red';
  }
}

function init() {
  predictWord();
}
init();
