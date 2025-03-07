# Electron WebSocket Client

This project is an application built with [Electron](https://www.electronjs.org/) that establishes a WebSocket connection with a remote server. Its main functionality is to allow the server to open windows on the client on demand, displaying their content on the second monitor if available. Additionally, when executed for the first time, the application configures itself to start automatically with Windows by adding an entry to the system registry.

## Features

- WebSocket connection with a remote server.
- Dynamic window opening on the second monitor if available.
- Automatic configuration to run at Windows startup.

## Installation and Execution

1. Clone this repository:
   ```bash
   git clone https://github.com/analizl/electron-app.git
   cd your-repository
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project's root directory and define the WebSocket server URL:
   ```env
   WS_CLIENT=wss://your-server.com
   ```
4. Start the application in development mode:
   ```bash
   npm start
   ```

## Generating an Executable

To build the application and generate an executable for Windows:
```bash
npx electron-packager . executable-name --platform=win32 --arch=x64
```

## Usage

1. Run the application.
2. It will automatically connect to the WebSocket server configured in the `.env` file.
3. When requested by the server, a new window will open on the second monitor (if available).
4. The application will be added to Windows startup to run automatically on future boots.

## Requirements

- Node.js and npm installed.
- Windows 10 or later (for startup configuration).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

