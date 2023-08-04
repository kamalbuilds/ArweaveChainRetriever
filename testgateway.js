import { arGql } from "ar-gql"

const argql = arGql();
const goldsky = arGql('https://arweave-search.goldsky.com/graphql');
const ariodev = arGql('https://ar-io.dev/graphql');
const arionet = arGql('https://ar-io.net/graphql');
const gateway = arGql('https://g8way.io/graphql');

const gateways = [argql, goldsky, ariodev, arionet, gateway];

// Test each gateway
async function testGateways() {
    for (const gateway of gateways) {
        try {
            const result = await gateway.run(`
                query {
                    transactions(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            `);
            console.log(result);
        } catch (error) {
            console.error('Error with gateway: ', error);
        }
    }
}

testGateways();
