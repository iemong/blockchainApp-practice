import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", () => {
	it("トークンの全供給量を所有者に割り当てる", async () => {
		// 最初に取得できるアカウントをOwnerとして設定
		const [owner] = await ethers.getSigners();

		// MyTokenコントラクトをデプロイ
		const myToken = await ethers.deployContract("MyToken");

		// balanceOf関数を呼び出し、ownerの残高を取得
		const ownerBalance = await myToken.balanceOf(owner.address);

		// Ownerのトークン量が全供給量と一致することを確認
		expect(await myToken.totalSupply()).to.equal(ownerBalance);
	});
});
