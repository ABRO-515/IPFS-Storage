import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import './App.css';

const App = () => {
  const jwt = import.meta.env.VITE_PINATA_JWT;
  const gateway = import.meta.env.VITE_PINATA_GATEWAY;

  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [storedHash, setStoredHash] = useState('');

  const contractAddress = '0x13505fdb7025e161aa8527dee786db824e192425';
  const contractAbi = [
    {
      inputs: [{ internalType: 'string', name: '_ipfsHash', type: 'string' }],
      name: 'setIPFSHash',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getIPFSHash',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    if (!selectedFile) return alert('Please select a file first!');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const hash = res.data.IpfsHash;
      setIpfsHash(hash);

      // Store the hash on the blockchain after uploading
      await storeHashOnBlockchain(hash);
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      alert('Failed to upload file to Pinata.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Ethereum-compatible wallet.');
      throw new Error('No Ethereum wallet found');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0]; // Return the first connected account
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet. Please ensure MetaMask is unlocked and you grant permission.');
      throw error;
    }
  };

  const storeHashOnBlockchain = async (hash) => {
    try {
      // Ensure wallet is connected
      await connectWallet();

      // Switch to Fuji Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa869' }],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contract.setIPFSHash(hash);
      await tx.wait();
      alert('IPFS hash stored on blockchain successfully!');
    } catch (error) {
      console.error('Error storing hash on blockchain:', error);
      alert('Failed to store hash on blockchain.');
    }
  };

  const retrieveHashFromBlockchain = async () => {
    try {
      // Ensure wallet is connected
      await connectWallet();

      // Switch to Fuji Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa869' }],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractAbi, provider);

      const storedHash = await contract.getIPFSHash();
      setStoredHash(storedHash);
    } catch (error) {
      console.error('Error retrieving hash from blockchain:', error);
      alert('Failed to retrieve hash from blockchain.');
    }
  };

  return (
    <div className="app-container">
      <div className="upload-section">
        <label className="form-label">Choose File</label>
        <input type="file" onChange={changeHandler} className="file-input" />
        <button onClick={handleSubmission} className="submit-button">
          Submit
        </button>
      </div>

      {ipfsHash && (
        <div className="result-section">
          <p>IPFS Hash: {ipfsHash}</p>
          <p>
            URL: <a href={`${gateway}${ipfsHash}`} target="_blank" rel="noopener noreferrer">{`${gateway}${ipfsHash}`}</a>
          </p>
        </div>
      )}

      <div className="retrieve-section">
        <button className="retrieve-button" onClick={retrieveHashFromBlockchain}>
          Retrieve Stored Hash
        </button>
      </div>

      {storedHash && (
        <div className="result-section">
          <p>Stored IPFS Hash: {storedHash}</p>
        </div>
      )}
    </div>
  );
};

export default App;