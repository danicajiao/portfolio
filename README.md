# Personal Portfolio with GSAP and Three.js

This is a modern, interactive portfolio website built with GSAP animations and Three.js 3D graphics to showcase software engineering projects and skills.

## Features

- Responsive design that works on all devices
- Custom animated cursor
- Project showcases with hover effects
- Skills visualization with 3D graphics
- Contact form
- Loading screen with progress animation

## Technologies Used

- HTML5, CSS3, JavaScript
- GSAP (GreenSock Animation Platform)
- Three.js for 3D graphics and WebGL
- Vite as the development server and build tool

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This will start the development server at http://localhost:5173

### Building for Production

Build the project for production:

```bash
npm run build
```

The build files will be in the `dist` directory.

### Preview Production Build

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
portfolio/
├── public/                          # Static assets
├── src/
│   ├── index.html                   # Main HTML file
│   ├── js/
│   │   ├── main.js                  # Main JavaScript file with GSAP and Three.js
│   │   └── project-link-animations.js  # Project hover animations
│   ├── styles/
│   │   ├── main.css                 # Main stylesheet
│   │   ├── cove-styles.css          # Cove project-specific styles
│   │   ├── schwab-styles.css        # Schwab project-specific styles
│   │   └── schwapp-styles.css       # SchwApp project-specific styles
│   ├── components/                  # Component files
│   └── assets/
│       ├── images/                  # Image assets
│       └── files/                   # Document assets
├── biome.json                       # Biome formatter/linter configuration
├── package.json                     # Project dependencies and scripts
└── vite.config.js                   # Vite configuration
```

## License

MIT License

## Acknowledgments

- GSAP by GreenSock
- Three.js
