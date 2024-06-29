---
title: "基于Redis的List实现特价商品列表"
---

# 基于Redis的List实现特价商品列表


## 场景

淘宝京东的特价商品列表，这些商品的特点就是

- 商品有限，但是并发量非常的大。
- 要考虑分页

传统的解决方案就是用：数据库db去做，但是在如此大的并发量的情况下。可能就不可取了。一般的做法我们会采用Redis来处理和解决。这些特价商品的数据不不多，而且Redis的List本身也支持分页。是天然处理这种列表的最佳选择解决方案。

如下：

![image-20210712203633359](./image/Snipaste_2024-06-29_22-30-21.png)


## 分析

采用list数据会更好一点，因为List数据结构有：lrange key 0 -1 可以进行数据的分页。

```shell
lpush products p1 p2 p3 p4 p5 p6 p7 p8 p9 p10
(integer) 10
lrange products 0 1
1) "p10"
2) "p9"
lrange products 2 3
1) "p8"
2) "p7"
lrange products 4 5
1) "p6"
2) "p5"

```


## 具体实现

淘宝，京东的热门商品在双11的时候，可能有100多w需要搞活动：程序需要5分钟对特价商品进行刷新。


### ProductListService类

- 初始化的活动的商品信息100个（这个东西肯定是从数据库去查询）
  - @PostContrcut使用
- 查询产品列表信息
  - 换算的分页的起始位置和结束位置

```java
@Service
public class ProductListService {

    private final static Logger log = LoggerFactory.getLogger(ProductListService.class);

    @Autowired
    private RedisTemplate redisTemplate;


    // 数据热加载
    @PostConstruct
    public void initData(){
        log.info("启动定时加载特价商品到redis的list中...");
        new Thread(() -> runCourse()).start();
    }

    public void runCourse() {
        while (true) {
            // 1：从数据库中查询出特价商品
            List<Product> productList = this.findProductsDB();
            // 2：删除原来的特价商品
            this.redisTemplate.delete("product:hot:list");
            // 3：把特价商品添加到集合中
            this.redisTemplate.opsForList().leftPushAll("product:hot:list", productList);
            try {
                // 4: 每隔一分钟执行一遍
                Thread.sleep(1000 * 60);
                log.info("定时刷新特价商品....");
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * 数据库中查询特价商品
     *
     * @return
     */
    public List<Product> findProductsDB() {
        //List<Product> productList = productMapper.selectListHot();
        List<Product> productList = new ArrayList<>();
        for (long i = 1; i <= 100; i++) {
            Product product = new Product();
            product.setId((long) new Random().nextInt(1000));
            product.setPrice((double) i);
            product.setTitle("特价商品" + (i));
            productList.add(product);
        }
        return productList;
    }
}

```

### 商品的数据接口的定义和展示及分页

```java
@RestController
public class ProductListController {

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private ProductListService productListService;

    /**
     * 查询产品信息
     * lrange products 0 1
     * 1) "p10"
     * 2) "p9"
     * lrange products 2 3
     * 1) "p8"
     * 2) "p7"
     * lrange products 4 5
     * 1) "p6"
     * 2) "p5"
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping("/findproducts")
    public List<Product> findProducts(int pageNo, int pageSize) {

        // 1: 从那个集合去查询
        String key = "product:hot:list";
        // 2: 分页的开始结束的换算
        if(pageNo<=0)pageNo = 1;
        int start = (pageNo - 1) * pageSize;
        // 3：计算分页的结束页
        int end = start + pageSize - 1;

        // 4: 根据redis的api去处理分页查询对应的结果
       try {
           List<Product> productList = this.redisTemplate.opsForList().range(key, start, end);
           if(CollectionUtils.isEmpty(productList)){
               //todo: 查询数据库，存在缓存击穿的情况，大量的并发请求进来，可能把数据库冲
               productList = productListService.findProductsDB();
           }
           return  productList;

       }catch ( Exception ex){
           ex.printStackTrace();
           return null;
       }
    }
}
```

## 关于Redis List数据结构分页

```shell
lrange products 0 1
1) "p10"
2) "p9"
lrange products 2 3
1) "p8"
2) "p7"
lrange products 4 5
```

start = 0  end = 1

start = 2  end = 3

start = 4  end = 5

小小技巧：两条两条进行分页。找到规律

程序已知的参数的是：

pageNo = 1 pageSize = 10

pageNo = 2 pageSize = 10

pageNo = 3 pageSize = 10

int start = (pageNo -1) * pageSize

int end = start +pageSize - 1



















