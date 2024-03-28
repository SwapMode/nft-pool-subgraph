import { FACTORY_ADDRESS, ONE_BI, ZERO_BI } from "./utils/constants";
import { PoolCreated } from "./types/NFTPoolFactory/NFTPoolFactory";
import { NFTPoolFactory } from "./types/schema";

export function handlePoolCreated(event: PoolCreated): void {
  let factory = NFTPoolFactory.load(FACTORY_ADDRESS);

  if (factory === null) {
    factory = new NFTPoolFactory(FACTORY_ADDRESS);
    factory.poolCount = ZERO_BI;
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI);

  factory.save();
}
