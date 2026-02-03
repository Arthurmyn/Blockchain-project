const connectBtn = document.getElementById("connectWallet");
const walletAddress = document.getElementById("walletAddress");

let currentAccount = null;

connectBtn.onclick = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not installed");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  currentAccount = accounts[0];
  walletAddress.innerText = currentAccount;
};