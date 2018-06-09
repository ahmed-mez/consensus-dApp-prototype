pragma solidity ^0.4.18;

contract consensus {

  // Every client is defined as a struct containing his choices and actions done on his data
  struct client {
    uint id;
    uint8[] pack;
    uint8[3][] actions;
    bytes32[] txs;
    uint8[3][] done_actions;
    bytes32[] tx_done_actions;
  }

  mapping (address => client) public clients;
  address[] public clientsAddresses;

  constructor() public {
  }

  function setClient(address _address, uint _id, uint8 _pack, uint8[3] _actions) public {
    uint8[3] memory acts;
    acts[0] = _actions[0];
    acts[1] = _actions[1];
    acts[2] = _actions[2];
    clients[_address].actions.push(acts);
    clients[_address].pack.push(_pack);
    clients[_address].id = _id;
    if (notAdded(_address)) {
    clientsAddresses.push(_address);
    }
  }

  function getClientID(address _address) view public returns (uint) {
    return clients[_address].id;
  }

  function getPack(address _address) view public returns(uint8[]) {
    return clients[_address].pack;
  }

  function getActions(address _address) view public returns (uint8[3][]) {
    return clients[_address].actions;
  }

  function setTx(address _address, bytes32 _tx) public {
  	clients[_address].txs.push(_tx);
  }

  function getTxs(address _address) view public returns (bytes32[]) {
    return clients[_address].txs;
  }

  // Function called when provider do actions on data
  function setDoneActions(address _address, uint8[3] _done_actions) public {
    uint8[3] memory acts;
    acts[0] = _done_actions[0];
    acts[1] = _done_actions[1];
    acts[2] = _done_actions[2];
    clients[_address].done_actions.push(acts);
  }

  function getDoneActions(address _address) view public returns (uint8[3][]) {
    return clients[_address].done_actions;
  }

  // Function called when provider do actions on data
  function setTxDoneAction(address _address, bytes32 _tx_done_action) public {
  	clients[_address].tx_done_actions.push(_tx_done_action);
  }

  function getTxDoneActions(address _address) view public returns (bytes32[]) {
    return clients[_address].tx_done_actions;
  }

  function getAddresses() view public returns (address[]) {
    return clientsAddresses;
  }

  function notAdded(address clientAddr) view public returns (bool) {
    for(uint i = 0; i < clientsAddresses.length; i++) {
      if (clientsAddresses[i] == clientAddr) {
        return false;
      }
    }
    return true;
  }
}
