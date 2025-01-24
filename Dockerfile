FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# 将构建的静态文件复制到 Nginx 的静态目录
COPY /dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]