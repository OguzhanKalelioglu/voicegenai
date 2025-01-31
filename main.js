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
      preload: app.isPackaged
        ? path.join(process.resourcesPath, 'preload.js')  // Build sonrası
        : path.join(__dirname, 'preload.js'),            // Geliştirme modu
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  mainWindow.loadFile('index.html');
}

function createTray() {
  const iconPath = path.join(
    __dirname, // Geliştirme ve build ortamı için uyumlu yol
    app.isPackaged ? 'build/icons/win/trayIcon.png' : 'electron-icon.png'
  );
  
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
  // Önceki kısayolları temizle (güvenlik için)
  if (app.isPackaged && !process.env.DEBUG) {
    globalShortcut.unregisterAll();
    console.log('Önceki kısayollar temizlendi.');
  }

  // Kısayol tuş kombinasyonu (Mac'te Cmd + Shift + S, Windows/Linux'ta Ctrl + Shift + S)
  const shortcutKey = 'CommandOrControl+Shift+S';

  try {
    // Kısayolu kaydet
    const registered = globalShortcut.register(shortcutKey, () => {
      // Pencereyi öne getir
      if (mainWindow) {
        bringWindowToFront();

        // Clipboard'daki metni oku
        const text = clipboard.readText().trim();

        // Eğer metin varsa, renderer process'e gönder
        if (text) {
          mainWindow.webContents.send('read-clipboard', text);
          console.log('Clipboard metni gönderildi:', text);
        } else {
          console.log('Clipboard boş veya metin yok.');
        }
      } else {
        console.error('MainWindow tanımlı değil!');
      }
    });

    // Kısayol başarıyla kaydedildi mi kontrol et
    if (!registered) {
      const errorMessage = `Kısayol kaydı başarısız: ${shortcutKey}. Başka bir uygulama bu kısayolu kullanıyor olabilir.`;
      console.error(errorMessage);

      // Renderer process'e hata mesajı gönder
      if (mainWindow) {
        mainWindow.webContents.send('app-error', errorMessage);
      }
    } else {
      console.log(`Kısayol başarıyla kaydedildi: ${shortcutKey}`);

      // Kısayolun kaydedildiğini kontrol et (isteğe bağlı)
      console.log('Kısayol kayıtlı mı?', globalShortcut.isRegistered(shortcutKey));
    }
  } catch (error) {
    // Hata durumunda logla ve renderer process'e bildir
    const errorMessage = `Kısayol kaydı sırasında hata: ${error.message}`;
    console.error(errorMessage);

    if (mainWindow) {
      mainWindow.webContents.send('app-error', errorMessage);
    }
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
