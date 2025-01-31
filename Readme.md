# VoiceGenAI

![VoiceGenAI Logo](./build/icons/png/trayIcon.png)

**VoiceGenAI** is a cutting-edge Text-to-Speech (TTS) application powered by Artificial Intelligence. Built with Electron, VoiceGenAI seamlessly converts written text into natural-sounding speech, enhancing accessibility and productivity across various platforms.

## Table of Contents

- [VoiceGenAI](#voicegenai)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Usage](#usage)
  - [Running in Development Mode](#running-in-development-mode)
    - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Global Shortcut: Ctrl+Shift+S (Windows/Linux) or Command+Shift+S (macOS)](#global-shortcut-ctrlshifts-windowslinux-or-commandshifts-macos)
    - [Configuration](#configuration)
  - [Environment Variables](#environment-variables)

## Features

- **AI-Powered Speech Synthesis**: Leverages advanced AI models to generate high-quality, natural-sounding speech from text.
- **Global Keyboard Shortcuts**: Easily access the application and convert clipboard text to speech using customizable shortcuts.
- **System Tray Integration**: Access and control VoiceGenAI directly from your system tray with a user-friendly context menu.
- **Cross-Platform Support**: Available for Windows, macOS, and Linux, ensuring a consistent experience across all major operating systems.
- **Clipboard Monitoring**: Automatically reads and converts text from your clipboard, streamlining your workflow.
- **Customizable Voices**: Choose from a variety of AI-generated voices to suit your preferences and needs.
- **Lightweight and Efficient**: Designed to consume minimal system resources while delivering optimal performance.

## Demo

![VoiceGenAI in Action](./screenshots/demo.gif)

*VoiceGenAI seamlessly converts clipboard text to speech with a simple keyboard shortcut.*

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later) or **Yarn**

### Clone the Repository

```bash
git clone https://github.com/oguzhankalelioglu/voicegenai.git
cd voicegenai 
```

### Install Dependencies
Using npm:
```bash
npm install
```

### Usage
## Running in Development Mode
To start the application in development mode with hot-reloading:

Using npm:
```bash
npm start
```

### Keyboard Shortcuts
## Global Shortcut: Ctrl+Shift+S (Windows/Linux) or Command+Shift+S (macOS)
Function: Brings the VoiceGenAI window to the foreground and converts the current clipboard text to speech.
System Tray Menu
Right-click the VoiceGenAI icon in your system tray to access the following options:

Read Clipboard: Converts the current clipboard text to speech.
Show Application: Brings the VoiceGenAI window to the foreground.
Quit: Exits the application.

### Configuration
## Environment Variables
VoiceGenAI utilizes environment variables to manage sensitive information such as API keys. Create a .env file in the root directory and add the following:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```