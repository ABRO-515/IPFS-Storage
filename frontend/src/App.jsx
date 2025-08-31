import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

const App = () => {
  const jwt = import.meta.env.VITE_PINATA_JWT;
  const gateway = import.meta.env.VITE_PINATA_GATEWAY;

  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleSubmission = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const hash = res.data.IpfsHash;
      setIpfsHash(hash);
      

    } catch (error) {
      console.error("Error uploading to Pinata:", error);
    }
  }

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
        <div className='result-section'>
          <p>IPFS Hash: {ipfsHash}</p>
          <p>URL: {gateway}{ipfsHash}</p>
        </div>
      )}
    </div>
  )
}

export default App;
