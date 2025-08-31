// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract ipfs {
    string private ipfsHash;

    // setter
function setIPFSHash(string memory _ipfsHash) public {
    ipfsHash = _ipfsHash;
}

    // getter
    
function getIPFSHash() public view returns (string memory){
    return ipfsHash;
}


}