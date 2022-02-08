class TronLink {

    constructor() {
        this.isInstalled = false;
        this.isLogin = false;
        this.tronweb = null;
        setTimeout(() => {
            this.detection();
        }, 500);
    }

    init() {
        this.tronWeb = window.tronWeb;
    }

    detection() {
        if (typeof window.tronWeb !== 'undefined') {
            console.log('Tronlink is installed!');
            this.isInstalled = true;
            this.init();
            if (tronWeb.defaultAddress.base58) {
                this.isLogin = true;
                console.log('Tronlink is login!');
            } else {
                this.isLogin = false;
                console.log('Tronlink is not login!');
            }
        } else {
            console.log('Tronlink is not installed!');
            console.log('Tronlink is not login!');
            this.isInstalled = false;
            this.isLogin = false;
        }
    }

    on(event, callback) {
        window.tronWeb.on(event, (res) => {
            console.log(res);
            callback(res);
        });

        /*
            window.addEventListener('message', (data) => {
                if (data.data.message) {
                    if (data.data.message.action == 'setAccount' || data.data.message.action == 'accountsChanged') {
                        login(localStorage.getItem('wallet'), this.props);
                    }
                }
            })
        */
    }

    connect() {
      
    }

    getContract() {

    }

    signMessage() {

    }
}

const TronLinkClient = new TronLink();

export default TronLinkClient;