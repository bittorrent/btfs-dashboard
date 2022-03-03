import xhr from "axios/index";

class APIClient {
    constructor() {
        this.apiUrl = '';
        this.request = async (url, body, config) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let {data} = await xhr.post(
                        this.apiUrl + url,
                        {
                            ...body
                        },
                        {...config}
                    );

                    resolve(data);
                }
                catch (e) {
                    resolve({
                        Type: 'error',
                        Message: e.response
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        }
    }

    setApiUrl(url) {
        this.apiUrl = url;
    }

    getHostInfo() {
        return this.request('');
    }

}

const Client10 = new APIClient();

export default Client;