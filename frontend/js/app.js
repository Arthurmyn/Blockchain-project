const connectBtn = document.getElementById("connectWallet");
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
