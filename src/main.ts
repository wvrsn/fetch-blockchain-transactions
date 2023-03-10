import Web3 from "web3";
import { StateMutabilityType, AbiType } from "web3-utils";
import * as dotenv from "dotenv";

dotenv.config();

const abi = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view" as StateMutabilityType,
    type: "function" as AbiType,
  },
];

const blockchainsNodes = {
  ethereum: "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY,
};

const web3 = new Web3(
  new Web3.providers.HttpProvider(blockchainsNodes.ethereum)
);

const main = async () => {
  const txHash = process.env.TRANSACTION;
  const conversionRate = Number(process.env.CONVERSION_RATE);

  if (!txHash) {
    console.error("Transaction hash not found!");
    return;
  }

  const transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
  const transaction = await web3.eth.getTransaction(txHash);

  const logs = await transactionReceipt.logs;
  const log = await logs.find((i) => i.transactionHash === txHash);

  if (log == null) return;

  const topics = await log.topics;
  const method = await web3.eth.abi.decodeParameter("bytes32", topics[0]);
  const from = await web3.eth.abi.decodeParameter("address", topics[1]);
  const to = await web3.eth.abi.decodeParameter("address", topics[2]);
  const value = Number(await web3.eth.abi.decodeParameter("uint256", log.data));
  const amount =
    Number(await web3.utils.fromWei(String(value))) * conversionRate;

  const contract = new web3.eth.Contract(abi, log.address);
  const symbol = await contract.methods.symbol().call();

  console.log({
    from,
    to,
    value,
    amount,
    symbol,
  });

  console.log(transaction);
};

main().catch((err) => console.log(err));
