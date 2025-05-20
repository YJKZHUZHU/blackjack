## [接口地址](https://bj-api.luckeyboard.com/swagger)
## [设计稿](https://www.figma.com/design/A6FGni8Kpj2jv3hHc4wCDh/LM?node-id=132-9228&m=dev)
## [设计原型](https://mastergo.com/goto/JkzQrGvT?page_id=1:0&file=159556248903339)
## [访问地址](https://d1tl6x3jjfq4l.cloudfront.net)



## Docker 部署
- ndoe 版本20+
- pnpm i
- pnpm run build
- EXPOSE 3000 指定端口
- CMD ["npm", "start"] 运行

## 本地验证
- npm run build && ls -l ./out
- npx serve@latest ./out -p 3000
- curl -I http://localhost:3000/mobile | grep "200 OK"

## 静态部署
- https://nextjs.net.cn/docs/pages/building-your-application/deploying/static-exports


<!-- FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"] -->