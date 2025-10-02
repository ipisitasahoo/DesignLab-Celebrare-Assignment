# DesignLab — Canva-like Editor  

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Table of Contents
- [Files](#files)
- [Features](#features)
- [Usage](#usage)
- [Notes](#notes)
- [Demo](#demo)

## Files
- `index.html`
- `style.css`
- `script.js`
- `assets/` (3 portrait 1080x1920 photos + `logo.svg`)

## Features
- **3 portrait (9:16) slides** with thumbnails and prev/next navigation
- **+ Add Text**: add independent, draggable, editable text blocks to the active slide
- **Font controls**:
  - Multiple **Google & system fonts**
  - Font size
  - Color
  - Alignment
  - Bold, Italic, Uppercase
- **Download current slide as PNG** (approximate rendering)
- **Slide independence**: each slide maintains its own text blocks

## Usage
1. Click **+ Add Text** to add a text block to the active slide.
2. Click a block to **select it**; use the controls to style it. **Drag to reposition**.
3. Click **Download Slide** to export a PNG of the current slide.

## Notes
- **Google Fonts** require an internet connection; system fonts are used offline.
- The download uses **canvas drawing**, so for **pixel-perfect export**, consider using [`html2canvas`](https://html2canvas.hertzen.com/).

## Demo
You can run the project locally by opening `index.html` in your browser.  
Add text blocks, style them, and download your slides easily.
