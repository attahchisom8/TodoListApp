# Architect: High-Performance Task & Workspace Manager

**Author:** Attah Chisom Moses  
**Role:** Software Engineer  

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 📌 Overview

**Architect** is a lightning-fast, highly optimized task and workspace management application. Built entirely with Vanilla JavaScript, HTML, and CSS, it bypasses the overhead of heavy frontend frameworks to deliver a seamless, zero-lag user experience. 

The application features workspace isolation, task status tracking, priority management, and a highly performant drag-and-drop reordering system designed for mobile and desktop environments.

## 🚀 Why This Project Stands Out

Unlike standard task-tracking applications that rely on bulky libraries or framework magic, this project was engineered from the ground up with a strict focus on **browser rendering performance and algorithmic efficiency**. 

* **Zero Dependency:** Built without React, Vue, or drag-and-drop libraries, demonstrating a deep understanding of core web APIs and the DOM.
* **Algorithmic UI:** Utilizes a custom **Binary Search** algorithm ($O(\log n)$) to calculate drag-and-drop insertion points dynamically, replacing the standard $O(n)$ linear checks that cause UI stuttering on large lists.
* **Memory & Rendering Efficiency:** Employs `DocumentFragment` for batched DOM mutations, strictly controlling repaint and reflow cycles to prevent layout thrashing.

## 🛠️ Engineering Challenges & Solutions

### 1. Eliminating Layout Thrashing During Drag-and-Drop
**The Challenge:** Standard drag-and-drop implementations often calculate row positions sequentially as the user drags an item, leading to expensive DOM reads (`getBoundingClientRect`) mixed with DOM writes, causing layout thrashing and dropped frames.
**The Solution:** * Pre-calculated row bounding boxes at the `dragstart` event.
* Implemented a `requestAnimationFrame` loop tied to the `dragover` event to decouple the mouse movement frequency from the screen refresh rate.
* Deployed a **Binary Search algorithm** to instantly find the correct drop target based on the mouse's Y-coordinate against the pre-calculated row midpoints, dropping the time complexity of the search dramatically.

### 2. High-Volume DOM Mutations
**The Challenge:** Switching between active workspaces or performing bulk state updates (e.g., refreshing past-due tasks) required clearing and rebuilding large portions of the HTML table. Doing this naively causes severe UI blockages.
**The Solution:** * Abstracted all UI rendering logic into memory using `DocumentFragment`. 
* The application constructs the entire UI tree in memory and appends it to the live DOM in a single, batched operation. This isolates the rendering pipeline, ensuring that 60FPS is maintained even when updating hundreds of list items simultaneously.

### 3. Temporal Task Tracking
**The Challenge:** Managing task deadlines and ensuring the application reflects the correct status (Pending/Undone) relative to the current date.
**The Solution:** * Implemented a robust `refreshTaskState` utility that compares task due dates against the system clock. By normalizing date objects, the application ensures real-time accuracy, automatically flagging expired tasks as "undone" without user intervention.

## 🧠 Key Learnings

* **Rendering Pipelines:** Deepened my understanding of the browser's critical rendering path, specifically how to avoid forced synchronous layouts by batching DOM reads and writes.
* **Data Structures in UI:** Reinforced the value of applying mathematical concepts and efficient data structures (Maps for ID lookups, Binary Search for positional tracking) directly to frontend engineering.
* **State Synchronization:** Mastered the complex synchronization required between a persistent data store (`workspaceObj`), the browser's `localStorage`, and the visual DOM state without relying on a framework's virtual DOM.

## ✨ Core Features

* **Workspace Management:** Create, update, and isolate tasks within dedicated, dynamically generated workspaces.
* **Smart Drag & Drop:** Reorder tasks fluidly with an algorithmic backend that guarantees smooth animation.
* **Automated Status Tracking:** Tasks dynamically evaluate their status against the system `Date`, automatically flagging pending items if they cross their deadline.
* **Optimized Search & Filtering:** Instantly filter tasks and workspaces via mobile and desktop search bindings.


---

## 🚦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/attahchisom8/TodoListApp.git
    ```
2.  **Navigate to the project folder:**
    ```bash
    cd TodoListApp
    ```

3. **Launch the app:**
    Open index.html in your favorite browser or use a Live Server extension.
