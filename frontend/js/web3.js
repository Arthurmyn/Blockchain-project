// Minimal ABI for the functions we use
const contractABI = [
  "function createCampaign(string _title, uint256 _goal, uint256 _duration) external",
  "function donate(uint256 _campaignId) external payable",
  "function getCampaignsCount() external view returns (uint256)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount)"
];

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Deployed to localhost

let web3Provider;
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
        console.error("User rejected connection", error);
        return null;
      }
    } else {
      alert("Please install MetaMask!");
      return null;
    }
  },

  async sendDonation(campaignId, amountEth) {
    if (!contract) await this.connectWallet();
    try {
      const ethAmount = ethers.parseEther(amountEth.toString());
      
      // Use the ID passed from the frontend (should correspond to the blockchain index)
      const tx = await contract.donate(campaignId, { value: ethAmount });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Blockchain donation failed:", error);
      throw error;
    }
  }
};