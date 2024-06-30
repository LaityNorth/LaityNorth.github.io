const basePath = "/数据库/MySQL/"
export default [
    {
        text: 'MySQL',
        items: [
            { text: '事务基础认识', link: `${basePath}MySQL事务基础认识`},
            { text: '锁', link: `${basePath}MySQL锁` },
            { text: '查询优化', link: `${basePath}MySQL查询优化`},
            { text: '索引优化', link: `${basePath}MySQL索引优化`},
            { text: 'MVCC', link: `${basePath}MySQL多版本并发控制MVCC`},
            { text: 'Redo日志', link: `${basePath}MySQL事务日志之Redo日志` },
            { text: 'Binlog日志', link: `${basePath}MySQL二进制文件Bin log`},
            { text: '主从复制', link: `${basePath}MySQL主从复制` },
        ]
    },
]