import { queryTransactionsGQL, ARWEAVE_GATEWAYS } from 'arweavekit/graphql';
import fs from 'fs';

const queryString = `
query($first: Int, $after: String) {
    transactions(first: $first, after: $after) {
        pageInfo {
            hasNextPage
        }
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
                    height,
                    timestamp
                }
                tags {
                    name,
                    value
                }
            }
        }
    }
}`;

// Initialize gateway index
let gatewayIndex = 0;

// Define options
const options = {
  gateway: ARWEAVE_GATEWAYS[gatewayIndex], // set initial gateway
  filters: {
    first: 100, // uncommented this line as we need it for pagination
    cursor: null // initialize cursor
  }
};

// Function to switch to next gateway
const nextGateway = () => {
  gatewayIndex = (gatewayIndex + 1) % ARWEAVE_GATEWAYS.length;
  options.gateway = ARWEAVE_GATEWAYS[gatewayIndex];
};

async function fetchAllTransactions() {
  let allTransactions = [];
  let cursor; // Initialize cursor as undefined

  // Open a write stream (overwrite the file at first and then append)
  let file = fs.createWriteStream('transactions.txt');

  while (true) {
    // Query transactions
    const response = await queryTransactionsGQL(queryString, { ...options, filters: { first: LIMIT_PER_PAGE, after: cursor } });

    // Check if transactions were returned
    if (response.data && response.data.length > 0) {
      // Append transactions to the array
      allTransactions = allTransactions.concat(response.data);

      // Write transactions to file
      file.write(JSON.stringify(response.data));

      // Check if more pages exist
      if (!response.hasNextPage) {
        break; // Break the loop if no more pages exist
      }

      // Update the cursor to the cursor of the last transaction in this page
      cursor = response.data[response.data.length - 1].cursor;
    } else {
      break; // Break the loop if no transactions were returned
    }
  }

  file.end();
  return allTransactions;
}

(async () => {
  let transactions = await fetchAllTransactions();
  console.log("Fetched a total of", transactions.length, "transactions");
})();