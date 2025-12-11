const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftCollection", function () {
  let NftCollection;
  let nft;
  let owner, addr1, addr2;
  
  // Configuration constants
  const NAME = "SubmissionNFT";
  const SYMBOL = "SNFT";
  const MAX_SUPPLY = 5;
  const BASE_URI = "https://api.example.com/metadata/";

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy contract
    const NftCollectionFactory = await ethers.getContractFactory("NftCollection");
    nft = await NftCollectionFactory.deploy(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and max supply", async function () {
      expect(await nft.name()).to.equal(NAME);
      expect(await nft.symbol()).to.equal(SYMBOL);
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint and update balances", async function () {
      await expect(nft.safeMint(addr1.address))
        .to.emit(nft, "Minted")
        .withArgs(addr1.address, 1);
        
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.totalSupply()).to.equal(1);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        nft.connect(addr1).safeMint(addr1.address)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should fail to mint beyond max supply", async function () {
      // Mint up to the limit
      for (let i = 0; i < MAX_SUPPLY; i++) {
        await nft.safeMint(owner.address);
      }
      // Attempt to mint one more
      await expect(nft.safeMint(owner.address)).to.be.revertedWith("Max supply reached");
    });
  });

  describe("Transfers and Approvals", function () {
    beforeEach(async function () {
      await nft.safeMint(owner.address); // Mint Token ID 1 to owner
    });

    it("Should transfer token successfully", async function () {
      await nft.transferFrom(owner.address, addr1.address, 1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail transfer from unauthorized address", async function () {
      await expect(
        nft.connect(addr1).transferFrom(owner.address, addr2.address, 1)
      ).to.be.revertedWithCustomError(nft, "ERC721InsufficientApproval");
    });

    it("Should support approvals", async function () {
      await nft.approve(addr1.address, 1);
      await nft.connect(addr1).transferFrom(owner.address, addr2.address, 1);
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });
  });

  describe("Metadata", function () {
    it("Should return correct tokenURI", async function () {
      await nft.safeMint(owner.address);
      expect(await nft.tokenURI(1)).to.equal(BASE_URI + "1");
    });
  });

  describe("Gas Usage Analysis", function () {
    it("Should mint within reasonable gas limits", async function () {
      const tx = await nft.safeMint(owner.address);
      const receipt = await tx.wait();
      
      // Ensure gas used is less than 150,000 (typical simple mint is ~70k-100k)
      expect(receipt.gasUsed).to.be.below(150000); 
    });
  });
});