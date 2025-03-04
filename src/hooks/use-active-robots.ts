import { useCallback, useEffect, useState } from 'react';

import { readContract } from 'wagmi/actions';

import wagmiConfig from '@/config/wagmi';

import addresses from '@/data/addresses';
import WarehouseABI from '@/contracts/WarehouseABI.json';

export default function useActiveRobots() {
    const [robots, setRobots] = useState([20, 20, 20]);

    const handleRobots = useCallback(async () => {
        const data = await readContract(wagmiConfig, {
            abi: WarehouseABI,
            functionName: 'activeRobots',
            address: addresses.warehouse,
        });
        const converted = (data as any).map((num: bigint) => Number(num));
        setRobots([...converted]);
    }, [robots]);

    const [upd, setUpd] = useState(false);
    useEffect(() => {
        handleRobots();
        setTimeout(() => setUpd(!upd), 3_000);
    }, [upd]);

    return robots;
}
