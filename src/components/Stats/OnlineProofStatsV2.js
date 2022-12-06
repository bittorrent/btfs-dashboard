/*eslint-disable*/
import React, { useEffect, useState } from 'react'
import { getHeartBeatsStatsV2 } from 'services/dashboardService.js'
import Emitter from 'utils/eventBus'
import themeStyle from 'utils/themeStyle.js'
import { t } from 'utils/text.js'

let didCancel = false

export default function HeartBeatsStats({ color }) {
  const [statusContarct, setStatusContarct] = useState('--')
  const [total, setTotal] = useState('--')
  const [peerId, setPeerId] = useState('--')
  const [nonce, setNonce] = useState('--')

  useEffect(() => {
    fetchData()
    return () => {
      didCancel = true
    }
  }, [])

  const fetchData = async () => {
    try {
      didCancel = false
      const result = await getHeartBeatsStatsV2();
      const { peer_id, status_contract, total_count, last_signature, last_signed_info, last_time } = result;
      console.log(result);
      if (!didCancel) {
        setStatusContarct(status_contract)
        setTotal(total_count)
        setPeerId(peer_id)
        setNonce(last_signed_info?.nonce)
      }
    } catch(e) {
      console.error(e)
    }
  }

  const showQR = (e) => {
    e.preventDefault()
    Emitter.emit('openQRModal', { address: statusContarct })
  }

  return (
    <>
      <div className="relative pb-4">
        <div className="mx-auto w-full">
          <div className="flex flex-wrap">
            {/* <div className="w-full xl:w-6/12 xl:pr-2">
              <div
                className={
                  'relative break-words rounded md:mb-2 xl:mb-0  ' +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="relative w-full h-125-px flex flex-col justify-between p-5 pb-6">
                  <h5
                    className={
                      'uppercase font-bold flex justify-start ' +
                      themeStyle.title[color]
                    }
                  >
                    <div>
                      {t('heart_contract')}
                      <Tooltip
                        placement="bottom"
                        title={<p>{t('heart_contract_des')}</p>}
                      >
                        <i className="fas fa-question-circle text-lg ml-2"></i>
                      </Tooltip>
                    </div>

                    <div className="flex items-center">
                      <a
                        onClick={(e) => {
                          showQR(e, 'BTTC')
                        }}
                      >
                        <i className="fas fa-qrcode ml-2"></i>
                      </a>
                      <ClipboardCopy value={statusContarct} />
                    </div>
                  </h5>
                  <div className="font-semibold">{statusContarct}</div>
                </div>
              </div>
            </div> */}
            <div className="w-full xl:w-6/12 xl:pl-2">
              <div
                className={
                  'relative break-words rounded ' +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="relative w-full h-125-px flex flex-col justify-between p-5">
                  <h5
                    className={'uppercase font-bold ' + themeStyle.title[color]}
                  >
                    {t('online_proof_data')}
                  </h5>
                  <div className="flex justify-center items-center overflow-auto mb-3 font-bold">
                    <p className={'flex-shrink-0' + themeStyle.title[color]}>
                      <span className="text-3xl font-bold">{total}</span>
                      <span> {t('in_total')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-6/12 xl:pl-2">
              <div
                className={
                  'relative break-words rounded ' +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="relative w-full h-125-px flex flex-col justify-between p-5">
                  <h5
                    className={'uppercase font-bold ' + themeStyle.title[color]}
                  >
                    {t('online_proof_nonce')}
                  </h5>
                  <div className="flex justify-center items-center overflow-auto mb-3 font-bold">
                    <p className={'flex-shrink-0' + themeStyle.title[color]}>
                      <span className="text-3xl font-bold">{nonce}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
