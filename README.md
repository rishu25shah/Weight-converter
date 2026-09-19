# Weight Converter

A client-side unit conversion web application and command-line tool designed for bidirectional weight conversions between metric and imperial systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](index.html)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](style.css)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](script.js)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)](weight_converer.py)

---

## Overview

Weight Converter provides an accurate conversion interface across standard mass and weight units. The project features a responsive web application built with vanilla web technologies, alongside a standalone Python CLI script.

The application calculates results in real time, displays the step-by-step mathematical conversion formula, retains calculation history in local browser storage, and supports theme switching between dark and light modes.

---

## Core Features

### Web Interface
- Real-Time Conversion: Automatically calculates output upon input or selection change without page reload.
- Comprehensive Unit Support:
  - Kilograms (kg)
  - Pounds (lbs)
  - Grams (g)
  - Ounces (oz)
  - Stones (st)
- Bidirectional Inversion: Swap input and output units with a single action.
- Dynamic Formula Breakdown: Renders the active multiplier and conversion formula for transparency.
- Quick Input Presets: Preset buttons for standard weight milestones (50, 65, 70, 80, 100, 150).
- Configurable Precision: Selectable rounding thresholds (1, 2, or 4 decimal places).
- Clipboard Integration: One-click copying of converted values with visual toast feedback.
- Local Storage Persistence: Preserves recent conversion logs and user theme preferences across sessions.
- Responsive Design: Custom CSS layout with dark and light mode themes, glassmorphic styling, and mobile optimization.

### Command-Line Utility
- Python script for quick terminal-based conversions between kilograms and pounds.
- Standardized conversion factor (1 kg = 2.205 lbs).
- Rounded output for readable command-line display.

---

## Technical Specifications

### Unit Conversion Ratios

Conversions use Kilograms (kg) as the base reference unit:

| Unit | Symbol | Factor (kg Equivalent) | Formula from Kilograms |
| :--- | :--- | :--- | :--- |
| Kilogram | kg | 1.0 | value |
| Pound | lbs | 1 / 2.205 | value * 2.205 |
| Gram | g | 0.001 | value * 1000 |
| Ounce | oz | (1 / 2.205) / 16 | (value * 2.205) * 16 |
| Stone | st | (1 / 2.205) * 14 | (value * 2.205) / 14 |

---

## Project Architecture

```text
Weightconver-proj/
|-- index.html          Main application markup and accessibility attributes
|-- style.css           Theme variables, layout, animations, and responsive styles
|-- script.js           Conversion logic, DOM event binding, and localStorage state
|-- weight_converer.py  Standalone Python command-line conversion script
`-- README.md           Project technical documentation
```

---

## Getting Started

### Prerequisites

- Web Application: Modern web browser (Chrome, Firefox, Safari, Edge).
- Python CLI: Python 3.8 or higher.

### Running the Web Application

#### Option 1: Direct Execution
Open the [index.html](file:///c:/Users/Rishu/Documents/proj/Weightconver-proj/index.html) file directly in any modern browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

#### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

Using Node.js:
```bash
npx serve .
```

---

### Running the Python CLI

Run the script from the project root:

```bash
python weight_converer.py
```

#### Interactive Terminal Session
```text
Enter the weight: 70
Is your given weight is in kilograms or pounds?(K/P) K
Your weight in pound is: 154.4LPS
```

---

## Codebase Implementation Details

- State Management: Uses custom JavaScript closures to isolate state without global namespace pollution.
- Storage Management: Safe reads and writes against the `window.localStorage` API, with JSON serialization for conversion history records.
- Input Handling: Event-driven updates listening on `input`, `change`, and `click` events.
- Accessibility: Uses semantic HTML5 landmarks (`<main>`, `<section>`, `<header>`, `<footer>`), ARIA attributes (`aria-label`, `role="status"`, `aria-live="polite"`), and clear visual focus rings.

---

## License

This project is released under the MIT License. See the LICENSE file for details.


