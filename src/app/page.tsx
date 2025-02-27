'use client';

import Image from 'next/image';
import { RainbowButton } from '@/components/magicui/rainbow-button';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

import './connection.css';

export default function Connection() {
    const router = useRouter();

    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();

    useEffect(() => {
        if (isConnected) router.push('/home/store');
    }, [isConnected]);

    return (
        <main className='connection'>
            <div className='logos'>
                <Image src={'/images/svg/logo.svg'} alt='logo' width={73} height={60} />
            </div>
            <div className='deployed'>
                <div>Scroll for Robotics</div>
                <div>
                    <Image
                        src={'/images/svg/partners/scroll.svg'}
                        alt='scroll'
                        width={19}
                        height={19}
                    />
                    Deployed on Scroll Sepolia
                </div>
            </div>
            <h1>
                The Ecommerce Warehouse <br /> Run By Robots.{' '}
            </h1>
            <RainbowButton className='rnb-button' onClick={() => open()}>
                <Image
                    src={'/images/svg/partners/walletconnect.svg'}
                    alt='wallet'
                    width={36}
                    height={36}
                />
                <h3>Connect with WalletConnect</h3>
            </RainbowButton>
            <h3>This showcase is powered by</h3>
            <div className='traits'>
                <div>
                    <Image
                        src={'/images/svg/partners/scroll.svg'}
                        alt='trait'
                        width={16}
                        height={16}
                    />
                    <h3>Scroll</h3>
                </div>
                <div>
                    <Image src={'/images/simulator.png'} alt='trait' width={19} height={19} />
                    <h3>Webost Simulator</h3>
                </div>
                <div>
                    <Image
                        src={'/images/svg/partners/worldcoin.svg'}
                        alt='trait'
                        width={19}
                        height={19}
                    />
                    <h3>Worldcoin</h3>
                </div>
                <div>
                    <Image
                        src={'/images/svg/partners/sign.svg'}
                        alt='trait'
                        width={32}
                        height={16}
                    />
                    <h3>Sign</h3>
                </div>
                <div>
                    <Image
                        src={'/images/svg/partners/anyrand.svg'}
                        alt='trait'
                        width={66}
                        height={16}
                    />
                    <h3>randomness</h3>
                </div>
            </div>
        </main>
    );
}
