import React, { useContext } from 'react';
import { Progress } from 'antd';
import { mainContext } from 'reducer';
import { switchBalanceUnit } from 'utils/BTFSUtil';
import { CashedItem, UnCashedItem } from './ChequeStats';
import { PROGRESS_COLORS } from 'utils/constants';

const { TRAIL_COLOR, STROKE_COLOR } = PROGRESS_COLORS;

const CurrencyIcon = ({ icon }) => (
  <img src={require(`assets/img/${icon}.svg`).default} width={24} height={24} alt="" className="mr-2" />
);

function SingleCurrency({ item, type, color, index }) {
  let { unit, cashed, unCashed, cashedValuePercent, icon } = item;

  if (type !== 'sentCheques') {
    const rate = item?.price?.rate ?? 1;
    cashed = switchBalanceUnit(cashed, rate);
    unCashed = switchBalanceUnit(unCashed, rate);
  }
  let style = {};
  if (index === 0) {
    style = { borderRightWidth: 1, borderBottomWidth: 1 };
  } else if (index === 1) {
    style = { borderBottomWidth: 1 };
  } else if (index === 2) {
    style = { borderRightWidth: 1 };
  } else if (index === 3) {
    style = {};
  }

  return type === 'sentCheques' ? (
    <div className="w-1/2 p-3 pr-8 inline-flex justify-between items-center theme-border-color" style={style}>
      <div className="w-full">
        {/* title */}
        <div className="flex">
          <CurrencyIcon icon={icon} />
          <div className="font-bold">{unit}</div>
        </div>
        <div>{cashed}</div>
        {/* cash */}
        <div className="w-full" style={{ width: item.width }}>
          <Progress
            className={color}
            percent={100}
            showInfo={false}
            strokeWidth={6}
            strokeColor={item.progressColor}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="w-1/2 p-3 pr-8 inline-flex justify-between items-center theme-border-color" style={style}>
      <div>
        {/* title */}
        <div className="flex">
          <CurrencyIcon icon={icon} />
          <div className="font-bold">{unit}</div>
        </div>
        {/* cash */}
        <div>
          <CashedItem value={cashed} unit={unit} />
          <UnCashedItem value={unCashed} unit={unit} />
        </div>
      </div>
      {/* progress */}
      <div>
        <Progress
          type="circle"
          strokeWidth={3}
          strokeLinecap="butt"
          trailColor={TRAIL_COLOR}
          strokeColor={STROKE_COLOR}
          percent={cashedValuePercent}
          width={45}
        />
      </div>
    </div>
  );
}

export default function MultipleCurrenyList({ color, type, dataList = [] }) {
  const { state } = useContext(mainContext);
  const { theme } = state;
  return (
    <div
      className="w-full p-4 rounded-b-2xl"
      style={{ backgroundColor: theme === 'light' ? '#ECF2FF' : '#130D00' }}>
      {dataList.map((item, index) => {
        return <SingleCurrency item={item} type={type} color={color} index={index} />;
      })}
    </div>
  );
}
