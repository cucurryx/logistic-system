import * as path from 'path';
import * as fs from 'fs';
import { Wallets, Wallet, Identity, Gateway, Contract, X509Identity } from 'fabric-network';
import { WarehouseReportRequest } from '../common/request';
import * as FabricCAServices from 'fabric-ca-client';

const channelName = "logistic-channel";
const contractName = "logistic";

export class FabricClient {
    
    wallet: Wallet;
    ccp: any;
    identities: Map<string, Identity>;
    contracts: Map<string, Contract>;
    gateways: Map<string, Gateway>;

    constructor() {
        // load wallet and connection profile
        const walletPath = path.join(process.cwd(), "wallet");
        const ccpPath = path.join(process.cwd(), "connection.json");
        Wallets.newFileSystemWallet(walletPath).then(
            wallet => this.wallet = wallet
        );
        this.ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        this.identities = new Map();
        this.contracts = new Map();
        this.gateways = new Map();
    }

    async enroll(username: string, password: string) {
        const caInfo = this.ccp.certificateAuthorities['ca.shipper.logistic.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        
        if (await this.wallet.get(username)) {
            console.log(`identity for ${username} already exist`);
            this.wallet.remove(username);
        }
        const enrollment = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: password
        });
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'ShipperMSP',
            type: 'X.509',
        };
        await this.wallet.put(username, x509Identity);
        this.identities.set(username, x509Identity);
        console.log("identity for admin put to wallet successfully");
    }

    async register(username: string, password: string) {
        const caInfo = this.ccp.certificateAuthorities['ca.shipper.logistic.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        
        if (await this.wallet.get(username)) {
            console.log(`identity for ${username} already exist`);
            this.wallet.remove(username);
        }

        const adminIdentity = await this.wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            return;
        }

        const provider = this.wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');
 
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: username, 
            enrollmentSecret: password,
            role: 'client'
        }, adminUser);
        console.log(`identity for ${username} register successfully, password: ${secret}`);
    }

    async logOut(username: string) {
        if (this.identities.get(username)) {
            this.identities.delete(username);
        }
        if (await this.wallet.get(username)) {
            this.wallet.remove(username);
        }
    }

    async reportWarehouse(username: string, request: WarehouseReportRequest) {
        await this.checkIdentity(username);
        const contract = await this.getContract(username);
        const jsonStr = JSON.stringify(request);
        const response = await contract.submitTransaction('putWarehouseInfo', jsonStr);
        return response;
    }

    async getAllGoodsInfo(username: string) {
        await this.checkIdentity(username);
        const contract = await this.getContract(username);
        const response = await contract.submitTransaction('getAllGoodsInfo');
        return response;
    }

    async getGoodsInfo(username: string, id: string) {
        await this.checkIdentity(username);
        const contract = await this.getContract(username);
        const response = await contract.submitTransaction('getGoodsInfo', id);
        return response;
    }

    async getGoodsHistory(username: string, id: string) {
        await this.checkIdentity(username);
        const contract = await this.getContract(username);
        const response = await contract.submitTransaction('getGoodsHistory', id);
        return response;
    }

    async getContract(username: string) {
        let contract = this.contracts.get(username);
        if (contract) {
            return contract;
        }
        let gateway = this.gateways.get(username);
        if (!gateway) {
            gateway = new Gateway();
            const wallet = this.wallet;
            await gateway.connect(this.ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });
        }
        const network = await gateway.getNetwork(channelName);
        contract = network.getContract(contractName);
        this.gateways.set(username, gateway);
        this.contracts.set(username, contract);
        return contract;
    }

    async checkIdentity(username: string) {
        let identity = this.identities.get(username);
        if (!identity) {
            identity = await this.wallet.get(username);
        }
        if (!identity) {
            throw Error(`do not find identity for user ${username}`);
        }
    }
}