# SAPU Weixin
## 部署指南
1. 安装 nodejs
  - 见 [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/) 和 [NodeSource Node.js Binary Distributions](https://github.com/nodesource/distributions/blob/master/README.md)。
  - 如果是阿里云或者腾讯云这样连接国外网站巨慢的服务器，也可以考虑用它们自己的源下载，见 [腾讯软件源](https://mirrors.cloud.tencent.com/) （不过很多指南已经很老了，所以ubuntu版本可能不太对……自己改一下就好了）。
  - 安装完之后检查一下 `node -v`
2. 安装 mongodb
  - 见 [Install MongoDB Community Edition on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)，其中设置源的那一步可以像上面提到那样子换成国内的源。
  - 安装完之后**不要**直接运行 mongod！要从 systemctl 那边 start 和 enable 服务，不然可能会导致目录里的文件权限出现问题。
  - 检查 `systemctl status mongod`
  - 万一出现服务跑不起来的情况（也是上述 status 为 failed 的情况），检查 mongodb 的日志（一般位于 `\var\log\mongodb\...`；如果是说不能在数据文件夹建立 lock 文件的话，说明是 `\var\lib\mongodb\` 下面的权限出问题了）
  - mongodb 默认监听 27017 端口，可以用 `sudo netstat -tulpn | grep LISTEN` 检查是不是正常监听了。
3. 安装并设置 nginx
  - 直接由 apt 安装 nginx 即可
  - 如果我们有一个域名的话，首先要修改域名的解析记录指向现在的服务器，然后下面的 server_name 也要进行替换。不用域名的话会简单一些，直接在微信公众号的设置里填 **ip+端口**（默认是13000）应该就可以。
  - 接下来我们需要建立一个 conf file 将发到服务器上的请求转发给 node 进程。这一步是先在 `/etc/nginx/sites-available` 建一个 `bot.conf` 文件（名字不是很重要），将以下打下划线的部分替换后写入
```
upstream bot {
    server localhost:__PORT__;
    keepalive 90;
}

server {
    listen          80;
    listen          [::]:80;
    server_name     __DOMAIN__;
    
    location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	proxy_set_header Host $http_host;
    	proxy_set_header X-NginX-Proxy true;
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
    	proxy_max_temp_file_size 0;
    	proxy_pass http://bot;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
    }
}
```
  - 然后我们在 `/etc/nginx/sites-enabled` 做一个软链接到刚才的文件，最后来一步 `nginx -s reload` 载入刚才的改动。
4. clone repo 并安装依赖
  - `git clone https://github.com/sapu-tech/sapu-weixin.git` 会有点慢，耐心等一下
  - `npm ci` 安装依赖
  - 询问之前的负责人要到 secret.json 并放置在和 app.js 一个目录下面
  - `npm i pm2 -g` 安装进程管理器 pm2。全局安装可能有一丢丢权限问题，可以参考 [Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
5. 开启 node 进程
  - 切换到 repo 目录，运行 `pm2 start --env production`
  - 用 `pm2 logs` 可以看日志，也能看到收到的请求和做出的回复
  - 可以在 `sudo tail -f /var/log/nginx/` 下面看 access/error 的 log