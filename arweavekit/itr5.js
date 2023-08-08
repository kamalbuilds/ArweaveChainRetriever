import { queryTransactionsGQL, ARWEAVE_GATEWAYS } from 'arweavekit/graphql';
import fs from 'fs';

// Define queryString with $cursor variable
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
  gateway: ARWEAVE_GATEWAYS[gatewayIndex],
  filters: {
    first: 100,
    after: null 
  }
};

// Function to switch to next gateway
const nextGateway = () => {
  gatewayIndex = (gatewayIndex + 1) % ARWEAVE_GATEWAYS.length;
  options.gateway = ARWEAVE_GATEWAYS[gatewayIndex];
};

async function fetchAllTransactions() {
    let allTransactions = [];

    // Open a write stream
    let file = fs.createWriteStream('results.json');

    while (true) {
        // Query transactions
        let result;
        try {
            console.log("Querying gateway:", options.gateway);
            result = await queryTransactionsGQL(queryString, options);
            console.log("Fetched", result.data.length, "transactions");
        } catch (error) {
            console.log("Encountered an error while querying gateway:", error);
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

        if (result.status === 504) {
            console.log("Error fetching transactions as result:", result);
            console.log("Switching gateway due to 504 status...");
            nextGateway();
            continue; // Continue to the next iteration by switching to new gateway
        }

        // Check if transactions were returned
        if (result && result.data.length > 0) {
            let transactions = result.data.map(edge => edge.node);
            console.log("Fetched", transactions.length, "transactions");

            // Append fetched transactions to all transactions
            allTransactions.push(...transactions);

            // Update the after with the last transaction cursor
            options.filters.after = result.cursor;
            console.log("Updated after to", options.filters.after);

            // Append transactions to file
            file.write(JSON.stringify(transactions, null, 2) + '\n');

            // If there are no more pages, break the loop
            if (!result.hasNextPage) {
                break;
            }
        } else {
            // Log potential errors
            console.log('Error fetching transactions as result:', result);
            break;
        }
    }

    // Close the write stream
    file.end();

    return allTransactions;
}

(async () => {
    let transactions = await fetchAllTransactions();
    console.log("Fetched a total of", transactions.length, "transactions");
})();
