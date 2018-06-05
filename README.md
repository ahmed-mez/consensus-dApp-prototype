# Prototype of a Decentralized Application (dApp) using Ethereum, Solidity, Ganache and nodeJS.
A prototype of how Blockchain can ensure consent and auditability on personal data usage.

## Overview
The main purpose of this project is to implement a concrete prototype of a decentralized application that can ensure consent and auditability on personal data usage. However, there are three actors in the system;
- User
- Service provider
- Audit entity

The user chooses what personal data he wants to share with his service provider (packs), and also chooses what kind of actions he allows to be performed on his data by the service provider. Once he completes this, the data will be transferred to the provider database and his choices of packs and allowed actions will be saved in the Blockchain.

And then, every action performed by the service provider on his clients personal data will be recorded to the Blockchain and that's how the audit entity can check if the service provider respects the user choices. Having the access to the Blockchain and the database, the auditor checks the conformity between the pack chosen by the user and the amount of data collected in the service provider database, added to this, the auditor checks the conformity between the allowed actions chosen by the user and the actions made on these data by the service provider.


The dApp uses Ganache-cli to simulates the Ethereum Blockchain, the [smart contract](./smart_contract/consensus.sol) is written in Solidity, and web3js to ensure the interaction with the Blockchain. As the prototype uses an in-memory simulated Blockchain, it uses also an in-memory sqlite database with sql.js


Please note that the implementation is not scalable and lacks security tests as the main purpose of the project is implementing a concrete prototype that covers the conceptual ideas described above.

### Run the dApp
The dApp can be ran by the following steps after cloning the repository


Step1 : Install the dependencies
```
$ npm install
```
Step2 : Run the node server
```
$ npm start
```
Step 3 : Now you can deploy the smart contract and try the dApp on [localhost](http://localhost:8080)


### Run the dApp using Docker
You can use Docker to run the dApp as a container
```
$ docker build -t consensus-dapp-prototype .
$ docker run -p 8080:8080 -d consensus-dapp-prototype
```
Now you can deploy the smart contract and try the dApp on [localhost](http://localhost:8080)
