panel = document.querySelector('.App-header');

async function createModel() {
  let URL = 'https://teachablemachine.withgoogle.com/models/hkBUhoOZw/';

  const checkpointURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';
  let recognizer = speechCommands.create(
    'BROWSER_FFT',
    undefined,
    checkpointURL,
    metadataURL
  );
  await recognizer.ensureModelLoaded();
  return recognizer;
}

async function predictWord() {
  const recognizer = await createModel();
  const words = recognizer.wordLabels();
  console.log(words);
  recognizer.listen(
    ({ scores }) => {
      scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));
      scores.sort((s1, s2) => s2.score - s1.score);
      changeBackground(scores[0].word);
    },
    {
      probabilityThreshold: 0.6,
      overlapFactor: 0.9,
    }
  );
}

function changeBackground(output) {
  if (output == 'Background Noise') {
    panel.style.backgroundColor = 'grey';
    document.querySelector('#console').textContent =
      'Quarantine zone , Number of people : 0';
    return;
  }
  output = parseInt(output);
  if (output < 4) {
    document.querySelector('#console').textContent =
      'Safe Zone , Number of people : ' + output;
    panel.style.backgroundColor = 'green';
  } else if (output < 7) {
    document.querySelector('#console').textContent =
      'Moderate Level Safety, Number of people : ' + output;
    panel.style.backgroundColor = 'orange';
  } else {
    document.querySelector('#console').textContent =
      'Danger Zone , Number of  people : ' + output;
    panel.style.backgroundColor = 'red';
  }
}

predictWord();
