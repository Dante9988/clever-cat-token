pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;

    // Variables
    string public name = "Clever Cat Token";
    string public symbol = "CLC";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track balances
    mapping(address => uint256) public balanceOf; // HashMap key pair values

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        totalSupply = 1000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // Send tokens
    function transfer(address _to, uint256 _value)
        public
        returns (bool success) {
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value); // If sender has enough balance, transfer is true, if not transfer is false (reject the transfer)
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value); // Decrease balance (Take the balance and reduce it by howch has been sent)
        balanceOf[_to] = balanceOf[_to].add(_value); // Increase the reciever's balance
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
