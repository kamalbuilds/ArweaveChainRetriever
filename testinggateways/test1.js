import { arGql } from "ar-gql"

const argql = arGql();
const goldsky = arGql('https://arweave-search.goldsky.com/graphql');
const ariodev = arGql('https://ar-io.dev/graphql');
const arionet = arGql('https://ar-io.net/graphql');
const gateway = arGql('https://g8way.io/graphql');

const gateways = [argql, goldsky, ariodev, arionet, gateway];

async function testGateways() {
  for(let i = 0; i < gateways.length; i++) {
    try {
      let result = await gateways[i].run(`query { transactions(first: 1) { edges { node { id } } } }`);
      console.log(`Gateway ${i} result: `, result);
    } catch (error) {
      console.error(`Error on gateway ${i}:`, error);
    }
  }
}

testGateways();
