---
title: " SpringBoot+Redis+Lua防止（黑客）IP重复防刷攻击"
---


## 分析

黑客或者一些恶意的用户为了攻击你的网站或者APP。通过并发用肉机并发或者死循环请求你的接口。从而导致系统出现宕机。

- 针对新增数据的接口，会出现大量的重复数据，甚至垃圾数据会将你的数据库和CPU或者内存磁盘耗尽，直到数据库撑爆为止。
- 针对查询的接口。黑客一般是重点攻击慢查询，比如一个SQL是2S。只要黑客一致攻击，就必然造成系统被拖垮，数据库查询全都被阻塞，连接一直得不到释放造成数据库无法访问。

## 具体实现步骤

具体要实现和达到的效果是：

需求：在10秒内，同一IP 127.0.0.1 地址只允许访问30次。

最终达到的效果：

```java
 Long execute = this.stringRedisTemplate.execute(defaultRedisScript, keyList, "30", "10");
```

分析：keylist = 127.0.0.1  expire 30  incr

- 分析1：用户ip地址127.0.0.1 访问一次 incr
- 分析2：用户ip地址127.0.0.1 访问一次 incr
- 分析3：用户ip地址127.0.0.1 访问一次 incr
- 分析4：用户ip地址127.0.0.1 访问一次 incr
- 分析10：用户ip地址127.0.0.1 访问一次 incr

判断当前的次数是否以及达到了10次，如果达到了。就时间当前时间是否已经大于30秒。如果没有大于就不允许访问，否则开始设置过期

### 新增iplimit.lua文件

```lua
-- 为某个接口的请求IP设置计数器，比如：127.0.0.1请求课程接口
-- KEYS[1] = 127.0.0.1 也就是用户的IP
-- ARGV[1] = 过期时间 30m
-- ARGV[2] = 限制的次数
local limitCount = redis.call('incr',KEYS[1]);
if limitCount == 1 then
    redis.call("expire",KEYS[1],ARGV[1])
end
-- 如果次数还没有过期，并且还在规定的次数内，说明还在请求同一接口
if limitCount > tonumber(ARGV[2]) then
    return 0
end

return 1
```

### 具体实现

````java
@RestController
public class IpLuaController {

    private static final Logger log = LoggerFactory.getLogger(IpLuaController.class);

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private DefaultRedisScript<Long> iplimitLua;

    @PostMapping("/ip/limit")
    public String luaupdateuser(String ip) {
        String key = "user:" + ip;
        // 1: KEYS对应的值,是一个集合
        List<String> keysList = new ArrayList<>();
        keysList.add(key);
        // 2：具体的值ARGV 他是一个动态参数，起也就是一个数组
        // 10 代表过期时间 2次数，表述：10秒之内最多允许2次访问
        Long execute = stringRedisTemplate.execute(iplimitLua, keysList,"10","100");
        if (execute == 0) {
            log.info("1----->ip:{},请求收到限制", key);
            return "客官，不要太快了服务反应不过来...";
        }
        log.info("2----->ip:{},正常访问，返回课程列表", key);
        return "正常访问，返回课程列表 " + key;
    }
}

````