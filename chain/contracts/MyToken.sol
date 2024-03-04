// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MyToken {
    string public name = "MyToken";
    string public symbol = "MYT";
    uint256 public totalSupply = 1000000;
    address public owner;

    mapping(address => uint256) balances;

    // イベント定義
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() {
        // コントラクト作成者に最大供給量分のトークンを設定
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // トークンを転送する関数
    function transfer(address to, uint256 amount) external {
        // この関数を実行したアドレスの残高に指定したトークン量があるかチェック
        require(balances[msg.sender] >= amount, "Not enough tokens");
        // この関数を実行したアドレスの残高から指定したトークン量を引く
        balances[msg.sender] -= amount;
        // 指定したアドレスの残高に指定したトークン量を足す
        balances[to] += amount;
        // イベントを発火
        emit Transfer(msg.sender, to, amount);
    }

    // 指定したアドレスの残高を返す
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}