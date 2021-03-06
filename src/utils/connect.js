export const connect = async (wallet, dispatch) => {
    if (wallet === 'eth') {
        const web3Provider = window.ethereum;
        let web3js = new window.Web3(web3Provider);
        let balance = await web3js.eth.getBalance(address);
        dispatch({
            type: 'SET_ACCOUNT',
            account: {
                address: address,
                chain: 'eth',
                balance: {
                    ETH: balance
                },
            }
        });
        localStorage.setItem('wallet', 'eth');
    }
    if (wallet === 'tron') {
        let tradeObj = await window.tronWeb.trx.getAccount(
            address,
        );
        let TRX = tradeObj.balance ? tradeObj.balance / 1000000 : 0;
        let BTT = 0;
        if (tradeObj.assetV2) {
            let temp = tradeObj.assetV2.filter(function (item) {
                return item.key === '1002000';
            });
            if (temp.length) {
                BTT = temp[0].value / 1000000;
            }
        }
        dispatch({
            type: 'SET_ACCOUNT',
            account: {
                address: address,
                chain: 'tron',
                balance: {
                    TRX: TRX,
                    BTT: BTT
                }
            }
        });
        localStorage.setItem('wallet', 'tron');
    }
};

export const disConnect = (dispatch) => {
    dispatch({
        type: 'SET_ACCOUNT',
        account: {
            address: null,
            chain: null,
            balance: null,
        }
    });
    localStorage.removeItem('wallet');
};

