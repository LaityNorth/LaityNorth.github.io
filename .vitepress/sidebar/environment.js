// 环境安装
const basePath = "/环境搭建/"
export default [
    {
        text: 'Linux环境搭建',
        // collapsed: false,
        items: [
            { text: '安装JDK', link: `${basePath}Linux上安装Jdk1.8` },
            { text: '安装Redis', link: `${basePath}Linux上安装Redis` },
            { text: '安装MySQL', link: `${basePath}Linux上安装MYSQL` },
            { text: '安装MongoDB', link: `${basePath}Linux安装MongoDB`},
            { text: '安装Nginx', link: `${basePath}Linux上安装Nginx`},
            { text: '安装RabbitMQ', link: `${basePath}Linux上安装RabbitMQ`},
            { text: '安装Nacos', link: `${basePath}Linux上部署Nacos集群`},
            { text: '安装Jenkins', link: `${basePath}Linux系统安装Jenkins`},
            { text: '安装Docker', link: `${basePath}Linux系统安装Docker`},
            { text: '安装Maven', link: `${basePath}Linux安装Maven`},

        ]
    },
    {
        text: 'Windos环境搭建',
        items: [
            { text: '安装Nacose', link: `${basePath}Windows系统Nacos安装`},
            { text: '安装MongoDB', link: `${basePath}Windows安装MongoDB`},
            { text: '解压安装MySQL', link: `${basePath}Windows解压安装MYSQL5.7`},
        ]
    }
]