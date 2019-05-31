# mi-client
customized apollo client

## Useage
Following example returns an [apollo-client](https://github.com/apollographql/apollo-client) instance
```js
import ApolloClient from 'mi-client';
const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';
const client = ApolloClient(GRAPHQL_ENDPOINT);
```
