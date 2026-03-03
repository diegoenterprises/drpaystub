import { GraphQLClient } from "graphql-request";

const SERVER_URL = `https://dr-paystub.myshopify.com/api/2021-01/graphql.json`;

export const graphQLClient = new GraphQLClient(SERVER_URL, {
  headers: {
    "X-Shopify-Storefront-Access-Token": "fde67ab5f9f1b05658e3cfcbe32a8ec9",
  },
});
