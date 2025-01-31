const { 
  app, 
  BrowserWindow, 
  ipcMain, 
  globalShortcut, 
  clipboard, 
  Menu, 
  Tray 
} = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  mainWindow.loadFile('index.html');
}

function createTray() {
  const iconPath = path.join(__dirname, 'electron-icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Clipboard'ı Oku",
      click: () => {
        bringWindowToFront();
        const text = clipboard.readText().trim();
        if (text) {
          mainWindow.webContents.send('read-clipboard', text);
        }
      }
    },
    {
      label: 'Uygulamayı Göster',
      click: () => {
        bringWindowToFront();
      }
    },
    {
      label: 'Çıkış',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('TTS Uygulaması');
  tray.setContextMenu(contextMenu);

  // Tek tıkla da pencereyi getirmek istersen:
  tray.on('click', () => {
    bringWindowToFront();
  });
}

// Pencereyi öne getiren fonksiyon
function bringWindowToFront() {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.show();
  mainWindow.focus();
}

function registerGlobalShortcut() {
  // Mac'te Cmd + Shift + S, Windows/Linux'ta Ctrl + Shift + S olarak tanımlanır
  const shortcutKey = 'CommandOrControl+Shift+S';

  const registered = globalShortcut.register(shortcutKey, () => {
    // Pencereyi öne getir
    bringWindowToFront();

    // Clipboard'daki metni al, boş değilse renderer.js'e gönder
    const text = clipboard.readText().trim();
    if (text) {
      mainWindow.webContents.send('read-clipboard', text);
    } else {
      console.log('Clipboard boş veya metin yok');
    }
  });

  if (!registered) {
    console.log(`Kısayol kaydı başarısız: ${shortcutKey}`);
  } else {
    console.log(`Kısayol aktif: ${shortcutKey}`);
    // Kayıt kontrolü (isteğe bağlı)
    console.log('isRegistered:',
      globalShortcut.isRegistered(shortcutKey)
    );
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcut();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// TTS için IPC
ipcMain.handle('speak-text', async (event, text, voice) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY; // .env üzerinden okuyoruz

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: "tts-1-hd",
        voice: voice,
        input: text
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const tempFilePath = path.join(
      app.getPath('temp'),
      `output_${Date.now()}.mp3`
    );
    fs.writeFileSync(tempFilePath, response.data);

    return { filePath: tempFilePath, usage: 0 };
  } catch (error) {
    console.error('API Hatası:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : 'Unknown error');
  }
});
