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

If you do not wish to build the app from source you can download the latest release from: 
- The [releases page](https://github.com/seiKiMo-Inc/Laudiolin/releases).
- The latest [GitHub Actions run](https://nightly.link/seiKiMo-Inc/Laudiolin/workflows/build/tauri-react). (dev builds only)

## Screenshots

*Home page when idle:*
![Home screen idle](https://user-images.githubusercontent.com/104459145/204433262-fe488ced-125c-474c-9491-b34378f2532b.png)

*Search results:*
![Search results](https://user-images.githubusercontent.com/104459145/204433675-2201aebb-d296-44b5-ac29-c543a878bdf7.png)

*Playing a song:*
![Playing a song](https://user-images.githubusercontent.com/104459145/204433880-02cba57a-b9fb-4630-823c-da49d64c02b7.png)

*Playlists:*
![Playlists](https://user-images.githubusercontent.com/104459145/204434065-2f471779-804a-40c7-8767-c3d6c3a8858b.png)

*Track Page:*
![Track page](https://user-images.githubusercontent.com/104459145/204434443-40b504e0-5ecc-410f-b5bf-845502310309.png)

*Laudiolin with custom background and brightness set by the user:*
![Custom background](https://user-images.githubusercontent.com/104459145/204435369-0af52e18-0d98-44ea-92d3-17ee0c077fbe.png)

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
- [Shichiha](https://github.com/Shichiha)
