# NFT Marketplace Project

## Overview
This project is an NFT marketplace built with a frontend in React using Next.js and a smart contract deployed on a local blockchain (Ganache). It interacts with the Ethereum blockchain and uses Pinata for IPFS storage.

## Requirements
Before starting, ensure you have the following installed and set up:

- [Ganache](https://trufflesuite.com/ganache/) (Local Ethereum blockchain)
- [MetaMask](https://metamask.io/) (Browser wallet)
- [Node.js v22](https://nodejs.org/) or higher
- [Pinata](https://www.pinata.cloud/) account for IPFS storage

---

## Setup Instructions

### 1. Start Ganache
1. Download and install Ganache.
2. Open Ganache and create a new workspace.

### 2. Blockchain Setup
1. Navigate to the `blockchain` folder in the project directory.

   ```bash
   cd blockchain
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile and deploy the smart contract:

   ```bash
   npx hardhat ignition deploy ignition/modules/NFT.ts --network ganache
   ```

   **Note:** Make sure Ganache is running before executing this command.

4. Copy the deployed contract address displayed in the console.

---

### 3. Frontend Setup
1. Navigate to the `frontend` folder in the project directory:

   ```bash
   cd ../frontend
   ```

2. Create an `.env` file in the `frontend` folder and add the following keys:

   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_PINATA_KEY=your_pinata_key
   NEXT_PUBLIC_PINATA_SECRET=your_pinata_secret
   ```

   Replace `your_contract_address` with the address of the deployed contract.
   Replace `your_pinata_key` and `your_pinata_secret` with your Pinata API keys.

3. Install frontend dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application in your browser at [http://localhost:3000](http://localhost:3000).

---

## Additional Information

### MetaMask Setup
1. Open MetaMask and switch to the Ganache network:
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337` (default for Ganache)
   - Currency Symbol: `ETH`
2. Import an account from Ganache using the private key.

### Using Pinata
1. Log in to your [Pinata](https://www.pinata.cloud/) account.
2. Navigate to **API Keys** and create a new API key.
3. Copy the API Key and Secret Key and use them in the `.env` file.