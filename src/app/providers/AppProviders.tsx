import { ReactNode } from 'react';
import { ApolloProvider } from './ApolloProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider>{children}</ApolloProvider>;
};
