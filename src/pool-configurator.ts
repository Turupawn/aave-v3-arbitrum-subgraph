import { ReserveInitialized } from "../generated/PoolConfigurator/PoolConfigurator"
import { Market } from "../generated/schema"
import { getOrCreateToken } from "./helpers/helpers";
import { AToken as ATokenTemplate, VariableDebtToken as VariableDebtTokenTemplate } from "../generated/templates";
import { ALLOWED_MARKETS } from "./helpers/constants";

// handleReserveInitialized creates new markets
export function handleReserveInitialized(event: ReserveInitialized): void {
  let market = Market.load(event.params.aToken);
  if (!market) {
    market = new Market(event.params.aToken);

    const aToken = getOrCreateToken(event.params.aToken);
    market.name = aToken.name;

    market.createdBlockNumber = event.block.number;
    market.aToken = aToken.id;
    market.reserveToken = getOrCreateToken(event.params.aToken).id;
  }

  if (ALLOWED_MARKETS.includes(event.params.aToken)) {
    market.save();
    ATokenTemplate.create(event.params.aToken);
    VariableDebtTokenTemplate.create(event.params.variableDebtToken);
  }
}
