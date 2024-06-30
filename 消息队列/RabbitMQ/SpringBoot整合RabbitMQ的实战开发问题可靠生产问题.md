## 1、全局写法 – 配置文件的方式

```yaml
spring:
  rabbitmq:
    host: 120.77.34.190
    port: 5672
    username: admin
    password: admin
    virtual-host: /
    #开启消息的return机制
    publisher-returns: true
    #在需要使用消息的return机制时候，此参数必须设置为true
    template:
      mandatory: true
    #开启消息的confirm机制
    publisher-confirm-type: correlated
```

## 2、全局写法 —配置类的方式

```java
@Configuration
@Slf4j
public class RabbitTemplateConfiguration {

    // 设置RabbitMQ的链接工厂实例
    @Autowired
    private CachingConnectionFactory connectionFactory;


    @Bean
    public RabbitTemplate rabbitTemplate() {
        // 设置消息发送确认机制，生产确认
        connectionFactory.setPublisherConfirmType(CachingConnectionFactory.ConfirmType.CORRELATED);
        // 设置消息发送确认机制，发送成功返回反馈信息
        connectionFactory.setPublisherReturns(true);
        // 定义RabbitMQ消息操作组件实例
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMandatory(true);
        // 设置发送的格式
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        // 设置消息发送确认机制，即发送成功时输出日志
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            // 这里如果能收到回执，说明rabbitmq一定收到了消息。
            //ack == false  代表rabbitmq excahnge/queue没有收到消息
            // ack = true 代表是正常的
            if(!ack){
                log.info("发消息出现了异常...{}",correlationData)
                 //告警 + 冗余(备份)
                return;
            }
            log.info("消息发送成功!!!!,correlationData:{},ack:{},casuse:{}",correlationData,ack,cause);
        });
        // 设置消息发送确认机制，即发送完消息后输出反馈信息，如消息是否丢失等。
        rabbitTemplate.setReturnsCallback((resultMessage) -> {

            log.info("消息确认了:,message:{},replycode:{},replytext:{},exchange：{},routingKey:{}",
                    resultMessage.getMessage().getBody(),resultMessage.getReplyCode(),resultMessage.getReplyText(),resultMessage.getExchange(),resultMessage.getRoutingKey());
        });
        return rabbitTemplate;
    }

}
```

## 3、局部写法 - 发消息类的写法

```java
@Configuration
@Slf4j
public class RabbitTemplateConfiguration {

    // 设置RabbitMQ的链接工厂实例
    @Autowired
    private CachingConnectionFactory connectionFactory;


    @Bean
    public RabbitTemplate rabbitTemplate() {
        // 设置消息发送确认机制，生产确认
        connectionFactory.setPublisherConfirmType(CachingConnectionFactory.ConfirmType.CORRELATED);
        // 设置消息发送确认机制，发送成功返回反馈信息
        connectionFactory.setPublisherReturns(true);
        // 定义RabbitMQ消息操作组件实例
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        // 设置发送的格式
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        return rabbitTemplate;
    }
}

```





```java
@Component
@Slf4j
public class ResponsitoryTopicMQService {

    @Autowired
    private RabbitTemplate rabbitTemplate;


    public void publishMongoDb(PugMessage pugMessage, String routeKey) {
        rabbitTemplate.setMandatory(true);
        // 设置消息发送确认机制，即发送成功时输出日志
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            // 这里如果能收到回执，说明rabbitmq一定收到了消息。
            log.info("消息发送成功!!!!,correlationData:{},ack:{},casuse:{}", correlationData, ack, cause);
        });

        // 设置消息发送确认机制，即发送完消息后输出反馈信息，如消息是否丢失等。
        rabbitTemplate.setReturnsCallback((resultMessage) -> {
            log.info("消息确认了:,message:{},replycode:{},replytext:{},exchange：{},routingKey:{}",
                    resultMessage.getMessage().getBody(), resultMessage.getReplyCode(), resultMessage.getReplyText(), resultMessage.getExchange(), resultMessage.getRoutingKey());
        });
        // 1: 指定交换机
        rabbitTemplate.setExchange(TopicOrderRabbitMQConfiguration.TOPIC_ORDER_EXCHANGE);
        // 2: 指定路由key
        rabbitTemplate.setRoutingKey(routeKey);
        // 3: 发送消息指定参数
        rabbitTemplate.convertAndSend(pugMessage, new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws AmqpException {
                // 设置消息的附属信息，来达到延时或者限制的目的
                MessageProperties messageProperties = message.getMessageProperties();
                messageProperties.setHeader("msgtype", "1");
                //messageProperties.setExpiration("10000");
                return message;
            }
        });
    }


    public void publishESDb(PugMessage pugMessage, String routeKey) {
        rabbitTemplate.setMandatory(true);
        // 设置消息发送确认机制，即发送成功时输出日志 只要你的消息投递到了交换机，就代表以及收到了消息，rabbitserver就会给你一个确认操作.
        // 哪怕投递到了一个不存在的路由key或者交换机中都会进入setConfirmCallback
        // 但是在开发的时候，我们最好还是要判断一个下ack是否收到回执，如果收到rabbItmqserver服务器给与回执ack=true,
        // 代表生产者已经把消息已经到了交换机中
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            if(!ack){
                // 这里什么时候进入：就是交换机没有收到生产者提供的消息就进入到setConfirmCallback,ack就是false
                System.out.println("没有收到rabbitmq server 确认.....");
                return;
            }
            log.info("1--------------------消息发送成功!!!!,correlationData:{},ack:{},casuse:{}", correlationData, ack, cause);
        });

        // 设置消息发送确认机制，即发送完消息后输出反馈信息，如消息是否丢失等。
        //  ReturnCallback消息没有正确到达队列时触发回调，如果正确到达队列不执行
        //
        rabbitTemplate.setReturnsCallback((resultMessage) -> {
            System.out.println("2=================returnCallback触发。消息路由到queue失败===========");
            System.out.println("msg=" + new String(resultMessage.getMessage().getBody()));
            System.out.println("replyCode=" + resultMessage.getReplyCode());
            System.out.println("replyText=" + resultMessage.getReplyText());
            System.out.println("exchange=" + resultMessage.getExchange());
        });

        // 1: 指定交换机
        rabbitTemplate.setExchange(TopicOrderRabbitMQConfiguration.TOPIC_ORDER_EXCHANGE);
        // 2: 指定路由key
        rabbitTemplate.setRoutingKey(routeKey);
        // 3: 发送消息指定参数
        rabbitTemplate.convertAndSend(pugMessage, new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws AmqpException {
                // 设置消息的附属信息，来达到延时或者限制的目的
                MessageProperties messageProperties = message.getMessageProperties();
                messageProperties.setHeader("msgtype", "1");
                //messageProperties.setExpiration("10000");
                return message;
            }
        });
    }
}
```

