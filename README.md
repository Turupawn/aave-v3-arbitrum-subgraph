# Aave V3 Subgraph

### Goal

Track a user's net supplied amount (per token) amount at the end of each hour.

> Include positional interest accrued and transactions associated with each user position

## Subgraph Location

Deployment ID: `QmZU1fWLhCuq3u3i7Sf9PU9QxyPPMYeAuH7dZsEfcQ8TNS`

Query URL: https://api.studio.thegraph.com/query/22601/aave-v3-arbitrum/version/latest

### Notes

- Skipping stable debt token tracking since none of the markets we want have stable debt tokens
- Only tracking the ETH, USDC, and USDT markets (this is hardcoded in `handleReserveInitialized()`)
  - Did this to speed up the syncing time (performance)
- Creating snapshots only when a position is interacted with
  - This increases the performance, but does not allow for the hourly snapshots of every single position
  - Hourly snapshots could be made by tracking a more frequent event (`ReserveDataUpdated` and then using the indices at that time to calculate the balance of each user position)

### Logic

- Supply Balance = `sum(scaled balance changes)` * `liquidity_index / 1e27`
- Borrow Balance = `sum(scaled balance changes)` * `variable_borrow_index / 1e27`
- Net supplied amount = `Supply Balance - Borrow Balance`

## Build & Deploy

Install proper packages
```
yarn install
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
