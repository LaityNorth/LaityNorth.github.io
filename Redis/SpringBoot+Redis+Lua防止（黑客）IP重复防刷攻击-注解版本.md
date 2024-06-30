---
title: "Redis+Lua限流注解版"
---

## 分析

黑客或者一些恶意的用户为了攻击你的网站或者APP。通过并发用肉机并发或者死循环请求你的接口。从而导致系统出现宕机。

- 针对新增数据的接口，会出现大量的重复数据，甚至垃圾数据会将你的数据库和CPU或者内存磁盘耗尽，直到数据库撑爆为止。
- 针对查询的接口。黑客一般是重点攻击慢查询，比如一个SQL是2S。只要黑客一致攻击，就必然造成系统被拖垮，数据库查询全都被阻塞，连接一直得不到释放造成数据库无法访问。

## 具体实现

现在一个用户在1秒钟之内，只允许请求n次。

## Redis + Lua实现的限流解决方案

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!--这里就是redis的核心jar包-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 新建一个userlimit.lua脚本

这个脚本userlimit.lua，存放于resource/lua目录下

```lua
-- 需求：用户请求在1秒之内，只允许2个请求
-- redis+lua redis基于key-value
-- 限流
-- 获取方法签名特征
local key = KEYS[1]
-- 调用脚本传入的限流大小
local limit = tonumber(ARGV[1])
-- 获取当前流量大小
local count = tonumber(redis.call('get',key) or "0")
-- 是否超出限流阈值
if count + 1 > limit then
    -- 拒绝服务
    return false
else
    -- 没有超过阈值
    -- 设置当前访问的数量 + 1
    redis.call("incr",key)
    -- 设置过期时间
    redis.call("expire",key,ARGV[2])
    return true
end
```

#### 加载lua脚本对象

```java
@Configuration
public class LuaConfiguration {

    /**
     * 将lua脚本的内容加载出来放入到DefaultRedisScript
     * @return
     */
    @Bean
    public DefaultRedisScript<Boolean> limitUserAccessLua() {
        // 1： 初始化一个lua脚本的对象DefaultRedisScript
        DefaultRedisScript<Boolean> defaultRedisScript = new DefaultRedisScript<>();
        // 2: 通过这个对象去加载lua脚本的位置 ClassPathResource读取类路径下的lua脚本
        // ClassPathResource 什么是类路径：就是你maven编译好的target/classes目录
        defaultRedisScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/userlimit.lua")));
        // 3: lua脚本最终的返回值是什么？建议大家都是数字返回。1/0
        defaultRedisScript.setResultType(Boolean.class);
        return defaultRedisScript;
    }

}
```

### 改写RedisTemplate的规则

```java
@Configuration
public class RedisConfiguration {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        // 1: 开始创建一个redistemplate
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        // 2:开始redis连接工厂跪安了
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 创建一个json的序列化方式
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        // 设置key用string序列化方式
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        // 设置value用jackjson进行处理
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        // hash也要进行修改
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
        // 默认调用
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }
}
```

### 使用StringRedisTemplate调用和执行lua

```java
@RestController
public class RateLimiterController {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private DefaultRedisScript<Boolean> limitUserAccessLua;


    /**
     * 限流的处理方法
     * @param userid
     * @return
     */
    @GetMapping("/limit/user")
    public String limitUser(String userid) {
        // 1: 定义key是的列表
        List<String> keysList = new ArrayList<>();
        keysList.add("user:"+userid);
        // 2:执行执行lua脚本限流
        Boolean accessFlag = stringRedisTemplate.execute(limitUserAccessLua, keysList, "1","1");
        // 3: 判断当前执行的结果，如果是0，被限制，1代表正常
        if (!accessFlag) {
           throw  new RuntimeException("server is busy!!!");
        }
        return "scucess";
    }

}

```

## 限流的业务场景

- 抢购
- 秒杀
- 抽奖
- 资源文件的竞争（下载）

考虑一个点：资源少，请求大。你可以考虑使用限流。

## 注解版本限流解决方案

核心知识点：Aop

## 需要定义个切面类

这个切面类的作用主要是用于：具体限流的规则和方案

## 添加Aop的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

```

## 定义切面类

```java
@Aspect
@Component
public class AccessLimiterAspect {

    private static final Logger log = LoggerFactory.getLogger(AccessLimiterAspect.class);

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private DefaultRedisScript<Boolean> limitUserAccessLua;

    // 1: 切入点
    @Pointcut("@annotation(com.kuangstudy.limit.annotation.AccessLimiter)")
    public void cut() {
        System.out.println("cut");
    }

    // 2: 通知和连接点
    @Before("cut()")
    public void before(JoinPoint joinPoint) {

        // 1: 获取到执行的方法
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        // 2:通过方法获取到注解
        AccessLimiter annotation = method.getAnnotation(AccessLimiter.class);
        // 如果 annotation==null，说明方法上没加限流AccessLimiter,说明不需要限流操作
        if (annotation == null) {
            return;
        }
        // 3: 获取到对应的注解参数
        String key = annotation.key();
        Integer limit = annotation.limit();
        Integer timeout = annotation.timeout();

        // 4: 如果你的key是空的
        if (StringUtils.isEmpty(key)) {
            String name = method.getDeclaringClass().getName();
            // 直接把当前的方法名给与key
            key = name+"#"+method.getName();
            // 获取方法中的参数列表

            //ParameterNameDiscoverer pnd = new DefaultParameterNameDiscoverer();
            //String[] parameterNames = pnd.getParameterNames(method);

            Class<?>[] parameterTypes = method.getParameterTypes();
            for (Class<?> parameterType : parameterTypes) {
                System.out.println(parameterType);
            }

            // 如果方法有参数，那么就把key规则 = 方法名“#”参数类型
            if (parameterTypes != null) {
                String paramtypes = Arrays.stream(parameterTypes)
                        .map(Class::getName)
                        .collect(Collectors.joining(","));
                key = key +"#" + paramtypes;
            }
        }

        // 1: 定义key是的列表
        List<String> keysList = new ArrayList<>();
        keysList.add(key);
        // 2:执行执行lua脚本限流
        Boolean accessFlag = stringRedisTemplate.execute(limitUserAccessLua, keysList, limit.toString(), timeout.toString());
        // 3: 判断当前执行的结果，如果是0，被限制，1代表正常
        if (!accessFlag) {
            throw new BusinessException(500, "server is busy!!!");
        }
    }
}
```

## 定义注解

这个注解作用其实就是标记那些个方法需要限流处理

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AccessLimiter {
    // 目标： @AccessLimiter(limit="1",timeout="1",key="user:ip:limit")
    // 解读：一个用户key在timeout时间内，最多访问limit次
    // 缓存的key
    String key();
    // 限制的次数
    int limit() default  1;
    // 过期时间
    int timeout() default  1;
}

```

## 在需要限流的方法上进行限流测试

```java
@RestController
public class RateLimiterController {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private DefaultRedisScript<Boolean> limitUserAccessLua;

    /**
     * 限流的处理方法
     * @param userid
     * @return
     */
    @GetMapping("/limit/user")
    public String limitUser(String userid) {
        // 1: 定义key是的列表
        List<String> keysList = new ArrayList<>();
        keysList.add("user:"+userid);
        // 2:执行执行lua脚本限流
        Boolean accessFlag = stringRedisTemplate.execute(limitUserAccessLua, keysList, "1","1");
        // 3: 判断当前执行的结果，如果是0，被限制，1代表正常
        if (!accessFlag) {
           throw  new BusinessException(500,"server is busy!!!");
        }
        return "scucess";
    }

    /**
     * 限流的处理方法
     * @param userid
     * @return
     * 方案1：如果你的一个方法进行限流：一个方法只允许1秒100请求，key公用
     * 方案2：如果你的一个方法进行限流：某个用户一秒之内允许10个请求，key必须要根据参数的具体值去执行拼接。
     *
     */
    @GetMapping("/limit/aop/user")
    @AccessLimiter(limit = 1,timeout = 1)
    public String limitAopUser(String userid) {
        return "scucess";
    }


    @GetMapping("/limit/aop/user3")
    @AccessLimiter(limit = 10,timeout = 1)
    public String limitAopUse3(String userid) {
        return "scucess";
    }

    /**
     * 限流的处理方法
     * @param userid
     * @return
     * 方案1：如果你的一个方法进行限流：一个方法只允许1秒100请求，key公用
     * 方案2：如果你的一个方法进行限流：某个用户一秒之内允许10个请求，key必须要根据参数的具体值去执行拼接。
     *
     */
    @GetMapping("/limit/aop/user2")
    public String limitAopUser2(String userid) {
        return "scucess";
    }
}

```
