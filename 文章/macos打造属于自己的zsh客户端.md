
# 打造属于自己的macos终端

macoos自带的终端工具，输入命令的时候都没有任何高亮，而且还看起来不太美观。下面将使用oh-my-posh + item2打造属于自己的终端。

前提是macos已经安装了Homebrew包管理工具。

如果没有安装Homebrew包管理工具，请参考下面的文章链接先去安装好Homebrew，在按照下面的步骤去打造属于自己的macos终端。

因为国内访问下载Homebrew巨慢，除非使用科学上网工具，国内安装Homebrew文章链接：

https://blog.csdn.net/weixin_38716347/article/details/123838344

brew的官网地址：https://brew.sh/

需要什么安装什么软件，直接在输入框中输入，并可以得到对应的brew 命令安装软件的方式。

## 下载安装item2

官网下载地址：https://iterm2.com/

下载安装完成后，开始使用brew安装oh-my-posh。

## 下载安装oh-my-posh

参考oh-my-posh官网指导：https://ohmyposh.dev/docs/installation/macos

下载安装后，需要把对应的配置写入到~/.zshrc配置文件中。参考示例配置如下：

``` bash

# 配置初始化oh-my-posh 指定对应的主题
eval "$(oh-my-posh init zsh --config /opt/homebrew/opt/oh-my-posh/themes/atomic.omp.json)"

```

macos如果是m系列芯片，homebrew默认安装的软件在`/opt/homebrew/opt/`目录下，指定使用的oh-my-posh的主题即可。

配置修改~/.zshrc文件后，执行`source ~/.zshrc`使其生效。

此时打开终端，默认是乱码的一个状态，需要下载额外配置一种字体，字体的地址：https://www.nerdfonts.com/font-downloads

具体选择那种字体，看自己个人选择。字体下载完成后，需要打开item2配置item2的字体。

配置路径：Setting -> Profiles -> Text。示例图片如下：

![alt text](<../文章/assets/CleanShot 2025-03-02 at 15.02.38.png>)

选择配置好字体后，可以额外配置item2的主题样式，item2的主题样式地址： https://iterm2colorschemes.com/

可以选择自己喜欢的主题，如何下载保存，然后再item2中进行使用。

配置路径：Setting -> Profiles -> Colors。示例图片如下：

![alt text](<../文章/assets/CleanShot 2025-03-02 at 15.06.53.png>)

找到import将对应下载好的item2的主题样式导入即可。

到此，item2的终端已经配置到一半了。但是执行相关的linux命令，如：ls -l 但是显示的文件列表还是没有任何颜色区分，接下来进行这方面的配置。

## 配置输入命令行高亮

使用homebrew安装软件`zsh-syntax-highlighting`，安装完成后，可以验证查看一下路径`/opt/homebrew/opt/`有没有zsh-syntax-highlighting的文件夹，如果存在说明已经安装成功了。

现在还需要在`~/.zshrc`中进行使用，否则在item2终端中输入的命令也不是高亮的。配置内容如下：

```bash
source /opt/homebrew/opt/zsh-syntax-highlighting/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

配置的方式还是和上面配置oh-my-posh的方式一致，配置后需要执行`source ~/.zshrc`使其生效。后续输入的ls -l等命令会高亮。

## 配置安装lsd

lsd插件的地址：https://github.com/lsd-rs/lsd

lsd是使用Rust开源的一个终端不同文件高亮显示库，使用brew安装lsd，安装成功后输入`lsd -l`会显示当前目录下不同文件显示不同的颜色，可以在~/.zshrc文件中配置别名，将系统的ls等命令替换为lsd，这样可以方便查看区分不同文件。配置内容如下：

```bash
alias ls='lsd'
alias ll='lsd -l'
alias la='lsd -a'
alias lt='lsd --tree'

```

配置后，正常使用ls -l等命令，就会列出不同文件显示不同颜色，但是这个库还有其他高级作用，具体可以去研究研究。

到此，macos打造属于自己专属的终端已经完善了。可以自行找一些提高终端效率的工具。

例：
- fzf
- bat
- fz
- zoxide
- zsh-autosuggestions
