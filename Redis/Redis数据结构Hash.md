---
title: "Redis数据结构-Hash"
---

## Redis Hash数据结构

Redis是基于key-value

key = "course:1" value=hash

key = "course:1" value=string

key = "course:1" value=list

> [!TIP] 简介
> Redis中的数据结构hash，它是**String数据结构的升级版**。就类似于**Java中的Map**,结构如下:
> ```java
> Map<String,Map<String,String>> hash = new HashMap<String,HashMap<String,String>>();
> ```
>每个hash存储的大小，可以存储2的（32-1）次方的键值对（40多亿条）。

## 常见的Hash操作命令

### hset 命令
> [!TIP] 语法
> ```sh
> hset key field value [field value ...]
> ```
> 给hash添加值,类似Java中的map.put(key,value)

案例:

```sh
hset course title java
(integer) 1
```

### hget命令

> [!TIP] 语法
> ```sh
> hget key field
> ```
> 获取hash中key对应的值,类似Java中的map.get(key)

案例:

```sh
hget course:100 title
"java"

```


### hmset命令

> [!TIP] 语法
>```sh
> hmset key field value [field value ...]
>```
>批量给hash添加值

案例:

```sh
hmset course title java1 price 12 detial kec
OK
```

### hmget命令

> [!TIP] 语法
>```sh
> hmget key field [field ...]
>```
>批量获取hash中key对应的值

案例:

```sh
hmget course title price detial
1) "java1"
2) "12"
3) "kec"
```

### hkeys命令
> [!TIP] 语法
>```sh
> hkeys key
>```
> 获取hash所有的key

案例:

```sh
hkeys course
1) "title"
2) "price"
3) "detial"

```

### hvals命令 

> [!TIP] 语法
>```sh
> hvals key
>```
> 获取hash所有的value

```sh
hvals course
1) "java1"
2) "12"
3) "kec"

```

### hgetall命令

> [!TIP] 语法
>```sh
> hgetall key
>```
> 获取hash中所有的filed和value

案例:

```sh
hgetall course
1) "title"
2) "java1"
3) "price"
4) "12"
5) "detial"
6) "kec"
```

### hlen命令

> [!TIP] 语法
>```sh
> hlen key
>```
> 获取hash中元素的个数

案例:

```sh
hlen course
(integer) 3
```

### hincrby命令

> [!TIP] 语法
>```sh
> hincrby key field increment
>```
> 给hash中key对应的field的value递增

案例:

```sh
hincrby course price 1
(integer) 13
hincrby course price 1
(integer) 14
hincrby course price 1
(integer) 15

```

### hincrbyfloat命令

> [!TIP] 语法
>```sh
> hincrbyfloat key field increment
>```
> 给hash中key对应的field的value浮点递增

案例:

```sh
hincrbyfloat course price 1.2
"16.2"
hincrbyfloat course price 1.2
"17.4"
hincrbyfloat course price 1.2
"18.6"
```

### hexists命令

> [!TIP] 语法
>```sh
> hexists key filed
>```
> 判断hash中key对应的field存在与否,字段存在返回1,字段不存在返回0

案例:

```sh
HEXISTS course price
(integer) 1
HEXISTS course address
(integer) 0

```

### hdel命令

> [!TIP] 语法
>```sh
> hdel key field [field ...]
>```
>删除hash中key对应的field元素

案例:

```sh
hdel course title
(integer) 1
```

## 小结

> [!Tip] 建议
在Linux系统中学习Redis的这些命令的时候不要去死记硬背，你可以先输入一个字母，hash开头都是h 开头。然后在不停的按Tab键即可。它自动补全所有的命令。直到找到你需要的位置。
