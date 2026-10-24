const playButton = document.getElementById('playButton');
const volumeSlider = document.getElementById('volume');
const statusText = document.getElementById('status');

let audioContext = null;
let soundBuffer = null;
let volumeNode = null;
let fade = null;
let source = null;

async function loadSound(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Couldn't load ${url} (${response.status})`);
    }
    const fileData = await response.arrayBuffer();
    return await audioContext.decodeAudioData(fileData);
}

function startSound() {
    source = audioContext.createBufferSource();
    source.buffer = soundBuffer;
    source.loop = true;
    
    fade = audioContext.createGain();
    fade.gain.value = 0;

    source.connect(fade);
    fade.connect(volumeNode);
    source.start();
    fade.gain.setTargetAtTime(1, audioContext.currentTime, 0.3)

}

function stopSound() {
    fade.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
    source.stop(audioContext.currentTime +1.5)
    source = null;
    fade = null;
}

playButton.addEventListener('click', async () => {
    if (!audioContext) {
        audioContext = new AudioContext();
        volumeNode = audioContext.createGain();
        volumeNode.gain.value = Number(volumeSlider.value)
        volumeNode.connect(audioContext.destination);
    }

    if(!soundBuffer) {
        playButton.disable = true;
        statusText.textContent = 'Loading...';
        try {
            soundBuffer = await loadSound('sounds/Light Rain.mp3')
        }   catch (error) {
            statusText.textContent = error.message;
            return;
        } finally {
            playButton.disabled = false;
        }
    }

    if (source) {
        stopSound();
        playButton.textContent = 'Play sound';
        statusText.textContent = 'Stopped';
    } else {
        startSound();
        playButton.textContent = 'Stop sound';
        statusText.textContent = 'Playing';
    }
    //statusText.textContent = 'Clicked!';
});

volumeSlider.addEventListener('input', () => {
    if (volumeNode) {
        volumeNode.gain.setTargetAtTime(Number(volumeSlider.value), audioContext.currentTime, 0.03);
    }
});