## 环境配置的优先级

Git 配置的优先级从高到低为：

- 本地仓库配置（.git/config）
- 全局配置（~/.gitconfig）
- 系统配置（/etc/gitconfig）

## 查看全部环境配置命令

```bash
# git查看当前生效的所有配置（包括系统、全局和仓库本地配置）
git config --list

# 查看全局配置
git config --global --list

# 查看系统级配置
git config --system --list

# 查看当前仓库的本地配置
git config --local --list

```

## 查看特定配置项命令

```bash
# 用户名称
git config user.name

# 用户邮箱
git config user.email

# 默认分支名称
git config init.defaultBranch

# HTTP 代理设置
git config http.proxy

```

## 查看配置文件路径

```bash
# 打开全局配置文件
git config --global --edit

```

## 配置当前本地git仓库命令

```bash

# 设置当前git仓库用户名
git config --local user.name "newName"

# 设置当前git仓库邮箱地址
git config --local user.email "xxxx@gmail.com"

# 设置当前git仓库代理
git config --local http.proxy "http://id地址:端口"

```