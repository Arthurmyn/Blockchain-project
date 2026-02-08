import { web3Handler } from './web3.js';

let userAccount = null;

const connectBtn = document.getElementById("connectWallet");
<<<<<<< HEAD
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
=======
const walletAddress = document.getElementById("walletAddress");
const ethBalanceEl = document.getElementById("ethBalance");
const tokenBalanceEl = document.getElementById("tokenBalance");
const createBtn = document.getElementById("createCampaign");
const campaignList = document.getElementById("campaignList");

const TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

let currentAccount = null;
let campaigns = [];

if (connectBtn) {
  connectBtn.onclick = async () => {
    await connectAndRenderWallet();
  };
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", async (accounts) => {
    if (!accounts || !accounts.length) {
      currentAccount = null;
      walletAddress.innerText = "Not Connected";
      ethBalanceEl.innerText = "ETH: -";
      tokenBalanceEl.innerText = "CRT: -";
      return;
    }
    currentAccount = accounts[0];
    await updateBalances(currentAccount);
  });

  window.ethereum.on("chainChanged", async () => {
    if (currentAccount) {
      await updateBalances(currentAccount);
    }
  });
}

async function connectAndRenderWallet() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  currentAccount = accounts[0];
  await updateBalances(currentAccount);
}

async function updateBalances(account) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  walletAddress.innerText = `${account.slice(0, 6)}...${account.slice(-4)}`;

  const ethWei = await provider.getBalance(account);
  ethBalanceEl.innerText = `ETH: ${Number(ethers.formatEther(ethWei)).toFixed(4)}`;

  if (!TOKEN_ADDRESS) {
    tokenBalanceEl.innerText = "CRT: set TOKEN_ADDRESS";
    return;
  }

  try {
    const code = await provider.getCode(TOKEN_ADDRESS);
    if (code === "0x") {
      tokenBalanceEl.innerText = "CRT: token not deployed in this network";
      return;
    }

    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    const [rawBalance, decimals] = await Promise.all([
      tokenContract.balanceOf(account),
      tokenContract.decimals(),
    ]);

    tokenBalanceEl.innerText = `CRT: ${Number(ethers.formatUnits(rawBalance, decimals)).toFixed(4)}`;
  } catch (error) {
    tokenBalanceEl.innerText = "CRT: error";
    console.error("Failed to read token balance:", error);
  }
}

if (createBtn) {
  createBtn.onclick = () => {
    const title = document.getElementById("title").value;
    const goal = document.getElementById("goal").value;
    const duration = document.getElementById("duration").value;

    if (!title || !goal || !duration) {
      alert("Fill all fields");
      return;
    }

    campaigns.push({ title, goal, donated: 0, });
    renderCampaigns();

    document.getElementById("title").value = "";
    document.getElementById("goal").value = "";
    document.getElementById("duration").value = "";
  };
}

function renderCampaigns() {
  if (!campaignList) return;
  campaignList.innerHTML = "";

  campaigns.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "campaign-card";

    div.innerHTML = `
      <h3>${c.title}</h3>
      <p><strong>Goal:</strong> ${c.goal} ETH</p>
      <p><strong>Donated:</strong> ${c.donated.toFixed(1)} ETH</p>
      <button class="btn success full" onclick="donate(${index})">Donate</button>
    `;

    campaignList.appendChild(div);
  });
}

window.donate = (index) => {
  campaigns[index].donated += 0.1;
  renderCampaigns();
};
>>>>>>> c1289f3 (feat(frontend): show wallet, network-aware status, and ETH/CRT balances)
