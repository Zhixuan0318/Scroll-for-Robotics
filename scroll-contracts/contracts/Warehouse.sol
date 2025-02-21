// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {IAnyrand} from "./lib/Anyrand.sol";
import {IRandomiserCallbackV3} from "./lib/RandomiserCallbackV3.sol";

import "./interfaces/Enums.sol";

import "./interfaces/IShop.sol";
import "./interfaces/IProducts.sol";

error NotARobot();
error NotAnOwner();

contract Warehouse is IRandomiserCallbackV3  {

	address public immutable anyrand;
	address _owner;

	enum Activity {
		Picking, Packing, Delivering
	}

	IShop Shop;
	IProducts Products;

	mapping (address => bool) _robotApproval;
	mapping (uint256 => Activity) _requestToActivity;
	mapping (uint256 => string) _requestToOrder;

	uint8[] pickingRobots = new uint8[](0);
	uint8[] packingRobots = new uint8[](0);
	uint8[] deliveryRobots = new uint8[](0);
	mapping (string => uint8) _activeOrderRobot;

	event WarehouseActivity(string orderId, Enums.OrderStatus status);
	event AssingRobot(string orderId, Activity activity, uint256 robotId);
	event RequestRobotId(string orderId, uint256 requestId);
	event ActivityVerifier(string orderId, Activity activity, address indexed verifier);

	constructor(address shop, address products) {
		_owner = msg.sender;
		Shop = IShop(shop);
		Products = IProducts(products);
		anyrand = 0x86d8C50E04DDd04cdaafaC9672cf1D00b6057AF5;

		for(uint8 i = 1; i <= 20; i++) {
			pickingRobots.push(i);
			packingRobots.push(i);
			deliveryRobots.push(i);
		}
	}

	function setRobot(address robot) external {
		require(msg.sender == _owner, 'Not an Owner');
		_robotApproval[robot] = true;
	}

	function processOrder(string memory orderId) onlyOwner external {
		Shop.updateOrderStatus(orderId, Enums.OrderStatus.Processing);

		emit WarehouseActivity(orderId, Enums.OrderStatus.Processing);
	}

	function pickOrder(string memory orderId, address verifier) onlyRobot external {
		Shop.updateOrderStatus(orderId, Enums.OrderStatus.Picked);

		pickingRobots.push(_activeOrderRobot[orderId]);
		_activeOrderRobot[orderId] = 0;

		emit WarehouseActivity(orderId, Enums.OrderStatus.Picked);
		emit ActivityVerifier(orderId, Activity.Picking, verifier);
	} 

	function packOrder(string memory orderId, address verifier) onlyRobot external {
		Shop.updateOrderStatus(orderId, Enums.OrderStatus.Packed);

		packingRobots.push(_activeOrderRobot[orderId]);
		_activeOrderRobot[orderId] = 0;

		emit WarehouseActivity(orderId, Enums.OrderStatus.Packed);
		emit ActivityVerifier(orderId, Activity.Packing, verifier);
	}

	function deliverOrder(string memory orderId, address verifier) onlyRobot external {
		Shop.updateOrderStatus(orderId, Enums.OrderStatus.Delivered);

		Products.mintProduct(Shop.getOrderProductId(orderId), Shop.getOrderCustomer(orderId));

		deliveryRobots.push(_activeOrderRobot[orderId]);
		_activeOrderRobot[orderId] = 0;

		emit WarehouseActivity(orderId, Enums.OrderStatus.Delivered);
		emit ActivityVerifier(orderId, Activity.Delivering, verifier);
	}

	function generateRobotId(
		string memory orderId, 
		Activity activityType,
	    uint256 deadline,
        uint256 callbackGasLimit // set to 7_000_000
	) onlyOwner external payable returns(uint256) {
		require(deadline > block.timestamp, "Deadline is in the past");
        (uint256 requestPrice, ) = IAnyrand(anyrand).getRequestPrice(
            callbackGasLimit
        );
        require(msg.value >= requestPrice, "Insufficient payment");
        if (msg.value > requestPrice) {
            (bool success, ) = msg.sender.call{value: msg.value - requestPrice}(
                ""
            );
            require(success, "Refund failed");
        }
        uint256 requestId = IAnyrand(anyrand).requestRandomness{
            value: requestPrice
        }(deadline, callbackGasLimit);

		_requestToActivity[requestId] = activityType;
		_requestToOrder[requestId] = orderId;

		emit RequestRobotId(orderId, requestId);

		return requestId;
	}

	function receiveRandomness(uint256 requestId, uint256 randomWord) external {
        require(msg.sender == anyrand, "Only callable by Anyrand");

		uint8 robotId = _occupyRobot(_requestToOrder[requestId], _requestToActivity[requestId], randomWord);

		emit AssingRobot(_requestToOrder[requestId], _requestToActivity[requestId], robotId);
    }

	function activeRobots() view external returns (uint256[] memory robots) {
		robots = new uint256[](3);
		robots[0] = pickingRobots.length;
		robots[1] = packingRobots.length;
		robots[2] = deliveryRobots.length;
	}

	function robotStatus(uint8 robotId, Activity robotType) view external returns (Enums.RobotStatus) {
		uint8[] memory copy = 
			robotType == Activity.Picking ? pickingRobots :
			robotType == Activity.Packing ? packingRobots : 
			deliveryRobots;

		for(uint8 i = 0; i < copy.length; i++) {
			if(copy[i] == robotId) return Enums.RobotStatus.Free;
		}

		return Enums.RobotStatus.Occupied;
	}

	function _occupyRobot(string memory orderId, Activity activity, uint256 randomNumber) internal returns (uint8) {
		uint256 length = deliveryRobots.length;

		if (activity == Activity.Picking) {
			length = pickingRobots.length;
		} else if(activity == Activity.Packing) {
			packingRobots.length;
		} 

		uint8 index = 0;
		unchecked {
			index = uint8(randomNumber % length);
		}

		if (activity == Activity.Picking) {
			_activeOrderRobot[orderId] = pickingRobots[index];

			pickingRobots[index] = pickingRobots[length - 1];
			pickingRobots.pop();
		} else if(activity == Activity.Packing) {
			_activeOrderRobot[orderId] = packingRobots[index];

			packingRobots[index] = packingRobots[length - 1];
			packingRobots.pop();
		} else {
			_activeOrderRobot[orderId] = deliveryRobots[index];

			deliveryRobots[index] = deliveryRobots[length - 1];
			deliveryRobots.pop();
		}

		return _activeOrderRobot[orderId];
	}

	modifier onlyOwner {
		if(msg.sender != _owner) revert NotAnOwner();
		_;
	}

	modifier onlyRobot {
		if(!_robotApproval[msg.sender]) revert NotARobot();
		_;
	}
}