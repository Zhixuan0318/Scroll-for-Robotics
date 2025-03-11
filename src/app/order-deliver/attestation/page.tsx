'use client';

import Image from 'next/image';
import { Suspense, useState } from 'react';
import Evidence from '@/components/attestation/Evidence';
import { CopyButton } from '@lobehub/ui';
import Link from 'next/link';

import { useAccount } from 'wagmi';
import useOrders from '@/hooks/useOrders';
import { useSearchParams } from 'next/navigation';
import { useMemo, useRef, useEffect } from 'react';

import Firebase from '@/services/Database';
import { pinataGateway } from '@/services/pinata';

import './attestation.css';

function Attestation() {
    const searchParams = useSearchParams();
    const { address } = useAccount();

    const firebase = useRef(new Firebase());

    const { getOrder, orders, updateOrderInList } = useOrders();
    const orderId = searchParams.get('id') as string;
    const [order, setOrder] = useState<Order>();

    const statusToDisplay = useMemo(
        () => (order ? (order.status == 'completed' ? 'processing' : 'delivered') : 'processing'),
        [order?.status]
    );

    useEffect(() => {
        if (orders.length) setOrder(getOrder(orderId));
    }, [orders]);

    useEffect(() => {
        if (order && address && order.status != 'delivered') {
            if (order.attestation?.logistics?.id && order.attestation.receiver?.id) {
                order.status = 'delivered';
                updateOrderInList(order.orderId, { ...order, status: 'delivered' });
            }
            firebase.current.updateOrder(address, order);
        }
    }, [address, order]);

    return (
        <main className='attestation'>
            <h1>Package Signing (Attestation)</h1>
            <div className='order-data'>
                <div className='order-id'>
                    <h4>Order</h4>
                    <h2>#{orderId}</h2>
                </div>
                {order?.receipt && (
                    <div className='receipt'>
                        <h4>Lifecycle Report</h4>
                        <Link href={`${pinataGateway}/ipfs/${order.receipt}`} target='_blank'>
                            <Image
                                src={'/images/svg/marked-invert.svg'}
                                alt='marked'
                                height={20}
                                width={20}
                            />
                            <h3>Recorder on Pinata</h3>
                            <Image
                                src={'/images/svg/partners/pinata.svg'}
                                alt='pinata'
                                height={19}
                                width={13}
                            />
                        </Link>
                    </div>
                )}
                <div className='topic'>
                    <h4>Schema ID (3PL)</h4>
                    <div>
                        <Link
                            href={`https://testnet-scan.sign.global/schema/onchain_evm_534351_0x84`}
                            target='_blank'
                        >
                            {'onchain_evm_534351_0x84'}
                        </Link>
                        <CopyButton content={'onchain_evm_534351_0x84'} />
                    </div>
                </div>
                <div className='topic'>
                    <h4>Schema ID (Recipient)</h4>
                    <div>
                        <Link
                            href={`https://testnet-scan.sign.global/schema/onchain_evm_534351_0x83`}
                            target='_blank'
                        >
                            {'onchain_evm_534351_0x83'}
                        </Link>
                        <CopyButton content={'onchain_evm_534351_0x83'} />
                    </div>
                </div>
                <div className='status'>
                    <h5 id={statusToDisplay}>
                        {order
                            ? statusToDisplay.charAt(0).toUpperCase() + statusToDisplay.slice(1)
                            : 'Loading'}
                    </h5>
                </div>
            </div>
            <section className='evidence'>
                <Evidence side='logistics' order={order} updateOrderInList={updateOrderInList} />
                <Evidence side='receiver' order={order} updateOrderInList={updateOrderInList} />
            </section>
        </main>
    );
}

export default function AttestationSuspended() {
    return (
        <Suspense>
            <Attestation />
        </Suspense>
    );
}
