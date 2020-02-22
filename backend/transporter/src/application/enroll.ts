import { X509Identity, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';

import * as fs from 'fs';
import * as path from 'path';


export async function enroll(username: string, password: string) {
  try {
    const ccpPath = path.join(process.cwd(), "connection.json");
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caInfo = ccp.certificateAuthorities['ca.transporter.logistic.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get(username);
    if (identity) {
      console.log(`identity for ${username} already exist`);
      return;
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
      mspId: 'TransporterMSP',
      type: 'X.509',
    };
    await wallet.put(username, x509Identity);
    console.log("identity for admin put to wallet successfully");

  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    throw error;
  }
}

enroll('admin', 'adminpw').then(r => console.log('finished'));