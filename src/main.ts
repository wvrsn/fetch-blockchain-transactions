import Web3 from "web3";
import * as dotenv from "dotenv";

dotenv.config();

const blockchainsNodes = {
  ethereum: "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY,
};

const web3 = new Web3(
  new Web3.providers.HttpProvider(blockchainsNodes.ethereum)
);

const main = async () => {
  const txHash = process.env.TRANSACTION;

  if (!txHash) {
    console.error("Transaction hash not found!");
    return;
  }

  const transaction = await web3.eth.getTransaction(txHash);
  console.log({
    value: web3.utils.fromWei(transaction.value),
    address: transaction.from,
    status: transaction.blockNumber === null ? 'peding' : 'processed'
  });
};

main().catch((err) => console.log(err));
