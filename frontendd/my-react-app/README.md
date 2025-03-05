# My React App

This project is a prediction game built with React and TypeScript. Players have a limited time to answer questions and submit their predictions. 

## Features

- **Game Over Screen**: Displays when the time is up, informing users of their performance.
- **Information Screen**: Informs users they have 60 seconds to play and must answer 10 questions.
- **Responsive Design**: The application is designed to work on various screen sizes.

## Components

- **TimeOver**: Displays a game over message and allows users to try again.
- **InfoScreen**: Informs users about the game rules and time limit.
- **Button**: A reusable button component for various actions throughout the app.

## Context

- **GameContext**: Manages the state of the game, including user answers and game-related data.

## Hooks

- **useGuessGame**: A custom hook for managing interactions with a smart contract, including submitting predictions and tracking transaction status.

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-react-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

- Players have **60 seconds** to answer **10 questions**.
- After the time is up, the game will display a game over screen.
- Users can click the play button to restart the game.

## License

This project is licensed under the MIT License.