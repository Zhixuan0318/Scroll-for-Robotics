import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { scrollSepolia } from 'viem/chains';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.27',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: 'scrollSepolia',

    networks: {
        scrollSepolia: {
            chainId: scrollSepolia.id,
            url: '',
            accounts: [''],
        },
    },
    etherscan: {
        apiKey: {
            scrollSepolia: '',
        },
        customChains: [
            {
                network: 'scrollSepolia',
                chainId: scrollSepolia.id,
                urls: {
                    apiURL: '',
                    browserURL: 'https://scrollscan.com',
                },
            },
        ],
    },
};

export default config;
