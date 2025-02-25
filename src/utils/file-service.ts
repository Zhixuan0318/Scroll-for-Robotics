import { provider } from './owner';

import addresses from '@/data/addresses';

import ProductsABI from '@/contracts/ProductsABI.json';
import { readContract } from 'wagmi/actions';
import wagmi from '@/config/wagmi';

const getVerifier = async (hash: string, log: number): Promise<string> => {
    const transaction = await provider.getTransactionReceipt(hash);
    return transaction?.logs[log].topics[1]
        ? '0x' + transaction.logs[log].topics[1].slice(26)
        : addresses.owner;
};

export async function wrapReceipt(order: Order): Promise<string> {
    const stock = await readContract(wagmi, {
        abi: ProductsABI,
        address: addresses.products,
        functionName: 'stock',
        args: [order.productId],
    });

    const receiptData = {
        orderId: order.orderId,
        dispatcher: addresses.owner,
        detailLog: {
            warehouseProcessing: order.hashes[0],
            warehouseProcessed: order.hashes[1],
            productPicking: order.hashes[2],
            productPicked: order.hashes[3],
            productPacking: order.hashes[4],
            productPacked: order.hashes[5],
            orderDelivering: order.hashes[6],
            orderDelivered: order.hashes[7],
        },
        approval: {
            pickingTask: await getVerifier(order.hashes[3], 2),
            packingTask: await getVerifier(order.hashes[5], 2),
            deliveryTask: await getVerifier(order.hashes[7], 3),
        },
        onChainStock: Number(stock),
        timestamp: Date.now(),
    };

    return JSON.stringify(receiptData);
}
