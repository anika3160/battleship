# 🚢 Battleship Game Backend

Online implementation of the classic board game "Battleship".

## 🚀 Features

- 🌐 Real-time multiplayer gameplay
- 🔐 User registration and authentication system
- 🏠 Create and join game rooms
- 🎮 Interactive game board

## 🛠 Technologies

- **Backend**: Node.js, TypeScript
- **WebSockets**: For real-time messaging
- **Database**: In-memory storage
- **Build**: Webpack

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anika3160/battleship.git
   cd battleship
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Add .env file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run start
   # or
   yarn start
   ```

5. Open the app in your browser at `http://localhost:8181`

## 🎮 How to Play

1. Register a new user or log in
2. Create a new room or join an existing one
3. Place your ships on the game board
4. Take turns attacking opponent's board
5. The first player to sink all opponent's ships wins

## 📂 Project Structure

```
src/
├── db/               # Database models and services
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   └── storage/      # Data storage
├── server/           # Server-side
│   ├── events/       # Event handlers
│   ├── handlers/     # Request handlers
│   └── responses/    # Response templates
└── utils/            # Utility functions
```

## 📝 License

This project is licensed under the MIT License.
