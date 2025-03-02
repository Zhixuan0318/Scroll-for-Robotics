'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import addresses from '@/data/addresses';

import './robot-card.css';

interface Props {
    name: 'Picking Robot' | 'Packing Robot' | 'Delivery Robot';
    amount: number;
}

export default function RobotCard({ name, amount }: Props) {
    return (
        <section className='robot-card'>
            <section className='info'>
                <h2>{name}</h2>
                <Image src={'/images/robot.png'} alt='robot-image' width={115} height={133} />
                <section className='details'>
                    <div className='units'>
                        <h3>{amount}</h3>
                        <h5>Working Unit(s)</h5>
                    </div>
                    <div className='type'>
                        <h3>ERC721</h3>
                        <h5>Tokenized Type</h5>
                    </div>
                </section>
            </section>
            <Link
                href={`${process.env.NEXT_PUBLIC_EXPLORER}/token/${
                    name == 'Picking Robot'
                        ? addresses.picker
                        : name == 'Packing Robot'
                        ? addresses.packer
                        : addresses.deliverer
                }`}
                target='_blank'
            >
                View on ScrollScan
            </Link>
        </section>
    );
}
