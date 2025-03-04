'use client';

import React, { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

import config, { wagmiAdapter } from '@/config/wagmi';

import { scrollSepolia } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';

const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    networks: [scrollSepolia],
    defaultNetwork: scrollSepolia,
});

const queryClient = new QueryClient();

function WalletProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(config, cookies);

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}> {children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default WalletProvider;
