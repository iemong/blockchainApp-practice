"use client";

import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import artifact from "@/abi/MyToken.sol/MyToken.json";
import { Web3SignerContext } from "@/context/web3";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
	const { signer, setSigner } = useContext(Web3SignerContext);
	const [account, setAccount] = useState<string | null>(null);

	useEffect(() => {
		async function fetchAddress() {
			console.log(signer);
			if (!signer) {
				return;
			}
			const address = await signer.getAddress();
			setAccount(address);
		}
		fetchAddress();
	}, [signer]);

	console.log(account);

	const handleButtonClick = async () => {
		const { ethereum } = window as any;
		if (ethereum) {
			const lProvider = new ethers.BrowserProvider(ethereum);
			const lSigner = await lProvider.getSigner();
			setSigner(lSigner);
		}
	};

	return (
		<div>
			<h1>Blockchain Sample</h1>
			{signer ? (
				<p>{account?.slice(0, 6) + "..." + account?.slice(-2)}</p>
			) : (
				<button onClick={handleButtonClick}>connect</button>
			)}
		</div>
	);
}
