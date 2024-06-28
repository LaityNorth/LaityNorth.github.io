---
title: 'Redisson分布式锁案例'
---

# 基于Redisson的方式实现分布式锁 



## 概述

官网：[Redisson官网](https://redisson.org/)

快速入门：[快速入门地址](https://github.com/redisson/redisson#quick-start)

文档：[文档地址](https://github.com/redisson/redisson/wiki/%E7%9B%AE%E5%BD%95)

Redisson是一个在Redis的基础上实现的Java驻内存数据网格（In-Memory Data Grid）。它不仅提供了一系列的分布式的Java常用对象，还提供了许多分布式服务。其中包括
    `BitSet`, `Set`, `Multimap`, `SortedSet`, `Map`, `List`, `Queue`, `BlockingQueue`, `Deque`, `BlockingDeque`, `Semaphore`, `Lock`, `AtomicLong`, `CountDownLatch`, `Publish / Subscribe`, `Bloom filter`, `Remote service`, `Spring cache`, `Executor service`, `Live Object service`, `Scheduler service`
Redisson提供了使用Redis的最简单和最便捷的方法。Redisson的宗旨是促进使用者对Redis的关注分离（Separation of Concern），从而让使用者能够将精力更集中地放在处理业务逻辑上。


## SpringBoot整合Redisson

### 依赖

```xml
<!-- redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <exclusions>
        <exclusion>
            <groupId>io.lettuce</groupId>
            <artifactId>lettuce-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.8.0</version>
</dependency>
<!-- redisson -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.17.0</version>
</dependency>
```

### 初始化Redisson的客户端连接

```properties
#redisson配置
redisson.host.config=redis://120.77.34.190:6379
```

```java
package com.pug.lock.config; /**
 * Created by Administrator on 2019/4/27.
 */

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Redisson相关开源组件自定义注入
 *
 **/
@Configuration
public class RedissonConfig {

    @Autowired
    private Environment env;

    /**
     * 自定义注入配置操作Redisson的客户端实例
     *
     * @return
     */
    @Bean
    public RedissonClient config() {
        //创建配置实例
        Config config = new Config();
        //可以设置传输模式为EPOLL，也可以设置为NIO等等
        //config.setTransportMode(TransportMode.NIO);
        //设置服务节点部署模式：集群模式；单一节点模式；主从模式；哨兵模式等等
        //config.useClusterServers().addNodeAddress(env.getProperty("redisson.host.config"),env.getProperty("redisson.host.config"));
        // “时间狗” 自动延长锁执行时间，防止死锁的一种机制
        //config.setLockWatchdogTimeout(30000L);
        config.useSingleServer()
                // 设置密码
                .setPassword("mkxiaoer1986.")
                // 你业务选择redis的db库
                .setDatabase(6)
                // redis的单节点地址
                .setAddress(env.getProperty("redisson.host.config"))
                // 保持tcp链接
                .setKeepAlive(true);
        //创建并返回操作Redisson的客户端实例
        return Redisson.create(config);
    }
}
```

### 使用redisson的功能–用户注册

```java
 @Autowired
    private RedissonClient redissonClient;

    @Override
    public void regUserRedissionLock(UserRegVo userRegVo) {
        // D yykk_lock 1 ?--晚于 A B C
        // 1: 设置redis的sexnx的key，考虑到幂等性，这个key有如下做法
        // 前提是：前userRegVo.getUserName()必须唯一的，
        // 为什么这样要唯一：A 注册 T1 T2 T3  | B也能够注册 T1 T2 T3 1W A 9999
        // A用户 t1
        String key = "redissolock_" + userRegVo.getUserName();
        // 获redisson分布式锁
        RLock lock = redissonClient.getLock(key);
        try {
            // 访问共享资源前上锁
            // 这里主要通过lock.lock方法进行上锁。
            // 上锁成功，不管何种情况下，10s后会自动释放。
            lock.lock(10, TimeUnit.SECONDS);
            // 根据用户名查询用户实体信息，如果不存在进行注册
            LambdaQueryWrapper<UserReg> userRegLambdaQueryWrapper = new LambdaQueryWrapper<>();
            // 根据用户名查询对应的用户信息条件
            userRegLambdaQueryWrapper.eq(UserReg::getUserName, userRegVo.getUserName());
            // 执行查询语句
            UserReg userReg = this.getOne(userRegLambdaQueryWrapper);
            if (null == userReg) {
                // 这里切记一定要创建一个用户
                userReg = new UserReg();
                // 使用BeanUtils.copyProperties进行两个对象相同属性的的复制和赋值，如果不同自动忽略
                BeanUtils.copyProperties(userRegVo, userReg);
                // 设置注册时间
                userReg.setCreateTime(new Date());
                // 执行保存和注册用户方法
                this.saveOrUpdate(userReg);
            } else {
                // 如果存在就返回用户信息已经存在
                throw new RuntimeException("用户信息已经注册存在了...");
            }
        } catch (Exception ex) {
            log.error("---获取Redisson的分布式锁失败!---");
            throw ex;
        } finally {
            // ---------------------释放锁--不论成功还是失败都应该把锁释放掉
            // 不管发生任何情况，都一定是自己删除自己的锁
            if (lock != null) {
                //释放锁
                log.error("---获取Redisson的分布式锁释放了---");
                lock.unlock();
                // 在一些严格的场景下，也可以调用强制释放锁
                // lock.forceUnlock();
            }
        }
    }
```


在传统的Java单体应用一般都是通过JDK自身提供的synchronized关键字，Lock类等工具控制并发线程对共享资源的访问。这种方式在很长一段时间内确实可以起到很好的保护共享资源的作用，

然而此种方式的服务，系统所在的HOST的jdk也很强的依赖性，如果是在单体架构中是没有问题的，但是在分布式或者集群部署的环境下，服务，系统都是独立，分开部署的，每个而服务实例将拥有自己的独立的HOST，独立的JDK，而这也导致了传统的，通过JDK自身提供的工具控制多线程并发访问共享资源显得捉襟见肘了。

因此分布式锁出现，分布式锁，它并不是一种全新的中间件或者组件，而是一种机制，一种实现方式，甚至可以说是一种解决方案，它指的是在分布式集群部署的环境下，通过锁的机制让多个客户端或者多个服务进程，线程互斥地对共享资源进行访问，从而避免并发带来的安全，和数据不一致等问题。


## Redisson的分布式锁

> 采用redisson实现分布式锁，底层还是使用redis，也是利用redis的原子操作和单线程执行的原理实现分布式锁，

在前面的代码中我们很容易发现，自己定义的redis分布式锁，如果出现了redis节点宕机等情况，而该锁又正好处于被锁住的状态，那么这个锁很有可能或进入到死锁状态，为了避免这个状况的发生，redisson内部提供了一个监控锁的：“time dog” 看门狗，其作用是在redisson实例被关闭之前，不断地延长分布式锁的有效期，在默认情况下，看门狗检查锁的超时时间是30s，当然在实际业务场景中我们可以通过Config.lockWatchDogTimout进行设置。

- redis 重入问题
- redis 获取锁(setnx)和关闭原子性lua (redisson 获取 lua + 关闭lua)

除此之外，redisson中间件还为我们提供了很多实际开发过程中的一些考虑，比如：“并发访问共享资源”的情况，主要包括了：“可以重入锁”，公平锁，联锁，红锁，读写锁，信号量和闭锁等。

不同的分布式锁功能组件实现方式，作用以及适用的应用场景也不一样。接下来着重介绍：redisson的可重入锁来进行说明和展开。

Redisson提供的分布式锁这一功能组件有：“一次性” 与 可重入 两种实现方式，

- 一次性顾名思义是：指的是当前线程如果可以获取到分布式锁，则成功取之，否则拿不到的线程全部永远失败。也就是：“咸鱼永远不翻身”、

- 可重入是指：指的是当前线程如果可以获取到分布式锁，则成功取之，拿不到的线程就会等待一定的时间，它们并不会立即失败，而是会等待一定时间，重新获取分布式锁，“咸鱼也有翻身之日”





## Redisson的一次性锁实战

主要通过RLock的lock方法，它的含义是：在分布式锁的获取过程中，高并发产生的多线程时，如果当前线程获取到分布式锁，其他的线程就会全部失败，获取不到的线程，就像有一道天然的屏障一样，永远地阻隔了该线程与共享资源的相见。

此种方式适合于那些在同一时刻，而且是在很长时间内仍然只允许一个线程访问共享资源的场景，比如：用户注册，重复提交，抢红包、提现等业务场景。在开源中间件Redisson中，主要通lock.lock()方法实现。

```
// 获取锁，一定要执行lock.unlock()才会释放
// 假设A ,B C ,A 拿锁 B,C 不阻塞直接释放调用unlock
lock.lock();

// 获取锁，要么执行lock.unlock()才会释放或者超过了10s自动释放.
// 假设A ,B C ,A 拿锁 B,C 不阻塞直接释放调用unlock
lock.lock(10, TimeUnit.SECONDS);
```

```java
@Autowired
private RedissonClient redissonClient;

@Override
public void regUserRedissionLock(UserRegVo userRegVo) {
    // D yykk_lock 1 ?--晚于 A B C
    // 1: 设置redis的sexnx的key，考虑到幂等性，这个key有如下做法
    // 前提是：前userRegVo.getUserName()必须唯一的，
    // 为什么这样要唯一：A 注册 B也能够注册
    String key = "redissolock_"+userRegVo.getUserName() ;
    // 获redisson分布式锁
    RLock lock = redissonClient.getLock(key);
    try {

        // 访问共享资源前上锁
        // 这里主要通过lock.lock方法进行上锁。
        // 上锁成功，不管何种情况下，10s后会自动释放。
        lock.lock(10,TimeUnit.SECONDS);

        // 根据用户名查询用户实体信息，如果不存在进行注册
        LambdaQueryWrapper<UserReg> userRegLambdaQueryWrapper = new LambdaQueryWrapper<>();
        // 根据用户名查询对应的用户信息条件
        userRegLambdaQueryWrapper.eq(UserReg::getUserName, userRegVo.getUserName());
        // 执行查询语句
        UserReg userReg = this.getOne(userRegLambdaQueryWrapper);
        if (null == userReg) {
            // 这里切记一定要创建一个用户
            userReg = new UserReg();
            // 使用BeanUtils.copyProperties进行两个对象相同属性的的复制和赋值，如果不同自动忽略
            BeanUtils.copyProperties(userRegVo, userReg);
            // 设置注册时间
            userReg.setCreateTime(new Date());
            // 执行保存和注册用户方法
            this.saveOrUpdate(userReg);
        } else {
            // 如果存在就返回用户信息已经存在
            throw new RuntimeException("用户信息已经注册存在了...");
        }
    } catch (Exception ex) {
        log.error("---获取Redisson的分布式锁失败!---");
        throw ex;
    } finally {
        // ---------------------释放锁--不论成功还是失败都应该把锁释放掉
        // 不管发生任何情况，都一定是自己删除自己的锁
        if (lock!=null) {
            //释放锁
            lock.unlock();
            // 在一些严格的场景下，也可以调用强制释放锁
            //
            //
            // lock.forceUnlock();
        }
    }
}
```





## Redisson分布式锁之可重入实战

分布式锁的可重入是指：当高并发产生多线程时，如果当前线程不能获取分布式锁，它并不会立即抛弃，而是会等待一定时间，重新尝试去获取分布式锁，如果可以获取成功，则执行后续操作共享资源的步骤，**如果不能获取到锁而且重试的时间到达了上限，则意味着该线程将被抛弃。**

```properties
lock.tryLock(10,seconds) 表示当前线程在某一个时刻如果能获取到锁，则会在10秒之后自动释放，如果不能获取到锁，则会一直处于进入尝试的状态。

// A线程 拿到锁 时间只有10s中，如果10s执行不完，会自动释放
// B线程不会释放，阻塞在位置，但是它最多只能阻塞100s
注册 1w lock 30s 1
下单 1w lock 30s 0.01s 100s 几千单 key 
lock.tryLock(100,10,seconds) ，表示这个上限是100s
直到尝试的实际达到一个上限  尝试加锁，最多等待·100s  上锁以后10s会自动释放。

```



典型的应用场景就是：商城的高并发抢购商品的业务场景。

众所周知，在商城品台在举办热卖商品的营销活动时，对外一般会选出商品“库存有限” 提醒用户希望可以尽快抢购下单，然后在一般情况下，该热卖商品的实际库存是：“永远”充足的，所有哪怕是在某一时刻出现了超卖现象，商家也会尽快采购商品发货。将库存补足。简单地理解就是，商城平台允许当前不同用户并发的线程请求数大于商品当前的库存，越多越好，当然同一个用户的并的多个线程请求除外，因为这种情况就有点类似于刷单了。故而商城平台的商品抢购流程中，虽然需要保证某一个时刻只能有一个用户对应的一个线程 抢购订单，但是却允许在某一时刻获取不到锁的其他用户线程重新尝试进行获取。

在采用基于中间件Redis的原子操作的实现分布式锁中，如果需要设置线程的可重入性，一般通过while(true)的方式进行，很明显，此种方式不但不够优雅，还很有可能会加重应用系统整体的负担。

而在Redisson里，可重入只需要通过：lock.tryLock()方法就可以实现了。

比如：

```
lock.tryLock(10,seconds) 表示当前线程在某一个时刻如果能获取到锁，则会在10秒之后自动释放，如果不能获取到锁，则会一直处于进入尝试的状态。直到尝试的实际达到一个上限，比如：
lock.tryLock(100,10,seconds) ，表示这个上限是100s
尝试枷锁，最多等待·100s  上锁以后10s会自动释放。

```



```java
//定义Redisson的客户端操作实例
    @Autowired
    private RedissonClient redissonClient;

    /**
     * 处理书籍抢购逻辑-加Redisson分布式锁
     * @param dto
     * @throws Exception
     */
    @Transactional(rollbackFor = Exception.class)
    public void robWithRedisson(BookRobDto dto) throws Exception{
        final String lockName="redissonTryLock-"+dto.getBookNo()+"-"+dto.getUserId();
        RLock lock=redissonClient.getLock(lockName);
        try {
            Boolean result=lock.tryLock(100,10,TimeUnit.SECONDS);
            if (result){
                //TODO：真正的核心处理逻辑

                //根据书籍编号查询记录
                BookStock stock=bookStockMapper.selectByBookNo(dto.getBookNo());
                //统计每个用户每本书的抢购数量
                int total=bookRobMapper.countByBookNoUserId(dto.getUserId(),dto.getBookNo());

                //商品记录存在、库存充足，而且用户还没抢购过本书，则代表当前用户可以抢购
                if (stock!=null && stock.getStock()>0 && total<=0){
                    //当前用户抢购到书籍，库存减一
                    int res=bookStockMapper.updateStockWithLock(dto.getBookNo());
                    //如果允许商品超卖-达成饥饿营销的目的，则可以调用下面的方法
                    //int res=bookStockMapper.updateStock(dto.getBookNo());

                    //更新库存成功后，需要添加抢购记录
                    if (res>0){
                        //创建书籍抢购记录实体信息
                        BookRob entity=new BookRob();
                        //将提交的用户抢购请求实体信息中对应的字段取值
                        //复制到新创建的书籍抢购记录实体的相应字段中
                        entity.setBookNo(dto.getBookNo());
                        entity.setUserId(dto.getUserId());
                        //设置抢购时间
                        entity.setRobTime(new Date());
                        //插入用户注册信息
                        bookRobMapper.insertSelective(entity);

                        log.info("---处理书籍抢购逻辑-加Redisson分布式锁---,当前线程成功抢到书籍：{} ",dto);
                    }
                }else {
                    //如果不满足上述的任意一个if条件，则抛出异常
                    throw new Exception("该书籍库存不足!");
                }
            }else{
                throw new Exception("----获取Redisson分布式锁失败!----");
            }
        }catch (Exception e){
            throw e;
        }finally {
            //TODO：不管发生何种情况，在处理完核心业务逻辑之后，需要释放该分布式锁
            if (lock!=null){
                lock.unlock();

                //在某些严格的业务场景下，也可以调用强制释放分布式锁的方法
                //lock.forceUnlock();
            }
        }
    }

```