// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./interfaces/IWarehouse.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error NotAnOwner();
error NotAMutliSigner();


contract PickingRobot is ERC721 {
	using Strings for uint256;

	IWarehouse Warehouse;
	address _owner;

	constructor(address warehouse) ERC721("Picking Robots", "PICK") {
		Warehouse = IWarehouse(warehouse);
		_owner = msg.sender;

		for(uint8 i = 1; i <= 20; i++) {
			_mint(warehouse, i);
		}
	}

	function pickOrder(string memory orderId, address verifier, uint8 v, bytes32 r, bytes32 s) external {
		if(msg.sender != _owner) revert NotAnOwner();
		if(ecrecover(keccak256(abi.encodePacked(orderId)), v, r, s) != verifier) revert NotAMutliSigner();
		Warehouse.pickOrder(orderId, verifier);
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "https://rose-principal-turtle-588.mypinata.cloud/ipfs/bafkreihs2qbcqdyjywxxzjgjhv3ooe4gzggwioi4xywelofqgxto4mvpgm";
    }
}

contract PackingRobot is ERC721 {
	
	IWarehouse Warehouse;
	address _owner;

	constructor(address warehouse) ERC721("Packing Robots", "PACK") {
		Warehouse = IWarehouse(warehouse);
		_owner = msg.sender;

		for(uint8 i = 1; i <= 20; i++) {
			_mint(warehouse, i);
		}
	}

	function packOrder(string memory orderId, address verifier, uint8 v, bytes32 r, bytes32 s) external {
		if(msg.sender != _owner) revert NotAnOwner();
		if(ecrecover(keccak256(abi.encodePacked(orderId)), v, r, s) != verifier) revert NotAMutliSigner();
		Warehouse.packOrder(orderId, verifier);
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "https://rose-principal-turtle-588.mypinata.cloud/ipfs/bafkreigffrcr2gh5bwiaxqxmotoovlhxee7lrqtct5mbzismjvwmiymjlu";
    }
}

contract DeliveryRobot is ERC721 {
	
	IWarehouse Warehouse;
	address _owner;

	constructor(address warehouse) ERC721("Delivery Robots", "DELI") {
		Warehouse = IWarehouse(warehouse);
		_owner = msg.sender;

		for(uint8 i = 1; i <= 20; i++) {
			_mint(warehouse, i);
		}
	}

	function deliverOrder(string memory orderId, address verifier, uint8 v, bytes32 r, bytes32 s) external {
		if(msg.sender != _owner) revert NotAnOwner();
		if(ecrecover(keccak256(abi.encodePacked(orderId)), v, r, s) != verifier) revert NotAMutliSigner();
		Warehouse.deliverOrder(orderId, verifier);
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "https://rose-principal-turtle-588.mypinata.cloud/ipfs/bafkreiaqjlykirksyntovfdtjscs3fpgq2mb2q57vdv7mubneokngsc4ji";
    }
}