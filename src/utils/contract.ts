import ABI from "./VotingABI.json";

// ✅ 替换为你的部署合约地址
export const CONTRACT_ADDRESS = "0x812133Df4B27dF80341098616848f87b827bC233";

// ✅ 导出 ABI（自动从 VotingABI.json 读取）
export const CONTRACT_ABI = ABI;

// ✅ 命名导出 + 默认导出一个对象
const contractConfig = {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
};
export default contractConfig;
