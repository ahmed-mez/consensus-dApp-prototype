pragma solidity ^0.4.18;

contract consensus {

  struct client {
    uint id;
    uint8 pack;
    uint8[3] actions;
    bytes32 tx_id;
    uint8[3][] doneActions;
    bytes32[] tx_actions;
  }

  mapping (address => client) public clients;
  address[] public clientsAddresses;

  constructor() public {
  }

  function setClient(address _address, uint _id, uint8 _pack, uint8[3] _actions) public {
    clients[_address].id = _id;
    clients[_address].pack = _pack;
    clients[_address].actions[0] = _actions[0];
    clients[_address].actions[1] = _actions[1];
    clients[_address].actions[2] = _actions[2];
    if (notAdded(_address)) {
      clientsAddresses.push(_address);
    }
  }

  function setTx(address _address, bytes32 _tx_id) public {
  	clients[_address].tx_id = _tx_id;
  }

  function setDoneActions(address _address, uint8[3] _doneActions) public {
    uint8[3] memory acts;
    acts[0] = _doneActions[0];
    acts[1] = _doneActions[1];
    acts[2] = _doneActions[2];
    clients[_address].doneActions.push(acts);
  }

  function setTxAction(address _address, bytes32 _tx_actions) public {
  	clients[_address].tx_actions.push(_tx_actions);
  }

  function getAddresses() view public returns (address[]) {
    return clientsAddresses;
  }

  function getClient(address _address) view public returns (uint, uint8, uint8[3], bytes32, uint8[3][]) {
    return (clients[_address].id, clients[_address].pack, clients[_address].actions, clients[_address].tx_id, clients[_address].doneActions);
  }

  function notAdded(address clientAddr) view public returns (bool) {
    if (clientsAddresses.length == 0) {
      return true;
    }
    for(uint i = 0; i < clientsAddresses.length; i++) {
      if (clientsAddresses[i] == clientAddr) {
        return false;
      }
    }
    return true;
  }
}
