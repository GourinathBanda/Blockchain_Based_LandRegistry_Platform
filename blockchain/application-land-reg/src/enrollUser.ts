import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export async function enrollUser() {
    try {
        let connectionProfile: any = yaml.load(
            fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'),
        );

        const caInfo =
            connectionProfile.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName,
        );

        const walletPath = path.join(
            process.cwd(),
            '../identity/user/landRegDept/wallet',
        );
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.get('landRegDept');
        if (userExists) {
            console.log(
                'An identity for the client user "landRegDept" already exists in the wallet',
            );
            return;
        }

        const enrollment = await ca.enroll({
            enrollmentID: 'user1',
            enrollmentSecret: 'user1pw',
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('landRegDept', x509Identity);
        console.log(
            'Successfully enrolled client user "landRegDept" and imported it into the wallet',
        );
    } catch (error) {
        console.error(`Failed to enroll client user "landRegDept": ${error}`);
        process.exit(1);
    }
}
