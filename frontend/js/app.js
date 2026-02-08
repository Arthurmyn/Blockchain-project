import { web3Handler } from './web3.js';

let userAccount = null;

const connectBtn = document.getElementById("connectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");

document.addEventListener("DOMContentLoaded", () => {
  loadCampaigns();
  setupEventListeners();
});

async function loadCampaigns() {
  const campaignsListContainer = document.querySelector(".campaigns");
  if (!campaignsListContainer) return;

  try {
    // Fetch directly from blockchain
    const campaigns = await web3Handler.getCampaigns();
    campaignsListContainer.innerHTML = ""; 

    campaigns.forEach((campaign) => {
      const progress = (campaign.raisedEth / campaign.goalEth) * 100;
      const card = document.createElement("div");
      card.className = "campaign-card";
      
      card.innerHTML = `
        <h3>${campaign.title}</h3>
        <p>${campaign.description}</p>
        <p>Goal: <b>${campaign.goalEth} ETH</b></p>
        <p>Raised: <b>${campaign.raisedEth.toFixed(2)} ETH</b></p>
        <div class="progress"><span style="width:${Math.min(progress, 100)}%"></span></div>
        <button class="btn success full donate-btn" 
                data-blockchain-id="${campaign.blockchainId}">Donate</button>
      `;
      campaignsListContainer.appendChild(card);
    });

    document.querySelectorAll(".donate-btn").forEach(btn => {
      btn.addEventListener("click", handleDonation);
    });
  } catch (error) {
    console.error("Load failed:", error);
  }
}

async function handleDonation(e) {
  if (!userAccount) {
    alert("Please connect your wallet first!");
    return;
  }

  const blockchainId = e.target.getAttribute("data-blockchain-id");
  const amount = prompt("Enter amount (ETH):", "0.1");

  if (amount && !isNaN(amount)) {
    try {
      e.target.innerText = "Processing...";
      e.target.disabled = true;

      const txHash = await web3Handler.sendDonation(blockchainId, amount);
      if (txHash) {
        alert(`Success! Tx: ${txHash}`);
        loadCampaigns(); 
      }
    } catch (error) {
      alert("Transaction failed");
    } finally {
      e.target.innerText = "Donate";
      e.target.disabled = false;
    }
  }
}

function setupEventListeners() {
  connectBtn.addEventListener("click", async () => {
    userAccount = await web3Handler.connectWallet();
    if (userAccount) {
      walletAddressDisplay.innerText = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
      connectBtn.innerText = "Connected";
    }
  });

  const createBtn = document.querySelector(".btn.success.full"); 
  if (createBtn && createBtn.innerText.includes("Create Campaign")) {
    createBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      
      if (!userAccount) {
        alert("Please connect your wallet first!");
        return;
      }

      const title = document.querySelector("input[placeholder='Enter your campaign title']").value;
      const goalEth = document.querySelector("input[placeholder='e.g. 5.0']").value;
      const duration = document.querySelector("input[placeholder='e.g. 30']").value;

      try {
        e.target.innerText = "Creating...";
        await web3Handler.createCampaign(title, goalEth, duration);
        alert("Campaign created on Blockchain!");
        loadCampaigns();
      } catch (error) {
        alert("Creation failed");
      } finally {
        e.target.innerText = "+ Create Campaign";
      }
    });
  }
}