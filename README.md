# ArweaveData

⛩️ Gateways
Gateways allow users to view content on the permaweb. Users gain access to files rendered locally by pointing to a transaction id. Gateways not only enable the storage of static files but also allow entire web applications to function.
In most of the cases, gateways expose a GraphQL interface for querying the tags linked to Arweave transactions. This allows developers to store content of their applications in Arweave transactions and build entire web applications on blockchain.

## Server.js

This script will write the results object to a file named results.json in the same directory as your script. The JSON.stringify function is used to convert the JavaScript object into a JSON string. The null and 2 arguments are used to format the output with two spaces of indentation.

Please note that fs.writeFile is asynchronous and does not block the rest of your program from executing while the file is being written. This is usually what you want, but if you need to make sure the file has been written before moving on, you can use fs.writeFileSync instead.