import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ALLOWED_MARKETS = [
    Address.fromHexString('0xf301805bE1Df81102C957f6d4Ce29d2B8c056B2a'), // aWETH
    //Address.fromHexString('0x6ab707aca953edaefbc4fd23ba73294241490620'), // aUSDT
    Address.fromHexString('0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD') // aUSDC
]

export const RAY = BigInt.fromString("10").pow(27);
export const ZERO_BI = BigInt.fromI32(0);
export const NEG_ONE_BI = BigInt.fromI32(-1);

export function rayDiv(value: BigInt, index: BigInt): BigInt {
    const index_bd = index.toBigDecimal().div(RAY.toBigDecimal());
    return BigInt.fromString(value.toBigDecimal().div(index_bd).truncate(0).toString());
}

export function rayMul(value: BigInt, index: BigInt): BigInt {
    const index_bd = index.toBigDecimal().div(RAY.toBigDecimal());
    return BigInt.fromString(value.toBigDecimal().times(index_bd).truncate(0).toString());
}

// for simplicity, we will use the address of the debt token to identify the market
export function getMarketIdFromDebtToken(address: Address): Bytes {
    // WETH
    if (address == Address.fromHexString('0xfD7344CeB1Df9Cf238EcD667f4A6F99c6Ef44a56')) {
        return Bytes.fromHexString('0xf301805bE1Df81102C957f6d4Ce29d2B8c056B2a')
    }

    // USDT
    //if (address == Address.fromHexString('0xfb00ac187a8eb5afae4eace434f493eb62672df7')) {
    //    return Bytes.fromHexString('0x6ab707aca953edaefbc4fd23ba73294241490620')
    //}

    // USDC
    if (address == Address.fromHexString('0x3d2E209af5BFa79297C88D6b57F89d792F6E28EE')) {
        return Bytes.fromHexString('0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD')
    }

    return Bytes.fromHexString(ZERO_ADDRESS);
}