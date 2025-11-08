import {
  ApolloClient,
  ApolloProvider as BaseApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { ReactNode, useMemo } from 'react';

const createApolloClient = () => {
  const uri = import.meta.env.VITE_GRAPHQL_ENDPOINT ?? '/graphql';
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    connectToDevTools: import.meta.env.DEV
  });
};

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(createApolloClient, []);
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
