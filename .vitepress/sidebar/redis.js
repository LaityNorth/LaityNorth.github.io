// Redis
const basePath = "/Redis/"
export default [
    {
        text: 'Redis数据结构',
        // collapsed: false,
        items: [
            { text: 'String', link: `${basePath}Redis数据结构String`},
            { text: 'List', link: `${basePath}Redis数据结构List`},
            { text: 'Hash', link: `${basePath}Redis数据结构Hash`},
            { text: 'Set', link: `${basePath}Redis数据结构Set`},
        ]
    },
    {
        text: 'Redis实战案例',
        collapsed: true,
        items: [
            { text: 'String数据结构实战案例', link: `${basePath}Redis String数据类型实战案例`},
            { text: '范围的规则递增全局ID案例', link: `${basePath}基于范围的规则递增(分布式订单编号)`},
            { text: '分布式全局ID案例', link: `${basePath}淘宝京东商品分布式全局ID`},
            { text: 'SpringBoot整合Redis案例', link: `${basePath}SpringBoot连接Redis`},
            { text: 'Redis中使用Lua脚本案例', link: `${basePath}Redis操作Lua脚本`},
            { text: 'Lua脚本限流简单案例', link: `${basePath}SpringBoot+Redis+Lua防止（黑客）IP重复防刷攻击`},
            { text: 'Lua脚本限流注解版案例', link: `${basePath}SpringBoot+Redis+Lua防止（黑客）IP重复防刷攻击-注解版本`},
            { text: 'Hash课程案例', link: `${basePath}SpringBoot+Redis+Hash存储课程信息和相关API学习`},
            { text: 'Hash注册案例', link: `${basePath}Redis的Hash数据结构---实现类似微博用户注册&发送微博`},
            { text: 'Hash购物车案例', link: `${basePath}Redis的Hash数据结构---实现购物车功能`},
            { text: 'Set数据结构实现抽奖案例', link: `${basePath}Redis的Set数据结构---实现抽奖功能`},
            { text: 'Set数据结构实现黑白名单案例', link: `${basePath}Redis的Set数据结构---实现淘宝京东黑白名单的过滤校验器`},
            { text: 'Set数据结构实现关注、粉丝案例', link: `${basePath}Redis的Set数据结构---实现关注和粉丝的分析`},
            { text: 'Set数据结构实现共同好友案例', link: `${basePath}Redis的Set数据结构---实现共同好友的微关系`},
            { text: 'List数据结构实现特价商品案例', link: `${basePath}Redis的List数据结构---实现淘宝京东特价商品列表`},
            { text: '布隆过滤器案例', link: `${basePath}Redis布隆过滤器`},
            { text: '缓存击穿', link: `${basePath}Redis缓存击穿`},
            { text: '缓存穿透', link: `${basePath}Redis缓存穿透`},
            { text: '缓存雪崩', link: `${basePath}Redis缓存雪崩`},


        ]
    }
]