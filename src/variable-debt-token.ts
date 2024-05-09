import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { Account, Market } from "../generated/schema";
import { Burn, Mint } from "../generated/templates/VariableDebtToken/VariableDebtToken";
import { NEG_ONE_BI, RAY, getMarketIdFromDebtToken, rayDiv, rayMul } from "./helpers/constants";
import { createPositionSnapshot, getOrCreateAccount, getOrCreatePosition } from "./helpers/helpers";

// handleMint adds debt to the position
export function handleMint(event: Mint): void {
    const market = Market.load(getMarketIdFromDebtToken(event.address));
    if (!market) {
        log.error("Market not found for address: {}", [event.address.toHexString()]);
        return;
    }
    
    const toAccount = getOrCreateAccount(event.params.onBehalfOf);
    const scaledAmount = rayDiv(event.params.value, event.params.index);
    updateDebtBalance(event, toAccount, market, scaledAmount, event.params.index);
}

// handleBurn removes debt from the position
export function handleBurn(event: Burn): void {
    const market = Market.load(getMarketIdFromDebtToken(event.address));
    if (!market) {
        log.error("Market not found for address: {}", [event.address.toHexString()]);
        return;
    }
    
    const toAccount = getOrCreateAccount(event.params.from);
    const scaledAmount = rayDiv(event.params.value, event.params.index).times(NEG_ONE_BI);
    updateDebtBalance(event, toAccount, market, scaledAmount, event.params.index);
}

function updateDebtBalance(event: ethereum.Event, account: Account, market: Market, scaledAmount: BigInt, index: BigInt): void {
    let position = getOrCreatePosition(account, market, event.block.number);

    // update variable debt balance
    position.scaledDebtSupply = position.scaledDebtSupply.plus(scaledAmount);
    position.debtBalance = rayMul(position.scaledDebtSupply, index);
    position.variableDebtIndex = index;

    position.netSupply = position.supplyBalance.minus(position.debtBalance);
    position.save();

    createPositionSnapshot(position, event);
}
