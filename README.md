📂 IPFS File Uploader with Blockchain Storage

This project is a full-stack dApp that allows users to:

Upload files to IPFS via Pinata.

Store the returned IPFS hash on the Avalanche Fuji Testnet blockchain.

Retrieve the stored hash directly from the smart contract.

It combines React (frontend) + Solidity (smart contract) + Ethers.js (blockchain interaction).

🚀 Features

Upload any file to IPFS through Pinata API.

Store the file’s IPFS hash on-chain.

Retrieve the stored hash from the smart contract.

Connect wallet with MetaMask and ensure correct chain (Fuji Testnet).

🛠️ Tech Stack

Frontend: React + Axios + Ethers.js

Smart Contract: Solidity

Blockchain: Avalanche Fuji C-Chain (Testnet)

File Storage: IPFS via Pinata

📑 Smart Contract

The smart contract stores and retrieves a single IPFS hash.

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract ipfs {
    string private ipfsHash;

    // Store IPFS hash
    function setIPFSHash(string memory _ipfsHash) public {
        ipfsHash = _ipfsHash;
    }

    // Retrieve IPFS hash
    function getIPFSHash() public view returns (string memory) {
        return ipfsHash;
    }
}


⚡ Prerequisites

Node.js & npm installed

MetaMask wallet with Fuji Testnet setup:

Network Name: Avalanche Fuji C-Chain

RPC URL: https://api.avax-test.network/ext/bc/C/rpc

Chain ID: 43113

Currency Symbol: AVAX

Pinata account with JWT key


🔑 Environment Variables

Create a .env file in your project root:
VITE_PINATA_JWT=your_pinata_jwt_here
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
