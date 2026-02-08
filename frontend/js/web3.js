const contractABI = [
  "function createCampaign(string _title, uint256 _goal, uint256 _duration) external",
  "function donate(uint256 _campaignId) external payable",
  "function getCampaignsCount() external view returns (uint256)",
  "function getCampaign(uint256 _campaignId) external view returns (address creator, string memory title, uint256 goal, uint256 deadline, uint256 totalCollected, bool finalized)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount)",
  "event RewardMinted(uint256 indexed campaignId, address indexed donor, uint256 tokenAmount)"
];

const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

let provider;
let signer;
let readContract;
let writeContract;

async function ensureCrowdfundingDeployed(currentProvider) {
  const code = await currentProvider.getCode(CONTRACT_ADDRESS);
  if (code === "0x") {
    throw new Error(
      "CharityCrowdfunding is not deployed at CONTRACT_ADDRESS. Run deploy.ts and update frontend/js/web3.js"
    );
  }
}

export const web3Handler = {
  async initReadContract() {
    if (!window.ethereum) return null;
    provider = new ethers.BrowserProvider(window.ethereum);
    await ensureCrowdfundingDeployed(provider);
    readContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    return readContract;
  },

  async connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await this.initReadContract();
        signer = await provider.getSigner();
        writeContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
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
    if (!readContract) {
      await this.initReadContract();
    }

    if (!readContract) return [];

    try {
      const count = await readContract.getCampaignsCount();
      const campaigns = [];
      for (let i = 0; i < Number(count); i++) {
        const c = await readContract.getCampaign(i);
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
    if (!writeContract) await this.connectWallet();
    await ensureCrowdfundingDeployed(provider);
    const goalWei = ethers.parseEther(goalEth.toString());
    const tx = await writeContract.createCampaign(title, goalWei, durationDays);
    await tx.wait();
    return tx.hash;
  },

  async sendDonation(blockchainId, amountEth) {
    if (!writeContract) await this.connectWallet();
    await ensureCrowdfundingDeployed(provider);
    const ethAmount = ethers.parseEther(amountEth.toString());
    const tx = await writeContract.donate(blockchainId, { value: ethAmount });
    await tx.wait();
    return tx.hash;
  }
};
