let isPlaying = false;
let audio = null;

const playPauseButton = document.getElementById('play-pause-button');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const errorMessage = document.getElementById('error-message');
const tokenUsage = document.getElementById('token-usage');

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
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: selectedVoice })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Bilinmeyen hata');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    audio = new Audio(url);
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
