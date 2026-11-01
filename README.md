# NutriTrack — Calorie & Macro Tracker

A fast, modern, and privacy-focused daily calorie and macronutrient tracker built with vanilla HTML, CSS, and JavaScript. All data is persisted locally in the browser (`localStorage`) with no backend, account, or internet connection required.

![NutriTrack Preview](https://img.shields.io/badge/Stack-Vanilla%20HTML%20%7C%20CSS%20%7C%20JS-10b981?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Browser%20LocalStorage-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

---

## Features

- **Live Dynamic Calorie Gauge**: Real-time SVG circular gauge calculating Calories Remaining = $\text{Goal} - \text{Food} + \text{Exercise}$, with dynamic color-coding.
- **Macronutrient Tracking**: Interactive progress bars and ratio splits for Protein, Carbohydrates, and Fats.
- **Meal Ledger**: Log items categorized across **Breakfast**, **Lunch**, **Dinner**, and **Snacks & Beverages**.
- **Quick-Add Presets**: Instant one-click food presets (Oatmeal, Eggs, Chicken Breast, Salmon, Greek Yogurt, Avocado, etc.).
- **Exercise & Burn Tracker**: Add physical activities and workouts to automatically credit calories back to your daily budget.
- **Water Hydration Tracker**: Interactive 250ml glass logger with customizable daily hydration targets.
- **Multi-Day Calendar & Daily Notes**: Browse past/future days and record energy notes per date.
- **Backup & Restore**: Export full database snapshots as JSON or restore backups anytime.
- **Pure Vanilla Stack**: Zero frameworks, no Tailwind, and zero CSS variables.

---

## Getting Started

No build tools or package managers needed.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/emmanueldme/calorie-tracker.git
   cd calorie-tracker
   ```
2. Open `index.html` directly in any web browser:
   - Double-click `index.html`, or
   - Right-click $\rightarrow$ **Open with** (Google Chrome, Microsoft Edge, Firefox, Safari)

---

## Tech Stack

- **HTML5**: Semantic tags, modals, forms, and SVG graphics.
- **CSS3**: Pure vanilla responsive stylesheet, flexbox/grid layout, CSS keyframe animations (no CSS variables, no utility libraries).
- **JavaScript (ES6+)**: Pure vanilla modular script, event delegation, and state persistence with `localStorage`.

---

## License

This project is open source and available under the [MIT License](LICENSE).

