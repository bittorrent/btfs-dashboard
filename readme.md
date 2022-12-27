# Usage

:warning: To successfully connect to the BTFS node, you will need to enable the CORS. Follow below commands and then restart the BTFS node.
```
btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://dashboard.btfs.io", "http://127.0.0.1:5001"]'
btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT","GET","POST"]'
```

## Website 
Browse http://dashboard.btfs.io 

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
