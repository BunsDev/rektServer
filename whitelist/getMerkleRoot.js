const { utils } = require('ethers')
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const whitelistAddresses = require('./whiteList.json');

const getMerkleRootHash = () => {

    if (whitelistAddresses.length < 1) {
        throw '\x1b[31merror\x1b[0m ' + 'The whitelist is empty, please add some addresses to the configuration.';
    }

    // Build the Merkle Tree
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = '0x' + merkleTree.getRoot().toString('hex');
    console.log("root hash: ", rootHash);

    return rootHash;
}

const getMerkleTree = () => {

    if (whitelistAddresses.length < 1) {
        throw '\x1b[31merror\x1b[0m ' + 'The whitelist is empty, please add some addresses to the configuration.';
    }

    // Build the Merkle Tree
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

    return merkleTree;
}

const getProofForAddress = (address) => {
    return getMerkleTree().getHexProof(keccak256(address));
}

// getMerkleRootHash()
// console.log(getProofForAddress("0x442C531AAec5B72bed3e4f8176EbC56D8c6css8B"))
module.exports = { getMerkleRootHash, getProofForAddress };

