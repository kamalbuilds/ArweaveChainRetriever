# ArweaveChainRetriever

🔗 ***Connecting You to the Whole Arweave***

### **Description:**
ArweaveChainRetriever is an innovative script designed to unlock the full potential of the Arweave blockchain by allowing users to pull the entire dataset from Arweave gateways.Since each gateway has rate limitations on the number of Queries that can be made. Hence the script is designed to adapt and it jumps to other gateway to fetch rest data. It's crafted for those who seek comprehensive access to the weave without the complexity of storing the entire chain.

### How to run

`node arweavekit/itr5.js`

This script will write the results object to a file named results.json in the same directory as your script. The JSON.stringify function is used to convert the JavaScript object into a JSON string. The null and 2 arguments are used to format the output with two spaces of indentation.

Please note that fs.writeFile is asynchronous and does not block the rest of your program from executing while the file is being written. This is usually what you want, but if you need to make sure the file has been written before moving on, you can use fs.writeFileSync instead.

Key Features:

1. **Full Chain Retrieval:** With the ease of a single script, ArweaveChainRetriever enables the download of the complete Arweave dataset. Whether for research, analysis, or development, users now have a simple tool to access the entire weave.

2. **Efficient Data Handling:** Utilizing the latest asynchronous programming practices, the script ensures that file writing doesn't block the rest of the program. Users benefit from a smooth experience that makes large data retrieval a breeze.

3. **Offline Indexing Capability:** By aggregating the data into one accessible place, ArweaveChainRetriever offers the possibility to index the data offline. It opens up new horizons for how the Arweave chain can be explored and utilized.

4. **Open Source Contribution:** As a testament to my commitment to open-source values, ArweaveChainRetriever invites collaboration and contribution from the broader blockchain community.

5. **Optimized for Performance:** The script is constructed with an eye for efficiency and robust performance, employing JSON.stringify and other methods to manage data seamlessly.

ArweaveChainRetriever is more than a mere utility; it's a gateway to endless possibilities within the Arweave blockchain. It embodies the spirit of accessibility and simplification, breaking down barriers to empower developers, researchers, and enthusiasts alike. Join us in this exciting journey as we unlock the full spectrum of Arweave, one chain at a time! 🚀

⛩️ Gateways
Gateways allow users to view content on the permaweb. Users gain access to files rendered locally by pointing to a transaction id. Gateways not only enable the storage of static files but also allow entire web applications to function.
In most of the cases, gateways expose a GraphQL interface for querying the tags linked to Arweave transactions. This allows developers to store content of their applications in Arweave transactions and build entire web applications on blockchain.

Results from the script

First we query from arweave.net gateway

![image](https://github.com/kamalbuilds/ArweaveChainRetriever/assets/95926324/018aa478-03d0-4fed-b913-66b2f1710b1e)

After fetching 2200 transactions from this gateway , It gets a timeout error and then switches to a new gateway `arweave.dev` .

![image](https://github.com/kamalbuilds/ArweaveChainRetriever/assets/95926324/dcfcf9c1-f42b-4d76-bc97-885f36d55419)

And the script goes on and on untill it fetches the whole Arweave transactions.
