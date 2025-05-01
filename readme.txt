# ⛳ Dashy Golf 2.0

**Dashy Golf 2.0** is a modern HTML5/TypeScript recreation and expansion of *Golf Dash Extended* by Megastyle. Built with [Phaser](https://phaser.io/), the project brings the retro charm of the original into the modern web with added polish, new features, and a more interactive experience — including a fully functional leaderboard powered by Fetch API.

---

## 🚀 Project Summary

Originally a simple golf-puzzle game where players dash their ball into the hole, **Dashy Golf 2.0** evolves the concept into a sleek, replayable web experience. The goal is straightforward: use **WASD** to move the ball and get it into the hole in the fewest strokes possible. 

This 2.0 version builds on the original gameplay with:
- A new level system
- Refined game physics
- A score-logging leaderboard
- A responsive HTML5 interface
- A tutorial-friendly UI design
- A leaderboard system tha keeps track of player performance

---

## 🧰 Technologies Used

| Tool/Tech         | Purpose                                       |
|------------------|-----------------------------------------------|
| **Phaser 3**      | Game engine for rendering and physics         |
| **TypeScript**    | Strongly-typed development & code structure   |
| **Vite**          | Lightning-fast bundler and dev environment    |
| **WAMP Server**   | Local PHP + MySQL backend for leaderboard API |
| **Fetch API**     | Submit and fetch player scores from backend   |
| **GitHub Pages**  | Deployment for the front-end game             |

---

## 🎮 Gameplay Instructions

- **Move Ball**: `W`, `A`, `S`, `D`
- **Restart Level**: `R`
- **Objective**: Reach the hole in as few moves as possible

Each move counts as a **stroke**, and your performance is recorded in the leaderboard upon completion of the final level.

---

## 🏆 Leaderboard System

Upon finishing the game, players can:
- Enter their name
- Submit their stroke count
- View the top 10 global players

The leaderboard is powered by a simple PHP + MySQL backend using a RESTful API. Scores are sorted in ascending order of strokes (lowest = best).

---

## 📋 Credits

- **Megastyle** - Original game concept and artwork
- **Long H. Nguyen** - Team Lead/Dev/QA/....
- Special thanks to Prof. Andrew Lively & TA Kevin Jin for their support and guidance throughout my time this Spring Semester.

---

## 📝 License & Copyright

This project is made as a Final Project for the [Web Game Development] (IT 3049C - SS25) course at [University of Cincinnati - CECH]

---

## 📚 References

- [Megastyle's Golf Dash Extended](https://megastyle.itch.io/golf-dash-extended)
- [Megastyle](https://megastyle.itch.io/)
- [Phaser 3](https://phaser.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [WAMP Server](https://www.wampserver.com/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [GitHub Pages](https://pages.github.com/)