import React from 'react'
import { Progress } from 'antd'

import themeStyle from 'utils/themeStyle.js'
import { t } from 'utils/text.js'
import { switchBalanceUnit } from 'utils/BTFSUtil'
import { PRECISION_RATE } from 'utils/constants'

function SingleCurrency({ item, type, color }) {
  return type === 'sentCheques' ? (
    <div className="w-full relative ">
      <div className={'w-full relative ' + themeStyle.title[color]}>
        <span className="font-bold">{item.cashed}</span>
      </div>
      <div className="relative" style={{ width: item.width }}>
        <Progress
          className={color}
          percent={100}
          showInfo={false}
          strokeWidth={14}
          strokeColor={item.progressColor}
        />
      </div>
    </div>
  ) : (
    <div className="w-full relative">
      <div
        className={'relative  flex justify-between ' + themeStyle.title[color]}
        style={{ width: '80%' }}
      >
        <div>
          <span className="mr-2">{t('cashed')}</span>
          <span className="font-bold">{item.price?.rate ? switchBalanceUnit(item.cashed, item.price.rate * PRECISION_RATE): item.cashed}</span>
          {type !== 'recievedCheques' && item.unit && (
            <span className="font-bold">{item.unit}</span>
          )}
        </div>
        <div>
          <span className="mr-2">{t('uncashed')}</span>
          <span className="font-bold">{item.price?.rate ? switchBalanceUnit(item.unCashed, item.price?.rate * PRECISION_RATE) : item.unCashed}</span>
          {type !== 'recievedCheques' && item.unit && (
            <span className="font-bold">{item.unit}</span>
          )}
        </div>
      </div>
      <div className="relative" style={{ width: item.width }}>
        <Progress
          className={color}
          percent={item.cashedValuePercent}
          showInfo={false}
          strokeWidth={14}
          strokeColor={item.progressColor}
        />
      </div>
    </div>
  )
}

export default function MultipleCurrenyList({ color, type, dataList = [] }) {
  return (
    <div className={'w-full ' + themeStyle.bg[color] + themeStyle.text[color]}>
      {dataList.map((item, index) => {
        return (
          <div key={index} className="w-full mt-8">
            <div className="flex items-center">
              <div>
                <img
                  src={require(`assets/img/${item.icon}.svg`).default}
                  alt=""
                  className="mr-6"
                />
                <div className={'font-bold' + themeStyle.title[color]}>
                  {item.unit}
                </div>
              </div>
              <SingleCurrency item={item} type={type} color={color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
