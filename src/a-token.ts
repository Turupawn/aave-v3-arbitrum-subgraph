import { Address, ethereum, log } from "@graphprotocol/graph-ts";
import { Account, Market, PositionSnapshot } from "../generated/schema";
import { AToken, Transfer } from "../generated/templates/AToken/AToken"
import { getOrCreateAccount, getOrCreatePosition } from "./helpers/helpers"
import { ZERO_ADDRESS } from "./helpers/constants"


export function handleTransfer(event: Transfer): void {
    const market = Market.load(event.address);
    if (!market) {
        log.critical("Market not found for address: {}", [event.address.toHexString()]);
        return;
    }

    if (event.params.from.toHexString() != ZERO_ADDRESS) {
        const account = getOrCreateAccount(event.params.from);
        updateAccountBalance(event, account, market);
    }

    if (event.params.to.toHexString() != ZERO_ADDRESS) {
        const account = getOrCreateAccount(event.params.to);
        updateAccountBalance(event, account, market);
    }
}

function updateAccountBalance(event: ethereum.Event, account: Account, market: Market): void {
    let position = getOrCreatePosition(account, market, event.block.number);

    // get position balance
    const contract = AToken.bind(event.address);
    const tryBalanceOf = contract.try_balanceOf(Address.fromBytes(account.id));
    if (tryBalanceOf.reverted) {
        log.error("balanceOf() reverted for account: {}", [account.id.toHexString()]);
        return;
    }

    position.supplyBalance = tryBalanceOf.value;

    // TODO get debt balance

    position.netSupply = position.supplyBalance.minus(position.debtBalance);
    position.save();

    // create positon snapshot TODO: put this in it's own function
    let positionSnapshot = new PositionSnapshot(
        position.id + "-" + event.block.number.toString()
    );
    positionSnapshot.blockNumber = event.block.number;
    positionSnapshot.timestamp = event.block.timestamp;

    positionSnapshot.position = position.id;

    positionSnapshot.supplyBalance = position.supplyBalance;
    positionSnapshot.debtBalance = position.debtBalance;
    positionSnapshot.netSupply = position.netSupply;
    positionSnapshot.save();
}