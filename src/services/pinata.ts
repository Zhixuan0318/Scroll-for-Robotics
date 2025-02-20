import { PinataSDK } from 'pinata-web3';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: 'rose-principal-turtle-588.mypinata.cloud',
});

export async function uploadFile(file: File): Promise<string> {
    const upload = await pinata.upload.file(file);
    return upload.IpfsHash;
}

export async function uploadReceipt(json: string): Promise<string> {
    const upload = await pinata.upload.json(JSON.parse(json));
    return upload.IpfsHash;
}

export async function getFile(cid: string) {
    const { data } = await pinata.gateways.get(cid);
    return data;
}

export const pinataGateway = pinata.config?.pinataGateway as string;
