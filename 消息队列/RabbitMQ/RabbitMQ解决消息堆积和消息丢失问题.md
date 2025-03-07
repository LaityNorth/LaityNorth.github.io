## 　解决方案

- 增加消费者或后台相关组件的吞吐能力

- 增加消费的多线程处理

- 根据不同的业务实现不同的丢弃任务，选择不同的策略淘汰任务

- 默认情况下，RabbitMQ消费者为单线程串行消费，设置并行消费两个关键属性，他们设置的是对每个消费者在初始化的时候设置的并发消费者个数，prefetchCount 是每次一次性从broker中获取的待消费的消息个数。

- concurrentConsumer

- prefetchConcurrentConsumer

## 消息丢失

解决方案

- 持久化
- 消息确认机制

​    消息在生产者，消息队列，消费者中都有可能丢失。

### 1. 在生产者中丢失

>[!info]原因
> 生产者发送消息成功后，消息队列没有收到消息，消息在从生产者传输到队列的过程中丢失，一般可能是网络不稳定。

>[!tip]​解决方案
>发送方采用消息确认机制，当消息成功被MQ接收到后， 会给生产者发一个确认消息，表示成功接收。如果没有接受成功，重新用定时器去投递

### 2. 在消息队列中丢失

>[!info]原因
> 消息到MQ后， 还没有被消费就被MQ给丢失了。比如MQ服务器宕机或者未进行持久化重启。

>[!tip]解决方案
>持久化交换机，队列和消息。确保MQ服务器重启时仍然能从磁盘恢复对应的队列，交换机和消息，然后我
>们把MQ 做多台分布式集群，防止出现所有的MQ服务器挂掉。

>[!danger]注意
> 交换机，队列和消息都要持久化。

### 3. 在消费者中丢失

>[!info]原因
> 默认消费者消费的时，设置的是自动回复MQ, 收到了消息，MQ会立刻删除自身保存的这条消息，如果消> 息已经在MQ中被删除，但消费者的业务处理出现异常或者宕机，那么就导致改消息没有被成功处理从而导> 致消息丢失。

> [!tip]解决方案:设置手动ACK