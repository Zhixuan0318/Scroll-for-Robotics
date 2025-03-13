'use client';

import Image from 'next/image';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';

import './home-layout.css';

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();

    const { status, address } = useAppKitAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (status == 'disconnected') router.push('/');
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
            <main className='home-layout'>
                <div className='selector'>
                    {[
                        ['Store'],
                        ['Track', 'package'],
                        ['Inventory'],
                        ['Distribute', 'delivery'],
                        ['Twins'],
                    ].map((section, index) => (
                        <button
                            key={index}
                            className={
                                pathname.includes(section[0].toLowerCase()) ||
                                (section[0] == 'Distribute' && pathname.includes('delivery'))
                                    ? 'primary-button'
                                    : 'white-button'
                            }
                            onClick={() =>
                                router.push(
                                    `/home/${
                                        section[0].toLowerCase() == 'distribute'
                                            ? 'delivery'
                                            : section[0].toLowerCase()
                                    }`
                                )
                            }
                        >
                            <Image
                                src={`/images/svg/${(section.length == 2
                                    ? section[1]
                                    : section[0]
                                ).toLowerCase()}.svg`}
                                alt='store'
                                width={21}
                                height={21}
                            />
                            {section[0]}
                        </button>
                    ))}
                </div>
                {children}
            </main>
        </>
    );
}
