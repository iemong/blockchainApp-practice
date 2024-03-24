import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyERC721", () => {
  // NFTコントラクトのデプロイとテストアカウントを2つ作成する関数
  async function deployFixture() {
    const [owner, account1] = await ethers.getSigners();
    const MyERC721Factory = await ethers.getContractFactory("MyERC721");
    const MyERC721 = await MyERC721Factory.deploy("TestNFT", "MYNFT");
    return { MyERC721, owner, account1 };
  }

  describe("初期流通量とNFT作成のテスト", () => {
    it("初期流通量が0であること", async () => {
      const { MyERC721 } = await loadFixture(deployFixture);
      expect(await MyERC721.totalSupply()).to.equal(0);
    });
    it("MyERC721を作成するテスト", async () => {
      const { MyERC721, owner, account1 } = await loadFixture(deployFixture);
      await MyERC721.safeMint(
        account1.address,
        "https://exmaple.com/nft1.json"
      );
      expect(await MyERC721.balanceOf(account1.address)).to.equal(1);
      expect(await MyERC721.totalSupply()).to.equal(1);
    });
    it("account1からは作成ができないことを確認", async () => {
      const { MyERC721, account1 } = await loadFixture(deployFixture);
      await expect(
        MyERC721.connect(account1).safeMint(
          account1.address,
          "https://exmaple.com/nft1.json"
        )
      ).to.be.revertedWith(/AccessControl: account .* is missing role .*/);
    });
  });

  describe("MyERC721をtransferするテスト", () => {
    it("MyERC721をtransferするテスト", async () => {
      const { MyERC721, owner, account1 } = await loadFixture(deployFixture);
      const txResp = await MyERC721.safeMint(
        account1.address,
        "https://exmaple.com/nft1.json"
      );
      // Transferイベントを取得
      const logs = await MyERC721.queryFilter(
        MyERC721.filters.Transfer(null, account1.address, null)
      );
      // Transferイベントの引数からtokenIdを取得
      const tokenId = logs.find((log) => log.transactionHash === txResp.hash)!
        .args[2];
      // account1からownerへtransfer
      await MyERC721.connect(account1).transferFrom(
        account1.address,
        owner.address,
        tokenId
      );
      // NFTの保有者がownerになっていることを確認
      expect(await MyERC721.ownerOf(tokenId)).to.equal(owner.address);
    });
    it("account1からowner保有のNFTはtransferができないことの確認", async () => {
      const { MyERC721, owner, account1 } = await loadFixture(deployFixture);
      const txResp = await MyERC721.safeMint(
        owner.address,
        "https://exmaple.com/nft1.json"
      );
      // Transferイベントを取得
      const logs = await MyERC721.queryFilter(
        MyERC721.filters.Transfer(null, owner.address, null)
      );
      // Transferイベントの引数からtokenIdを取得
      const tokenId = logs.find((log) => log.transactionHash === txResp.hash)!
        .args[2];
      // account1からownerへtransfer
      await expect(
        MyERC721.connect(account1).transferFrom(
          owner.address,
          account1.address,
          tokenId
        )
      ).to.be.revertedWith(/ERC721: caller is not token owner or approved/);
    });
    it("NFT保有者がapproveすればaccount1からもNFTをtransferできることの確認", async () => {
      const { MyERC721, owner, account1 } = await loadFixture(deployFixture);
      const txResp = await MyERC721.safeMint(
        owner.address,
        "https://exmaple.com/nft1.json"
      );
      // Transferイベントを取得
      const logs = await MyERC721.queryFilter(MyERC721.filters.Transfer());
      // Transferイベントの引数からtokenIdを取得
      const tokenId = logs.find((log) => log.transactionHash === txResp.hash)!
        .args[2];
      // account1からownerへtransfer
      await MyERC721.connect(owner).setApprovalForAll(account1.address, true);
      await MyERC721.connect(account1).transferFrom(
        owner.address,
        account1.address,
        tokenId
      );
      // NFTの保有者がaccount1になっていることを確認
      expect(await MyERC721.ownerOf(tokenId)).to.equal(account1.address);
    });
  });
});
