# node镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /app

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有>必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /app/

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
RUN npm install --registry=https://registry.npm.taobao.org

COPY . /app

CMD npm run prod