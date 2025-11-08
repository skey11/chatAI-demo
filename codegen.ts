import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_ENDPOINT ?? 'http://localhost:8787/graphql',
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false
      }
    }
  }
};

export default config;
