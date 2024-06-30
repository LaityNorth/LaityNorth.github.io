---
title: "基于Redis的Set数据结构实现抽奖功能"
---

# 基于Redis的Set数据结构实现抽奖功能


## 分析

比如这个时候，公司年底要做年会所有的员工都要参与抽奖的环节。比如是平台的产品要进行抽奖活动。这个时候我们可以利用redis中的set集合中的spop来实现。

spop方法的特征是：抽奖成功的人会自动从集合中删除。也就是获取到了奖品了这个小伙就不在继续参与抽奖。

>[!tip] spop命令
> spop命令：具有随机返回元素，元素从集合中删除该元素

## 抽奖

- 把公司的的小伙伴全部添加到集合中列表中
- 然后调用spop即可

## 具体实现


### 初始化名单数据

```java
@Service
public class SpopRandomSetService {

    private static final Logger log = LoggerFactory.getLogger(SpopRandomSetService.class);


    @Autowired
    private RedisTemplate redisTemplate;

    private static final String SPOP_USER_SETS = "pop:user:set";


    // 01、把公司的的小伙伴全部添加到集合中列表中
    @PostConstruct
    public void initData(){
        log.info("初始化奖品等级信息...");
        // 02：判断一下这个集合是否已经存在
        boolean flag = this.redisTemplate.hasKey(SPOP_USER_SETS);
        //03：防止程序开发人员自己作弊
        if (!flag) {
            // 03、获取所有员工的信息
            List<Integer> initDataList = initDataList();
            // 04、把员工信息写入到redis中 sadd key data
            initDataList.forEach(data -> this.redisTemplate.opsForSet().add(SPOP_USER_SETS, data));
        }
    }

    /**
     * 模拟100用户抽奖
     * 比如：某公司搞年会，参与的小伙伴要进行抽奖，这个时候我们就把所有参与的小伙伴
     * 加入到set集合中即可。比如把小伙伴的ID或者工号加入到集合中。
     * @return
     */
    private List<Integer> initDataList() {
        // todo : 这里是从数据库里面来，你把你公司里面所有的员工从数据表中全部查询出来
        List<Integer> listdata = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            listdata.add(i + 1);
        }
        return listdata;
    }


    /**
     * 随机抽取一个用户出来
     * @return
     */
    public int start(){
        return (int)redisTemplate.opsForSet().pop(SPOP_USER_SETS);
    }
}

```


### 具体抽奖的方法

```java
/**
 * 随机抽取一个用户出来
 * @return
 */
public int start(){
    return (int)redisTemplate.opsForSet().pop(SPOP_USER_SETS);
}
```

### 抽奖的接口测试

```java
@RestController
public class SpopRandomSetController {

    @Autowired
    private SpopRandomSetService spopRandomSetService;


    /**
     * 抽奖
     *
     * @return
     */
    @PostMapping("/spop/random/user")
    public int start() {
        return spopRandomSetService.start();
    }
}

```

### 小结

```shell
# 查询集合成员
smembers pop:user:Set
# 查询集合的长度变化
scard pop:user:Set
```

通过上面的分析，spop它是一随机从集合取出一个元素返回，并且从集合中删除该元素。