import { NFTPool, Position, UserTotalBalanceForPool } from "./types/schema";
import {
  AddToPosition,
  CreatePosition,
  EmergencyWithdraw,
  Transfer,
  WithdrawFromPosition,
} from "./types/templates/NFTPool/NFTPool";
import { ADDRESS_ZERO, BI_18 } from "./utils/constants";
import {
  convertTokenToDecimal,
  createUser,
  createUserTotalBalanceForPool,
  getPositionID,
  getUserTotalBalanceID,
} from "./utils/helpers";

// event CreatePosition(uint256 indexed tokenId, uint256 amount, uint256 lockDuration);
export function handleCreatePosition(event: CreatePosition): void {
  let from = event.transaction.from;

  // create and save user if needed
  createUser(from);

  let tokenId = event.params.tokenId;
  let position = new Position(getPositionID(event.address, tokenId));

  // @note May not need this with attaching user now
  position.owner = from;
  position.user = from.toHexString();
  position.liquidityTokenBalance = convertTokenToDecimal(event.params.amount, BI_18);

  position.pool = event.address.toHexString();
  position.tokenId = tokenId;

  position.save();
}

// event AddToPosition(uint256 indexed tokenId, address user, uint256 amount);
export function handleAddToPosition(event: AddToPosition): void {
  // Can only be called by the current owner of the position

  // Shouldn't be needed..?
  let user = event.transaction.from;
  createUser(user);

  let position = Position.load(getPositionID(event.address, event.params.tokenId));
  if (!position) return;

  let amount = convertTokenToDecimal(event.params.amount, BI_18);
  position.liquidityTokenBalance = position.liquidityTokenBalance.plus(amount);
  position.save();

  let userTotalBalance = createUserTotalBalanceForPool(user, event.address);
  userTotalBalance.balance = userTotalBalance.balance.plus(amount);
  userTotalBalance.save();
}

// event WithdrawFromPosition(uint256 indexed tokenId, uint256 amount);
export function handleWithdrawFromPosition(event: WithdrawFromPosition): void {
  //
}

// event EmergencyWithdraw(uint256 indexed tokenId, uint256 amount);
export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  //
}

export function handleTransfer(event: Transfer): void {
  // // ignore initial transfers for mints
  // // Owner is assigned in handleCreatePosition
  // if (event.params.from.toHexString() == ADDRESS_ZERO) {
  //   return;
  // }
  // // Update positions user/account link
  // let position = Position.load(getPositionID(event.address, event.params.tokenId));
  // if (!position) return;
  // // TODO: Handle burns
  // if (event.params.to.toHexString() == ADDRESS_ZERO) {
  //   // Remove position link to user
  //   position.owner = null;
  //   position.user = "";
  //   position.liquidityTokenBalance = 0
  //   position.save();
  //   return;
  // }
  // @note Can use a tx entity to store teh historical link/reference
  // type Transfer @entity {
  //   # hash?
  //   id: ID!
  //   # NFT ID
  //   tokenId: BigInt!
  //   # account transferring the position
  //   from: Bytes!
  //   # new owner of position
  //   to: Bytes!
  //   transaction: Transaction!
  // }
  // let from = event.params.from;
  // createUser(from);
  // let to = event.params.to;
  // createUser(to);
  // position.owner = to;
  // position.user = to.toHexString();
  // position.save();
}
