'use client';

import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import WorldIdVerification from './WorldIdVerification';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import useOrders from '@/hooks/useOrders';

import Database from '@/services/Database';

import wagmiConfig from '@/config/wagmi';
import { writeContract } from 'wagmi/actions';

import addresses from '@/data/addresses';
import ShopABI from '@/contracts/ShopABI.json';

import { generateOrderId, generateRandomValue } from '@/utils/generator';
import { provider, signMessage } from '@/utils/owner';

import './order-form.css';

interface Props {
    product: Product;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
}

export default function OrderForm({ product, setSelectedProduct }: Props) {
    const { addOrder, getOrder, updateOrderInList } = useOrders();
    const { address } = useAccount();
    const [isProcessing, setIsProcessing] = useState(false);

    const [countdown, setCountdown] = useState(15);

    const name = useRef('');
    const phone = useRef('');
    const deliveryAddress = useRef('');
    const orderId = useRef(generateOrderId(address ? address : '2sac1rt'));

    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            const form = document.querySelector('div.order-background') as HTMLElement;
            form.style.animation = 'none';
        }, 800);
    }, []);

    useEffect(() => {
        if (countdown == 0) handleCloseForm();
        else
            setTimeout(() => {
                if (!isProcessing) setCountdown(countdown - 1);
            }, 1000);
    }, [countdown]);

    const handleCloseForm = useCallback(async () => {
        const form = document.querySelector('div.order-background') as HTMLElement;
        form.style.animation = 'form-appear 750ms ease-out reverse forwards';
        await new Database().reduceOnHold(product.id, false);
        setTimeout(() => setSelectedProduct(undefined), 800);
        setIsProcessing(false);
    }, [setSelectedProduct]);

    const handleOrderCreation = useCallback(async () => {
        try {
            if (!name.current || !phone.current || !deliveryAddress.current) return;
            setIsProcessing(true);

            const signature = signMessage(orderId.current);
            const args = [orderId.current, product.id, signature.v, signature.r, signature.s];

            const txHash = await writeContract(wagmiConfig, {
                abi: ShopABI,
                functionName: 'placeOrder',
                address: addresses.shop,
                args,
            });

            const receipt = await provider.waitForTransaction(txHash);
            if (!receipt || receipt.status == 0) throw new Error('Tx error');

            const newOrder: Order = {
                orderId: orderId.current,
                status: 'processing',

                productId: product.id,
                productName: product.name,
                productImage: product.image,

                hashes: [txHash, 'empty'],
                robots: [-1, -1, -1],

                mailingInfo: {
                    name: name.current,
                    phone: phone.current,
                    address: deliveryAddress.current,
                },

                nullifierHash: '',
                receipt: '',

                timestamp: Math.floor(Date.now() / 1000),
            };

            const db = new Database();
            await db.updateOrder(address as string, newOrder);
            await db.reduceOnHold(product.id, true);

            addOrder(newOrder);
            setIsApproved(true);
        } catch (error: any) {
            setIsProcessing(false);
            alert(error.message);
            handleCloseForm();
        }
    }, [setIsProcessing, setIsApproved]);

    return (
        <div className='order-background'>
            {isApproved ? (
                <WorldIdVerification
                    orderId={orderId.current}
                    getOrder={getOrder}
                    updateOrderInList={updateOrderInList}
                />
            ) : (
                <section className='order-form'>
                    <div className='header'>
                        <h1>Order Form</h1>
                        <div className='countdown'>
                            <Image
                                src={'/images/svg/calender.svg'}
                                alt='calender'
                                width={25}
                                height={25}
                            />
                            <h6>
                                Congrats! This product is currently on-hold for you. Please proceed{' '}
                                <br />
                                with the order in 00:{countdown < 10
                                    ? `0${countdown}`
                                    : countdown}{' '}
                                before it is release.
                            </h6>
                        </div>
                    </div>

                    <ProductCard product={product} withButon={false} />
                    <div className='form'>
                        <Input id='name' name='Name' valueRef={name} />
                        <Input id='phone' name='Phone Number' valueRef={phone} />
                        <Input id='address' name='Address' valueRef={deliveryAddress} />
                        <button className='primary-button' onClick={handleOrderCreation}>
                            {isProcessing ? (
                                <div id='spinner' style={{ filter: 'invert(1)' }}></div>
                            ) : (
                                'Place Order for FREE'
                            )}
                        </button>
                    </div>
                    <Image
                        src={'/images/svg/cross.svg'}
                        alt='cross'
                        width={18}
                        height={18}
                        onClick={handleCloseForm}
                    />
                </section>
            )}
        </div>
    );
}

interface InputProps {
    name: string;
    id: string;
    valueRef: React.MutableRefObject<string>;
}

function Input({ name, id, valueRef }: InputProps) {
    const handleRandomizeValue = useCallback(() => {
        valueRef.current = generateRandomValue(id);
        const element = document.querySelector(`.order-form #${id}`) as HTMLInputElement;
        element.value = valueRef.current;
    }, [id]);

    return (
        <div>
            <label htmlFor={id}>{name}</label>
            {id == 'address' ? (
                <textarea id={id} onChange={(event) => (valueRef.current = event.target.value)} />
            ) : (
                <input id={id} onChange={(event) => (valueRef.current = event.target.value)} />
            )}
            <Image
                src={'/images/svg/randomize.svg'}
                alt='dice'
                width={27}
                height={27}
                onClick={handleRandomizeValue}
            />
        </div>
    );
}
