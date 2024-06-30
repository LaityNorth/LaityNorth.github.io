import { defineConfig } from 'vitepress'
import { sidebarData } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "知识笔记",
  description: "知识记录",
  themeConfig: {
    // 页面目录
    outlineTitle:'目录',
    outline:[2,6],
    // 头部导航栏
    nav: [
      { text: '文章', link: '/文章/index' },
      { text: '数据库', link: '/数据库/index' },
      { text: 'Redis', link: '/Redis/index' },
      { text: '分布式锁', link: '/分布式锁/index' },
      { text: '消息队列', link: '/消息队列/index' },
      { text: '环境搭建', link: '/环境搭建/index' },
      { text: '踩坑记录', link: '/踩坑记录/index' },
    ],
    // 侧边栏
    sidebar:sidebarData,
  },
  markdown: {
    // markdown显示代码块序号
    lineNumbers: true,
    image: {
      // 默认禁用图片懒加载
      lazyLoading: false
    },
  },
})
