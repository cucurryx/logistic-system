import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import { WarehouseReportRequest } from '../common/request';

const channelName = "logistic-channel";
const contractName = "logistic";

export async function reportWarehouse(username: string, request: WarehouseReportRequest) {
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

  const jsonStr = JSON.stringify(request);
  console.log(`${jsonStr}`);
  const response = await contract.submitTransaction('putWarehouseInfo', jsonStr);
  console.log('transaction has been submitted');
  gateway.disconnect();
  return response;
}