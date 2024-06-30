import{_ as p,D as e,c as h,j as s,I as n,a,a1 as l,o as k}from"./chunks/framework.DFHaK-wS.js";const r="/assets/image.DGG2bmHz.png",t="/assets/image1.BAq5G2SH.png",E="/assets/Snipaste_2024-06-28_19-41-23.ChfrJi5m.png",d="/assets/Snipaste_2024-06-28_19-43-14.kB5Gus1L.png",c="/assets/Snipaste_2024-06-28_19-43-52.BFMwK3tx.png",b="/assets/Snipaste_2024-06-28_19-44-48.pk7fy9FQ.png",g="/assets/Snipaste_2024-06-28_21-01-35.DbMlu4gR.png",y="/assets/202303071526514.Bv3SvSar.png",u="/assets/202303071528412.D0xUJMPL.png",R=JSON.parse('{"title":"分布式锁","description":"","frontmatter":{"title":"分布式锁"},"headers":[],"relativePath":"分布式锁/index.md","filePath":"分布式锁/index.md"}'),m={name:"分布式锁/index.md"},o=l("",22),F=s("li",null,"如果你项目是集群部署。这种jdk自带的锁就失去意义和价值。",-1),A=s("li",null,"你只能通过：数据库乐观锁，悲观锁，redis的锁，zookeeper锁，redssion的锁解决。",-1),D=l("",6),T=l("",5),C=l("",54),v=s("p",null,"基于数据库级别的",-1),B=s("li",null,[a("乐观锁 "),s("ul",null,[s("li",null,"基于数据库级别的乐观锁，主要是通过在查询，操作共享数据记录时带上一个标识字段(version)，通过version来控制每次对数据记录执行的更新操作。")])],-1),_=l("",3),S=l("",20);function x(q,L,f,P,z,j){const i=e("Badge");return k(),h("div",null,[o,s("ul",null,[s("li",null,[n(i,{type:"tip",text:"Synchronized"}),a(" 和 "),n(i,{type:"tip",text:"Lock"}),a(" ，仅限于单体架构，如果你的项目没有集群部署可以使用。")]),F,A]),D,s("ul",null,[s("li",null,[a("无返回值实现接口"),n(i,{type:"tip",text:"Runnable"})]),s("li",null,[a("继承类 "),n(i,{type:"tip",text:"Thread"}),a(" （不推荐，java是多实现，单一继承）")]),s("li",null,[a("有返回值："),n(i,{type:"tip",text:"Callabled"})])]),T,s("p",null,[a("在传统的单体架构应用时代，针对并发访问共享资源出现数据不一致，即并发安全的问题的时候，一般都是使用"),n(i,{type:"tip",text:"Synchronized"}),a("或者"),n(i,{type:"tip",text:"Lock"}),a("关键字来解决。如下：")]),C,s("ul",null,[s("li",null,[v,s("ul",null,[B,s("li",null,[a("悲观锁 "),s("ul",null,[s("li",null,[a("基于数据级别的悲观锁，这里以MYSQL的innodb为例，它主要通过在访问共享的数据记录时加上"),n(i,{type:"tip",text:"for update"}),a("关键词，表示该共享的数据记录已经被当前线程锁住了，（行级锁，表级别锁，间隙锁），只有当该线程操作完成并提交事务之后，才会释放该锁，从而其他线程才能访问该数据记录。")])])])])]),_]),S])}const I=p(m,[["render",x]]);export{R as __pageData,I as default};
