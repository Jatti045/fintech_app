# Budget Tracker React Native

A cross-platform mobile application for tracking budgets and expenses. Built with React Native and a Node.js/PostgreSQL backend, this app helps users manage their personal finances efficiently, offering features such as budget creation, transaction logging, category filtering, and different theme support.

## Features

- **Budget Management**: Create, edit, and track budgets for different categories.
- **Transaction Logging**: Add, view, and filter transactions; assign them to specific categories.
- **Spending Visualization**: Progress bars and analytics show spending against set budgets.
- **Category Filtering**: Easily filter transactions and budgets by category.
- **Modern UI/UX**: Intuitive design with different theme support (dark, forest, coffee) for eye comfort.
- **User Authentication**: Secure login and profile management.
- **Planned Bank Integration**: Future support for automated bank transaction imports.
- **Cross-Platform**: Runs on both Android and iOS devices.

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/5af65918-931e-4af5-b212-9c865ea3541a" width="200"/>
  <img src="https://github.com/user-attachments/assets/103b6899-a821-4b35-92c3-ed9dcd8047f3" width="200"/>
  <img src="https://github.com/user-attachments/assets/9bb148be-4edd-489d-b9f0-29ecb752584a" width="200"/>
  <img src="https://github.com/user-attachments/assets/d79674da-e71a-49c4-b102-7d33bc8a126b" width="200"/>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/d19881c8-6ab9-4aec-b6f6-4b09f8fc3cc2" width="200"/>
  <img src="https://github.com/user-attachments/assets/35fa5f10-346c-45f9-b013-1dcd88eedbac" width="200"/>
  <img src="https://github.com/user-attachments/assets/7275a11c-35ec-44b5-b6f3-9ca8e0996429" width="200"/>
  <img src="https://github.com/user-attachments/assets/8c1b632e-5ecb-4bab-9211-789287422e72" width="200"/>
</p>

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Infrastructure**: Docker, GitHub Actions, EAS (Expo Application Services)
- **Authentication**: JWT (JSON Web Tokens)
- **Other Tools**: Prisma ORM, Git, npm

## Project Structure

```
client/    # React Native application
server/    # Node.js/Express backend
docker-compose.yml  # Local development containers
.github/workflows/  # CI/CD pipelines
```

## Getting Started

### Prerequisites

- Node.js & npm
- Docker (optional, for local database)
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL (local or via Docker)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jatti045/budget-tracker-react-native.git
   cd budget-tracker-react-native
   ```

2. **Set up the backend:**
   - Navigate to `server/` and create a `.env` file with your PostgreSQL configuration (see sample in `server/.env.example`).
   - Install dependencies:
     ```bash
     cd server
     npm install
     ```
   - Start the backend:
     ```bash
     npm run dev
     ```

3. **Set up the frontend:**
   - Navigate to `client/` and create a `.env` file with your backend API URL.
   - Install dependencies:
     ```bash
     cd ../client
     npm install
     ```
   - Start the app (with Expo):
     ```bash
     expo start
     ```

4. **Optional: Run database with Docker**
   ```bash
   docker-compose up
   ```

### Build & Deployment

- Android builds and Play Store deployment are automated via EAS and GitHub Actions (see `.github/workflows/eas-build.yml`).

## Usage

- Register and log in to your account.
- Create budgets for different categories.
- Add transactions and assign them to budgets.
- Monitor spending with progress bars and analytics.
- Edit your profile and switch between light/dark themes.
- [Planned] Connect your bank for automated imports (coming soon).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by modern personal finance and budgeting apps.
- Special thanks to [Expo](https://expo.dev/) and [Prisma](https://www.prisma.io/).


