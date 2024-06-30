---
title: "# 基于Redis的Set数据结构实现黑白名单的过滤校验器"
---

# 基于Redis的Set数据结构实现黑白名单过滤校验器


## 分析

我们在做网站开发时候，经常可能会遇到一个恶意评论或者灌水的用户，我们称之为：差评师，这个时候我们就需要对这一类用户进行黑名单过滤。

## 黑名单过滤实现解决方案

黑白名单过滤器是在实际开发中有很多种：比如：用户黑名单，IP黑名单等。在一些场景下，如果仅仅通过数据库DB来进行过滤处理。在并发量小的情况下是没有问题。

但是如果在高并发的场景下，可能就会出现性能瓶颈，这个时候采用Redis来实现是最佳的选择方案。如何进行开发和处理呢？

答案是：Redis中的数据结构Set。

- 先把黑名单的用户数据放入到Redis的集合中或者在举报的时候把用户放入到黑名单中。
- 然后在登录或者评价或者在一些需要限制的地方，通过sismember命令来查询用户是否在黑名单列表中，如果存在就返回1，不存在就返回0.

```shell
sadd user_black_items 1 2 3
sismember user_black_items 1
```

## 实现用户黑名单


- 添加用户到黑名单
- 判断用户是否在黑名单中
- 将用户移除黑名单

```java
@Service
public class BlackUserListService {
    private final static Logger log = LoggerFactory.getLogger(BlackUserListService.class);

    @Autowired
    private RedisTemplate redisTemplate;

    // 用户黑名单的key
    final String USER_BLACK_LIST_KEY = "user:blacklist:set";


    // 1: 添加用户到黑名单中和数据DB中,比如举报
    public void addBlackList(Integer userid) {

    }

    // 2: 判断当前用户是否在黑名单中
    public boolean isBlackList(Integer userid) {

    }

    // 3: 删除黑名单
    public boolean removeBlackList(Integer userid) {

    }
}
```

### 添加黑名单

```java
// 1: 添加用户到黑名单中和数据DB中,比如举报
public Long addBlackList(Integer userid) {
    // 1: 判断一个用户是否在黑名单中，如果在直接返回
    if (this.redisTemplate.opsForSet().isMember(USER_BLACK_LIST_KEY, userid)) {
        return 0L;
    }
    // 2: 如果不在就直接添加到黑名单列表中，其实对应命令 sadd user:blacklist:set 1 2 3
    return this.redisTemplate.opsForSet().add(USER_BLACK_LIST_KEY, userid);
}

```



### 判断当前用户是否在黑名单中

```java
// 2: 判断当前用户是否在黑名单中
public boolean isBlackList(Integer userid) {
    // 对应的命令：sismember user:blacklist:set 1 2 3
    Boolean member = this.redisTemplate.opsForSet().isMember(USER_BLACK_LIST_KEY, userid);
    // member = true 代表用户存在黑名单中 反之，不存在黑名单中
    return member;
}

```

### 删除黑名单

```java
// 3: 删除黑名单
public Long removeBlackList(Integer userid) {
    // 1: 判断一个用户是否在黑名单中，如果在直接返回
    if (!this.redisTemplate.opsForSet().isMember(USER_BLACK_LIST_KEY, userid)) {
        return 0L;
    }
    Long remove = this.redisTemplate.opsForSet().remove(USER_BLACK_LIST_KEY, userid);
    // remove= 0 代表删除失败 remove=1代表用户从黑名单中已经移除成功
    return remove;
}
```

### 定义测试的controller

```java
@RestController
public class BlackUserListController {

    @Autowired
    private BlackUserListService blackUserListService;


    // 1: 添加用户到黑名单中和数据DB中,比如举报
    @PostMapping("/set/black/add")
    public Long addBlackList(Integer userid) {
        return blackUserListService.addBlackList(userid);
    }

    // 2: 判断当前用户是否在黑名单中
    @PostMapping("/set/black/ismember")
    public boolean isBlackList(Integer userid) {
      return blackUserListService.isBlackList(userid);
    }

    // 3: 删除黑名单
    @PostMapping("/set/black/remove")
    public Long removeBlackList(Integer userid) {
        return blackUserListService.removeBlackList(userid);
    }
}

```

### 关于如何将MySQL中的黑名单的数据加载到Redis中

```java
//关于如何将mysql中的黑名单的数据加载到redis中
@PostConstruct
public void initDataToRedis(){
    // 1：这里从数据库mysql中黑名单表查询出来了1000用户
    for (int i = 0; i < 1000; i++) {
        this.redisTemplate.opsForSet().add(USER_BLACK_LIST_KEY, i);
    }
}
```
