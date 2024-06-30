---
title: "Redis数据结构-List"
---


Redis类型List是一个双端链表的数据结构。容量是：2的32次方减1个元素，即可以存储40亿个元素。
其主要功能有：push、pop、lrange 获取元素等，一般应用在栈、队列、消息队列等场景。

## 常见的List操作命令

### lpush命令

>[!TIP] 语法
>lpush key element [element ...] <br/>
>以开头插入或者尾部插入的方式指定放入到key队列中，可以存放1个或者多个元素。


案例:

```sh
lpush user:list xiaowu xiaozhang xiaofei
(integer) 3
```


### lrange命令

> [!TIP] 语法
> lrange key start end <br/>
> 获取列表指定范围内的元素，如果end等于-1代表截取到最后。

案例:

```sh
lrange user:list 0 -1
1) "111"
2) "xiaofei"
3) "xiaozhang"
4) "xiaowu"
5) "2222"

```


### linsert命令

> [!TIP] 语法
> linsert key before|after  povit value <br/>
> 在指定集合某个元素的的前面或者后面在指定的位置插入元素，注意：povit集合中的元素

插队的业务案例:

```sh
linsert user:list before xiaofei 2222222
(integer) 6
lrange user:list 0 -1
1) "111"
2) "2222222"
3) "xiaofei"
4) "xiaozhang"
5) "xiaowu"
6) "2222"
linsert user:list after xiaofei 2222222
(integer) 7
lrange user:list 0 -1
1) "111"
2) "2222222"
3) "xiaofei"
4) "2222222"
5) "xiaozhang"
6) "xiaowu"
7) "2222"
```

### llen命令

> [!TIP] 语法
> llen key <br/>
> 获取列表的长度

案例:

```sh
llen user:list
(integer) 7

```

### lindex命令

> [!TIP] 语法
> lindex key idnex <br/>
> 通过索引获取列表中的元素

案例:

```sh
lindex user:list 0
"111"
lindex user:list 1
"2222222"
lindex user:list 2
"xiaofei"
lindex user:list 3
"2222222"
```

### lset命令

> [!TIP] 语法
> lset KEY index value <br/>
> 通过指定索引index, 把指定索引位置上的元素修改成value

案例:

```sh
lset user:list 0 aaaa
OK
lrange user:list 0 -1
1) "aaaa"
2) "2222222"
3) "xiaofei"
4) "2222222"
5) "xiaozhang"
6) "xiaowu"
7) "2222"

```

### lrange命令

> [!TIP] 语法
> lrange KEY startindex endindex <br/>
> 截图列表指定区间的元素，其他元素都删除

案例:

```sh
lrange user:list 0 -1
1) "aaaa"
2) "2222222"
3) "xiaofei"
```

### lrem命令

> [!TIP] 语法
> lrem key count element <br/>
> 移除列表元素,就是把集合中的相同的元素进行移除。

案例:

```sh
lrem listkey 2 1
(integer) 2
lrange listkey 0 -1
1) "f"
2) "a"
3) "a"
4) "a"
5) "d"
6) "c"
7) "b"
8) "a"
9) "1"
```

### lpop命令

> [!TIP] 语法
> lpop key count <br/>
> 从队列的头或者尾部弹出元素（返回该元素并从列表中删除该元素）

案例:

```sh
lrange listkey 0 -1
1) "f"
2) "a"
3) "a"
4) "a"
5) "d"
6) "c"
7) "b"
8) "a"
9) "1"
lpop listkey
"f"
lpop listkey 2
1) "a"
2) "a"
rpop listkey
"1"
rpop listkey
"a"
```

### rpoplpush命令

> [!TIP] 语法
> rpoplpush source destination <br/>
> 移除列表的最后一个元素，并将该元素添加到另外一个列表并返回

案例:

```sh
lrange listkey 0 -1
 1) "k"
 2) "g"
 3) "i"
 4) "h"
 5) "g"
 6) "f"
 7) "e"
 8) "d"
 9) "c"
10) "b"
11) "a"
rpoplpush listkey newlist
"a"
rpoplpush listkey newlist
"b"
rpoplpush listkey newlist
"c"
lrange newlist 0 -1
1) "c"
2) "b"
3) "a"
```

### blpop命令

> [!TIP] 语法
> blpop key [key ...] timeout <br/>
> 移除并获取列表第一个或者最后一个元素，如果列表没有元素会阻塞列表直到等待超时时或者发现可弹出的元素为止。

案例:

```sh
blpop listkey 10
1) "listkey"
2) "e"
blpop listkey 10
(nil)
(10.07s)
```