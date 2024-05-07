const explorers: { [chainId: number]: string } = {
  1: "https://etherscan.io/address/",
  5: "https://goerli.etherscan.io/address/",
  11155111: "https://sepolia.etherscan.io/address/",
  56: "https://bscscan.com/address/",
  137: "https://polygonscan.com/address/",
  1284: "https://moonscan.io/address/",
  10: "https://optimistic.etherscan.io/address/",
  59144: "https://lineascan.build/address/",
  42161: "https://arbiscan.io/address/",
};

export function blockchainExplorer(chainId: number): string {
  return explorers[chainId] || "";
}
