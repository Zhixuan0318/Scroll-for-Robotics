import { Log } from 'viem';

import { useCallback, useEffect, useState } from 'react';
import useOrders from './useOrders';
import { useRouter } from 'next/navigation';
import { useAccount, useWatchContractEvent } from 'wagmi';

import Database from '@/services/Database';

import WarehouseABI from '@/contracts/WarehouseABI.json';

import addresses from '@/data/addresses';
import { wrapReceipt } from '@/utils/file-service';
import { uploadReceipt } from '@/services/pinata';

const usePollOrder = (orderId: string) => {
    const router = useRouter();

    const { address } = useAccount();
    const { updateOrderInList, getOrder, orders } = useOrders();

    const [order, setOrder] = useState<Order>();
    const [simulationStatus, setSimulationStatus] = useState<SimulatorStatus>('processing');

    useEffect(() => {
        if (!orders.length || order) return;

        const loaded = getOrder(orderId);
        loaded ? setOrder(loaded) : router.push('/home/store');
    }, [orders]);

    const handleOrderLogs = useCallback(
        async (logs: Log[]) => {
            if (!order) return;
            const hashes = order.hashes;
            const robots = order.robots;

            for (let baseLog of logs) {
                const log = baseLog as any;
                console.log(log);
                if (log.args.orderId != order.orderId) continue;
                if (hashes.includes(log.transactionHash)) continue;
                if (log.eventName == 'ActivityVerifier' || log.eventName == 'RequestRobotId')
                    continue;
                if (log.eventName == 'AssingRobot') {
                    robots[log.args.activity] = Number(log.args.robotId);
                }
                console.log(log.eventName);
                hashes[hashes.length - 1] = log.transactionHash;
                if (hashes.length < 8) hashes.push('empty');
            }

            setOrder({ ...order, hashes, robots });
        },
        [order]
    );

    useWatchContractEvent({
        address: addresses.warehouse,
        abi: WarehouseABI,
        onLogs(logs) {
            handleOrderLogs(logs);
        },
        pollingInterval: 1000,
    });

    useEffect(() => {
        if (!order || order.status == 'cancelled' || order.status == 'delivered') return;

        if (order.status == 'completed' && address) {
            new Database().completeOrder(address, order.orderId, order);
            updateOrderInList(order.orderId, order);
        } else if (order.hashes.length == 8 && order.hashes[7] != 'empty') {
            wrapReceipt(order).then(async (receiptJson) => {
                const receipt = await uploadReceipt(receiptJson);
                setOrder({ ...order, status: 'completed', receipt });
            });
        }
    }, [order?.hashes[7], order?.status]);

    useEffect(() => {
        if (!order) return;
        const length = order.hashes.length;

        if (order.status == 'completed' || order.status == 'delivered')
            setSimulationStatus('completed');
        else
            setSimulationStatus(
                length == 4
                    ? 'picking'
                    : length == 6
                    ? 'packing'
                    : length == 8
                    ? 'delivery'
                    : 'processing'
            );
    }, [order]);

    return { order, simulationStatus };
};

export default usePollOrder;
