# SpringBoot整合RabbitMQ - Fanout工作模型

RabbitMQ的工作模型：[官方文档](https://www.rabbitmq.com/getstarted.html)

## 1、依赖

```xml
<!-- 引入 RabbitMQ 依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```



## 2、配置RebbitMQ配置文件

``` yaml
spring:
  rabbitmq:
    host: 47.103.73.17 # RabbitMQ服务地址
    port: 15672 # 端口
    username: root # 账号
    password: lxk11824. # 密码
    virtual-host: /
```



## 3、配置RabbitMQ Configuration

```java
@Configuration
@Slf4j
public class RabbitTemplateConfiguration {

    // 设置RabbitMQ的链接工厂实例
    @Autowired
    private CachingConnectionFactory connectionFactory;


    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public RabbitTemplate rabbitTemplate() {
        // 定义RabbitMQ消息操作组件实例
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        // 设置发送的格式
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        return rabbitTemplate;
    }
}
```

## 4、使用Java代码创建RabbitMQ的交换机、路由key以及队列，并进行绑定

```java
@Configuration
public class FanoutOrderRabbitMQConfiguration {

    /**
     * rabbitmq遵循的:amqp协议：
     *         - producer 生产者
     *             - connection 连接(spring框架已经处理好了)
     *             - channel 通道(spring框架已经处理好了)
     *                 - spring容器会利用starter机制会把rabbitmq进行服务的连接和初始化，会产生一个模板对象RabbitTemplate
     *                 - RabbitTemplate可以取完成消息的投递的工作
     *             - exchange 交换机(如果代码中没有指定交换机：就会走到默认的交换机进行投递消息)
     *             - routingkey 路由key（条件过滤的规则，可以为空，为空就是：Publish/Subscribe,direct,topic）
     *             - bingding 绑定 (负责：把交换机和路由和queue进行捆绑)
     *             - queue 队列 最终数据存储的地方（持久化问题）
     *         - consumer 消费者
     */
    // 定义一个交换机
    public static final String FANOUT_ORDER_EXCHANGE = "pug.mq.fanout.order.ex";
    // 定义一个路由key
    public static final String FANOUT_ORDER_ROUTEING_KEY = "";
    // 定义一个订单mongodb队列
    public static final String FANOUT_ORDER_MONGO_QUEUE = "pug.mq.fanout.order.mongo.queue";
    // 定义一个订单es队列
    public static final String FANOUT_ORDER_ES_QUEUE = "pug.mq.fanout.order.es.queue";

    /**
     * 创建fanout模型交换机
     * @return
     */
    @Bean
    public Exchange orderExchange(){
        return ExchangeBuilder.fanoutExchange(FANOUT_ORDER_EXCHANGE).durable(true).build();
    }

    /**
     * 创建队列queue,mongodb
     * @return
     */
    @Bean
    public Queue orderMongoQueue(){
        return QueueBuilder.durable(FANOUT_ORDER_MONGO_QUEUE).build();
    }

    /**
     * 创建队列queue,mongodb
     * @return
     */
    @Bean
    public Queue orderEsQueue(){
        return QueueBuilder.durable(FANOUT_ORDER_ES_QUEUE).build();
    }

    /**
     * 将队列与交换机进行绑定，并设置路由key
     * @return
     */
    @Bean
    public Binding orderFanoutMongoBinding() {
        return BindingBuilder
                .bind(orderMongoQueue())
                .to(orderExchange())
                .with(FANOUT_ORDER_ROUTEING_KEY).noargs();
    }

    /**
     * 将队列与交换机进行绑定，并设置路由key
     * @return
     */
    @Bean
    public Binding orderFanoutEsBinding() {
        return BindingBuilder
                .bind(orderEsQueue())
                .to(orderExchange())
                .with(FANOUT_ORDER_ROUTEING_KEY).noargs();
    }

}
```

## 5、RabbitMQ 生产者生产消息

```java
@Service
@Slf4j
public class OrderFanoutService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 模拟下单
     * @param orderId
     */
    public void makeorder(Long orderId) {
        // s
         rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        // 1: 指定交换机
        rabbitTemplate.setExchange(FanoutOrderRabbitMQConfiguration.FANOUT_ORDER_EXCHANGE);
        // 2: 指定路由key
        rabbitTemplate.setRoutingKey(FanoutOrderRabbitMQConfiguration.FANOUT_ORDER_ROUTEING_KEY);
        // 3: 发送消息指定参数
        rabbitTemplate.convertAndSend(orderId, new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws AmqpException {
                // 设置消息的附属信息，来达到延时或者限制的目的
                MessageProperties messageProperties = message.getMessageProperties();
                //messageProperties.setExpiration("10000");
                return message;
            }
        });
        log.info("pug fanout order send success ,message is :{}", orderId);

    }
}
```

## 6、RabbitMQ消费消费消息

```java
@Service
@Slf4j
public class OrderFanoutConsumService {

    @RabbitListener(queues = {FanoutOrderRabbitMQConfiguration.FANOUT_ORDER_MONGO_QUEUE})
    public void ordermonodbmessage(@Payload Long orderId, Message message, Channel channel) {
        log.info("***************pug fanout order mongodb message is :{}", orderId);
    }

    @RabbitListener(queues = {FanoutOrderRabbitMQConfiguration.FANOUT_ORDER_ES_QUEUE})
    public void orderesmessage(@Payload Long orderId, Message message, Channel channel) {
        log.info("================pug fanout order es message is :{}", orderId);
    }
}
```
