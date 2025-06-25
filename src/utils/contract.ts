import ABI from "./VotingABI.json";

// ✅ 替换为你的部署合约地址
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ✅ 导出 ABI（自动从 VotingABI.json 读取）
export const CONTRACT_ABI = ABI;

// ✅ （可选）默认导出一个对象，方便整合引用
export default {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
};