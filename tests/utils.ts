import { NFTPool } from "../src/types/schema";
import { newMockEvent, test } from "matchstick-as/assembly/index";

export function createNFTPool() {
  let poolEvent = changeType<NFTPool>(newMockEvent());
}
