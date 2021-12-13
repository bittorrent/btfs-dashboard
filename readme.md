# Usage

:warning: To successfully connect to the BTFS node, you will need to enable the CORS. You can do so by
setting `cors-allowed-origins: ['*']` in the BTFS config file and then restart the BTFS node.

## Testnet 
Browser https://dashboard-test.btfs.io 

## Docker
Run docker image and browse http://localhost

```sh
docker run -d -p 127.0.0.1:80:80 ghcr.io/bittorrent/btfs-dashboard:master
```
## Development

Install node.js and run below command
https://nodejs.org/en/

```sh
git clone https://github.com/bittorrent/btfs-dashboard.git

cd  btfs-dashboard

npm install

npm start
```