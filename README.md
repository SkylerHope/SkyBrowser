<div align="center">

<img src="./assets/logo.png" alt="AppLogo" width="80" height="80">

# SkyBrowser
#### A minimal and lightweight web browser with basic adblocking
</div>

## Installation

You can download and test the latest beta for Linux and Windows, available [here](https://github.com/SkylerHope/SkyBrowser/releases/tag/beta-0.3.2)


### Development Requirements

- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en)
- npm (Comes with NodeJS on Windows)

Clone the GitHub repo
```bash
git clone https://github.com/SkylerHope/SkyBrowser.git
```
Enter the project directory
```bash
cd SkyBrowser
```
Install the dependencies
```bash
npm install
```

## Usage

Enter the project directory
```bash
cd SkyBrowser
```
Start the development server
```bash
npm start
```

## Update

Enter the project directory
```bash
cd SkyBrowser
```
Fetch the latest commit
```bash
git pull
```

## Building a package
Please refer to the official electron-builder guide to configue package.json for building. [Linux](https://www.electron.build/configuration/linux), [Windows](https://www.electron.build/configuration/win), [macOS](https://www.electron.build/configuration/mac)

Enter the project directory
```bash
cd SkyBrowser
```
Install the dependencies
```bash
npm install
```
Start the building process
```bash
npm run build
```
For the next step, refer to the [electron-builder docs](https://www.electron.build/multi-platform-build) again