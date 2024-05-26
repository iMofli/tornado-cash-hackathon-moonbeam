// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Whitelist {
    mapping(address => bool) private owners;
    uint256 public ownerCount;
    mapping(address => bool) public whiteListAddress;

    modifier onlyOwner() {
        require(owners[msg.sender], "Not an owner");
        _;
    }

    constructor(address[] memory _owners) {
        for (uint256 i = 0; i < _owners.length; i++) {
            owners[_owners[i]] = true;
            }
        ownerCount = _owners.length;
    }

    function addToWhitelist(address _address) public {
        whiteListAddress[_address] = true;
    }

    function removeFromWhitelist(address _address) public {
        whiteListAddress[_address] = false;
    }

    function isWhiteListed(address _address) public view returns(bool) {
        return whiteListAddress[_address];
    }

    function addOwner(address _newOwner) external onlyOwner {
        require(!owners[_newOwner], "Already an owner");
        owners[_newOwner] = true;
        ownerCount++;
    }

    function removeOwner(address _owner) external onlyOwner {
        require(ownerCount > 1, "Cannot remove the last owner");
        owners[_owner] = false;
        ownerCount--;
    }
}