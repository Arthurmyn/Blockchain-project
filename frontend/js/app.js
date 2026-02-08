import { api } from './api.js';
import { web3Handler } from './web3.js';

let userAccount = null;

const connectBtn = document.getElementById("connectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCampaigns();
  setupEventListeners();
});

async function loadCampaigns() {
  const campaignsListContainer = document.querySelector(".campaigns");
  if (!campaignsListContainer) return;

  try {
    const campaigns = await api.getCampaigns();
    campaignsListContainer.innerHTML = ""; // Clear placeholders

    campaigns.forEach((campaign, index) => {
      const progress = (campaign.raisedEth / campaign.goalEth) * 100;
      const card = document.createElement("div");
      card.className = "campaign-card";
      
      // We use blockchainId from DB if it exists, otherwise fallback to the array index
      const bId = campaign.blockchainId !== undefined ? campaign.blockchainId : index;

      card.innerHTML = `
        <h3>${campaign.title}</h3>
        <p>${campaign.description}</p>
        <p>Goal: <b>${campaign.goalEth} ETH</b></p>
        <p>Raised: <b>${(campaign.raisedEth || 0).toFixed(2)} ETH</b></p>
        <div class="progress"><span style="width:${Math.min(progress, 100)}%"></span></div>
        <button class="btn success full donate-btn" 
                data-id="${campaign.id}" 
                data-blockchain-id="${bId}">Donate</button>
      `;
      campaignsListContainer.appendChild(card);
    });

    // Add donation listeners
    document.querySelectorAll(".donate-btn").forEach(btn => {
      btn.addEventListener("click", handleDonation);
    });
  } catch (error) {
    console.error("Error loading campaigns:", error);
  }
}

async function handleDonation(e) {
  if (!userAccount) {
    alert("Please connect your wallet first!");
    return;
  }

  const campaignId = e.target.getAttribute("data-id");
  const blockchainId = e.target.getAttribute("data-blockchain-id");
  const amount = prompt("Enter amount to donate (ETH):", "0.1");

  if (amount && !isNaN(amount)) {
    try {
      e.target.innerText = "Processing...";
      e.target.disabled = true;

      // 1. Web3 Transaction (MetaMask)
      const txHash = await web3Handler.sendDonation(blockchainId, amount);
      
      if (txHash) {
        // 2. Update Backend
        await api.recordDonation({
          campaignId,
          donorWallet: userAccount,
          amountEth: amount,
          txHash
        });

        alert(`Thank you for your donation! Tx: ${txHash}`);
        loadCampaigns(); // Refresh UI
      }
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed. Check MetaMask console.");
    } finally {
      e.target.innerText = "Donate";
      e.target.disabled = false;
    }
  }
}

function setupEventListeners() {
  // Wallet Connection
  connectBtn.addEventListener("click", async () => {
    userAccount = await web3Handler.connectWallet();
    if (userAccount) {
      walletAddressDisplay.innerText = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
      connectBtn.innerText = "Connected";
    }
  });

  // Campaign Creation
  const createBtn = document.querySelector(".btn.success.full"); 
  if (createBtn && createBtn.innerText.includes("Create Campaign")) {
    createBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      
      if (!userAccount) {
        alert("Please connect your wallet first!");
        return;
      }

      // Select inputs by their placeholder as they don't have IDs
      const titleInput = document.querySelector("input[placeholder='Enter your campaign title']");
      const descInput = document.querySelector("textarea");
      const catInput = document.querySelector("input[placeholder='e.g. Health, Education']");
      const goalInput = document.querySelector("input[placeholder='e.g. 5.0']");
      const durInput = document.querySelector("input[placeholder='e.g. 30']");

      if (!titleInput.value || !goalInput.value) {
        alert("Please fill in Title and Goal");
        return;
      }

      try {
        await api.createCampaign({
          title: titleInput.value,
          description: descInput.value,
          category: catInput.value,
          goalEth: goalInput.value,
          durationDays: durInput.value,
          creatorWallet: userAccount
        });

        alert("Campaign created successfully (Saved to DB)!");
        loadCampaigns();
        
        // Clear form
        titleInput.value = "";
        descInput.value = "";
        goalInput.value = "";
      } catch (error) {
        console.error("Creation failed:", error);
      }
    });
  }
}
