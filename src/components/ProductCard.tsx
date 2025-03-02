'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SkeletonCard from '@/utils/SkeletonCard';

import './product-card.css';
import addresses from '@/data/addresses';

interface Props {
    product: Product | undefined;
    withButon: boolean;
    setSelectedProduct?: React.Dispatch<React.SetStateAction<Product | undefined>>;
}

export default function ProductCard({ product, withButon, setSelectedProduct }: Props) {
    return !product ? (
        <SkeletonCard />
    ) : (
        <section className='product-card'>
            <section
                className='info'
                style={withButon ? {} : { boxShadow: '-10px 10px var(--primary)' }}
            >
                <h2>{product.name}</h2>
                <Image src={product.image} alt='product-image' width={160} height={160} />
                <section className='details'>
                    <div className='stock'>
                        <h3>{product.stock}</h3>
                        <h5>Stock</h5>
                    </div>
                    <div className='price'>
                        <Image src={'/images/svg/free.svg'} alt='price' width={32} height={32} />
                        <h5>ETH</h5>
                    </div>
                </section>
                {withButon ? (
                    <button
                        className='primary-button'
                        onClick={() => (setSelectedProduct ? setSelectedProduct(product) : {})}
                    >
                        Order
                    </button>
                ) : (
                    <></>
                )}
            </section>
            <Link
                href={`${process.env.NEXT_PUBLIC_EXPLORER}/nft/${addresses.products}/${product.id}`}
                target='_blank'
            >
                View on ScrollScan
            </Link>
        </section>
    );
}
