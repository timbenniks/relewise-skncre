import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clymq9rdt07ry07w79ehfwozb/master',
  documents: ['./**/*.tsx', './**/*.ts', '!src/gql/**/*'],
  generates: {
    './gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;