import { ImmutableXClient, Link } from "@imtbl/imx-sdk";
import * as dotenv from "dotenv";
import Web3 from "web3";

dotenv.config();

const linkAddress = "https://link.x.immutable.com";
const apiAddress = "https://api.x.immutable.com/v1";

const main = async () => {
  // Link SDK
  const link = new Link(linkAddress);

  // IMX Client
  const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });

  const transfer = await client.getTransfer({ id: 194440421 });
  const value = Web3.utils.fromWei(transfer.token.data.quantity.toString());
  const conversionRate = 0.2;
  const amount = Number(value) * conversionRate;

  if (transfer.token.type !== "ERC20") {
    return;
  }

  const token = await client.getToken({
    tokenAddress: transfer.token.data.token_address,
  });

  console.log({
    from: transfer.user,
    to: transfer.receiver,
    value,
    amount,
    symbol: token.symbol,
  });
};

main().catch((err) => console.log(err));
