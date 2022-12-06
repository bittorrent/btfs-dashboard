/*eslint-disable*/
import React, { useContext, useState } from 'react'
import QRModal from 'components/Modals/QRModal.js'
import OnlineProofStats from 'components/Stats/OnlineProofStats.js'
import OnlineProofStatsV2 from 'components/Stats/OnlineProofStatsV2.js'
import OnlineProofTable from 'components/Tables/OnlineProofTable.js'
import OnlineProofTableV2 from 'components/Tables/OnlineProofTableV2.js'
import { t } from 'utils/text.js'
import { mainContext } from 'reducer'
import { Tooltip } from 'antd'
import themeStyle from 'utils/themeStyle'

const V2 = 2
const V1 = 1

export default function HeartBeats() {
  const { state } = useContext(mainContext)
  const { theme } = state

  const [version, setVersion] = useState(V2)

  const handleClick = () => {
    setVersion(version === V2 ? V1 : V2)
  }

  return (
    <>
      <SwitchVersion version={version} onClick={handleClick} />
      {version === V2 && (
        <>
          <OnlineProofStatsV2 color={theme} />
          <OnlineProofTableV2 color={theme} />
          <QRModal color={theme} />
        </>
      )}
      {version === V1 && (
        <>
          <OnlineProofStats color={theme} />
          <OnlineProofTable color={theme} />
          <QRModal color={theme} />
        </>
      )}
    </>
  )
}

function SwitchVersion({ version, onClick }) {
  const { state } = useContext(mainContext)
  const { theme } = state

  return (
    <div className={`flex justify-end py-2`}>
      <a onClick={onClick}>
        <span className={`text-md font-bold ${themeStyle.text[theme]}`}>{version === V2 ? t('switch_to_v1') : t('switch_to_v2')}</span>
        <span className={`text-sm px-1 ${themeStyle.text[theme]}`}>
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
        </span>
        <Tooltip title={t('switch_v1_v2_tootip')}>
            <span className='text-sm text-blueGray-500'>
              <i className="fa-sharp fa-solid fa-circle-question"></i>
            </span>
        </Tooltip>
      </a>
    </div>
  )
}
