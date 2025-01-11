import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("NFT Contract", function () {
  // Fixture to deploy the NFT contract and set up test accounts
  async function deployNFTFixture() {
    const [owner, account1, account2] = await hre.ethers.getSigners();

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(owner);

    return { nft, owner, account1, account2 };
  }

  it("Should mint an NFT and assign it to the correct owner", async function () {
    const { nft, owner } = await loadFixture(deployNFTFixture);

    const tokenURI = "ipfs://sample_metadata";
    await expect(nft.mintNFT(tokenURI))
      .to.emit(nft, "TokenMinted")
      .withArgs(owner.address, 0, tokenURI);

    const ownerOfToken = await nft.ownerOf(0);
    expect(ownerOfToken).to.equal(owner.address);

    const tokenURIStored = await nft.tokenURI(0);
    expect(tokenURIStored).to.equal(tokenURI);
  });

  it("Should allow the owner to set a price for an NFT", async function () {
    const { nft, owner } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;
    const price = hre.ethers.parseEther("1");

    await expect(nft.setPrice(tokenId, price))
      .to.emit(nft, "TokenPriceSet")
      .withArgs(tokenId, price);

    const storedPrice = await nft.tokenPrices(tokenId);
    expect(storedPrice).to.equal(price);

    const isForSale = await nft.tokenForSale(tokenId);
    expect(isForSale).to.be.true;
  });

  it("Should allow a user to purchase an NFT", async function () {
    const { nft, owner, account1 } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;
    const price = hre.ethers.parseEther("1");

    await nft.setPrice(tokenId, price);

    await expect(
      nft.connect(account1).buyNFT(tokenId, { value: price })
    )
      .to.emit(nft, "TokenSold")
      .withArgs(tokenId, owner.address, account1.address, price);

    const newOwner = await nft.ownerOf(tokenId);
    expect(newOwner).to.equal(account1.address);

    const isForSale = await nft.tokenForSale(tokenId);
    expect(isForSale).to.be.false;

    const storedPrice = await nft.tokenPrices(tokenId);
    expect(storedPrice).to.equal(0);
  });

  it("Should revert if non-owner tries to set the price", async function () {
    const { nft, account1 } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;
    const price = hre.ethers.parseEther("1");

    await expect(
      nft.connect(account1).setPrice(tokenId, price)
    ).to.be.revertedWith("No Owner");
  });

  it("Should revert if the price is set to zero", async function () {
    const { nft } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;

    await expect(
      nft.setPrice(tokenId, 0)
    ).to.be.revertedWith("Invalid Price");
  });

  it("Should revert if the buyer sends an incorrect price", async function () {
    const { nft, owner, account1 } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;
    const price = hre.ethers.parseEther("1");

    await nft.setPrice(tokenId, price);

    await expect(
      nft.connect(account1).buyNFT(tokenId, { value: hre.ethers.parseEther("0.5") })
    ).to.be.revertedWith("Incorrect price.");
  });

  it("Should revert if the buyer is already the owner", async function () {
    const { nft, owner } = await loadFixture(deployNFTFixture);

    await nft.mintNFT("ipfs://sample_metadata");

    const tokenId = 0;
    const price = hre.ethers.parseEther("1");

    await nft.setPrice(tokenId, price);

    await expect(
      nft.buyNFT(tokenId, { value: price })
    ).to.be.revertedWith("Not Allowed");
  });

  it("Should prevent accidental Ether transfers using fallback or receive", async function () {
    const { owner, nft } = await loadFixture(deployNFTFixture);

    await expect(
      owner.sendTransaction({ to: nft.target, value: hre.ethers.parseEther("1") })
    ).to.be.revertedWithCustomError(nft, "notSupported");

    await expect(
      owner.sendTransaction({ to: nft.target, data: "0x00" })
    ).to.be.revertedWithCustomError(nft, "fallbackDisabled");
  });
});
