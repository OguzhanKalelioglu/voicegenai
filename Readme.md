# VoiceGenAI

VoiceGenAI is a text-to-speech application powered by OpenAI's AI models. It allows users to convert written text into natural-sounding audio. The application is available as a desktop app built with Electron and also includes a web server component.

## Core Features

*   **Text-to-Speech Conversion:** Enter or paste text into the application to generate speech.
*   **Voice Selection:** Choose from a variety of available voices provided by OpenAI.
*   **Audio Playback:** Listen to the generated audio directly within the application.
*   **Clipboard Integration:** Automatically read text from the clipboard and convert it to speech.
*   **Global Keyboard Shortcut:** Use `CmdOrControl+Shift+S` to quickly speak the text currently in the clipboard.
*   **System Tray Icon:** Access application functionalities like clipboard reading and showing the app window directly from the system tray.
*   **Web Interface:** A simple web interface (`web.html`) is available, powered by a local Express.js server, offering similar TTS functionality.

## Technologies Used

*   **Electron:** For building the cross-platform desktop application.
*   **OpenAI API:** Utilizes the `tts-1-hd` model for high-quality speech synthesis.
*   **Node.js:** As the runtime environment for Electron's main process and the backend server.
*   **Express.js:** For the web server component that handles API requests for the web interface.
*   **HTML, CSS, JavaScript:** For the application's user interface.
*   **Bootstrap:** For styling the user interface.

## How to Run

### Desktop Application

1.  Ensure you have Node.js and npm installed.
2.  Clone the repository.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Set up your OpenAI API Key:
    *   Create a `.env` file in the root of the project.
    *   Add your API key to the `.env` file like this:
        ```
        OPENAI_API_KEY=your_openai_api_key_here
        ```
5.  Start the application:
    ```bash
    npm start
    ```

### Web Server

1.  Follow steps 1-4 from the Desktop Application setup.
2.  Start the web server:
    ```bash
    npm run start-web
    ```
3.  Open your browser and navigate to `http://localhost:3000` (or the port specified in your environment if different) to access `web.html`.

## Author

Oğuzhan Kalelioğlu

## License

MIT
