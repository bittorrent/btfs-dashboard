import React, { useEffect, useState } from 'react'
import { getHeartBeatsStatsV2 } from 'services/dashboardService.js'
import themeStyle from 'utils/themeStyle.js'
import { t } from 'utils/text.js'

let didCancel = false

export default function HeartBeatsStats({ color }) {
  const [total, setTotal] = useState('--')
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
      const result = await getHeartBeatsStatsV2()
      const {
        total_count,
        last_signed_info,
      } = result
      console.log(result)
      if (!didCancel) {
        setTotal(total_count ?? 0)
        setNonce(last_signed_info?.nonce ?? 0)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <div className="relative pb-4">
        <div className="mx-auto w-full">
          <div className="flex flex-wrap">
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
