---
title: 'Redis数据结构-String'
---

 Redis操作String数据结构

## 常见操作字符串的方式

查看类型：

```sh
type key
```

查看所有的key

```sh
key *
```

### set命令

> [!TIP] 语法
> SET key value [expiration EX seconds|PX milliseconds] [NX|XX]

> [!DANGER] 语法解释
> - 必填参数key
> - 设置的键value
> - NX: 表示key不存在的时候才设置，如果存在就返回null (存在不做任何操作)
> - XX: 表示key存在的时候才设置，如果不存在就返回null（替换原则）
> - EX: 设置key的过期时间单位是秒,采用ttl查看剩余的秒数

案例：

```shell
set user feifei
get user
# NX 是如果key存在的话，就不进行任何操作，如果不存在就添加
set user feifei NX
# XX 是如果key存在的话，就会进行覆盖，如果不不存在就添加
set user feifei2 XX
## 600s自动过期key=user
set user feifei EX 600
## 600000ms自动过期key=user
set user feifei PX 600000
ttl user
```


### setnx命令


> [!TIP] 语法
> SETNX key value 等同于:SET key value NX

案例:

```shell
# NX 是如果key存在的话，就不进行任何操作，如果不存在就添加
setnx phone 123
(integer) 1
setnx phone 123456
(integer) 0
```


### setex命令

> [!TIP] 语法
> setex key seconds value 等同于:SET key vaue EX seconds

案例:

```shell
setex addres 10 meizhou
OK
get addres
"meizhou"
ttl addres
(integer) 3
ttl addres
(integer) 2

```

### psetex命令

> [!TIP] 语法
> 语法:psetex key milliseconds value 等同于:SET key vaue PX milliseconds

案例:
```shell
psetex name2 10000 xiaoyi
OK
get name2
"xiaoyi"
ttl name2
(integer) 5
ttl name2
(integer) 4
ttl name2
(integer) 4

```

### mset命令

> [!TIP] 语法
> 批量设值 MSET key1 value1 key2 value2 ….

```shell
mset a 1 b 2 c 3
OK
get  a
"1"
get b
"2"
get c
"3"
```

### getset命令

> [!TIP] 语法
> 先查询上一次的值出来，然后在修改掉这个值。

案例:

```shell
set name 123
OK
getset name 456
"123"
get name
"456"
```

### setrange命令

> [!TIP] 作用
> 为某个key，修改偏移量offset后面的value 但是offset不能小于0

案例:

```shell
set user 0123456789
OK
setrange user 1 a
(integer) 10
get user
"0a23456789"
```

### getrange命令

> [!TIP] 作用
> 截取字符串 getrange key start end (start,end可以为负数，如果是负数则反向获取)

案例:

```shell
set user 0123456789
OK
getrange user 0 1
"01"
getrange user 2 5
"2345"

```

### append命令

> [!TIP] 作用
> 字符串拼接 append key appendstr

案例:

```shell
append user xyz
(integer) 13
get user
"0a23456789xyz"

```



### substr命令

> [!TIP] 作用
> 字符串截取 substr key start end

案例:

```shell
substr user 0 10
"0a23456789x"
substr user 0 1
"0a"
```


### incr 命令

> [!TIP] 作用
> 累加计数器 incr key

案例:

```shell
incr bbs_view_1
(integer) 1
incr bbs_view_1
(integer) 2
incr bbs_view_1
(integer) 3
incr bbs_view_1
(integer) 4
incr bbs_view_1
(integer) 5
incr bbs_view_1
(integer) 6
incr bbs_view_1
(integer) 7
incr bbs_view_1
(integer) 8
incr bbs_view_1
(integer) 9

```



### decr命令

> [!TIP] 作用
> 累减计数器 decr key

案例:

```shell
decr bbs_view_1
(integer) 67
decr bbs_view_1
(integer) 66
decr bbs_view_1
(integer) 65
decr bbs_view_1
(integer) 64
decr bbs_view_1
(integer) 63
```



### incrby命令

> [!TIP] 作用
> 指定步长增加 incrby key datacount

案例:

```shell
incrby bbs_view_1 10
(integer) 19
incrby bbs_view_1 10
(integer) 29
incrby bbs_view_1 10
(integer) 39
incrby bbs_view_1 10
(integer) 49
incrby bbs_view_1 10
(integer) 59
incrby bbs_view_1 10
(integer) 69
```

### decrby 命令

> [!TIP] 作用
> 指定步长减少 decrby key data

案例:

```shell
decrby bbs_view_1 10
(integer) 53
decrby bbs_view_1 10
(integer) 43
decrby bbs_view_1 10
(integer) 33
decrby bbs_view_1 10
(integer) 23
decrby bbs_view_1 10
(integer) 13
decrby bbs_view_1 10
(integer) 3
decrby bbs_view_1 10
(integer) -7

```



### incrbyfloat命令

> [!TIP] 作用
> 给浮点数增加对应的值

案例:

```shell
incrbyfloat money 12.5
"12.5"
incrbyfloat iphone_13  12000.99
"12000.99000000000000021"
incrbyfloat iphone_13  -1000.99
"11000"
incrbyfloat iphone_13  1000.99
"12000.99000000000000021"
```

> [!DANGER] 注意
> 注意：官方并没有提供decrbyflaot命令，如果你要递增写负数即可。

## Java中操作Redis String的api

一般使用RedisTemplate来操作Redis

```java
redisTemplate.opsForValue()
```

