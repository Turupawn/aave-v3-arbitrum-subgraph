import { ReserveInitialized } from "../generated/PoolConfigurator/PoolConfigurator"
import { Market } from "../generated/schema"
import { getOrCreateToken } from "./helpers/helpers";
import { AToken as ATokenTemplate } from "../generated/templates";

export function handleReserveInitialized(event: ReserveInitialized): void {
  let market = Market.load(event.params.aToken);
  if (!market) {
    market = new Market(event.params.aToken);

    const aToken = getOrCreateToken(event.params.aToken);
    market.name = aToken.name;

    market.createdBlockNumber = event.block.number;
    market.aToken = aToken.id;
    market.reserveToken = getOrCreateToken(event.params.aToken).id;
    market.save();
  }

  ATokenTemplate.create(event.params.aToken);
}
