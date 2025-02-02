---
title: "Docker运行MySQL"
---

## Docker Run MySql

运行MySQL并挂到用户目录下在volume命令如下：

```bash
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -p 3306:3306 \
  -v ~/mysql/data:/var/lib/mysql \
  mysql:5.7

```