# Aave V3 Subgraph

### Goal

Track a user's net supplied amount (per token) amount at the end of each hour.

> Include positional interest accrued and transactions associated with each user position

## Build & Deploy

Install proper packages
```
yarn global add @graphprotocol/graph-cli
```

Build and codegen your subgraph
```
graph codegen && graph build
```

Add your authentication
```
graph auth --studio [your-studio-access-code]
```

Deploy the subgraph
```
graph deploy --studio aave-v3-arbitrum
```

Ref: https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-studio/
