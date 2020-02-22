import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

const channelName = "logistic-channel";
const contractName = "logistic";

export async function receiveGoods(username: string, goodsID: string) {
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get(username);
  if (!identity) {
    throw Error(`do not find identity for user ${username}`);
  }

  const ccpPath = path.join(process.cwd(), "connection.json");
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(contractName);

  const response = await contract.submitTransaction('receiveGoods', goodsID);
  console.log('transaction has been submitted');
  gateway.disconnect();
  return response;
}