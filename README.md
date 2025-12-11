# NFT Smart Contract Submission

This repository contains a complete implementation of an ERC-721 compatible NFT smart contract, along with a comprehensive automated test suite and a Dockerized environment for reproducible evaluation.

## Project Overview

The core component is the `NftCollection` smart contract, designed to manage a limited supply of unique digital assets. The project is structured to ensure reliability through automated testing and ease of deployment via Docker.

### Directory Structure

* `contracts/`: Contains the Solidity source code (`NftCollection.sol`).
* `test/`: Contains the automated test suite (`NftCollection.test.js`).
* `Dockerfile`: Defines the container environment for building and testing.
* `hardhat.config.js`: Configuration for the Hardhat development environment.

## Smart Contract Features

The `NftCollection` contract implements the following key features and constraints:

1.  **ERC-721 Compliance**: Full implementation of the standard for ownership, transfers, and approvals (inherited from OpenZeppelin).
2.  **Maximum Supply**: The contract enforces a strict `maxSupply` limit. Attempts to mint beyond this limit will revert.
3.  **Access Control**: Utilizes the `Ownable` pattern. Only the contract owner (admin) is authorized to:
    * Mint new tokens (`safeMint`).
    * Update the base URI for metadata (`setBaseURI`).
4.  **Metadata Management**: Implements a standard URI scheme where token metadata is accessible at `baseURI + tokenId`.
5.  **Safety & Security**:
    * Prevents minting to the zero address.
    * Ensures token IDs are unique and sequential (starting from 1).
    * Includes checks to prevent unauthorized transfers.

## Docker Instructions

The project is fully containerized to ensure it runs consistently in any environment. The Docker container handles dependency installation, contract compilation, and test execution automatically.

### 1. Build the Docker Image

Run the following command in the root directory of the project:

```bash
docker build -t nft-contract .
```

### 2. Run the Container
Execute the test suite by running the container:

```bash
docker run nft-contract
```

#### **Expected Output**
When you run the container, it will automatically execute the test suite using Hardhat. You should see output similar to the following, indicating that all functional requirements and constraints have been verified:

``` Plaintext
  NftCollection
    Deployment
      ✔ Should set the correct name, symbol, and max supply
      ✔ Should set the right owner
    Minting
      ✔ Should allow owner to mint and update balances
      ✔ Should fail if non-owner tries to mint
      ✔ Should fail to mint beyond max supply
    Transfers and Approvals
      ✔ Should transfer token successfully
      ✔ Should fail transfer from unauthorized address
      ✔ Should support approvals
    Metadata
      ✔ Should return correct tokenURI
    Gas Usage Analysis
      ✔ Should mint within reasonable gas limits

  10 passing (1s)
```
## Local Development (Optional)
If you prefer to run the tests outside of Docker, ensure you have Node.js (v18+) installed.

### **Install Dependencies:**

```bash
npm install
```

### **Compile Contracts:**

```bash
npx hardhat compile
```

### **Run Tests:**

```bash
npx hardhat test
