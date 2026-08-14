const SHOPIFY_STOREFRONT_TOKEN = '8fbd0cd7dcd010e0b5f5ae7e05d89e15';
const SHOPIFY_STORE_PERMANENT_DOMAIN = '7230j1-fw.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/2025-07/graphql.json`;

const query = `
  query {
    products(first: 5) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

fetch(SHOPIFY_STOREFRONT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
  },
  body: JSON.stringify({ query }),
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
