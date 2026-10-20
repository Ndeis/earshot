const playButton = document.getElementById('playButton');
const volumeSlider = document.getElementById('volume');
const statusText = document.getElementById('status');

let audioContext = null;
let soundBuffer = null;
let volumeNode = null;
let source = null;

async function loadSound(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Couldn't load ${url} (${response.status})`);
    }
    const fileData = await response.arrayBuffer();
    return await audioContext.decodeAudioData(fileData);
}

playButton.addEventListener('click', async () => {
    if (!audioContext) {
        audioContext = new AudioContext();
        volumeNode = audioContext.createGain();
        volumeNode.gain.value = Number(volumne)
    }
    statusText.textContent = 'Clicked!';
});

function startSound() {
    source = audioContext.createBufferSource();
    source.buffer = soundBuffer;
    source.loop = true;
    source.connect(volumeNode);
    source.start();
}

function stopSound() {
    source.Stop();
    source = null;
}