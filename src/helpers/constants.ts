import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ALLOWED_MARKETS = [
    Address.fromHexString('0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8'), // aWETH
    Address.fromHexString('0x6ab707aca953edaefbc4fd23ba73294241490620'), // aUSDT
    Address.fromHexString('0x625e7708f30ca75bfd92586e17077590c60eb4cd') // aUSDC
]

export const RAY = BigInt.fromString("10").pow(27);
export const ZERO_BI = BigInt.fromI32(0);
export const NEG_ONE_BI = BigInt.fromI32(-1);

// for simplicity, we will use the address of the debt token to identify the market
export function getMarketIdFromDebtToken(address: Address): Bytes {
    // WETH
    if (address == Address.fromHexString('0x0c84331e39d6658cd6e6b9ba04736cc4c4734351')) {
        return Bytes.fromHexString('0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8')
    }

    // USDT
    if (address == Address.fromHexString('0xfb00ac187a8eb5afae4eace434f493eb62672df7')) {
        return Bytes.fromHexString('0x6ab707aca953edaefbc4fd23ba73294241490620')
    }

    // USDC
    if (address == Address.fromHexString('0xf611aeb5013fd2c0511c9cd55c7dc5c1140741a6')) {
        return Bytes.fromHexString('0x625e7708f30ca75bfd92586e17077590c60eb4cd')
    }

    return Bytes.fromHexString(ZERO_ADDRESS);
}