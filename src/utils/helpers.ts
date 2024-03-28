import { log, BigInt, BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts";
import { User } from "../types/schema";
import { ONE_BI, ZERO_BI } from "./constants";

export function createUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user === null) {
    user = new User(address.toHexString());
    user.save();
  }

  return user;
}

export function getPositionID(poolAddress: Address, tokenId: BigInt): string {
  return poolAddress.toHexString().concat("-").concat(tokenId.toString());
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}
