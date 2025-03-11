'use client';

import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AttestationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { address, status } = useAppKitAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (status && status != 'connected' && status != 'reconnecting') router.push('/');
    }, [status]);

    return (
        <>
            <nav>
                <Image
                    className='logo'
                    src={'/images/svg/logo.svg'}
                    alt='logo'
                    width={66}
                    height={54}
                    onClick={() => router.push('/home/track')}
                />
                <div className='wallet'>
                    <Image
                        src={'/images/svg/partners/scroll.svg'}
                        alt='wallet-logo'
                        width={18}
                        height={18}
                    />
                    <h4>{address ? `0x...${address?.slice(38, 42)}` : 'Loading...'}</h4>
                    <h6 onClick={() => disconnect()}>Disconnect Wallet</h6>
                </div>
            </nav>
            {children}
        </>
    );
}
