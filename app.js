// Module dependencies
const express = require('express');
const bodyParser = require('body-parser');
const expressSanitized = require('express-sanitize-escape');
const sql = require('sql.js');
const path = require("path");
const helpers = require("./helpers.js");
const settings = require("./settings.js");
const fs = require("fs");
const Web3 = require('web3');
const solc = require('solc');
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use bodyParser
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Use express-sanitize-escape
app.use(expressSanitized.middleware());

// Instanciate an in-memory SQLite database
var db = new sql.Database();

// Initialize database tables
helpers.initDB(db);

// Route handling
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Handle the smart contract deployment
app.get('/deploy', function(req, res) {
  // Connect to the ganache-cli simulated Ethereum Blockchain using web3
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // Read and compile the smart contract
  var code = fs.readFileSync('smart_contract/consensus.sol').toString()
  var compiledCode = solc.compile(code)
  var abiDefinition = JSON.parse(compiledCode.contracts[':consensus'].interface)
  var consensusContract = web3.eth.contract(abiDefinition)
  var byteCode = compiledCode.contracts[':consensus'].bytecode
  //Deploy the smart contract
  var deployedContract = consensusContract.new({
    data: byteCode,
    from: web3.eth.accounts[settings.PROVIDER_ID],
    gas: settings.DEPLOYMENT_GAS_PRICE
  }, function(e, contract) {
    if (!e) {
      if (!contract.address) {
        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("Contract mined! Address: " + contract.address);
        contractInstance = consensusContract.at(contract.address);
        res.render('deploy', {
          data1: "Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...",
          data2: "Contract mined! Address: " + contract.address,
        });
      }
    }
  })
});

// Handle client get request
app.get('/client', function(req, res) {
  res.render('client');
});

// Handle client post request
app.post('/client', function(req, res) {
  var clientID = req.body.id;
  if (helpers.isValideID(clientID)) {
    res.render('client');
    // Update database with new entered data
    helpers.updateUsersTable(db, req.body);
    helpers.updateDataTable(db, req.body);
    // Save client choices to the Blockchain
    var pack = helpers.getPackID(req.body.pack);
    var actions = helpers.convertActions(req.body.action);
    var tx = contractInstance.setClient(web3.eth.accounts[clientID], clientID, pack, actions, {
      from: web3.eth.accounts[clientID],
      gas: settings.GAS_PRICE
    });
    contractInstance.setTx(web3.eth.accounts[clientID], tx, {
      from: web3.eth.accounts[clientID],
      gas: settings.GAS_PRICE
    });
  } else {
    res.send("Please enter a valid id! (between 1 and 9)");
  }
});

// Handle provider get request
app.get('/provider', function(req, res) {
  // Query the database to show data
  var resultsDB1 = db.exec("SELECT * FROM users");
  var resultsDB2 = db.exec("SELECT * FROM data");
  res.render('provider', {
    dataDB1: resultsDB1,
    dataDB2: resultsDB2,
  });
});

// Handle provider post request
app.post('/provider', function(req, res) {
  // Save to the Blockchain the actions done by the provider on users data
  var clientID = req.body.id;
  var actions = helpers.convertActions(req.body.action);
  var tx_actions = contractInstance.setDoneActions(web3.eth.accounts[clientID], actions, {
    from: web3.eth.accounts[settings.PROVIDER_ID],
    gas: settings.GAS_PRICE
  });
  contractInstance.setTxAction(web3.eth.accounts[clientID], tx_actions, {
    from: web3.eth.accounts[settings.PROVIDER_ID],
    gas: settings.GAS_PRICE
  });
  // Render the same page as a get request
  var resultsDB1 = db.exec("SELECT * FROM users");
  var resultsDB2 = db.exec("SELECT * FROM data");
  res.render('provider', {
    dataDB1: resultsDB1,
    dataDB2: resultsDB2,
  });
});

// Handle auditor get request
app.get('/auditor', function(req, res) {
  // Query the provider database to show data
  var resultsDB1 = db.exec("SELECT * FROM users");
  var resultsDB2 = db.exec("SELECT * FROM data");
  // Get clients choices saved in the Blockchain
  var resultsBC = []
  var addresses = contractInstance.getAddresses();
  for (let i = 0; i < addresses.length; i++) {
    info = contractInstance.getClient(addresses[i]);
    resultsBC.push(helpers.cleanClientInfo(addresses[i], info));
  }
  res.render('auditor', {
    dataBC: resultsBC,
    dataDB1: resultsDB1,
    dataDB2: resultsDB2,
  });
});

// Start listening
app.listen(settings.PORT, settings.HOST, function() {
  console.log("listening on port 8080");
});
