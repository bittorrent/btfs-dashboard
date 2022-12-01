/*eslint-disable*/
import React, { useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import ClipboardCopy from 'components/Utils/ClipboardCopy'
import { getNodeWalletStats } from 'services/dashboardService.js'
import Emitter from 'utils/eventBus'
import themeStyle from 'utils/themeStyle.js'
import { t } from 'utils/text.js'
import { bttcScanLinkCheck } from 'utils/checks.js'

let didCancel = false

export default function NodeWalletStats({ color }) {
  const [BTTCAddress, setBTTCAddress] = useState('--')
  const [chequeAddress, setChequeAddress] = useState('--')
  const [chequeBookBalance, setChequeBookBalance] = useState(0)
  const [BTTCAddressBTT, setBTTCAddressBTT] = useState(0)
  const [BTTCAddressWBTT, setBTTCAddressWBTT] = useState(0)
  const [_chequeBookWBTT, set_ChequeBookWBTT] = useState(0)
  const [_BTTCAddressBTT, set_BTTCAddressBTT] = useState(0)
  const [_BTTCAddressWBTT, set_BTTCAddressWBTT] = useState(0)
  const [balance10, setBalance10] = useState(0)
  const [tronAddress, setTronAddress] = useState('--')
  const [allCurrencyBalanceList, setAllCurrencyBalanceList] = useState([])

  useEffect(() => {
    fetchData()
    return () => {
      didCancel = true
    }
  }, [])

  useEffect(() => {
    const set = async function () {
      setTimeout(() => {
        fetchData()
      }, 3000)
    }
    Emitter.on('updateWallet', set)
    return () => {
      Emitter.removeListener('updateWallet')
    }
  }, [])

  const fetchData = async () => {
    didCancel = false
    let {
      BTTCAddress,
      chequeAddress,
      chequeBookBalance,
      BTTCAddressBTT,
      BTTCAddressWBTT,
      maxAvailableChequeBookWBTT,
      maxAvailableBTT,
      maxAvailableWBTT,
      balance10,
      tronAddress,
      allCurrencyBalanceList,
    } = await getNodeWalletStats()
    if (!didCancel) {
      unstable_batchedUpdates(() => {
        setBTTCAddress(BTTCAddress)
        setChequeAddress(chequeAddress)
        setChequeBookBalance(chequeBookBalance)
        setBTTCAddressBTT(BTTCAddressBTT)
        setBTTCAddressWBTT(BTTCAddressWBTT)
        set_ChequeBookWBTT(maxAvailableChequeBookWBTT)
        set_BTTCAddressBTT(maxAvailableBTT)
        set_BTTCAddressWBTT(maxAvailableWBTT)
        setBalance10(balance10)
        setTronAddress(tronAddress)
        setAllCurrencyBalanceList(() => allCurrencyBalanceList)
      })
    }
  }

  const onDeposit = (e) => {
    e.preventDefault()
    Emitter.emit('openWithdrawDepositModal', {
      type: 'deposit',
      maxWBTT: _BTTCAddressWBTT,
      allCurrencyBalanceList: allCurrencyBalanceList,
    })
  }

  const onWithdraw = (e) => {
    e.preventDefault()
    Emitter.emit('openWithdrawDepositModal', {
      type: 'withdraw',
      maxWBTT: _chequeBookWBTT,
      allCurrencyBalanceList: allCurrencyBalanceList,
    })
  }

  const onWithdraw10 = (e) => {
    e.preventDefault()
    console.log(tronAddress)
    Emitter.emit('openWithdrawDepositModal', {
      type: 'withdraw10',
      maxBTT: balance10,
      account: tronAddress,
      allCurrencyBalanceList: allCurrencyBalanceList,
    })
  }

  const onTransfer = (e) => {
    e.preventDefault()
    Emitter.emit('openTransferConfirmModal', {
      type: 'transfer',
      maxBTT: _BTTCAddressBTT,
      maxWBTT: _BTTCAddressWBTT,
      allCurrencyBalanceList: allCurrencyBalanceList,
    })
  }

  const onExchange = (e) => {
    e.preventDefault()
    Emitter.emit('openExchangeModal', {
      type: 'exchange',
      maxBTT: _BTTCAddressBTT,
      maxWBTT: _BTTCAddressWBTT,
    })
  }

  const showQR = (e, type) => {
    e.preventDefault()
    if (type === 'Cheque') {
      Emitter.emit('openQRModal', { address: chequeAddress })
    }
    if (type === 'BTTC') {
      Emitter.emit('openQRModal', { address: BTTCAddress })
    }
  }

  return (
    <>
      <div className="relative pb-4">
        <div className="mx-auto w-full">
          <div className="flex flex-wrap gap-x-2">
            <div className="w-full mb-2 xl:mb-0 xl:w-6/12 xl:pr-2">
              <div
                className={
                  'h-full relative break-words rounded md:mb-2 xl:mb-0  ' +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="h-full flex items-center p-4">
                  <div className="relative w-full flex flex-col justify-between">
                    <h5
                      className={
                        'uppercase font-bold ' + themeStyle.title[color]
                      }
                    >
                      BTTC {t('address')}
                      <a
                        onClick={(e) => {
                          showQR(e, 'BTTC')
                        }}
                      >
                        <i className="fas fa-qrcode ml-2"></i>
                      </a>
                      <ClipboardCopy value={BTTCAddress} />
                    </h5>
                    <div className="font-semibold">
                      <a
                        href={bttcScanLinkCheck() + '/address/' + BTTCAddress}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {BTTCAddress}
                      </a>
                    </div>
                    <div className="mt-2">
                      <div className={'font-bold' + themeStyle.title[color]}>
                        BTTC {t('address_balance')}
                      </div>
                      <div className="flex items-center w-1/2 py-2 border-b">
                        <img
                          src={require(`assets/img/btt.svg`).default}
                          alt=""
                          width={35}
                          height={35}
                          className="mr-2 block "
                        />
                        <div
                          className={
                            'font-bold text-xl mr-2 ' + themeStyle.title[color]
                          }
                        >
                          {BTTCAddressBTT}
                        </div>
                        <div className={themeStyle.title[color]}>BTT</div>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap w-full mt-2">
                      {allCurrencyBalanceList.map((item) => {
                        return (
                          <div
                            key={item.unit}
                            className="flex items-center w-1/2 mb-2"
                          >
                            <img
                              src={
                                require(`assets/img/${item.icon}.svg`).default
                              }
                              alt=""
                              className="mr-2 block "
                            />
                            <div
                              className={
                                'font-bold text-xl mr-2 ' + themeStyle.title[color]
                              }
                            >
                              {item.addressValue}
                            </div>
                            <div className={themeStyle.title[color]}>
                              {item.unit}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="transfer_exchange">
                      <button
                        className={
                          'border-1 px-4 py-2 rounded outline-none focus:outline-none mx-2 mt-2 shadow hover:shadow-md inline-flex items-center font-bold ' +
                          themeStyle.bg[color]
                        }
                        type="button"
                        onClick={onTransfer}
                      >
                        {t('transfer')}
                      </button>
                      <button
                        className={
                          'border-1 px-4 py-2 rounded outline-none focus:outline-none mx-2 mt-2 shadow hover:shadow-md inline-flex items-center font-bold ' +
                          themeStyle.bg[color]
                        }
                        type="button"
                        onClick={onExchange}
                      >
                        BTT
                        <i className="fas fa-exchange-alt mx-4"></i>
                        WBTT
                      </button>
                      <button
                        className={
                          'border-1 px-4 py-2 rounded outline-none focus:outline-none mx-2 mt-2 shadow hover:shadow-md inline-flex items-center font-bold ' +
                          themeStyle.bg[color]
                        }
                        type="button"
                        onClick={onWithdraw10}
                      >
                        BTFS 1.0 Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-6/12 xl:pl-2">
              <div
                className={
                  'h-full relative break-words rounded ' +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="h-full flex items-center p-4">
                  <div className="h-full relative w-full flex flex-col justify-between">
                    <div>
                      <h5
                        className={
                          'uppercase font-bold ' + themeStyle.title[color]
                        }
                      >
                        {t('vault_contract_address')}
                        <a
                          onClick={(e) => {
                            showQR(e, 'Cheque')
                          }}
                        >
                          <i className="fas fa-qrcode ml-2"></i>
                        </a>
                        <ClipboardCopy value={chequeAddress} />
                      </h5>
                      <div className="font-semibold">
                        <a
                          href={
                            bttcScanLinkCheck() + '/address/' + chequeAddress
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          {chequeAddress}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className={'font-bold' + themeStyle.title[color]}>
                        {t('vault_contract_balance')}
                      </div>
                      <div className="flex items-center flex-wrap w-full mt-2">
                        {allCurrencyBalanceList.map((item) => {
                          return (
                            <div
                              key={item.unit}
                              className="flex items-center w-1/2 mb-2"
                            >
                              <img
                                src={
                                  require(`assets/img/${item.icon}.svg`).default
                                }
                                alt=""
                                className="mr-2 block "
                              />
                              <div
                                className={
                                  'font-bold text-xl mr-2 ' + themeStyle.title[color]
                                }
                              >
                                {item.bookBalanceValue}
                              </div>
                              <div className={themeStyle.title[color]}>
                                {item.unit}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="withdraw_deposit">
                        <button
                          className={
                            'border-1 px-4 py-2 rounded outline-none focus:outline-none mx-2 mt-2 shadow hover:shadow-md inline-flex items-center font-bold ' +
                            themeStyle.bg[color]
                          }
                          type="button"
                          onClick={onWithdraw}
                        >
                          {t('chequebook_withdraw')}
                        </button>
                        <button
                          className={
                            'border-1 px-4 py-2 rounded outline-none focus:outline-none mx-2 mt-2 shadow hover:shadow-md inline-flex items-center font-bold ' +
                            themeStyle.bg[color]
                          }
                          type="button"
                          onClick={onDeposit}
                        >
                          {t('chequebook_deposit')}
                        </button>
                      </div>
                    </div>
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
