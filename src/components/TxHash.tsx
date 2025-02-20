'use client';

import { CopyButton } from '@lobehub/ui';

import './tx-hash.css';

export default function TxHash({ hash }: { hash?: string }) {
    return (
        <div className='tx-hash'>
            <h6>
                Txn Hash:{' '}
                {hash ? hash?.slice(0, 6) + '...' + hash?.slice(hash.length - 5) : 'Pending'}
            </h6>
            {hash && <CopyButton content={hash} />}
        </div>
    );
}
