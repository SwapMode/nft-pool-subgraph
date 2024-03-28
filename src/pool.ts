import {
  AddToPosition,
  CreatePosition,
  EmergencyWithdraw,
  Transfer,
  WithdrawFromPosition,
} from "./types/templates/NFTPool/NFTPool";
import { createUser } from "./utils/helpers";

// event CreatePosition(uint256 indexed tokenId, uint256 amount, uint256 lockDuration);
export function handleCreatePosition(event: CreatePosition): void {
  let from = event.transaction.from;
  let user = createUser(from);

  let tokenId = event.params.tokenId;
}

export function handleTransfer(event: Transfer): void {
  //
  // @note May need to account for initial mint to user here..?

  let from = event.params.from;
  createUser(from);
  let to = event.params.to;
  let user = createUser(to);

  // Update position user
  let tokenId = event.params.tokenId;
  let poolAddress = event.address;
}

// event AddToPosition(uint256 indexed tokenId, address user, uint256 amount);
export function handleAddToPosition(event: AddToPosition): void {
  //
}

// event WithdrawFromPosition(uint256 indexed tokenId, uint256 amount);
export function handleWithdrawFromPosition(event: WithdrawFromPosition): void {
  //
}

// event EmergencyWithdraw(uint256 indexed tokenId, uint256 amount);
export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  //
}
