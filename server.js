import { arGql } from "ar-gql"

const argql = arGql();
const goldsky = arGql('https://arweave-search.goldsky.com/graphql');
const ariodev = arGql('https://ar-io.dev/graphql');
const arionet = arGql('https://ar-io.net/graphql');
const gateway = arGql('https://g8way.io/graphql');

const gateways = [argql, goldsky, ariodev, arionet, gateway];
let gatewayIndex = 0;

// Method to cycle through available gateways
function nextGateway() {
  gatewayIndex = (gatewayIndex + 1) % gateways.length;
}

// Handling request with rate limit
async function runQuery(query, variables) {
  let result;

  while (true) {
    try {
      console.log(`Running query on gateway [${gatewayIndex}]`);
      result = await gateways[gatewayIndex].run(query, variables);
      break;
    } catch (error) {
      // Check the actual error message for your use case.
      if (error) {
        console.log("Switching to the next gateway due to rate limit.", error);
        nextGateway();
      } else {
        throw error;
      }
    }
  }

  return result;
}


async function fetchAllTransactions() {
    let transactions = []
    let cursor = ''
  
    while (true) {
        let result = await runQuery(`
            query($cursor: String) {
                transactions(first: 100, after: $cursor) {
                    edges {
                        cursor
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
            }
        `, { cursor });
        
        transactions.push(...result.transactions.edges.map(edge => edge.node));

        if (!result.transactions.edges.length) {
            break;
        }

        cursor = result.transactions.cursor;
    }

    return transactions;
}

(async () => {
    let transactions = await fetchAllTransactions();
    console.log(transactions);
})();
