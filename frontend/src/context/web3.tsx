"use client";
import { createContext, Dispatch, PropsWithChildren, useState } from "react";
import { Signer } from "ethers";

export const Web3SignerContext = createContext<{
	signer: Signer | null;
	setSigner: Dispatch<Signer>;
}>({
	signer: null,
	setSigner: () => {},
});

export const Web3SignerContextProvider = ({ children }: PropsWithChildren) => {
	const [signer, setSigner] = useState<Signer | null>(null);
	return (
		<Web3SignerContext.Provider value={{ signer, setSigner }}>
			{children}
		</Web3SignerContext.Provider>
	);
};
