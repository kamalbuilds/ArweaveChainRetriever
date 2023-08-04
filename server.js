import { arGql } from "ar-gql";

const argql = arGql();
const goldsky = arGql('https://arweave-search.goldsky.com/graphql');
const ariodev = arGql('https://ar-io.dev/graphql');
const arionet = arGql('https://ar-io.net/graphql');
const gateway = arGql('https://g8way.io/graphql');

const gateways = [argql, goldsky, ariodev, arionet, gateway];


(async () => {
	let results = await ario.run(`query( $count: Int ){
        
    transactions(
      first: $count, 
      tags: [
        {
          name: "App-Name",
          values: ["PublicSquare"]
        },
        {
          name: "Content-Type",
          values: ["text/plain"]
        },
      ]
    ) {
      edges {
        node {
          id
          owner {
            address
          }
          data {
            size
          }
          block {
            height
            timestamp
          }
          tags {
            name,
            value
          }
        }
      }
    }
  }`, {count: 1});
  console.log(results);
})();