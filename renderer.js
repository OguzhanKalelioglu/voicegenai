// renderer.js
let isPlaying = false;
let audio = null;

const playPauseButton = document.getElementById('play-pause-button');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const errorMessage = document.getElementById('error-message');
const tokenUsage = document.getElementById('token-usage');

const { ipcRenderer } = window.api;

playPauseButton.addEventListener('click', async () => {
  if (audio && isPlaying) {
    audio.pause();
    isPlaying = false;
    playPauseButton.textContent = 'Oynat';
    return;
  }

  const text = textInput.value.trim();
  if (!text) {
    alert('Lütfen seslendirmek için metin girin.');
    return;
  }

  const selectedVoice = voiceSelect.value;
  errorMessage.textContent = '';
  playPauseButton.disabled = true;
  playPauseButton.textContent = 'Yükleniyor...';

  try {
    const result = await window.api.speakText(text, selectedVoice);
    const { filePath, usage } = result;
    tokenUsage.textContent = usage > 0 
      ? `Kullanılan Token: ${usage}`
      : '';

    audio = new Audio(`file://${filePath}`);

    audio.addEventListener('play', () => {
      isPlaying = true;
      playPauseButton.textContent = 'Durdur';
      playPauseButton.disabled = false;
    });
    audio.addEventListener('pause', () => {
      isPlaying = false;
      playPauseButton.textContent = 'Oynat';
    });
    audio.addEventListener('ended', () => {
      isPlaying = false;
      playPauseButton.textContent = 'Oynat';
    });

    audio.play();
  } catch (err) {
    console.error('Seslendirme Hatası:', err);
    errorMessage.textContent = `Seslendirme sırasında bir hata oluştu: ${err.message}`;
  } finally {
    playPauseButton.disabled = false;
  }
});

// `read-clipboard` olayını dinleyin
window.api.onReadClipboard((clipboardText) => {
  if (!clipboardText) return;
  textInput.value = clipboardText;
  console.log("Clipboard metni:", clipboardText);
  
  // Otomatik oynatmak istersen:
  playPauseButton.click();
});
