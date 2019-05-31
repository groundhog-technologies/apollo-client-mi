const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const { onError } = require('apollo-link-error');
const { ApolloLink, split } = require('apollo-link');
const { createUploadLink } = require('apollo-upload-client');
const { BatchHttpLink } = require('apollo-link-batch-http');
const fetch = require('isomorphic-unfetch');

const isFile = value =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob);

const isUpload = ({ variables }) => Object.values(variables).some(isFile);

let client = null;

module.exports = function(uri) {
  if (client) return client;

  const options = {
    uri,
    credentials: 'include',
    fetch,
  };
  const uploadLink = createUploadLink(options);
  const batchLink = new BatchHttpLink(options);

  const link = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    split(isUpload, uploadLink, batchLink),
    // createUploadLink({
    //   uri: `${window.HOST_URL}/graphql`,
    //   credentials: 'include',
    //   // headers: {
    //   //   apolloclient: 1
    //   // },
    // }),
  ]);
  client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
  return client;
};
