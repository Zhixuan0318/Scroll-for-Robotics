'use client';

import Image from 'next/image';
import { CopyButton } from '@lobehub/ui';
import Link from 'next/link';
import { ConfettiButton } from '../ui/confetti';
import CodePopUp from '../CodePopUp';

import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { pinataGateway, uploadFile } from '@/services/pinata';
import { getAttestation, signAttestation } from '@/services/sign-attestation';

interface Props {
    order: Order | undefined;
    side: 'logistics' | 'receiver';
    updateOrderInList: (orderId: string, updated: Order) => void;
}

export default function Evidence({ order, side, updateOrderInList }: Props) {
    const [uploading, setUploading] = useState(false);

    const { address } = useAccount();

    const isReceiver = useRef(side == 'receiver');

    const [schema, setSchema] = useState<string>();
    const [result, setResult] = useState(false);

    const confettiRef = useRef<any>(null);
    useEffect(() => {
        if (order?.status != 'delivered' && order?.attestation?.[side]?.id && confettiRef.current)
            confettiRef.current.children[0].click();
    }, [order?.attestation?.[side]?.id]);

    return (
        <div className={side}>
            {schema && <CodePopUp code={schema} setCode={setSchema} result={result} />}
            <h2>{isReceiver.current ? 'Package Recipient' : 'Third Party Logistic (3PL)'}</h2>
            <div className='upload-image'>
                <label htmlFor={side} className='file-upload'>
                    <h4>Upload Photographic Evidence</h4>
                    <input
                        id={side}
                        name={side}
                        type='file'
                        accept='image/*'
                        onChange={async (event) => {
                            const copy = { ...order };

                            if (
                                !event.target.files ||
                                !copy ||
                                copy.attestation?.[side]?.cid != undefined
                            ) {
                                event.target.files = null;
                                return;
                            }

                            if (isReceiver.current && !copy.attestation?.logistics?.id) {
                                event.target.files = null;
                                return;
                            }

                            setUploading(true);

                            const file = event.target.files[0];
                            event.target.files = null;

                            const cid = await uploadFile(file);
                            copy.attestation = {
                                ...copy.attestation,
                                [side]: {
                                    id: '',
                                    cid: cid,
                                },
                            };
                            updateOrderInList(copy.orderId as string, copy as Order);

                            setUploading(false);
                        }}
                    />
                    <Image
                        src={'/images/svg/upload-image.svg'}
                        alt='upload-image'
                        height={49}
                        width={49}
                    />
                </label>
                {uploading && (
                    <h4>
                        <div id='spinner'></div>Uploading to Pinata
                    </h4>
                )}
                {order?.attestation?.[side] ? (
                    <div className='cid'>
                        <h4>File CID:</h4>{' '}
                        <Link
                            href={`${pinataGateway}/ipfs/${order.attestation[side].cid}`}
                            target='_blank'
                        >
                            {order?.attestation?.[side].cid.slice(0, 5) +
                                '...' +
                                order?.attestation?.[side].cid.slice(54)}
                        </Link>
                        <CopyButton content={order.attestation?.[side]?.cid ?? ''} />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div ref={confettiRef} id={side} className='absolute confetti-container'>
                <ConfettiButton className='confetti-btn'></ConfettiButton>
            </div>
            {order?.attestation?.[side]?.id ? (
                <div className='success'>
                    <Image src={'/images/svg/marked.svg'} alt='sign' height={41} width={41} />
                    <h4
                        onClick={async () => {
                            if (!order.attestation?.[side]) return;

                            setResult(true);

                            const schema = await getAttestation(order.attestation[side].id);
                            console.log(schema);

                            setSchema(JSON.stringify(schema.data, null, 4));
                        }}
                    >
                        Broadcast Successfully!
                    </h4>
                    <Link
                        href={`https://testnet-scan.sign.global/attestation/onchain_evm_534351_${order?.attestation?.[side]?.id}`}
                        target='_blank'
                    >
                        View on Sign Scan
                    </Link>
                </div>
            ) : (
                <button
                    className={order?.attestation?.[side]?.cid ? 'primary-button' : ''}
                    id={!order?.attestation?.[side]?.cid ? 'black-button-disabled' : ''}
                    onClick={async () => {
                        if (!order) return;
                        const copy = { ...order };
                        if (!copy.attestation || !address) return;

                        if (isReceiver.current) {
                            if (!copy.attestation.receiver?.cid) return;
                            const result = await signAttestation(
                                isReceiver.current,
                                copy.receipt,
                                (copy.attestation as any)[side].cid,
                                address,
                                copy.nullifierHash,
                                address
                            );

                            copy.attestation.receiver.id = result.attestationId;
                            copy.attestation.receiver.hash = result.txHash ?? '';
                        } else {
                            if (!copy.attestation.logistics?.cid) return;
                            const result = await signAttestation(
                                isReceiver.current,
                                copy.receipt,
                                (copy.attestation as any)[side].cid,
                                address,
                                copy.nullifierHash,
                                address
                            );

                            copy.attestation.logistics.id = result.attestationId;
                            copy.attestation.logistics.hash = result.txHash ?? '';
                        }

                        updateOrderInList(copy.orderId, copy);
                    }}
                >
                    Broadcast your attestation{' '}
                    <Image
                        src={'/images/svg/partners/scroll.svg'}
                        alt='scroll'
                        height={24}
                        width={24}
                    />
                </button>
            )}

            <div className='info'>
                <Image src={'/images/svg/info.svg'} alt='info' height={32} width={32} />
                {isReceiver.current
                    ? 'You can only make an attestation after our third party logistic completed the attestation'
                    : 'Upload photo evidence as proof of delivery before proceeding'}
            </div>
        </div>
    );
}
