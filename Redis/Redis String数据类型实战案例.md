---
title: "String数据类型实战开发 - 新浪微博文章的PV统计"
---

## 场景分析

 使用Redis的计数器来完成文章的统计计数

- 新浪的文章访问
- 微信公众号的文章访问

都有一个浏览数、评论数、转发数等，数量的统计，我们就可以使用string数据结构中的命令`incr`来进行处理和累加。

## 具体的实现分析

![1625234295053](./image/Snipaste_2024-06-29_18-05-28.png)

- 每篇文章都有一个文章ID ：可以用作为的key
- 值就是每篇文章的浏览数即可

```java
redisTemplate.incrment("文章ID")
```

### 使用Redis的计数命令incr key

> [!INFO] 分析
采用incr命令 ，每次累加1<br/>
如果key不存在，那么初始化的值是0，后面执行incr操作都会递增1.比如我为文章1增加计数

```properties
incr bbs:1
(integer) 2
incr bbs:1
(integer) 3
incr bbs:1
(integer) 4
incr bbs:1
(integer) 5
```

### 使用incr实现增加文章浏览量

```java
@Controller
public class ContentController {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * @Description 同步页面渲染
     * @return java.lang.String
    **/
    @GetMapping("/content/detail2/{id}")
    public String contentdetail2(@PathVariable("id") Integer id, ModelMap modelMap) {
        // 1: redis是一个基于key-value内存数据库
        String key = "content:" + id;
        // 2：给每篇文章添加浏览数
        Long viewCount = redisTemplate.opsForValue().increment(key);
        modelMap.put("viewCount", viewCount);
        return "content/detail2";
    }


    /**
     * @Description 异步处理
     * @return java.lang.String
    **/
    @GetMapping("/content/detail/{id}")
    public String contentdetail(@PathVariable("id") Integer id, ModelMap modelMap) {
        modelMap.put("contentid", id);
        return "content/detail";
    }

    /**
     * @Param [contentId]
     * @Description 给文章添加的浏览数
     * @return java.lang.String
     **/
    @ResponseBody
    @PostMapping("/content/viewscount")
    public Long contentView(String contentId) {
        // 1: redis是一个基于key-value内存数据库
        String key = "content:" + contentId;
        // 2：给每篇文章添加浏览数
        Long viewCount = redisTemplate.opsForValue().increment(key);
        // 3: 返回给浏览器
        return viewCount;
    }
}

```