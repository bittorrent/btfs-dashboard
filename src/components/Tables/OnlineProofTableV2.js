/*eslint-disable*/
import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment';
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import { getHeartBeatsReportlistV2 } from 'services/dashboardService.js'
import { t } from 'utils/text.js'
import themeStyle from 'utils/themeStyle.js'
import OnlineProofDetailModal from 'components/Modals/OnlineProofDetailModal'
import Emitter from 'utils/eventBus'

let didCancel = false
export default function OnlineProofTable({ color }) {
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState(null)
  const [peerId, setPeerId] = useState('')
  const [bttcAddr, setBttcAddr] = useState('')

  const openDetailModal = (item, bttcAddr) => {
    Emitter.emit('openOnlineProofDetailModal', {item, bttcAddr})
  }

  const pageChange = useCallback((page) => {
    updateTable(page)
  }, [])

  const updateTable = async (page) => {
    didCancel = false
    let { records, total, peer_id, bttc_addr } = await getHeartBeatsReportlistV2(
      (page - 1) * 10,
      10
    )
    if (!didCancel) {
      setList(records)
      setTotal(total)
      setCurrent(page)
      setPeerId(peer_id)
      setBttcAddr(bttc_addr)
    }
  }

  useEffect(() => {
    updateTable(1)
    return () => {
      didCancel = true
    }
  }, [])

  return (
    <>
      <div
        className={
          'relative flex flex-col min-w-0 break-words w-full shadow-lg rounded ' +
          themeStyle.bg[color] +
          themeStyle.text[color]
        }
      >
        <div className="rounded-t mb-0 p-4 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-2 max-w-full flex-grow flex-1">
              <h3 className={'font-semibold ' + themeStyle.title[color]}>
                {t('online_proof_detail')}
              </h3>
              <span>{t('list_des')}</span>
            </div>
            {peerId && <a href={`https://scan.btfs.io/#/node/${peerId}`} target="_blank">
                {t('heart_to_scan')}
            </a>}
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr className="text-xs uppercase whitespace-nowrap">
                <th
                  className={
                    'px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left ' +
                    themeStyle.th[color]
                  }
                >
                  {t('online_proof_node_id')}
                </th>
                <th
                  className={
                    'px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left ' +
                    themeStyle.th[color]
                  }
                >
                  {t('online_proof_sign_time')}
                </th>
                <th
                  className={
                    'px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left ' +
                    themeStyle.th[color]
                  }
                >
                  {t('online_proof_heart_beats')}
                </th>
                <th
                  className={
                    'px-6 border border-solid py-3 border-l-0 border-r-0 font-semibold text-left ' +
                    themeStyle.th[color]
                  }
                >
                  {t('online_proof_table_detail')}
                </th>
              </tr>
            </thead>
            <tbody>
              {list &&
                list.map((items, index) => {
                  return (
                    <tr key={index}>
                      <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        <span>{items.last_signed_info.peer}</span>
                      </td>
                      <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span>{moment.unix(items.last_signed_info.signed_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </td>
                      <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span>{items.last_signed_info.nonce}</span>
                      </td>
                      <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <a onClick={() => openDetailModal(items, bttcAddr)}>
                          {t('check')}
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          {!list && (
            <div className="w-full flex justify-center pt-4">
              <img
                alt="loading"
                src={require('../../assets/img/loading.svg').default}
                style={{ width: '50px', height: '50px' }}
              />
            </div>
          )}
        </div>
        <div>
          <Pagination
            className={'float-right p-4 ' + color}
            simple
            current={current}
            total={total}
            hideOnSinglePage={true}
            onChange={pageChange}
          />
        </div>
      </div>
      <OnlineProofDetailModal/>
    </>
  )
}

OnlineProofTable.defaultProps = {
  color: 'light',
}

OnlineProofTable.propTypes = {
  color: PropTypes.oneOf(['light', 'dark']),
}
