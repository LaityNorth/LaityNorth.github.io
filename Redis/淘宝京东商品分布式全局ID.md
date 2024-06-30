---
title: '分布式全局ID'
---

### 分布式ID的概述

 在项目开发中，随着业务的不断发展数据日增大。这个时候就会出现数据表的分库分表的操作。一旦进行了分库和分表操作。传统的id就失去了意义。所以需要分布式全局ID

### 全局分布式唯一ID的特点

1.全局唯一性，不能出现重复的ID

2.单调递增，保证下一个ID一定大于上一个ID

3.范围趋势递增。在一个时间段内，生成的ID是递增趋势的比如：202012120001 202012120002….第二天的时候又要从1开始计数。202012130001 202012130002…..

4.安全性，在不同的领域中我们有些业务不要出现连续的递增，可以很好的保护数据格式和形态。因为很容易让竞争对手套取数据。

- 淘宝订单号：给用户看（安全）
- 连续规则的）给自己内部小伙伴ID）
在分布式系统中有一个非常出门的定理：CAP定理、在分布式系统，我们不可能完成保证你系统数据完全一致性。我们只能容器出错，能到最终达到一致性。


### 分布式全局唯一ID实现方式

- UUID

 UUID是基于当前时间、计数器（counter）和硬件标识（通常为[无线网卡](https://baike.baidu.com/item/无线网卡/292243)的[MAC地址](https://baike.baidu.com/item/MAC地址/1254181)）等数据计算生成的

```java
package com.kuangstudy.utils;

import java.util.UUID;

/**
 * @description:
 * @author: xuke
 * @time: 2021/7/3 20:16
 */
public class UuidTest {

    public static void main(String[] args) {
        String s = UUID.randomUUID().toString();
        System.out.println(s);
        System.out.println(s.length());
    }
}
```
> 运行结果:
9f2f8729-7ae7-4f5d-b7f2-b1bb9f0d9123
36

特点：可读性很差，一般很少去使用。可以用命名的图片名字。

- Redis：提供了一个命令：incr ，统计累加，单线程，不会出现重复。
- Twitter的雪花算法
```java
/**
 * Twitter_Snowflake<br>
 * SnowFlake的结构如下(每部分用-分开):<br>
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 -
 * 000000000000 <br>
 * 1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0<br>
 * 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)
 * 得到的值），这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T
 * = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69<br>
 * 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId<br>
 * 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号<br>
 * 加起来刚好64位，为一个Long型。<br>
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)，并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。
 */
@Component
public class SnowflakeIdWorker {

    // ==============================Fields===========================================
    /**
     * 开始时间截 (2015-01-01)
     */
    private final long twepoch = 1420041600000L;

    /**
     * 机器id所占的位数
     */
    private final long workerIdBits = 5L;

    /**
     * 数据标识id所占的位数
     */
    private final long datacenterIdBits = 5L;

    /**
     * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)
     */
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);

    /**
     * 支持的最大数据标识id，结果是31
     */
    private final long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);

    /**
     * 序列在id中占的位数
     */
    private final long sequenceBits = 12L;

    /**
     * 机器ID向左移12位
     */
    private final long workerIdShift = sequenceBits;

    /**
     * 数据标识id向左移17位(12+5)
     */
    private final long datacenterIdShift = sequenceBits + workerIdBits;

    /**
     * 时间截向左移22位(5+5+12)
     */
    private final long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;

    /**
     * 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)
     */
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);

    /**
     * 工作机器ID(0~31)
     */
    private long workerId;

    /**
     * 数据中心ID(0~31)
     */
    private long datacenterId;

    /**
     * 毫秒内序列(0~4095)
     */
    private long sequence = 0L;

    /**
     * 上次生成ID的时间截
     */
    private long lastTimestamp = -1L;

    // ==============================Constructors=====================================

    public SnowflakeIdWorker() {
        this(1L, 2L);
    }

    /**
     * 构造函数
     *
     * @param workerId     工作ID (0~31)
     * @param datacenterId 数据中心ID (0~31)
     */
    public SnowflakeIdWorker(long workerId, long datacenterId) {

        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        }

        if (datacenterId > maxDatacenterId || datacenterId < 0) {
            throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
        }

        this.workerId = workerId;
        this.datacenterId = datacenterId;
    }

// ==============================Methods==========================================

    /**
     * 获得下一个ID (该方法是线程安全的)
     *
     * @return SnowflakeId
     */
    public synchronized long nextId() {
        long timestamp = timeGen();

        // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }

        // 如果是同一时间生成的，则进行毫秒内序列
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            // 毫秒内序列溢出
            if (sequence == 0) {
                // 阻塞到下一个毫秒,获得新的时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }
        // 时间戳改变，毫秒内序列重置
        else {
            sequence = 0L;
        }

        // 上次生成ID的时间截
        lastTimestamp = timestamp;

        // 移位并通过或运算拼到一起组成64位的ID
        return ((timestamp - twepoch) << timestampLeftShift) //
                | (datacenterId << datacenterIdShift) //
                | (workerId << workerIdShift) //
                | sequence;
    }

    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     *
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 返回以毫秒为单位的当前时间
     *
     * @return 当前时间(毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }

// ==============================Test=============================================

    /**
     * 测试
     */
    public static void main(String[] args) {
        SnowflakeIdWorker idWorker = new SnowflakeIdWorker(0, 0);
        for (int i = 0; i < 1000; i++) {
            long id = idWorker.nextId();
            // System.out.println(Long.toBinaryString(id));
            System.out.println(id);
        }

    }
}

```

- 美团的Leaf算法(翻阅资料)

- 百度分布式 ID

### 使用Redis实现分布式全局ID


#### 定义id生成器

````java
@Service
public class RedisCreatorIdService {

    @Autowired
    private RedisTemplate redisTemplate;

    public Long getRedisId(String key){
        // 1：给商品表添加一个分布式ID
        RedisAtomicLong entityIdCounter = new RedisAtomicLong(key, redisTemplate.getConnectionFactory());//0
        // 计数器累加
        Long increment = entityIdCounter.incrementAndGet();
        // 或者
        //Long increment = redisTemplate.opsForValue().increment(key);
        return increment;
    }
}

````

#### 测试调用

```java

@RestController
@Slf4j
public class RedisCreatorIdController {

    @Autowired
    private RedisCreatorIdService redisCreatorIdService;

    @GetMapping("/redis/id")
    public Long incrmentid() {
        Long productId = redisCreatorIdService.getRedisId("id:creator:product");
        //Long orderId = redisCreatorIdService.getRedisId("id:creator:order");
        log.info("生成的id是:{}",productId);
        return productId;
    }
}
```

