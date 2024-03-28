import { FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from "./utils/constants";
import { PoolCreated } from "./types/NFTPoolFactory/NFTPoolFactory";
import { NFTPool, NFTPoolFactory } from "./types/schema";

export function handlePoolCreated(event: PoolCreated): void {
  let factory = NFTPoolFactory.load(FACTORY_ADDRESS);

  if (factory === null) {
    factory = new NFTPoolFactory(FACTORY_ADDRESS);
    factory.poolCount = ZERO_BI;
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI);
  factory.save();

  let pool = new NFTPool(event.params.pool.toHexString());
  pool.lpToken = event.params.lpToken;
  pool.lpSupply = ZERO_BD;
  pool.lpSupplyWithMultiplier = ZERO_BD;
  pool.save();
}
