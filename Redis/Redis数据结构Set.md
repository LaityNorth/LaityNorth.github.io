---
title: "Redis数据结构-Set"
---

## set的常用命令

### sadd命令

> [!TIP] 语法
>```sh
> sadd key member [member ...]
>```
> 给集合key中添加元素。如果添加相同元素就会自动过滤

案例:

```sh
sadd users u1
(integer) 1
sadd users u2
(integer) 1
sadd users u3 u4 u5

```


### smembers命令

> [!TIP] 语法
>```sh
> smembers key
>```
> 返回集合中所有的元素

案例:

```sh
smembers users
1) "u4"
2) "u3"
3) "u2"
4) "u1"
5) "u5"
```

### srem命令

> [!TIP] 语法
>```sh
> srem key member [member ...]
>```
> 删除集合中的指定的元素也可以删除多个

案例:

```sh
sadd users u1
(integer) 0
srem users u1 u2 
(integer) 2
srem users u3
(integer) 1
```

### sismember命令

> [!TIP] 语法
>```sh
> sismember key member 
>```
> 查看一个元素member是否存在当前集合中

案例:

```sh
sismember users u4
(integer) 1
sismember users u3
(integer) 0

```

### scard命令

> [!TIP] 语法
>```sh
> scard key
>```
> 返回集合中所有的元素

案例:

```sh
scard users
(integer) 2
smembers users
1) "u4"
2) "u5"
```

### smove命令

> [!TIP] 语法
>```sh
> smove srckey targetkey  member
>```
> 将srckey集合的元素member移动到targetkey集合中

案例:

```sh
smove users blacklist u1
(integer) 1
smove users blacklist u2
(integer) 1
smembers blacklist
1) "u2"
2) "u1"
scard blacklist
(integer) 2

```

### srandmember 命令

> [!TIP] 语法
>```sh
> srandmember key
>```
> 随机返回集合中的一个元素

案例:

```sh
srandmember users 1
1) "u5"
srandmember users 2
1) "u3"
2) "u4"
smembers users
1) "u4"
2) "u5"
3) "u3"

```

### spop命令

> [!TIP] 语法
>```sh
> spop key
>```
> 随机删除集合中的元素，并返回

案例:

```sh
spop users 1
1) "u3"
spop users 1
1) "u4"
smembers users
1) "u5"

```

### sinter命令

> [!TIP] 语法
>```sh
> sinter key [key ...]
>```
> 求多个集合的交集

案例:

```sh
sadd s1 1 2 3 4 5 a
(integer) 6
sadd s2 a b c 2 3 6
(integer) 6
sinter s1 s2
1) "3"
2) "a"
3) "2"

```

### sinterstore命令

> [!TIP] 语法
>```sh
> sinterstore destination key [key ...]
>```
> 求多个集合的交集并放入到targetkey集合中 

案例:

```sh
sinterstore s3 s1 s2
(integer) 3
smembers s3
1) "2"
2) "3"
3) "a"

```

### sunion命令

> [!TIP] 语法
>```sh
> sunion key [key ...]
>```
> 求多个集合的并集

案例:

```sh
sunion s1 s2
1) "3"
2) "a"
3) "5"
4) "c"
5) "2"
6) "1"
7) "6"
8) "4"
9) "b"

```

### sunionstore命令

> [!TIP] 语法
>```sh
> sunionstore targetkey key [key ...]
>```
> 求多个集合的并集并放入到targetkey集合中

案例:

```sh
sunionstore s4 s1 s2
(integer) 9
smembers s4
1) "3"
2) "a"
3) "5"
4) "c"
5) "2"
6) "1"
7) "6"
8) "4"
9) "b"

```

### sdiff命令

> [!TIP] 语法
>```sh
> sdiff key [key ...]
>```
> 求多个集合的差集

案例:

```sh
smembers s1
1) "3"
2) "a"
3) "5"
4) "2"
5) "1"
6) "4"
smembers s2
1) "3"
2) "a"
3) "2"
4) "c"
5) "6"
6) "b"
sdiff s1 s2
1) "1"
2) "4"
3) "5"
sdiff s2 s1
1) "c"
2) "6"
3) "b"

```

### sdiffstore命令

> [!TIP] 语法
>```sh
> sdiffstore targetkey key [key ...]
>```
> 求多个集合的差集并放入到targetkey集合中

案例:

```sh
sdiffstore s5 s2 s1
(integer) 3
smembers s5
1) "c"
2) "6"
3) "b"
```
