
# Macos RAGFLOW 本地安装

RAGFLOW官网文档地址：https://ragflow.io/docs/dev/build_docker_image

因为macos m系列芯片是linux/arm64，官方没有提供维护linux/arm6的docker镜像，需要我们自己手动拉去官网仓库进行自动build镜像


## clone 官方RagFlow仓库

```bash
git clone --depth 1 https://github.com/infiniflow/ragflow.git
cd ragflow/
# 使用python uv工具安装对应依赖，如果没有安装uv需要使用brew进行安装或者自行安装
# uv是基于Rust开发的pyhoen包管理工具，类似pip。但是效率比pip包管理效率高
# uv官网：https://docs.astral.sh/uv/
uv run download_deps.py

# 等依赖下载完后编译构建镜像
docker build -f Dockerfile.deps -t infiniflow/ragflow_deps .

# 构建编译带嵌入模型的镜像
docker build -f Dockerfile -t infiniflow/ragflow:nightly .

```

进入到ragflow的docker文件夹中，修改`docker-compose-base.yml`

找到infinity的标签中的镜像，即：`infiniflow/infinity:v0.6.0-dev3` -> `infiniflow/ragflow:nightly`

然后编辑docker目录下的`.env`文件，修改对应的mysql、minio、Elasticsearch的账号密码信息，不然都是默认的账号密码。

执行如下命令进行安装ragflow

```bash

docker compose -f docker-compose-macos.yml up -d
```

如果是macos上运行会导致Elasticsearch的容器失败，ragflow的github上issue中找到了对应的方案，修改docker文件夹下的`.env`针对于macos的配置如下：

请参考ragflow的仓库issue地址：https://github.com/infiniflow/ragflow/issues/5466

![alt text](<../文章/assets/CleanShot 2025-03-02 at 22.10.56@2x.png>)


然后重新执行上面的运行命令，即可启动ragflow。