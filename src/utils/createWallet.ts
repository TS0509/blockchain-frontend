// src/utils/createWallet.ts
import { ethers } from "ethers";

/**
 * 自动生成钱包：返回私钥和钱包地址
 */
export function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    privateKey: wallet.privateKey,
    walletAddress: wallet.address,
  };
}
