# SpringBoot+Redis+Hash课程案例

## 具体实现

### 设置hash的key乱码和value的序列化问题

```java
/**
 * 改写redistemplate序列化规则
 */
@Configuration
public class RedisConfiguration {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 创建一个json的序列化方式
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        // 设置value用jackjson进行处理
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        // 设置key用string序列化方式
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        // 设置hash的键
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        // 设置hash的value序列化
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

```

### 使用Hash完成相关API操作

```java
@RestController
@Log4j2
public class ProductHashController {
    @Autowired
    private RedisTemplate redisTemplate;
    @PostMapping("/hash/product/create")
    public R createProduct(Product product) {
        // 1: 将产品存入到DB数据库中
        // 2: 确定HASH的key
        String key = "course:hash:" + product.getId();
        // 3 :把产品信息转换成map
        Map<String, Object> productMap = R.beanToMap(product);
        // 4: 将产品信息存入到hash中 putall等价于: 批量的 hmset key field1 value1 field2 value2 ....
        this.redisTemplate.opsForHash().putAll(key, productMap);
        // 5: 获取hash中的值
        Object title = this.redisTemplate.opsForHash().get(key, "title");
        Object price = this.redisTemplate.opsForHash().get(key, "price");
        Object description = this.redisTemplate.opsForHash().get(key, "description");
        log.info("从redis缓存中获取的值是：{},{},{}", title, price, description);
        // multiGet类似于：hmget key field1 field2 ...fieldn
        List<Object> list = this.redisTemplate.opsForHash().multiGet(key, Arrays.asList("title", "price", "description"));
        log.info("从redis缓存中获取的值是：{}", list);
        return R.ok();
    }
}
```

#### 创建实体

```java
package com.kuangstudy.entiy;

public class Product {

    private Long id;
    private String title;
    private Double price;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", price=" + price +
                '}';
    }
}

```

#### 创建一个ProductController

```java

@RestController
public class ProductController {

    private static  final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 商品保存
     * @param product
     * @return
     */
    @PostMapping("/hash/product/create")
    public String createProduct(Product product) {

        // 1： redis是基于key-value键值对的 key 唯一- value=hash数据结构. hash结构等价于java中的map
        String key = "product:"+product.getId();
        // 2: 获取hash操作api对象
        HashOperations hashOperations = redisTemplate.opsForHash();

        //一个一个的放，这个就类似于 hset key field value
        //hashOperations.put(key,"id",product.getId());
        //hashOperations.put(key,"title",product.getTitle());
        //hashOperations.put(key,"price",product.getPrice());

        // 批量添加
        Map<String,Object> map = new HashMap<>();
        map.put("id",product.getId());
        map.put("title",product.getTitle());
        map.put("price",product.getPrice());
        hashOperations.putAll(key,map);

        // 5: 获取hash中的值
        Object id = this.redisTemplate.opsForHash().get(key, "id");
        Object title = this.redisTemplate.opsForHash().get(key, "title");
        Object price = this.redisTemplate.opsForHash().get(key, "price");
        log.info("从redis缓存中获取的值是：{},{},{}", title, price, id);

        // multiGet类似于：hmget key field1 field2 ...fieldn
        List<Object> list = this.redisTemplate.opsForHash().multiGet(key, Arrays.asList("title", "price", "description"));
        log.info("从redis缓存中获取的值是：{}", list);

        // todo : 存储到数据库中
        return "success";
    }

}

```

## 上面的代码可以使用String数据结构进行存储吗？

> 理解hash数据和string数据结构差异，也就说我们为什么在一些场景中不使用string，而使用hash 或者未来的list,zset呢？

答案：是可以的，那为什么不用String呢？

在开发场景中，使用不同的数据结构，可以得到不同步性能，以及不同的开发效率和效果。

也让大家分清楚在什么样子的场景下选择什么样子的数据结构最适合。而不是清一色的使用String。

如果使用String数据结构

一般存储数据格式都是json。 请注意这个json是一个字符串。如果将上面的产品代码存储到redis中，如下

```json
key=product:1 \{\"id"\:\1\,\"title"\:\"iphone112\",\"price"\:\"100"\}
```

如果使用hash数据结构

````java
key=product:1 id:1 title iphone12 price 100
````

如果有一个这样的需求：我要对产品product:1，它的价格增加：1000元。怎么处理？如果使用hash就非常的容易

```sh
hincrby product:1 price 1000
```

但是如果你使用string数据结构的话,就非常的麻烦

```java
1: \{\"id"\:\1\,\"title"\:\"iphone112\",\"price"\:\"100"\} 转成product对象
2: product.setPrice(product.getPrice() + 100)
3: redisTemplate.set(key,product);
```

## 总结

Redis存储的对象java一般用String或者Hash都可以进行存储，到底在什么时候使用String？什么时候使用hash呢？

- String的存储在频繁读操作，他的存储结构是json字符串。即把java对象转换为json。然后存入redis中。

- Hash的存储场景应用在频繁写的操作。即:当对象的某个属性频繁修改时，不适合用JSON + String的方式进行存储，因为不灵活，每次修改都要把整个对象转成JSON在进行存储。如果采用hash，就可以针对某个属性进行针对性的单独修改。不用序列化去修改整个对象，比如：产品的库存，架构、浏览数、关注数、评论数、点赞数等在开发中可能经常变动，这个时候就可以使用hash来存储要更优越string。

>[!Note]结论
频繁读操作用string。频繁写入用hash
