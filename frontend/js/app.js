const connectBtn = document.getElementById("connectWallet");
const walletAddress = document.getElementById("walletAddress");
const createBtn = document.getElementById("createCampaign");
const campaignList = document.getElementById("campaignList");

let currentAccount = null;
let campaigns = [];

connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  currentAccount = accounts[0];
  walletAddress.innerText =
    currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);
};

createBtn.onclick = () => {
  const title = document.getElementById("title").value;
  const goal = document.getElementById("goal").value;
  const duration = document.getElementById("duration").value;

  if (!title || !goal || !duration) {
    alert("Fill all fields");
    return;
  }

  campaigns.push({
    title,
    goal,
    donated: 0,
  });

  renderCampaigns();

  document.getElementById("title").value = "";
  document.getElementById("goal").value = "";
  document.getElementById("duration").value = "";
};

function renderCampaigns() {
  campaignList.innerHTML = "";

  campaigns.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "campaign";

    div.innerHTML = `
      <h3>${c.title}</h3>
      <p><strong>Goal:</strong> ${c.goal} ETH</p>
      <p><strong>Donated:</strong> ${c.donated} ETH</p>
      <button class="secondary" onclick="donate(${index})">Donate</button>
    `;

    campaignList.appendChild(div);
  });
}

window.donate = (index) => {
  campaigns[index].donated += 0.1;
  renderCampaigns();
};