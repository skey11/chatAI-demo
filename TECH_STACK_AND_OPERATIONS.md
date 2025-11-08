## 项目概述

- **目标**：构建一个基于 React + TypeScript 的对话式前端，通过 GraphQL 与 Cloudflare Workers 上的 Serverless 后端通信，最终部署至 Cloudflare Pages。
- **仓库建议**：该子项目将独立托管在 `chat-ai-frontend`（示例名）仓库，便于与 Workers 端解耦发布。

## 技术选型

| 领域 | 方案 | 说明 |
| --- | --- | --- |
| 构建工具 | Vite + pnpm | Vite 提供极速开发体验；pnpm 保证 node_modules 去重和一致性。 |
| UI 层 | React 18 + TypeScript | 提供强类型与函数式组件开发体验。 |
| 状态管理 | Zustand 或 React Query | 轻量状态（会话列表、用户设置）使用 Zustand；网络层缓存依赖 Apollo 本身或 React Query。 |
| GraphQL 客户端 | Apollo Client 3.x | 负责请求、缓存与错误处理；支持 GraphQL Code Generator。 |
| 接口契约 | GraphQL Code Generator | 基于后端提供的 schema 生成 TypeScript 类型与 Hooks，避免手写类型。 |
| UI 框架 | Tailwind CSS + Radix UI | Tailwind 处理布局与主题，Radix 提供无障碍组件（Dialog、Dropdown 等）。 |
| 测试 | Vitest + React Testing Library | 保证核心组件和 GraphQL hooks 的稳定性。 |
| CI/CD | GitHub Actions + Cloudflare Pages | PR 中执行 lint/test/build，主分支自动推送到 Pages。 |

## 项目结构（建议）

```
frontend/
  src/
    app/
      providers/        # Apollo、主题、状态等全局 Provider
      router/           # React Router 配置
    components/         # UI 组件
    features/chat/      # Chat 功能模块（输入框、消息气泡等）
    graphql/
      fragments/
      mutations/
      queries/
      __generated__/    # 由 codegen 生成的类型
    lib/                # 工具函数
    styles/             # 全局样式、Tailwind 配置
  public/
  .env.example
  package.json
  schema.graphql        # 从后端同步的 GraphQL Schema（只读）
  codegen.ts            # GraphQL Code Generator 配置
```

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_GRAPHQL_ENDPOINT` | 指向 Cloudflare Workers 暴露的 GraphQL HTTPS 入口。 |
| `VITE_DEEPSEEK_MODEL` | 当前会话使用的 DeepSeek 模型名称（例如 `deepseek-chat`）。 |
| `VITE_APP_VERSION` | 用于前端展示版本信息和缓存更新。 |

在 `pnpm dev` 阶段读取 `.env.local`，在 Cloudflare Pages 上通过 Project Settings → Environment Variables 配置。

## 开发与构建流程

1. **安装依赖**
   ```bash
   pnpm install
   ```
2. **同步 GraphQL Schema**
   - 运行 `pnpm graphql:pull`（调用 `apollo client:download-schema` 或 `graphql-codegen`）从 Workers 端获取最新 schema。
   - `pnpm graphql:codegen` 生成类型安全的 Hooks（例如 `useSendMessageMutation`）。
3. **启动本地开发服务器**
   ```bash
   pnpm dev
   ```
   Vite 默认监听 `http://localhost:5173`，并通过代理将 `/graphql` 指向本地 `wrangler dev` 端口，避免 CORS。
4. **代码质量**
   ```bash
   pnpm lint
   pnpm test
   pnpm typecheck
   ```
5. **打包与部署**
   ```bash
   pnpm build   # 生成 dist/
   pnpm preview
   ```
   构建工件会在 GitHub Actions 中被上传为 Cloudflare Pages Artifact 或由 Pages 直接构建。

## GraphQL 交互约定

- 前端仅通过 GraphQL（`query`、`mutation`、`subscription`）与 Workers 端通信，避免暴露 DeepSeek API Key。
- 典型 Mutation：
  ```graphql
  mutation SendMessage($conversationId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, content: $content) {
      id
      role
      content
      createdAt
    }
  }
  ```
- 订阅（可选）可使用 GraphQL over SSE/WebSocket；Cloudflare Workers 建议使用 `graphql-ws` over Durable Objects，若尚未实现则前端回退为 Polling。

## 与 Serverless 项目的协作

- Schema 变更需在 Workers 仓库提交后触发前端 `graphql:pull`。
- 通过 GitHub Actions 的 Workflow Dispatch 或 Release Tag，确保两端版本同步。
- 在 PR 中引入 JSON Schema 或 GraphQL Mock（`msw`）以便无后端也可开发。

## 最小可运行示例（MVP）

1. 输入框+发送按钮。
2. 使用 Apollo Mutation 将用户消息发到 `/graphql`.
3. 使用 Query 轮询会话消息列表。
4. 将 DeepSeek 模型建议或错误反馈展示给用户。

上述能力完成后即可部署到 Cloudflare Pages 进行端到端联调。
