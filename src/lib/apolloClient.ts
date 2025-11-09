import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const endpoint =
  import.meta.env.VITE_GRAPHQL_ENDPOINT ?? 'https://chataiserver.shenweisheng126.workers.dev/graphql'

const httpLink = new HttpLink({
  uri: endpoint,
  headers: {
    'content-type': 'application/json',
  },
  fetchOptions: {
    mode: 'cors',
  },
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
