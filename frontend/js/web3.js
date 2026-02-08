const contractABI = [
  "function createCampaign(string _title, uint256 _goal, uint256 _duration) external",
  "function donate(uint256 _campaignId) external payable",
  "function getCampaignsCount() external view returns (uint256)",
  "function getCampaign(uint256 _campaignId) external view returns (address creator, string memory title, uint256 goal, uint256 deadline, uint256 totalCollected, bool finalized)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount)"
];

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

let signer;
let contract;

export const web3Handler = {
  async connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        return accounts[0];
      } catch (error) {
        console.error("Connection failed", error);
        return null;
      }
    } else {
      alert("Please install MetaMask!");
      return null;
    }
  },

  async getCampaigns() {
    if (!contract) await this.connectWallet();
    try {
      const count = await contract.getCampaignsCount();
      const campaigns = [];
      for (let i = 0; i < Number(count); i++) {
        const c = await contract.getCampaign(i);
        campaigns.push({
          blockchainId: i,
          creator: c.creator,
          title: c.title,
          description: "On-chain Verified Campaign",
          goalEth: ethers.formatEther(c.goal),
          raisedEth: Number(ethers.formatEther(c.totalCollected)),
          deadline: Number(c.deadline),
          finalized: c.finalized
        });
      }
      return campaigns;
    } catch (error) {
      console.error("Error fetching campaigns", error);
      return [];
    }
  },

  async createCampaign(title, goalEth, durationDays) {
    if (!contract) await this.connectWallet();
    const goalWei = ethers.parseEther(goalEth.toString());
    const tx = await contract.createCampaign(title, goalWei, durationDays);
    await tx.wait();
    return tx.hash;
  },

  async sendDonation(blockchainId, amountEth) {
    if (!contract) await this.connectWallet();
    const ethAmount = ethers.parseEther(amountEth.toString());
    const tx = await contract.donate(blockchainId, { value: ethAmount });
    await tx.wait();
    return tx.hash;
  }
};
