import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Account, Market, Position, Token } from "../../generated/schema";
import { ERC20 } from "../../generated/Pool/ERC20";
import { ZERO_BI } from "./constants";

export function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address);

  if (!token) {
    const contract = ERC20.bind(Address.fromBytes(address));

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
    position.supplyBalance = ZERO_BI;
    position.debtBalance = ZERO_BI;
    position.netSupply = ZERO_BI;
    position.save();
  }

  return position;
}