import {ApolloClient, ApolloProvider} from '@apollo/client';
import {SchemaLink} from '@apollo/client/link/schema';
import {mergeResolvers} from '@graphql-tools/merge';
import {addMocksToSchema} from '@graphql-tools/mock';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {loader} from 'graphql.macro';
import * as React from 'react';

import {AppCache} from 'src/AppCache';
import {defaultMocks} from 'src/testing/defaultMocks';

const schemaDefinition = loader('../schema.graphql');

interface Props {
  children: React.ReactNode;
  mocks?: any;
}

export const ApolloTestProvider = (props: Props) => {
  const {children, mocks} = props;

  const client = React.useMemo(() => {
    const schema = makeExecutableSchema({typeDefs: schemaDefinition});
    const withMerge = mergeResolvers([defaultMocks, mocks]);
    const withMocks = addMocksToSchema({schema, mocks: withMerge});
    return new ApolloClient({
      cache: AppCache,
      link: new SchemaLink({schema: withMocks}),
    });
  }, [mocks]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
