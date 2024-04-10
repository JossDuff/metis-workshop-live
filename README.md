# metis-workshop-live

Live-coded an indexer using [Envio](https://envio.dev/) on the [Metis](https://www.metis.io/) blockchain during a Metis livestream on April 5th, 2024.  The focus for this livestream was to index a smart contract and display indexed data on a frontend as simply as possible.

We indexed the ERC20 token `Hum` on Metis at `0x4aAC94985cD83be30164DfE7e9AF7C054D7d2121` 
[block explorer link](https://explorer.metis.io/token/0x4aAC94985cD83be30164DfE7e9AF7C054D7d2121)


## `indexer/`
Contains the code for the Envio indexer, which is publicly hosted and production-ready at the endpoint `https://indexer.bigdevenergy.link/171c891/v1/graphql`.  Find more information about getting started with an Envio indexer [here](https://docs.envio.dev/docs/overview).


## `frontend/` 
Contains the `create-react-app` code for a minimal frontend that makes a graphql query to the indexer and shows the results on the frontend. (see `frontend/DataFetcher.js`).  Find more information about `create-react-app` on [their website](https://create-react-app.dev/).

Run with `npm start` when inside the `frontend` folder.