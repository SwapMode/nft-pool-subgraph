import { Position } from "./types/schema";
import {
  AddToPosition,
  CreatePosition,
  Transfer,
  WithdrawFromPosition,
} from "./types/templates/NFTPool/NFTPool";
import { ADDRESS_ZERO, BI_18 } from "./utils/constants";
import {
  convertTokenToDecimal,
  createUser,
  createUserTotalBalanceForPool,
  getPositionID,
} from "./utils/helpers";

// event CreatePosition(uint256 indexed tokenId, uint256 amount, uint256 lockDuration);
export function handleCreatePosition(event: CreatePosition): void {
  let from = event.transaction.from;
  // create and save user if needed
  createUser(from);

  let tokenId = event.params.tokenId;
  let position = new Position(getPositionID(event.address, tokenId));

  let amount = convertTokenToDecimal(event.params.amount, BI_18);
  // @note May not need this with attaching user now
  position.owner = from;
  position.user = from.toHexString();
  position.liquidityTokenBalance = amount;
  position.pool = event.address.toHexString();
  position.tokenId = tokenId;
  position.save();

  let userTotalBalance = createUserTotalBalanceForPool(from, event.address);
  userTotalBalance.balance = userTotalBalance.balance.plus(amount);
  userTotalBalance.save();
}

// event AddToPosition(uint256 indexed tokenId, address user, uint256 amount);
export function handleAddToPosition(event: AddToPosition): void {
  // Can only be called by the current owner of the position

  // Shouldn't be needed after transfer is added..?
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
  let position = Position.load(getPositionID(event.address, event.params.tokenId));
  if (!position) return;

  let amount = convertTokenToDecimal(event.params.amount, BI_18);

  position.liquidityTokenBalance = position.liquidityTokenBalance.minus(amount);
  position.save();

  let userTotalBalance = createUserTotalBalanceForPool(event.transaction.from, event.address);
  userTotalBalance.balance = userTotalBalance.balance.minus(amount);
  userTotalBalance.save();
}

export function handleTransfer(event: Transfer): void {
  // ignore initial transfers for mints
  // Owner is assigned in handleCreatePosition
  if (event.params.from.toHexString() == ADDRESS_ZERO) {
    return;
  }

  // Update position and user amounts
  let position = Position.load(getPositionID(event.address, event.params.tokenId));
  if (!position) return;

  position.owner = event.params.to;
  position.user = event.params.to.toHexString();
  position.save();
}
