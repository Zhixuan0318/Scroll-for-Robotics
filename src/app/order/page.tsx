'use client';

import Image from 'next/image';
import Link from 'next/link';
import Simulator from './Simulator';
import Approval from './Approval';
import Warning from './Warning';
import TxHash from '@/components/TxHash';
import CodePopUp from '@/components/CodePopUp';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import usePollOrder from '@/hooks/usePollOrder';
import { useAppKitAccount } from '@reown/appkit/react';

import { pinataGateway } from '@/services/pinata';

import logs from '@/data/logs';

import './order-info.css';
import addresses from '@/data/addresses';

function OrderInfo() {
    const { address } = useAppKitAccount();

    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') as string;
    const simulationMethod = searchParams.get('method') as string;
    const ngrokUrl = searchParams.get('url');

    const { order, simulationStatus } = usePollOrder(orderId);

    const [design, setDesign] = useState(false);
    const [code, setCode] = useState<string>();

    const manageSim = useCallback(
        async (stage: number) => {
            if (!address || !order) return;
            if (simulationMethod == 'local' && stage != 1) {
                await fetch(`/api/robot/simulate`, {
                    method: 'POST',
                    body: JSON.stringify({
                        productId: order.productId,
                        ngrokUrl,
                        stage,
                        orderId: orderId,
                    }),
                });
            } else
                setTimeout(
                    async () => {
                        await fetch('/api/order', {
                            method: 'POST',
                            body: JSON.stringify({ orderId, stage, address }),
                        });
                    },
                    stage == 1 ? 0 : stage == 2 ? 42_000 : stage == 3 ? 38_000 : 45_000
                );
        },
        [address, order]
    );

    useEffect(() => {
        if (!address || !order || order.status != 'processing') return;

        switch (order.hashes.length) {
            case 2:
                manageSim(1);
                break;
            case 4:
                manageSim(2);
                break;
            case 6:
                manageSim(3);
                break;
            case 8:
                manageSim(4);
                break;
        }
    }, [address, order?.hashes.length]);

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (
            !order ||
            order.status == 'completed' ||
            order.status == 'delivered' ||
            isLoaded ||
            !address
        )
            return;
        setIsLoaded(true);
    }, [order]);

    return (
        <>
            <Warning order={order} />
            <main className='order-info'>
                {code && (
                    <CodePopUp
                        code={code}
                        setCode={setCode}
                        width='60dvw'
                        text={`FileId: ${order?.receipt}`}
                    />
                )}
                <div className='order-id'>
                    <h1>#{orderId}</h1>
                    <h5 id={order ? order.status : 'processing'}>
                        {order
                            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                            : 'Loading'}
                    </h5>
                </div>
                <section className='order-details'>
                    <div className='product'>
                        <h4>Order</h4>
                        <Image
                            src={order ? order.productImage : '/'}
                            alt='product-image'
                            height={32}
                            width={32}
                        />
                        <Link
                            href={`${process.env.NEXT_PUBLIC_EXPLORER}/nft/${addresses.products}/${order?.productId}`}
                            target='_blank'
                        >
                            {order ? order.productName : 'Product'}
                        </Link>
                    </div>
                    <div className='mailing-info'>
                        <h4>Mailing Info</h4>
                        <h5>{order ? order.mailingInfo.name : 'Loading'}</h5>
                        <h5>{order ? order.mailingInfo.phone : 'Loading'}</h5>
                        <h5>{order ? order.mailingInfo.address : 'Loading'}</h5>
                        <div>
                            <Image
                                src={'/images/svg/marked.svg'}
                                alt='marked'
                                height={14}
                                width={14}
                            />
                            <Image
                                src={'/images/svg/partners/worldcoin.svg'}
                                alt='worldcoin'
                                height={14}
                                width={14}
                            />
                        </div>
                    </div>
                    {order?.receipt && (
                        <Link
                            className='receipt'
                            href={`${pinataGateway}/ipfs/${order.receipt}`}
                            target='_blank'
                        >
                            <h4>Lifecycle Report</h4>
                            <div>
                                <Image
                                    src={'/images/svg/marked-invert.svg'}
                                    alt='marked'
                                    height={20}
                                    width={20}
                                />
                                <h3>Recorded on Pinata</h3>
                                <Image
                                    src={'/images/svg/partners/pinata.svg'}
                                    alt='pinata'
                                    height={19}
                                    width={13}
                                />
                            </div>
                        </Link>
                    )}
                </section>
                <section className='load-assignment'>
                    <div id='header'>
                        <h4>Load Assignment</h4>
                        <div id='order-prop'>
                            <Image src={'/images/svg/power.svg'} alt='power' height={9} width={9} />
                            <div>
                                <Image
                                    src={'/images/svg/partners/anyrand.svg'}
                                    alt='anyrand'
                                    height={12}
                                    width={66}
                                />
                                <h6>randomness</h6>
                            </div>
                        </div>
                        <div id='order-prop'>
                            <Image
                                src={'/images/svg/important.svg'}
                                alt='important'
                                height={9}
                                width={9}
                            />
                            <h6>Click to view on Scroll Scan</h6>
                        </div>
                    </div>

                    {order?.robots.map((robot, index) => {
                        const hash =
                            order.hashes.length > 2 + index * 2
                                ? order.hashes[2 + index * 2]
                                : 'empty';
                        return (
                            <div key={index} className='assignment-card'>
                                <Image
                                    src={'/images/svg/crane.svg'}
                                    alt='crane'
                                    height={67}
                                    width={58}
                                />

                                <div className='data'>
                                    <h5>
                                        {index == 0
                                            ? 'Product Picking'
                                            : index == 1
                                            ? 'Order Packing'
                                            : 'Parcel Delivery'}
                                    </h5>
                                    <div>ROBOT ID</div>
                                    {robot != -1 ? (
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_EXPLORER}/nft/${
                                                index == 0
                                                    ? addresses.picker
                                                    : index == 1
                                                    ? addresses.packer
                                                    : addresses.deliverer
                                            }/${robot}`}
                                            target='_blank'
                                        >
                                            {robot}
                                        </Link>
                                    ) : (
                                        <div id='spinner'></div>
                                    )}
                                </div>
                                <TxHash hash={hash == 'empty' ? undefined : hash} />

                                <Link
                                    href={`${process.env.NEXT_PUBLIC_EXPLORER}/tx/${hash}`}
                                    target='_blank'
                                >
                                    <Image
                                        src={'/images/svg/view-explorer.svg'}
                                        alt='explorer'
                                        width={20}
                                        height={20}
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </section>
                <Simulator
                    order={order}
                    simulationStatus={simulationStatus}
                    productName={order ? order.productName : ''}
                    simulationMethod={simulationMethod}
                    setDesign={setDesign}
                />
                {design && (
                    <section className='simulation-design'>
                        <h3>About the Webot simulation setup</h3>
                        <h5>
                            The robots simulated in the Webot scenes are programmed to perform
                            warehouse operations based on the activity on the Scroll Sepolia
                            Testnet, and will also report back to the Scroll Sepolia Testnet once
                            jobs are completed. Our team had built a simulated warehouse scene to
                            demonstrate how robots deal with product picking, parcel packing, and
                            parcel delivery:
                        </h5>
                        <div>
                            <Image
                                src={'/images/simulation-design.png'}
                                alt='design'
                                width={630}
                                height={413}
                            />
                            <Image src={'/images/arrow.png'} alt='arrow' width={16} height={16} />
                            <h6>Warehouse Simulation Design</h6>
                        </div>
                    </section>
                )}
                <section className='detail-log'>
                    <div id='header'>
                        <h4>Detail Log</h4>
                        <div id='order-prop'>
                            <Image
                                src={'/images/svg/important.svg'}
                                alt='important'
                                height={9}
                                width={9}
                            />
                            <h6>Click to view on Scroll Scan</h6>
                        </div>
                    </div>
                    <div className='logs'>
                        {order?.hashes
                            .map((hash, index) => (
                                <div key={index} className='log'>
                                    <div className='status'>
                                        {index < order.hashes.length - 1 ||
                                        order.status == 'completed' ||
                                        order.status == 'delivered' ? (
                                            <Image
                                                src={'/images/svg/success-orange.svg'}
                                                alt='completed'
                                                width={18}
                                                height={18}
                                            />
                                        ) : (
                                            <div id='spinner'></div>
                                        )}
                                        {logs[index]}
                                    </div>
                                    <TxHash hash={hash == 'empty' ? undefined : hash} />
                                    <Link
                                        href={`${process.env.NEXT_PUBLIC_EXPLORER}/tx/${hash}`}
                                        target='_blank'
                                    >
                                        <Image
                                            src={'/images/svg/open-explorer.svg'}
                                            alt='explorer'
                                            width={20}
                                            height={20}
                                        />
                                    </Link>
                                </div>
                            ))
                            .reverse()}
                    </div>
                </section>
                <Approval order={order} />
            </main>
        </>
    );
}

export default function Page() {
    return (
        <Suspense>
            <OrderInfo />
        </Suspense>
    );
}
