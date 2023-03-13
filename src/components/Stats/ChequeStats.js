import { Progress } from 'antd';
import { PROGRESS_COLORS } from 'utils/constants';

const { TRAIL_COLOR, STROKE_COLOR } = PROGRESS_COLORS;

const CashedUnCashedItem = ({ type, value, unit, percent, fontSize = "14px" }) => {
    const color = type === 'cashed' ? '#06A561' : '#F99600';
    const text = type === 'cashed' ? 'Cashed: ' : 'Uncashed: ';
    const marginBottom = type === 'cashed' ? 6 : 0;
    return (
        <div className="flex items-center unit_color" style={{ fontSize, marginBottom }}>
            <div className="mr-2 rounded" style={{ width: 6, height: 6, backgroundColor: color }}></div>
            <span className="mr-1">{text}</span>
            <span className="mr-1">{value}</span>
            {unit != null && <span className="mr-1">{unit}</span>}
            {percent != null && <span>{`(${percent}%)`}</span>}
        </div>
    );
};

export const CashedItem = props => {
    return <CashedUnCashedItem type="cashed" {...props} />;
};

export const UnCashedItem = props => {
    return <CashedUnCashedItem type="uncashed" {...props} />;
};

export const ChequeMain = ({ title, total, cashed, uncashed, percent, unit, progressIcon }) => {
    return (
        <div className="p-8 flex justify-between items-center ">
            <div>
                <div>{title}</div>
                <div className="mt-6 mb-4 text-3xl font-bold">{total}</div>
                <div>
                    <CashedItem value={cashed} percent={percent} unit={unit} />
                    <UnCashedItem value={uncashed} percent={100 - percent} unit={unit} />
                </div>
            </div>
            <div>
                <Progress
                    type="circle"
                    strokeWidth={20}
                    strokeLinecap="butt"
                    trailColor={TRAIL_COLOR}
                    strokeColor={STROKE_COLOR}
                    percent={percent || 0}
                    width={136}
                />
            </div>
        </div>
    );
};
