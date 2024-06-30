// 分布式锁相关的侧边栏
export default [
    {
        text: '分布式锁',
        // collapsed: false,
        items: [
            { text: '数据库锁案例', link: '/分布式锁/基于数据库的乐观锁和悲观锁' },
            { text: 'Redis分布式锁案例', link: '/分布式锁/基于Redis的方式分布式锁' },
            { text: 'Readisson分布式锁案例', link: '/分布式锁/基于Redisson的方式实现分布式锁' },
            { text: 'Zookeeper分布式锁案例', link: '/分布式锁/基于Zookeeper的方式实现分布式锁' },

        ]
    }
]
