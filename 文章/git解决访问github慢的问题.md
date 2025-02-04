
# git访问github慢的问题

## 本机git访问github

前提是有科学上网工具，然后配置git的本机代理，配置命令如下：

```bash
git config --global http.proxy http://localhost:端口

```

端口指是本机科学上网软件映射的端口

## 云服务器git访问github

在国内云服务器上ping不通github，导致从云服务器拉取代码出现超时错误。
我的解决办法是配置云服务器的hosts,`vim /etc/hosts`,添加如下内的配置信息：

```bash
140.82.113.4  github.com
199.232.69.194  gibhut.global.ssl.Fastly.net
185.199.108.153 assets-cnd.Github.com
185.199.108.133 objects.githubusercontent.com

```

添加后通过ping命令能ping通github

```bash
ping -c 4 github.com
PING github.com (140.82.113.4) 56(84) bytes of data.
64 bytes from github.com (140.82.113.4): icmp_seq=1 ttl=45 time=228 ms
64 bytes from github.com (140.82.113.4): icmp_seq=2 ttl=45 time=228 ms
64 bytes from github.com (140.82.113.4): icmp_seq=3 ttl=45 time=228 ms
64 bytes from github.com (140.82.113.4): icmp_seq=4 ttl=45 time=228 ms

--- github.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3000ms
rtt min/avg/max/mdev = 228.122/228.252/228.342/0.080 ms
```