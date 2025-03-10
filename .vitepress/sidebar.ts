import article from './sidebar/article'
import db from './sidebar/db'
import redis from './sidebar/redis'
import distributedLock from './sidebar/distributedlock'
import queue from './sidebar/queue'
import recorder from './sidebar/recorder'
import environment from './sidebar/environment'
import design from './sidebar/design'

export const sidebarData = {
    "/文章/": article,
    "/设计模式/": design,
    "/数据库/": db,
    "/Redis/": redis,
    "/分布式锁/": distributedLock,
    "/消息队列/": queue,
    "/踩坑记录/": recorder,
    "/环境搭建/": environment,
}