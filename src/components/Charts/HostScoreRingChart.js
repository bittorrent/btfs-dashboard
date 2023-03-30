import React from 'react';
import { t } from 'utils/text.js';

export default function HostScoreRingChart({ color, data }) {
    const scoreConfig = {
        1: {
            color: '#dc4242',
            icon: <i className="fa-solid fa-face-frown"></i>,
            text: 'poor',
        },
        2: {
            color: '#f99600',
            icon: <i className="fa-solid fa-face-meh"></i>,
            text: 'general',
        },
        3: {
            color: '#2ebbb9',
            icon: <i className="fa-solid fa-face-smile"></i>,
            text: 'good',
        },
        4: {
            color: '#06a561',
            icon: <i className="fa-solid fa-face-laugh-squint"></i>,
            text: 'excellent',
        },
    };
    const level = data.level || 1;
    const scoreLevelObj = scoreConfig[level];

    return (
        <div className="py-8 px-6 h-full flex flex-col">
            <h5 className="text-base font-semibold theme-text-main">{t('host_score')}</h5>
            <div className="py-5 flex-grow flex justify-center items-center border-b theme-border-color">
                {!!(data.level && scoreLevelObj) && (
                    <div
                        className="flex justify-center items-center rounded-full"
                        style={{
                            width: 163,
                            height: 163,
                            borderWidth: 12,
                            borderColor: scoreLevelObj.color,
                            color: scoreLevelObj.color,
                        }}>
                        <div className="flex flex-col items-center">
                            <div style={{ fontSize: 60, lineHeight: 1 }}>{scoreLevelObj.icon}</div>
                            <div className="mt-2 text-base font-bold leading-none">{t(scoreLevelObj['text'])}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="px-1 pt-4 text-xs theme-text-sub-main">
                <div className="mb-2">{t('last_updated')}</div>
                <div>{data.lastUpdated ? new Date(data.lastUpdated).toISOString() : '--'}</div>
            </div>
        </div>
    );
}
