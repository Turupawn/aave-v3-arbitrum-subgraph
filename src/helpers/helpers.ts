import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Account, Market, Position, PositionSnapshot, Token } from "../../generated/schema";
import { AToken } from "../../generated/templates/AToken/AToken";
import { RAY, ZERO_BI } from "./constants";

export function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address);

  if (!token) {
    const contract = AToken.bind(Address.fromBytes(address));

    token = new Token(address);
    token.symbol = contract.try_symbol() ? contract.symbol() : "Unknown";
    token.name = contract.try_name() ? contract.name() : "Unknown";
    token.decimals = contract.try_decimals() ? contract.decimals() : 18;
    token.save();
  }

  return token;
}

export function getOrCreateAccount(address: Bytes): Account {
  let account = Account.load(address);

  if (!account) {
    account = new Account(address);
    account.save();
  }

  return account;
}

export function getOrCreatePosition(account: Account, market: Market, blockNumber: BigInt): Position {
  let position = Position.load(account.id.toHexString() + "-" + market.id.toHexString());

  if (!position) {
    position = new Position(account.id.toHexString() + "-" + market.id.toHexString());
    position.account = account.id;
    position.market = market.id;
    position.blockNumberOpened = blockNumber;
    position.scaledSupply = ZERO_BI;
    position.liquidityIndex = RAY;
    position.supplyBalance = ZERO_BI;
    position.scaledDebtSupply = ZERO_BI;
    position.variableDebtIndex = RAY;
    position.debtBalance = ZERO_BI;
    position.netSupply = ZERO_BI;
    position.save();
  }

  return position;
}

export function createPositionSnapshot(position: Position, event: ethereum.Event): void {
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