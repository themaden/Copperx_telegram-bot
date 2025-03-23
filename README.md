# CopperX Telegram Bot

A Telegram bot for managing CopperX stablecoin accounts, allowing users to check balances, send funds, view transaction history, and manage wallets directly from Telegram.

## Features

- **Authentication**: Secure login with email and OTP verification
- **Balance Check**: View your current account balance
- **Wallet Management**: List wallets and set default wallet
- **Send Funds**: Transfer funds to email addresses, wallet addresses, or bank accounts
- **Transaction History**: View past transactions
- **Profile Management**: View profile details and logout

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Telegram Bot Token (from BotFather)
- CopperX API access

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/copperx-telegram-bot.git
   cd copperx-telegram-bot
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env` and filling in the required values:
   ```
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - BOT_TOKEN: Your Telegram bot token
   - API_BASE_URL: CopperX API endpoint
   - PUSHER_KEY: Pusher key for real-time notifications
   - PUSHER_CLUSTER: Pusher cluster region

## Running the Bot

### Development mode
```
npm run dev
```

### Production mode
```
npm run build
npm start
```

## Docker Deployment

You can also run the bot using Docker:

1. Build the Docker image:
   ```
   docker build -t copperx-telegram-bot .
   ```

2. Run the container:
   ```
   docker run -d --env-file .env copperx-telegram-bot
   ```

## Available Commands

- `/start` - Begin interaction with the bot
- `/login` - Authenticate with your CopperX account
- `/balance` - Check your current balance
- `/wallets` - List your wallets
- `/send` - Send funds to another user
- `/history` - View transaction history
- `/profile` - View your profile information
- `/logout` - Sign out from your account
- `/help` - Get help with using the bot

## Project Structure

```
copperx-telegram-bot/
├── src/
│   ├── api/           # API integration
│   ├── commands/      # Bot command handlers
│   ├── config/        # Configuration files
│   ├── middlewares/   # Telegram bot middlewares
│   ├── services/      # Business logic services
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── index.ts       # Entry point
├── .env.example       # Example environment variables
├── Dockerfile         # Docker configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License.

## Acknowledgments

- CopperX API team for providing the necessary endpoints
- Telegraf library for the Telegram Bot API framework 