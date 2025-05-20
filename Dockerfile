# 第一阶段：构建阶段
FROM node:20-alpine AS builder

# 启用 Corepack（内置包管理器管理工具）
RUN corepack enable

# 设置工作目录
WORKDIR /app

# 拷贝依赖文件（包含 PNPM 专属的锁文件）
COPY package.json pnpm-lock.yaml* ./

# 安装依赖（使用 frozen-lockfile 保证锁版本）
RUN pnpm install --frozen-lockfile

# 拷贝项目文件
COPY . .

# 构建并导出静态文件
RUN pnpm run build

# 第二阶段：部署阶段
FROM nginx:alpine

# 删除默认的 nginx 静态资源
RUN rm -rf /usr/share/nginx/html/*

# 拷贝构建好的静态文件到 nginx 的 html 目录
COPY --from=builder /app/out /usr/share/nginx/html

# 拷贝 nginx 配置文件（可选）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]