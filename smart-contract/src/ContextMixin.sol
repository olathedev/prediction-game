// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Context.sol";

// contract ContextMixin is Context {
//  /**
//   * Returns the actual sender of the transaction.
//   * If the call came through the Biconomy forwarder, returns the original sender.
//   */
//  function _msgSender() internal view virtual override returns (address payable sender) {
//   if (msg.sender == address(this)) {
//    bytes memory array = msg.data;
//    uint256 index = msg.data.length;
//    assembly {
//     // Load the 32 bytes word from memory with the address on the lower 20 bytes
//     sender := and(
//      mload(add(array, index)),
//      0xffffffffffffffffffffffffffffffffffffffff
//     )
//    }
//   } else {
//    sender = payable(msg.sender);
//   }
//  }

//  function _msgData() internal view virtual override returns (bytes calldata) {
//   if (msg.sender == address(this)) {
//    return msg.data[:msg.data.length - 20];
//   } else {
//    return msg.data;
//   }
//  }
// }
