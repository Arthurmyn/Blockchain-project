import { web3Handler } from "./web3.js";

const connectBtn = document.getElementById("connectWallet");
const walletAddress = document.getElementById("walletAddress");
const ethBalanceEl = document.getElementById("ethBalance");
const tokenBalanceEl = document.getElementById("tokenBalance");
const createBtn = document.getElementById("createCampaign");
const campaignList = document.getElementById("campaignList");

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const SUPPORTED_NETWORKS = {
  "0xaa36a7": "Sepolia",
  "0x4268": "Holesky",
  "0x7a69": "Local (Hardhat 31337)",
  "0x539": "Local (1337)",
};

let currentAccount = null;

document.addEventListener("DOMContentLoaded", async () => {
  await loadCampaigns();
  setupEventListeners();
});

function setupEventListeners() {
  if (connectBtn) {
    connectBtn.onclick = async () => {
      const account = await web3Handler.connectWallet();
      if (!account) return;

      currentAccount = account;
      await updateWalletHeader();
      await updateBalances();
      await loadCampaigns();
      connectBtn.innerText = "Connected";
    };
  }

  if (createBtn) {
    createBtn.onclick = async () => {
      if (!currentAccount) {
        alert("Please connect MetaMask first");
        return;
      }

      const title = document.getElementById("title").value.trim();
      const goalEth = document.getElementById("goal").value.trim();
      const durationDays = document.getElementById("duration").value.trim();

      if (!title || !goalEth || !durationDays) {
        alert("Fill all fields");
        return;
      }

      try {
        createBtn.disabled = true;
        createBtn.innerText = "Creating...";
        await web3Handler.createCampaign(title, goalEth, durationDays);
        document.getElementById("title").value = "";
        document.getElementById("goal").value = "";
        document.getElementById("duration").value = "";
        await loadCampaigns();
      } catch (error) {
        console.error("Create campaign failed:", error);
        alert("Create campaign failed");
      } finally {
        createBtn.disabled = false;
        createBtn.innerText = "+ Create Campaign";
      }
    };
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (!accounts || !accounts.length) {
        currentAccount = null;
        walletAddress.innerText = "Not Connected";
        ethBalanceEl.innerText = "ETH: -";
        tokenBalanceEl.innerText = "CRT: -";
        connectBtn.innerText = "Connect MetaMask";
        return;
      }

      currentAccount = accounts[0];
      await updateWalletHeader();
      await updateBalances();
      await loadCampaigns();
    });

    window.ethereum.on("chainChanged", async () => {
      if (!currentAccount) return;
      await updateWalletHeader();
      await updateBalances();
      await loadCampaigns();
    });
  }
}

async function updateWalletHeader() {
  if (!currentAccount) return;
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const networkName = SUPPORTED_NETWORKS[chainId] ?? `Unsupported (${chainId})`;
  walletAddress.innerText = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)} | ${networkName}`;
}

async function updateBalances() {
  if (!currentAccount || !window.ethereum) return;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const ethWei = await provider.getBalance(currentAccount);
  ethBalanceEl.innerText = `ETH: ${Number(ethers.formatEther(ethWei)).toFixed(4)}`;

  try {
    const code = await provider.getCode(TOKEN_ADDRESS);
    if (code === "0x") {
      tokenBalanceEl.innerText = "CRT: token not deployed in this network";
      return;
    }

    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    const [rawBalance, decimals] = await Promise.all([
      tokenContract.balanceOf(currentAccount),
      tokenContract.decimals(),
    ]);

    tokenBalanceEl.innerText = `CRT: ${Number(ethers.formatUnits(rawBalance, decimals)).toFixed(4)}`;
  } catch (error) {
    tokenBalanceEl.innerText = "CRT: error";
    console.error("Failed to read token balance:", error);
  }
}

async function loadCampaigns() {
  if (!campaignList) return;
  const campaigns = await web3Handler.getCampaigns();
  campaignList.innerHTML = "";

  campaigns.forEach((c) => {
    const goal = Number(c.goalEth);
    const raised = Number(c.raisedEth);
    const isClosed = c.finalized || raised >= goal;
    const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

    const div = document.createElement("div");
    div.className = `campaign-card ${isClosed ? "campaign-closed" : ""}`;
    div.innerHTML = `
      <h3>${c.title}</h3>
      ${isClosed ? '<p class="campaign-status">Fundraising closed</p>' : ""}
      <p><strong>Goal:</strong> ${goal} ETH</p>
      <p><strong>Donated:</strong> ${raised.toFixed(4)} ETH</p>
      <div class="progress"><span style="width:${progress}%"></span></div>
      <input
        id="donation-${c.blockchainId}"
        type="number"
        min="0.0001"
        step="0.0001"
        placeholder="Enter amount in ETH"
        style="margin: 10px 0 12px; padding: 10px; border-radius: 10px; border: 1px solid #d1d5db;"
        ${isClosed ? "disabled" : ""}
      />
      <button
        class="btn success full donate-btn"
        data-campaign-id="${c.blockchainId}"
        ${isClosed ? "disabled" : ""}
      >
        ${isClosed ? "Closed" : "Donate"}
      </button>
      <button
        class="btn collect collect-btn"
        data-campaign-id="${c.blockchainId}"
        data-wallet-id="${c.walletAddress}"
        ${isClosed ? "disabled" : ""}
      >
        ${isClosed ? "Closed" : "Collect"}
      </button>
    `;
    campaignList.appendChild(div);
  });

  document.querySelectorAll(".donate-btn").forEach((btn) => {
    btn.addEventListener("click", handleDonation);
  });
}

async function handleDonation(event) {
  if (!currentAccount) {
    alert("Please connect MetaMask first");
    return;
  }

  const campaignId = Number(event.target.dataset.campaignId);
  const amountInput = document.getElementById(`donation-${campaignId}`);
  const amount = Number(amountInput?.value);

  if (!amount || Number.isNaN(amount) || amount <= 0) {
    alert("Enter a valid donation amount");
    return;
  }

  try {
    event.target.disabled = true;
    event.target.innerText = "Processing...";
    await web3Handler.sendDonation(campaignId, amount);
    await loadCampaigns();
    await updateBalances();
  } catch (error) {
    console.error("Donation failed:", error);
    alert("Donation failed or rejected");
  } finally {
    event.target.disabled = false;
    event.target.innerText = "Donate";
  }
}
