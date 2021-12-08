# Usage

:warning: To successfully connect to the BTFS node, you will need to enable the CORS. You can do so by
setting `cors-allowed-origins: ['*']` in the BTFS config file and then restart the BTFS node.


## Docker
Run docker image and browse http://localhost:3000

```sh
docker run -d -p 127.0.0.1:3000:3000 ghcr.io/bittorrent/btfs-dashboard:master
```

## Docker: Build yourself
Run docker image and browse http://localhost:3000
```sh
git clone https://github.com/bittorrent/btfs-dashboard.git

cd  btfs-dashboard

docker build -t btfs-dashboard .

docker run -d -p 127.0.0.1:3000:3000  btfs-dashboard
```
## Development

Step 1: install node.js
https://nodejs.org/en/

Step 2

```sh
git clone https://github.com/bittorrent/btfs-dashboard.git

cd  btfs-dashboard

npm install

npm start
```