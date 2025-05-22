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
- Lenis for smooth scrolling
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

This will start the development server at http://localhost:3000

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
├── public/                 # Static assets
├── src/
│   ├── index.html          # Main HTML file
│   ├── js/
│   │   ├── main.js         # Main JavaScript file with GSAP and Three.js
│   ├── styles/
│   │   ├── main.css        # Main stylesheet
│   ├── assets/
│   │   ├── images/         # Image assets
│   │   ├── models/         # 3D models (if any)
│   │   └── fonts/          # Custom fonts
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Customization

### Personal Information

Update your personal information in `index.html` including:
- Your name
- Job title/description
- About me section
- Project details
- Skills
- Contact information

### Colors and Styles

The main color scheme and styling variables can be found at the top of `src/styles/main.css` in the `:root` selector.

### Projects

Add your own projects in the "Work" section of `index.html`. Each project should follow the structure of the example projects.

### 3D Graphics

The Three.js scenes can be customized in `src/js/main.js`. Look for the `initHeroScene()` and `initSkillsScene()` functions.

## License

MIT License

## Acknowledgments

- GSAP by GreenSock
- Three.js
- Lenis by Studio Freight
