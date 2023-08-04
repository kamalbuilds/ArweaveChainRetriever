import { queryAllTransactionsGQL, ARWEAVE_GATEWAYS } from 'arweavekit/graphql';
import fs from 'fs';

// Define queryString with $cursor variable
const queryString = `
query($cursor: String) {
    transactions(first: 100, after: $cursor) {
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
    let transactions = [];

    // Open a write stream (overwrite the content with each new batch of transactions)
    let file = fs.createWriteStream('transactions.txt');

    while (true) {
        // Query transactions
        let result;
        try {
            console.log("Querying gateway:", options.gateway);
            result = await queryAllTransactionsGQL(queryString, options);
        } catch (error) {
            console.log("Switching gateway due to rate limit...", error);
            nextGateway();
            continue;
        }

        // Check if result contains errors indicating rate limit reached
        if (result && result.errors) {
            for(let error of result.errors) {
                if (error.message.includes("rate limit")) {
                    console.log("Switching gateway due to rate limit...");
                    nextGateway();
                    continue;
                }
            }
        }

        // Check if transactions were returned
        if (result && Array.isArray(result)) {
            transactions = result.map(edge => edge.node);
            console.log("Fetched", transactions.length, "transactions");

            // Update the cursor with the last transaction id
            options.filters.cursor = transactions[transactions.length - 1].id;

            // Write transactions to file
            file.write(JSON.stringify(transactions, null, 2) + '\n');
        } else {
            // Log potential errors
            console.log('Error fetching transactions:', result);
            break;
        }
    }

    // Close the write stream
    file.end();

    return transactions;
}

(async () => {
    let transactions = await fetchAllTransactions();
    console.log("transactions are here", transactions);
})();
