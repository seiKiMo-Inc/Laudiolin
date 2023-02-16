# Laudiolin

A "high quality" music player written in TypeScript using Tauri and React.

## Contents

- [Features](#features)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Developer Quickstart](#developer-quickstart)
- [Development and Contributing](#development-and-contributing)
- [Credits](#credits)

## Features

- Play music from online services like YouTube.
- Download audios.
- Login using Discord OAuth.
- Create playlists (synced with your account).
- Discord Rich Presence showing your current song.
- Queue system with shuffle and repeat.
- Background customization.
- No ads or any kind of monetization.

## Installation

If you do not wish to build the app from source you can download the latest release from the [releases page](https://github.com/seiKiMo-Inc/Laudiolin/releases).

## Screenshots

*Home page when idle:*
![Home screen idle]()

*Search results:*
![Search results]()

*Playing a song:*
![Playing a song]()

*Playlists:*
![Playlists]()

*Track Page:*
![Track page]()

*Laudiolin with custom background and brightness set by the user:*
![Custom background]()

and more...

## Developer Quickstart

### Prerequisites

- Install [Node.js](https://nodejs.org/en/)
- Install [Rust](https://www.rust-lang.org/tools/install)
- Clone the project with `git clone https://github.com/seiKiMo-Inc/Laudiolin.git`

### Running From Source

```bash
npm i                         # Install dependencies
npm run start:dev             # Start the app in development mode
```

### Building From Source

- run `npm run package` for a `release` build
- run `npm run package -- --debug` for a `debug` build

## Development and Contributing

We accept all kinds of pull requests if you want to ~~fix shit code~~ improve the app or add a new feature.
Just Try to follow the style of the code and use `npm run lint` to format your code.

## Credits

### Tools

- [Tauri](https://tauri.app/) for the framework.
- [React](https://reactjs.org/) for the awesome UI library.
- [TypeScript](https://www.typescriptlang.org/) and [Rust](https://www.rust-lang.org/) for the programming languages.

### Creators

- [Arikatsu](https://github.com/Arikatsu)
- [KingRainbow44](https://github.com/KingRainbow44)
- no more shichihachi 😭