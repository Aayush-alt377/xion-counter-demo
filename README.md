# XION Counter dApp

A simple dApp built on the XION Network that demonstrates how to interact with a smart contract using the Abstraxion SDK

## Features

- Connect to the XION Network with Abstraxion Wallet
- View the current counter value
- Increment the counter with on-chain transactions
- View transaction details and history

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: XION Network (Cosmos-based chain)
- **Wallet Integration**: Abstraxion (@burnt-labs/abstraxion)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. The app connects to XION Network via the Abstraxion wallet provider
2. Users can connect their wallet by clicking "Connect" 
3. Once connected, the current counter value is fetched from the smart contract
4. Users can increment the counter value, which creates an on-chain transaction
5. Transaction details are displayed after successful execution


## Development

You can customize and extend this dApp by modifying:

- `src/app/page.tsx`: Main application UI and logic
- `src/app/layout.tsx`: Layout configuration including Abstraxion provider
- `src/app/globals.css`: Global styles and Tailwind customizations

## Resources

- [XION Network Documentation](https://docs.xion.burnt.com/)
- [Abstraxion Wallet Documentation](https://github.com/burnt-labs/abstraxion)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
