## Docker Run MySql

运行MySQL并挂在volume命令如下：

```bash
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -p 3306:3306 \
  -v /usr/local/mysql:/var/lib/mysql \
  mysql:5.7

```