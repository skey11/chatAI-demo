import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

// Cloudflare Workers GraphQL 入口，支持从 .env 注入，也提供一个线上默认值
const endpoint =
  import.meta.env.VITE_GRAPHQL_ENDPOINT ??
  'https://chataiserver.shenweisheng126.workers.dev/graphql'

// 建立 HTTP 链接，配置 CORS、JSON Header 等底层请求参数
const httpLink = new HttpLink({
  uri: endpoint,
  headers: {
    'content-type': 'application/json',
  },
  fetchOptions: {
    mode: 'cors',
  },
})

// 导出全局 Apollo 客户端实例，集中设置缓存策略与请求策略
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only', // 查询始终命中网络，保证上下文实时
    },
    mutate: {
      fetchPolicy: 'no-cache', // mutation 不缓存，避免旧数据
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network', // 监听查询先读缓存再更新
    },
  },
})
