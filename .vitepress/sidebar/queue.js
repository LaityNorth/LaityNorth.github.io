// 消息队列
const basePath = "/消息队列/"
export default [
    {
        text: 'RabbitMQ',
        items: [
            { text: 'SpringBoot整合RabbitMQ', link: `${basePath}RabbitMQ/SpringBoot整合RabbitMQ`},
            { text: '消息持久化', link: `${basePath}RabbitMQ/RabbitMQ如何通过持久化保证消息不丢失`},
            { text: '死信队列', link: `${basePath}RabbitMQ/RabbitMQ死信队列实战`},
            { text: '可靠消费', link: `${basePath}RabbitMQ/SpringBoot整合RabbitMQ的实战开发问题可靠消费问题`},
            { text: '可靠生产', link: `${basePath}RabbitMQ/SpringBoot整合RabbitMQ的实战开发问题可靠生产问题`},
            { text: '解决消息堆积丢失问题', link: `${basePath}RabbitMQ/RabbitMQ解决消息堆积和消息丢失问题`},

        ]
    },
    {
        text: 'RocketMQ',
        // collapsed: false,
        item: [

        ]
    },
]