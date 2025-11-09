# 前端：Cloudflare Pages React 客户端

React + TypeScript + Apollo Client 的单页应用，用于在浏览器端展示聊天界面并通过 GraphQL 调用部署在 Cloudflare Workers 上的 AI 能力。

## 技术选型

- **构建框架**：Vite + React 19 + TypeScript，快速开发、默认 ESM、出色的 DX。
- **GraphQL 客户端**：`@apollo/client` + `graphql`，管理请求、缓存与错误态。
- **样式方案**：原子化 CSS + 自定义渐变背景，保持零依赖、便于迁移到 Pages。
- **环境变量**：使用 `VITE_GRAPHQL_ENDPOINT` 以区分本地、预发、生产的 GraphQL 入口。

## 快速开始

```bash
cd frontend
cp .env.example .env           # 可按需修改 GraphQL 地址
npm install
npm run dev                    # 默认监听 http://localhost:5173
```

> `VITE_GRAPHQL_ENDPOINT` 需指向 serverless 项目的 `/graphql` 路由，开发时默认为 `http://localhost:8787/graphql`（Wrangler Dev 默认端口）。

## NPM Script

| 命令            | 说明                                  |
| --------------- | ------------------------------------- |
| `npm run dev`   | 本地调试，Vite Dev Server + HMR       |
| `npm run build` | 生成 `dist/`，供 Cloudflare Pages 使用 |
| `npm run preview` | 预览生产构建后的静态内容             |

## GraphQL 协议

客户端只依赖一个 mutation：

```graphql
mutation SendMessage($input: ChatMessageInput!) {
  sendMessage(input: $input) {
    reply {
      role
      content
    }
    history {
      role
      content
    }
  }
}
```

`ChatMessageInput` 由以下字段组成：

| 字段           | 类型                | 说明                               |
| -------------- | ------------------- | ---------------------------------- |
| `conversation` | `[MessageInput!]!` | 现有对话历史（用户 / 助手）        |
| `userMessage`  | `String!`           | 新的用户输入                       |

## Cloudflare Pages 部署

1. 连接到 GitHub 仓库后选择 **Pages**。
2. Build command：`npm run build`
3. Build output directory：`dist`
4. 环境变量：在 Pages 项目里设置 `VITE_GRAPHQL_ENDPOINT=https://<workers-domain>/graphql`

## 关键源码

- `src/App.tsx`：聊天 UI 与业务逻辑（表单、错误态、建议提示）。
- `src/lib/apolloClient.ts`：Apollo 实例与缓存策略。
- `src/types/chat.ts`：前端共享的消息结构类型。

更多部署细节可参考仓库根目录的后端文档。
