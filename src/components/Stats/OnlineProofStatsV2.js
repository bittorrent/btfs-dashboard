import React, { useEffect, useState } from 'react';
import { getHeartBeatsStatsV2 } from 'services/dashboardService.js';
import { t } from 'utils/text.js';

let didCancel = false;

export default function HeartBeatsStats({ color }) {
    const [total, setTotal] = useState('--');
    const [nonce, setNonce] = useState('--');

    useEffect(() => {
        fetchData();
        return () => {
            didCancel = true;
        };
    }, []);

    const fetchData = async () => {
        try {
            didCancel = false;
            const result = await getHeartBeatsStatsV2();
            const { total_count, last_signed_info } = result;
            console.log(result);
            if (!didCancel) {
                setTotal(total_count ?? 0);
                setNonce(last_signed_info?.nonce ?? 0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="mb-4 flex flex-wrap">
            <div className="w-full mb-4 lg:mb-0 lg:w-1/2 lg:pr-2">
                <div className="common-card theme-bg">
                    <h5 className="text-base theme-text-main">{t('online_proof_data')}</h5>
                    <div className="mt-6">
                        <span className="mr-2 text-3xl font-bold theme-text-main">{total}</span>
                        <span className="text-sm theme-text-sub-main">{t('in_total')}</span>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-2">
                <div className="common-card theme-bg">
                    <h5 className="text-base theme-text-main">{t('online_proof_nonce')}</h5>
                    <div className="mt-6">
                        <span className="text-3xl font-bold theme-text-main">{nonce}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
