import { ethers } from "./ethers.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdraw");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    // window.ethereum.request({ method: "eth_requestAccounts" }); // łaczy z metamaskiem
    await ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
    console.log(ethers);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  const ethAmount = document.getElementById("fundInput").value;
  console.log(`Fundiwn with ${ethAmount}..`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer); //łaczenie sie z kontraktem
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMin(transactionResponse, provider);
      console.log("dones");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMin(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
    });
    resolve();
  });
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMin(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
