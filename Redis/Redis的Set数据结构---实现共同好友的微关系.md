---
title: "基于Redis的Set集合实现共同好友的关系"
---

# 基于Redis的Set集合实现共同好友的关系


## 概述

使用Redis的Set集合实现微博共同好友

在开发中，我们可能需要计算出张三和李四共同关注的人有哪些？也就是关注张三的人和关注李四的人。我们如何通过计算把两个人的关注相同的人找出来。如果我们使用SQL如何进行编写呢？

比如：张三关注了10个人，李四关注了50个人，怎么计算两个人共同关注了那些人。

- 如果使用SQL。一般我们采用in或者not in来实现，但是对于高并发的情况下in和not in可能是不可取的，就算我们优化使用了索引其实也会性能很差。
- 一般的解决方案还是使用：`Redis`。
- 通过Redis的Set集合数据结构，非常适合的存储好友、关注、粉丝和感兴趣的人的集合。然后通过set提供的命令

> [!tip] 分析
> 1、`sinter`命令：获得A和B两个用户共同的好友。<br/>
> 2、`sismember`命令：可以判断某个用户是B的好友。<br/>
> 3、`scard`命令：可以获取好友的数量。


## 具体实现


把张三的关注列表和李四的关注列表

张三的关注列表：followee:user:2

李四的关注列表：followee:user:3

```shell
sinter followee:user:2 followee:user:3
```



```java
@RestController
public class ToggleFollowerController {


    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private FollowerServicee followerServicee;

    /**
     * 求出两个用户共同的好友
     *
     * @param userid1 = 张三
     * @param userid2 = 李四
     * @return
     */
    @PostMapping("/toggle/follow")
    public List<User> follow(Integer userid1, Integer userid2) {
        // 1: 获取redis的set集合对象
        SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();
        // 2 : 获取两个用户的集合
        // 获取张三的关注列表
        String memebers1 = FollowerServicee.FOLLOWEE_SET_KEY + userid1;
        // 获取李四的关注列表
        String memebers2 = FollowerServicee.FOLLOWEE_SET_KEY + userid2;
        // 3: 对张三的关注列表和李四的关注列表就行求交集 sinter  memebers1 memebers2
        Set<Integer> integers = opsForSet.intersect(memebers1, memebers2);
        // 4: 返回共同的好友
        return followerServicee.getUserInfos(integers);
    }
}
```
