import{_ as a,c as e,o as t,a1 as i}from"./chunks/framework.DFHaK-wS.js";const l="/assets/Snipaste_2024-06-29_23-35-52.BsClhbHF.png",r="/assets/Snipaste_2024-06-29_23-36-24.CruExAer.png",o="/assets/Snipaste_2024-06-29_23-37-38.DVgdSnQe.png",s="/assets/Snipaste_2024-06-29_23-38-29.dDlQCfHN.png",p="/assets/Snipaste_2024-06-29_23-39-17.Wj7ygp6O.png",c="/assets/Snipaste_2024-06-29_23-39-59.kccnXRR0.png",n="/assets/Snipaste_2024-06-29_23-42-00.DiS4R3mT.png",b="/assets/Snipaste_2024-06-29_23-43-46.49AEvJdW.png",h="/assets/Snipaste_2024-06-29_23-52-37.1gdeklHJ.png",d="/assets/Snipaste_2024-06-29_23-56-01.CfbuuvX5.png",R=JSON.parse('{"title":"消息队列","description":"","frontmatter":{"title":"消息队列"},"headers":[],"relativePath":"消息队列/index.md","filePath":"消息队列/index.md"}'),k={name:"消息队列/index.md"},u=i('<h1 id="mq消息队列概述和差异" tabindex="-1">MQ消息队列概述和差异 <a class="header-anchor" href="#mq消息队列概述和差异" aria-label="Permalink to &quot;MQ消息队列概述和差异&quot;">​</a></h1><h2 id="_01、为什么使用消息队列" tabindex="-1">01、为什么使用消息队列 <a class="header-anchor" href="#_01、为什么使用消息队列" aria-label="Permalink to &quot;01、为什么使用消息队列&quot;">​</a></h2><ul><li>解耦</li><li>异步</li><li>削峰</li><li>持久化</li><li>提速</li></ul><h2 id="_02、传统开发和中间件开发" tabindex="-1">02、传统开发和中间件开发 <a class="header-anchor" href="#_02、传统开发和中间件开发" aria-label="Permalink to &quot;02、传统开发和中间件开发&quot;">​</a></h2><h3 id="解耦" tabindex="-1">解耦 <a class="header-anchor" href="#解耦" aria-label="Permalink to &quot;解耦&quot;">​</a></h3><p>​传统方式</p><p><img src="'+l+'" alt="image-20230405154545999"></p><div class="info custom-block github-alert"><p class="custom-block-title">传统模式的缺点</p><p>系统间耦合性太强，如上图所示，系统A在代码中直接调用系统B和系统C的代码，如果将来D系统接入，系统A还需要修改代码，过于麻烦！</p></div><p>异步方式</p><p><img src="'+r+'" alt="image-20230405155124351"></p><div class="tip custom-block github-alert"><p class="custom-block-title">中间件模式的的优点</p><p>将消息写入消息队列，需要消息的系统自己从消息队列中订阅，从而系统A不需要做任何修改。</p></div><h3 id="削峰" tabindex="-1">削峰 <a class="header-anchor" href="#削峰" aria-label="Permalink to &quot;削峰&quot;">​</a></h3><p>​传统方式</p><p><img src="'+o+'" alt="image-20230405155253587"></p><div class="info custom-block github-alert"><p class="custom-block-title">传统模式的缺点</p><p>并发量大的时候，所有的请求直接怼到数据库，造成数据库连接异常</p></div><p>异步方式</p><p><img src="'+s+'" alt="image-20230405155405003"></p><div class="tip custom-block github-alert"><p class="custom-block-title">中间件模式的的优点</p><p>系统A慢慢的按照数据库能处理的并发量，从消息队列中慢慢拉取消息。在生产中，这个短暂的高峰期积压是允许的</p></div><h3 id="异步" tabindex="-1">异步 <a class="header-anchor" href="#异步" aria-label="Permalink to &quot;异步&quot;">​</a></h3><p>​传统方式</p><p><img src="'+p+'" alt="image-20230405155541391"></p><div class="info custom-block github-alert"><p class="custom-block-title">传统模式的缺点</p><p>一些非必要的业务逻辑以同步的方式运行，太耗费时间。</p></div><p>​中间件方式</p><p><img src="'+c+'" alt="image-20230405155555192"></p><div class="tip custom-block github-alert"><p class="custom-block-title">中间件模式的的优点</p><p>将消息写入消息队列，非必要的业务逻辑以异步的方式运行，加快响应速度</p></div><h2 id="_03、使用了消息队列会有什么缺点" tabindex="-1">03、使用了消息队列会有什么缺点? <a class="header-anchor" href="#_03、使用了消息队列会有什么缺点" aria-label="Permalink to &quot;03、使用了消息队列会有什么缺点?&quot;">​</a></h2><p>分析:一个使用了MQ的项目，如果连这个问题都没有考虑过，就把MQ引进去了，那就给自己的项目带来了风险。我们引入一个技术，要对这个技术的弊端有充分的认识，才能做好预防。要记住，不要给公司挖坑！ 回答：回答也很容易，从以下两个个角度来答:</p><ul><li>系统可用性降低：本来其他系统只要运行好好的，那你的系统就是正常的。现在你非要加个消息队列进去，那消息队列挂了，你的系统不是呵呵了。因此，系统可用性降低。</li><li>系统复杂性增加：要多考虑很多方面的问题，比如一致性问题、如何保证消息不被重复消费，如何保证保证消息可靠传输。因此，需要考虑的东西更多，系统复杂性增大。但是，我们该用还是要用的。</li></ul><h2 id="_04、消息队列如何选型" tabindex="-1">04、消息队列如何选型? <a class="header-anchor" href="#_04、消息队列如何选型" aria-label="Permalink to &quot;04、消息队列如何选型?&quot;">​</a></h2><p>先说一下，为什么掌握了ActiveMQ,RabbitMQ,RocketMQ,Kafka，对什么ZeroMQ等其他MQ没啥理解，因此只能基于这四种MQ给出回答。 分析:既然在项目中用了MQ，肯定事先要对业界流行的MQ进行调研，如果连每种MQ的优缺点都没了解清楚，就拍脑袋依据喜好，用了某种MQ，还是给项目挖坑。如果面试官问:&quot;你为什么用这种MQ？。&quot;你直接回答&quot;领导决定的。&quot;这种回答就很LOW了。还是那句话，不要给公司挖坑。 回答:首先，咱先上ActiveMQ的社区，看看该MQ的更新频率:</p><p>再来一个性能对比表</p><p><img src="'+n+'" alt="image-20230405155648129"></p><p>综合上面的材料得出以下两点:</p><ol><li><p>中小型软件公司，建议选RabbitMQ.一方面，erlang语言天生具备高并发的特性，而且他的管理界面用起来十分方便。正所谓，成也萧何，败也萧何！他的弊端也在这里，虽然RabbitMQ是开源的，然而国内有几个能定制化开发erlang的程序员呢？所幸，RabbitMQ的社区十分活跃，可以解决开发过程中遇到的bug，这点对于中小型公司来说十分重要。不考虑RocketMQ和Kafka的原因是，一方面中小型软件公司不如互联网公司，数据量没那么大，选消息中间件，应首选功能比较完备的，所以kafka排除。不考虑RocketMQ的原因是，Rocketmq是阿里出品，如果阿里放弃维护RocketMQ，中小型公司一般抽不出人来进行RocketMQ的定制化开发，因此不推荐。</p></li><li><p>大型软件公司，根据具体使用在RocketMQ和Kafka之间二选一。一方面，大型软件公司，具备足够的资金搭建分布式环境，也具备足够大的数据量。针对RocketMQ,大型软件公司也可以抽出人手对RocketMQ进行定制化开发，毕竟国内有能力改Java源码的人，还是相当多的。至于Kafka，根据业务场景选择，如果有日志采集功能，肯定是首选Kafka了。具体该选哪个，看使用场景。</p></li></ol><h2 id="_05、如何保证消息队列是高可用的" tabindex="-1">05、如何保证消息队列是高可用的？ <a class="header-anchor" href="#_05、如何保证消息队列是高可用的" aria-label="Permalink to &quot;05、如何保证消息队列是高可用的？&quot;">​</a></h2><p>分析：在第二点说过了，引入消息队列后，系统的可用性下降。在生产中，没人使用单机模式的消息队列。因此，作为一个合格的程序员，应该对消息队列的高可用有很深刻的了解。如果面试的时候，面试官问，你们的消息中间件如何保证高可用的？你的回答只是表明自己只会订阅和发布消息，面试官就会怀疑你是不是只是自己搭着玩，压根没在生产用过。请做一个爱思考，会思考，懂思考的程序员。</p><p>回答：这问题，其实要对消息队列的集群模式要有深刻了解，才好回答。 以rcoketMQ为例，他的集群就有多master 模式、多master多slave异步复制模式、多 master多slave同步双写模式。多master多slave模式部署架构图(网上找的,偷个懒，懒得画):</p><p><img src="'+b+'" alt="image-20230405155735191"></p><p>其实博主第一眼看到这个图，就觉得和kafka好像，只是NameServer集群，在Kafka中是用zookeeper代替，都是用来保存和发现master和slave用的。通信过程如下:</p><p>Producer 与 NameServer集群中的其中一个节点（随机选择）建立长连接，定期从 NameServer 获取 Topic 路由信息，并向提供 Topic 服务的 Broker Master 建立长连接，且定时向 Broker 发送心跳。Producer 只能将消息发送到 Broker master，但是 Consumer 则不一样，它同时和提供 Topic 服务的 Master 和 Slave建立长连接，既可以从 Broker Master 订阅消息，也可以从 Broker Slave 订阅消息。</p><p>那么Kafka呢,为了对比说明直接上Kafka的拓补架构图</p><p><img src="'+h+'" alt="image-20230405155752666"></p><p>如上图所示，一个典型的Kafka集群中包含若干Producer（可以是web前端产生的Page View，或者是服务器日志，系统CPU、Memory等），若干broker（Kafka支持水平扩展，一般broker数量越多，集群吞吐率越高），若干Consumer Group，以及一个Zookeeper-watch集群。Kafka通过Zookeeper管理集群配置，选举leader，以及在Consumer Group发生变化时进行rebalance。Producer使用push模式将消息发布到broker，Consumer使用pull模式从broker订阅并消费消息。</p><p>至于RabbitMQ,也有普通集群和镜像集群模式，自行去了解，比较简单，两小时即懂。 要求，在回答高可用的问题时，应该能逻辑清晰的画出自己的MQ集群架构或清晰的叙述出来</p><h2 id="_06、如何保证消息不被重复消费" tabindex="-1">06、如何保证消息不被重复消费？ <a class="header-anchor" href="#_06、如何保证消息不被重复消费" aria-label="Permalink to &quot;06、如何保证消息不被重复消费？&quot;">​</a></h2><p>分析:这个问题其实换一种问法就是，如何保证消息队列的幂等性?这个问题可以认为是消息队列领域的基本问题。换句话来说，是在考察你的设计能力，这个问题的回答可以根据具体的业务场景来答，没有固定的答案。</p><p>回答:先来说一下为什么会造成重复消费?</p><p>其实无论是那种消息队列，造成重复消费原因其实都是类似的。正常情况下，消费者在消费消息时候，消费完毕后，会发送一个确认信息给消息队列，消息队列就知道该消息被消费了，就会将该消息从消息队列中删除。只是不同的消息队列发送的确认信息形式不同,例如RabbitMQ是发送一个ACK确认消息，RocketMQ是返回一个CONSUME_SUCCESS成功标志，Kafka实际上有个offset的概念，简单说一下(如果还不懂，出门找一个kafka入门到精通教程),就是每一个消息都有一个offset，kafka消费过消息后，需要提交offset，让消息队列知道自己已经消费过了。那造成重复消费的原因?，就是因为网络传输等等故障，确认信息没有传送到消息队列，导致消息队列不知道自己已经消费过该消息了，再次将该消息分发给其他的消费者。</p><p>如何解决?这个问题针对业务场景来答分以下几点</p><p>(1)比如，你拿到这个消息做数据库的insert操作。那就容易了，给这个消息做一个唯一主键，那么就算出现重复消费的情况，就会导致主键冲突，避免数据库出现脏数据。</p><p>(2)再比如，你拿到这个消息做redis的set的操作，那就容易了，不用解决，因为你无论set几次结果都是一样的，set操作本来就算幂等操作。</p><p>(3)如果上面两种情况还不行，上大招。准备一个第三方介质,来做消费记录。以redis为例，给消息分配一个全局id，只要消费过该消息，将&lt;id,message&gt;以K-V形式写入redis。那消费者开始消费前，先去redis中查询有没消费记录即可。</p><h2 id="_07、如何保证消费的可靠性传输" tabindex="-1">07、如何保证消费的可靠性传输? <a class="header-anchor" href="#_07、如何保证消费的可靠性传输" aria-label="Permalink to &quot;07、如何保证消费的可靠性传输?&quot;">​</a></h2><ul><li>确认机制</li><li>ACK机制</li></ul><p>分析：我们在使用消息队列的过程中，应该做到消息不能多消费，也不能少消费。如果无法做到可靠性传输，可能给公司带来千万级别的财产损失。同样的，如果可靠性传输在使用过程中，没有考虑到，这不是给公司挖坑么，你可以拍拍屁股走了，公司损失的钱，谁承担。还是那句话，认真对待每一个项目，不要给公司挖坑。</p><p>回答：其实这个可靠性传输，每种MQ都要从三个角度来分析:生产者弄丢数据、消息队列弄丢数据、消费者弄丢数据</p><h2 id="rabbitmq" tabindex="-1">RabbitMQ <a class="header-anchor" href="#rabbitmq" aria-label="Permalink to &quot;RabbitMQ&quot;">​</a></h2><h3 id="生产者丢数据" tabindex="-1">生产者丢数据 <a class="header-anchor" href="#生产者丢数据" aria-label="Permalink to &quot;生产者丢数据&quot;">​</a></h3><p>从生产者弄丢数据这个角度来看，RabbitMQ提供transaction和confirm模式来确保生产者不丢消息。</p><p>transaction机制就是说，发送消息前，开启事物(channel.txSelect())，然后发送消息，如果发送过程中出现什么异常，事物就会回滚(channel.txRollback())，如果发送成功则提交事物(channel.txCommit())。然而缺点就是吞吐量下降了。因此，按照博主的经验，生产上用confirm模式的居多。一旦channel进入confirm模式，所有在该信道上面发布的消息都将会被指派一个唯一的ID(从1开始)，一旦消息被投递到所有匹配的队列之后，rabbitMQ就会发送一个Ack给生产者(包含消息的唯一ID)，这就使得生产者知道消息已经正确到达目的队列了.如果rabiitMQ没能处理该消息，则会发送一个Nack消息给你，你可以进行重试操作。</p><ul><li>消息冗余</li><li>确认机制confirm模式</li></ul><h3 id="消息队列丢数据" tabindex="-1">消息队列丢数据 <a class="header-anchor" href="#消息队列丢数据" aria-label="Permalink to &quot;消息队列丢数据&quot;">​</a></h3><p>处理消息队列丢数据的情况，一般是开启持久化磁盘的配置。这个持久化配置可以和confirm机制配合使用，你可以在消息持久化磁盘后，再给生产者发送一个Ack信号。这样，如果消息持久化磁盘之前，rabbitMQ阵亡了，那么生产者收不到Ack信号，生产者会自动重发。 那么如何持久化呢，这里顺便说一下吧，其实也很容易，就下面两步</p><p>1、将queue的持久化标识durable设置为true,则代表是一个持久的队列 2、发送消息的时候将deliveryMode=2 这样设置以后，rabbitMQ就算挂了，重启后也能恢复数据</p><ul><li>集群</li><li>持久化</li></ul><h3 id="消费者丢数据" tabindex="-1">消费者丢数据 <a class="header-anchor" href="#消费者丢数据" aria-label="Permalink to &quot;消费者丢数据&quot;">​</a></h3><p>消费者丢数据一般是因为采用了自动确认消息模式。这种模式下，消费者会自动确认收到信息。这时RahbitMQ会立即将消息删除，这种情况下如果消费者出现异常而没能处理该消息，就会丢失该消息。 至于解决方案，采用手动确认消息即可。</p><ul><li>采用手动确认消息即可。手动ACK</li><li>用定时器消息冗余消息重新消费</li></ul><h2 id="kafka" tabindex="-1">Kafka <a class="header-anchor" href="#kafka" aria-label="Permalink to &quot;Kafka&quot;">​</a></h2><p>这里先引一张kafka Replication的数据流向图</p><p><img src="'+d+'" alt="image-20230405155943503"></p><p>Producer在发布消息到某个Partition时，先通过ZooKeeper找到该Partition的Leader，然后无论该Topic的Replication Factor为多少（也即该Partition有多少个Replica），Producer只将该消息发送到该Partition的Leader。Leader会将该消息写入其本地Log。每个Follower都从Leader中pull数据。 针对上述情况，得出如下分析</p><h3 id="生产者丢数据-1" tabindex="-1">生产者丢数据 <a class="header-anchor" href="#生产者丢数据-1" aria-label="Permalink to &quot;生产者丢数据&quot;">​</a></h3><p>在kafka生产中，基本都有一个leader和多个follwer。follwer会去同步leader的信息。因此，为了避免生产者丢数据，做如下两点配置</p><p>第一个配置要在producer端设置acks=all。这个配置保证了，follwer同步完成后，才认为消息发送成功。 在producer端设置retries=MAX，一旦写入失败，这无限重试</p><h3 id="消息队列丢数据-1" tabindex="-1">消息队列丢数据 <a class="header-anchor" href="#消息队列丢数据-1" aria-label="Permalink to &quot;消息队列丢数据&quot;">​</a></h3><p>针对消息队列丢数据的情况，无外乎就是，数据还没同步，leader就挂了，这时zookpeer会将其他的follwer切换为leader,那数据就丢失了。针对这种情况，应该做两个配置。</p><p>replication.factor参数，这个值必须大于1，即要求每个partition必须有至少2个副本 min.insync.replicas参数，这个值必须大于1，这个是要求一个leader至少感知到有至少一个follower还跟自己保持联系 这两个配置加上上面生产者的配置联合起来用，基本可确保kafka不丢数据</p><h3 id="消费者丢数据-1" tabindex="-1">消费者丢数据 <a class="header-anchor" href="#消费者丢数据-1" aria-label="Permalink to &quot;消费者丢数据&quot;">​</a></h3><p>这种情况一般是自动提交了offset，然后你处理程序过程中挂了。kafka以为你处理好了。再强调一次offset是干嘛的 offset：指的是kafka的topic中的每个消费组消费的下标。简单的来说就是一条消息对应一个offset下标，每次消费数据的时候如果提交offset，那么下次消费就会从提交的offset加一那里开始消费。 比如一个topic中有100条数据，我消费了50条并且提交了，那么此时的kafka服务端记录提交的offset就是49(offset从0开始)，那么下次消费的时候offset就从50开始消费。 解决方案也很简单，改成手动提交即可。</p><h2 id="如何保证消息的顺序性" tabindex="-1">如何保证消息的顺序性？ <a class="header-anchor" href="#如何保证消息的顺序性" aria-label="Permalink to &quot;如何保证消息的顺序性？&quot;">​</a></h2><p>分析：其实并非所有的公司都有这种业务需求，但是还是对这个问题要有所复习。</p><p>回答：针对这个问题，通过某种算法，将需要保持先后顺序的消息放到同一个消息队列中(kafka中就是partition,rabbitMq中就是queue)。然后只用一个消费者去消费该队列。</p><p>有的人会问:那如果为了吞吐量，有多个消费者去消费怎么办？</p><p>这个问题，没有固定回答的套路。比如我们有一个微博的操作，发微博、写评论、删除微博，这三个异步操作。如果是这样一个业务场景，那只要重试就行。比如你一个消费者先执行了写评论的操作，但是这时候，微博都还没发，写评论一定是失败的，等一段时间。等另一个消费者，先执行写评论的操作后，再执行，就可以成功。</p><p>总之，针对这个问题，我的观点是保证入队有序就行，出队以后的顺序交给消费者自己去保证，没有固定套路。</p><h2 id="主要消息中间件对比" tabindex="-1">主要消息中间件对比 <a class="header-anchor" href="#主要消息中间件对比" aria-label="Permalink to &quot;主要消息中间件对比&quot;">​</a></h2><h3 id="activemq" tabindex="-1">ActiveMQ <a class="header-anchor" href="#activemq" aria-label="Permalink to &quot;ActiveMQ&quot;">​</a></h3><ul><li>单机吞吐量：万级</li><li>topic数量都吞吐量的影响： 时效性：ms级</li><li>可用性：高，基于主从架构实现高可用性</li><li>消息可靠性：有较低的概率丢失数据</li><li>功能支持：MQ领域的功能极其完备</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">总结</p><p>非常成熟，功能强大，在早些年业内大量的公司以及项目中都有应用<br> 偶尔会有较低概率丢失消息<br> 现在社区以及国内应用都越来越少，官方社区现在对ActiveMQ 5.x维护越来越少，几个月才发布一个版本<br> 主要是基于解耦和异步来用的，较少在大规模吞吐的场景中使用</p></div><h3 id="rabbitmq-1" tabindex="-1">RabbitMQ <a class="header-anchor" href="#rabbitmq-1" aria-label="Permalink to &quot;RabbitMQ&quot;">​</a></h3><ul><li>单机吞吐量：万级</li><li>topic数量都吞吐量的影响：时效性：微秒级，延时低是一大特点。</li><li>可用性：高，基于主从架构实现高可用性</li><li>消息可靠性：功能支持：基于erlang开发，所以并发能力很强，性能极其好，延时很低</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">总结</p><p>erlang语言开发，性能极其好，延时很低；<br> 吞吐量到万级，MQ功能比较完备<br> 开源提供的管理界面非常棒，用起来很好用<br> 社区相对比较活跃，几乎每个月都发布几个版本分<br> 在国内一些互联网公司近几年用rabbitmq也比较多一些 但是问题也是显而易见的，RabbitMQ确实吞吐量会低一些，这是因为他做的实现机制比较重。<br> erlang开发，很难去看懂源码，基本职能依赖于开源社区的快速维护和修复bug。<br> Rabbitmq集群动态扩展会很麻烦，不过这个我觉得还好。其实主要是erlang语言本身带来的问题。很难读源码，很难定制和掌控。</p></div><h3 id="rocketmq" tabindex="-1">RocketMQ <a class="header-anchor" href="#rocketmq" aria-label="Permalink to &quot;RocketMQ&quot;">​</a></h3><ul><li>单机吞吐量：十万级</li><li>topic数量都吞吐量的影响：topic可以达到几百，几千个的级别，吞吐量会有较小幅度的下降。可支持大量topic是一大优势。</li><li>时效性：ms级</li><li>可用性：非常高，分布式架构</li><li>消息可靠性：经过参数优化配置，消息可以做到0丢失</li><li>功能支持：MQ功能较为完善，还是分布式的，扩展性好</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">总结</p><p>接口简单易用，可以做到大规模吞吐，性能也非常好，分布式扩展也很方便，社区维护还可以，可靠性和可用性都是ok的，还可以支撑大规模的topic数量，支持复杂MQ业务场景 而且一个很大的优势在于，源码是java，我们可以自己阅读源码，定制自己公司的MQ，可以掌控<br> 社区活跃度相对较为一般，不过也还可以，文档相对来说简单一些，然后接口这块不是按照标准JMS规范走的有些系统要迁移需要修改大量代码<br></p></div><p>阿里巴巴</p><ul><li><p>消息队列 RocketMQ 是阿里巴巴集团基于高可用分布式集群技术，自主研发的云正式商用的专业消息中间件，</p></li><li><p>既可为分布式应用系统提供异步解耦和削峰填谷的能力，</p></li><li><p>同时也具备互联网应用所需的海量消息堆积、高吞吐、可靠重试等特性，是阿里巴巴双 11 使用的核心产品。</p></li></ul><h3 id="kafka-1" tabindex="-1">Kafka <a class="header-anchor" href="#kafka-1" aria-label="Permalink to &quot;Kafka&quot;">​</a></h3><ul><li>单机吞吐量：十万级，最大的优点，就是吞吐量高。</li><li>topic数量都吞吐量的影响：topic从几十个到几百个的时候，吞吐量会大幅度下降。所以在同等机器下，kafka尽量保证topic数量不要过多。如果要支撑大规模topic，需要增加更多的机器资源</li><li>时效性：ms级</li><li>可用性：非常高，kafka是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用</li><li>消息可靠性：经过参数优化配置，消息可以做到0丢失</li><li>功能支持：功能较为简单，主要支持简单的MQ功能，在大数据领域的实时计算以及日志采集被大规模使用</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">总结</p><p>Kafka的特点其实很明显，就是仅仅提供较少的核心功能，但是提供超高的吞吐量，ms级的延迟，极高的可用性以及可靠性，而且分布式可以任意扩展<br> 同时kafka最好是支撑较少的topic数量即可，保证其超高吞吐量<br> kafka唯一的一点劣势是有可能消息重复消费，那么对数据准确性会造成极其轻微的影响，在大数据领域中以及日志采集中，这点轻微影响可以忽略</p></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li>一般的业务系统要引入MQ，最早大家都用ActiveMQ，但是现在确实大家用的不多了，没经过大规模吞吐量场景的验证，社区也不是很活跃</li><li>后来大家开始用RabbitMQ，但是确实erlang语言阻止了大量的java工程师去深入研究和掌控他，对公司而言，几乎处于不可控的状态，但是确实人家是开源的，比较稳定的支持，活跃度也高；</li><li>不过现在确实越来越多的公司，会去用RocketMQ，确实很不错，但是要想好社区万一突然黄掉的风险</li><li>所以中小型公司，技术实力较为一般，技术挑战不是特别高，用RabbitMQ是不错的选择；大型公司，基础架构研发实力较强，用RocketMQ是很好的选择</li><li>如果是大数据领域的实时计算、日志采集等场景，用Kafka是业内标准的，绝对没问题，社区活跃度很高，绝对不会黄，何况几乎是全世界这个领域的事实性规范。</li></ul><p>一些其他的相关连接：</p><ul><li><a href="https://www.cnblogs.com/williamjie/p/9481774.html" target="_blank" rel="noreferrer">RabbitMQ基础概念详细介绍</a></li><li><a href="https://blog.csdn.net/anzhsoft/article/details/19563091" target="_blank" rel="noreferrer">RabbitMQ消息队列</a></li><li><a href="https://segmentfault.com/a/1190000016351345" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000016351345</a></li><li><a href="https://blog.csdn.net/qq_26656329/article/details/77891793" target="_blank" rel="noreferrer">RabbitMQ参数调优</a></li><li><a href="https://blog.csdn.net/kzadmxz/article/details/99359067" target="_blank" rel="noreferrer">https://blog.csdn.net/kzadmxz/article/details/99359067</a></li></ul>',105),m=[u];function f(_,q,M,g,Q,v){return t(),e("div",null,m)}const x=a(k,[["render",f]]);export{R as __pageData,x as default};
