import{_ as s,c as a,o as t,a1 as e}from"./chunks/framework.DFHaK-wS.js";const n="/assets/Snipaste_2024-06-30_13-03-28.B9RTvEMx.png",i="/assets/Snipaste_2024-06-30_13-03-57.DQXJ-6Hp.png",o="/assets/Snipaste_2024-06-30_13-04-22.BT7toEI1.png",p="/assets/Snipaste_2024-06-30_13-04-50.CF7-gJ5n.png",_="/assets/Snipaste_2024-06-30_13-05-11._PRNU_vc.png",c="/assets/Snipaste_2024-06-30_13-05-34.CeKD2nlS.png",r="/assets/Snipaste_2024-06-30_13-05-52.H6oOEFHO.png",v=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"环境搭建/Windows系统Nacos安装.md","filePath":"环境搭建/Windows系统Nacos安装.md"}'),l={name:"环境搭建/Windows系统Nacos安装.md"},d=e('<h2 id="_1、打开nacos的官网进行下载" tabindex="-1">1、打开Nacos的官网进行下载 <a class="header-anchor" href="#_1、打开nacos的官网进行下载" aria-label="Permalink to &quot;1、打开Nacos的官网进行下载&quot;">​</a></h2><p>官网地址：<a href="https://nacos.io/zh-cn/index.html" target="_blank" rel="noreferrer">https://nacos.io/zh-cn/index.html</a> ，跳转到github，选择对应的版本进行下载即可。</p><p><img src="'+n+'" alt="Snipaste_2024-06-30_13-03-28.png"></p><p><img src="'+i+'" alt="Snipaste_2024-06-30_13-03-57.png"></p><h2 id="_2、下载完成之后-解压安装nacos即可" tabindex="-1">2、下载完成之后，解压安装Nacos即可 <a class="header-anchor" href="#_2、下载完成之后-解压安装nacos即可" aria-label="Permalink to &quot;2、下载完成之后，解压安装Nacos即可&quot;">​</a></h2><p>在解压下载成功的文件夹之后，进入<code>bin</code>目录，启动<code>startup.cmd -m standalone</code>文件</p><p><img src="'+o+'" alt="Snipaste_2024-06-30_13-04-22.png"></p><h2 id="_3、启动服务" tabindex="-1">3、启动服务 <a class="header-anchor" href="#_3、启动服务" aria-label="Permalink to &quot;3、启动服务&quot;">​</a></h2><p><img src="'+p+'" alt="Snipaste_2024-06-30_13-04-50.png"></p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">startup.cmd</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> standalone</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><img src="'+_+'" alt="Snipaste_2024-06-30_13-05-11.png"></p><h2 id="_4、启动成功之后在浏览器访问地址" tabindex="-1">4、启动成功之后在浏览器访问地址 <a class="header-anchor" href="#_4、启动成功之后在浏览器访问地址" aria-label="Permalink to &quot;4、启动成功之后在浏览器访问地址&quot;">​</a></h2><p>输入<code>http://localhost:8848/nacos</code>，出现如下界面，即nacos安装并运行成功。</p><p><img src="'+c+'" alt="Snipaste_2024-06-30_13-05-34.png"></p><p>使用默认的账号和密码<code>nacos</code>，进行登录</p><p><img src="'+r+'" alt="Snipaste_2024-06-30_13-05-52.png"></p>',16),h=[d];function m(g,u,b,S,k,f){return t(),a("div",null,h)}const x=s(l,[["render",m]]);export{v as __pageData,x as default};
