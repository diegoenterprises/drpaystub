import { gql } from '@apollo/client';

export const checkoutAddLineItems = gql`
    mutation($data: CheckoutCreateInput!) {
        checkoutCreate(input: $data) {
            checkout {
                id
                webUrl
                lineItems(first: 5) {
                    edges {
                        node {
                            title
                            quantity
                        }
                    }
                }
            }
        }
    }
`;
export const checkoutUpdateAttributes = gql`
    mutation checkoutAttributesUpdateV2($checkoutId: ID!, $input: CheckoutAttributesUpdateV2Input!) {
        checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
            checkout {
                id
            }
            checkoutUserErrors {
                code
                field
                message
            }
        }
    }
`;

export const checkoutPaymentDone = gql`
    query getCheckout($id: ID!) {
        node(id: $id) {
            id
            ... on Checkout {
                id
                completedAt
                orderStatusUrl
                ready
                currencyCode
                subtotalPrice
                taxesIncluded
                totalTax
                totalPrice
                lineItems(first: 250) {
                    edges {
                        node {
                            id
                            title
                            quantity
                            variant {
                                id
                                price
                            }
                        }
                    }
                }
            }
        }
    }
`;
