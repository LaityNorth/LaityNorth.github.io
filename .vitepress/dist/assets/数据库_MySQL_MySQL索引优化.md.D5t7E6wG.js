import{_ as p,c as l,o as a,a1 as e}from"./chunks/framework.DFHaK-wS.js";const S=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"数据库/MySQL/MySQL索引优化.md","filePath":"数据库/MySQL/MySQL索引优化.md"}'),i={name:"数据库/MySQL/MySQL索引优化.md"},s=e('<h2 id="索引的类型" tabindex="-1">索引的类型 <a class="header-anchor" href="#索引的类型" aria-label="Permalink to &quot;索引的类型&quot;">​</a></h2><p>下面将MySQL支持的索引类型进行简单的总结：</p><ul><li><p>B-Tree索引</p><p>最常见的索引类型，支持大部分存储引擎。</p></li><li><p>B+Tree索引</p><p>在B-Tree索引的基础上进行优化的结果，在MySQL中大部分存储引擎都支持B+Tree索引。如果没有为数据库或数据表显示地指定索引类型，则MySQL底层会默认使用B+Tree索引。</p></li><li><p>Hash索引</p><p>比较适合存储Key-Value型数据。查询Key-Value型数据时，会根据Key快速获取数据。但是Hash索引有个弊端，即不适合根据某个数据范围来查询数据。</p></li><li><p>R-Tree索引</p><p>空间索引，对于地理空间类型的数据来说，通常会使用R-Tree索引。</p></li><li><p>Full-Text索引</p><p>主要用于全文检索。在MySQL5.6版本之前，Full-Text索引只支持MyISAM存储引擎。从MySQL5.6开始，InnoDB存储引擎开始支持Full-Text索引。</p></li></ul><h2 id="使用索引的场景" tabindex="-1">使用索引的场景 <a class="header-anchor" href="#使用索引的场景" aria-label="Permalink to &quot;使用索引的场景&quot;">​</a></h2><ol><li><p><span style="color:#dd9595;"> 全值匹配</span></p><p>全值匹配是指在MySQL的查询条件中包含索引中所有列，并且针对索引中的每列进行等值判断。</p></li><li><p><span style="color:#dd9595;"> 查询范围</span></p><p>MySQL支持对索引的值进行范围查找。</p></li><li><p><span style="color:#dd9595;"> 匹配最左原则</span></p><p>在使用联合索引查询数据时从联合索引中的最左边的列开始查询，并且不能跳过索引中的列。如果跳过索引中的列查询数据，则在后续的查询中将不再使用索引。</p></li><li><p><span style="color:#dd9595;">查询索引列</span></p><p>在查询包含索引的列或者查询的列都在索引中时，查询的效率比使用SELECT *或者查询没有索引的列的效率要高很多。</p></li><li><p><span style="color:#dd9595;"> 匹配字段前缀</span></p><p>如果数据表中的字段存储的数据比较长，则在整个字段上添加索引会影响数据的写入性能，增加MySQL维护索引的负担。此时，可以在字段的开头部分添加索引，并按照此索引进行数据查询。</p></li><li><p><span style="color:#dd9595;">精确与范围匹配索引</span></p><p>在查询数据时，可以同时精确匹配索引并按照另一个索引的范围进行数据查询。</p></li><li><p><span style="color:#dd9595;">匹配NULL值</span></p><p>对一个添加了索引的字段判断是否为NULL时会使用到索引进行查询。</p></li><li><p><span style="color:#dd9595;">连接查询匹配索引</span></p><p>使用JOIN连接语句查询多个数据表中的数据，并且当实现JOIN连接的字段上添加了索引时，MySQL会使用索引进行查询数据。</p></li><li><p><span style="color:#dd9595;"> LIKE匹配索引</span></p><p>当like语句中的查询条件<span style="color:#dd9595;">不以通配符</span>开始时，MySQL会使用索引查询数据。</p></li></ol><h2 id="索引失效的场景" tabindex="-1">索引失效的场景 <a class="header-anchor" href="#索引失效的场景" aria-label="Permalink to &quot;索引失效的场景&quot;">​</a></h2><ol><li><p><span style="color:#dd9595;">以通配符开的LIKE语句</span></p><p>当使用以通配符开始的LIKE语句查询时，MySQL不会使用索引。</p></li><li><p><span style="color:#dd9595;">数据类型转换</span></p><p>当查询的字段数据进行了数据类型转换时，MySQL不会使用索引查询数据。</p></li><li><p><span style="color:#dd9595;">联合索引未匹配最左原则</span></p><p>当数据表中创建了联合索引，如果索引在查询数据时，查询条件不包含联合索引最左边的列或者最左边列的开发部分，即不满足最左前缀匹配规则，那么MySQL不会使用索引。</p></li><li><p><span style="color:#dd9595;">OR语句</span></p><p>查询语句中使用OR来连接多个查询条件时，只要查询条件中存在未创建索引的字段，MySQL就不会使用索引。</p></li><li><p><span style="color:#dd9595;">计算索引列</span></p><p>查询数据时对查询条件的字段添加了索引，而且在查询数据时对字段进行了计算或者使用了函数，此时MySQL不会使用索引。</p></li><li><p><span style="color:#dd9595;">范围条件右侧的列无法使用索引</span></p><p>使用联合索引查询数据时，如果按照联合索引中字段的某个范围查询数据，则此字段后面的列无法使用索引，会进行全表扫描。</p></li><li><p><span style="color:#dd9595;">使用&lt;&gt;或!=操作符匹配查询条件</span></p><p>在MySQL中，使用使用&lt;&gt;或!=操作符匹配查询条件时不会使用索引。</p></li><li><p><span style="color:#dd9595;">匹配NOT NULL值</span></p><p>在MySQL中使用IS NULL判断某个字段是否为NULL时，会使用该字段的索引。相反，如果使用NOT NULL 来验证某个字段不为NULL时，会进行全表扫描操作。</p></li><li><p><span style="color:#dd9595;">索引耗时</span></p><p>在某些场景下，如果MySQL评估使用索引比使用全表扫描查询数据性能更低，则不会使用索引来查询数据，而会进行全表扫描。</p></li></ol><h2 id="优先考虑覆盖索引" tabindex="-1">优先考虑覆盖索引 <a class="header-anchor" href="#优先考虑覆盖索引" aria-label="Permalink to &quot;优先考虑覆盖索引&quot;">​</a></h2><p>理解1：索引是高效找到行的一个方法，但是一般数据库也能使用索引找到一个列的数据，因此它不必读取整个行。毕竟索引叶子节点存储了它们索引的数据；当能通过读取索引就可以得到想要的数 据，那就不需要读取行了。<span style="color:#dd9595;">一个索引包含了满足查询结果的数据就叫做覆盖索引。</span></p><p>理解2：非聚簇复合索引的一种形式，它包括在查询里的SELECT、JOIN和WHERE子句用到的所有列 （即建索引的字段正好是覆盖查询条件中所涉及的字段）。</p><p>简单说就是，<span style="color:#dd9595;"> 索引列+主键包含 SELECT 到 FROM之间查询的列 。</span></p><h2 id="覆盖索引的利弊" tabindex="-1">覆盖索引的利弊 <a class="header-anchor" href="#覆盖索引的利弊" aria-label="Permalink to &quot;覆盖索引的利弊&quot;">​</a></h2><ul><li><p>好处</p><p>1、避免Innodb表进行索引的二次查询（回表）</p><p>2、可以把随机IO变成顺序IO加快查询效率</p></li><li><p>弊端</p><p><span style="color:#dd9595;">索引字段的维护</span> 总是有代价的。因此，在建立冗余索引来支持覆盖索引时就需要权衡考虑了。</p></li></ul><h2 id="索引条件下推" tabindex="-1">索引条件下推 <a class="header-anchor" href="#索引条件下推" aria-label="Permalink to &quot;索引条件下推&quot;">​</a></h2><p>Index Condition Pushdown(ICP)是MySQL 5.6中新特性，是一种在存储引擎层使用索引过滤数据的一种优化方式。ICP可以减少存储引擎访问基表的次数以及MySQL服务器访问存储引擎的次数。把本来由<code>Server</code>层做的索引条件检查下推给存储引擎层来做，以降低回表和访问存储引擎的次数，提高查询效率。</p><h3 id="使用前后对比" tabindex="-1">使用前后对比 <a class="header-anchor" href="#使用前后对比" aria-label="Permalink to &quot;使用前后对比&quot;">​</a></h3><ul><li><p>如果没有ICP，存储引擎会遍历索引以定位基表中的行，并将它们返回给MySQL服务器，由MySQL服务器评估WHERE后面的条件是否留行。</p></li><li><p>启用ICP后，如果部分WHERE条件可以使用索引中的列进行筛选，则MySQL服务器会把这部分WHERE条件放到存储引擎筛选。然后，存储引擎通过使用索引条目来筛选数据，并且只有在满足这一条时才从表中读取行</p><p>好处：ICP可以减少存储引擎必须访问基表的次数和MySQL服务器必须访问存储引擎的次数。但是，ICP的加速效果取决于存储引擎内通过ICP筛选掉的数据的比例。</p></li></ul><p>MySQL默认开启索引条件下推，可以使用如下命令关闭：</p><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> optimizer_switch</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;index_condition_pushdown=off&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>当使用索引条件下推时，EXPLAIN语句输出的结果中Extra列内容为 <span style="color:#dd9595;"> Using index condition</span></p><p>ICP的使用条件</p><ul><li><p>只能用于二级索引(secondary index)</p></li><li><p>explain显示的执行计划中type值（join 类型）为 range 、 ref 、 eq_ref 或者 ref_or_null</p></li><li><p>并非全部where条件都可以用ICP筛选，如果where条件的字段不在索引列中，还是要读取整表的记录 到server端做where过滤</p></li><li><p>ICP可以用于MyISAM和InnnoDB存储引擎</p></li><li><p>MySQL 5.6版本的不支持分区表的ICP功能，5.7版本的开始支持</p></li><li><p>当SQL使用覆盖索引时，不支持ICP优化方法</p></li></ul>',22),n=[s];function o(t,r,d,c,h,y){return a(),l("div",null,n)}const u=p(i,[["render",o]]);export{S as __pageData,u as default};
