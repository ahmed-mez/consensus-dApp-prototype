// Dictionaries used to convert packs and actions
const Packs = {
  "Minimal": 1,
  "Medium": 2,
  "Maximal": 3
};
const unPacks = {
  1: "Minimal",
  2: "Medium",
  3: "Maximal"
};
const Actions = {
  1: "Collection",
  2: "Treatment",
  3: "Transfer",
};

// Initialize database with empty data columns
exports.initDB = function(db) {
  sqlstr = "CREATE TABLE users (id int primary key, pack text, actions text);";
  sqlstr += "INSERT INTO users VALUES (1, '', '');"
  sqlstr += "INSERT INTO users VALUES (2, '', '');"
  sqlstr += "INSERT INTO users VALUES (3, '', '');"
  sqlstr += "INSERT INTO users VALUES (4, '', '');"
  sqlstr += "INSERT INTO users VALUES (5, '', '');"
  sqlstr += "INSERT INTO users VALUES (6, '', '');"
  sqlstr += "INSERT INTO users VALUES (7, '', '');"
  sqlstr += "INSERT INTO users VALUES (8, '', '');"
  sqlstr += "INSERT INTO users VALUES (9, '', '');"
  db.run(sqlstr);
  sqlstr = "CREATE TABLE data (id int primary key, nom text, mail text, sexe text, tel text, adr text, nat text, stat text, etat text);";
  sqlstr += "INSERT INTO data VALUES (1, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (2, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (3, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (4, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (5, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (6, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (7, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (8, '', '', '', '', '', '', '', '');"
  sqlstr += "INSERT INTO data VALUES (9, '', '', '', '', '', '', '', '');"
  db.run(sqlstr);
}

// Check entered id
exports.isValideID = function(id) {
  return id > 0 && id < 10;
}

// Update database with new entered data
exports.updateUsersTable = function(db, data) {
  sqlstr = "UPDATE users SET pack ='" + data.pack + "' WHERE id =" + data.id + ";"
  sqlstr += "UPDATE users SET actions ='" + Array(data.action).join(" ") + "' WHERE id =" + data.id + ";"
  db.run(sqlstr);
}

// Update database with new entered data
exports.updateDataTable = function(db, data) {
  switch (data.pack) {
    case "Minimal":
      sqlstr = "UPDATE data SET nom ='" + data.nom1 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET mail ='" + data.mail1 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET sexe ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET tel ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET adr ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET nat ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET stat ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET etat ='' WHERE id =" + data.id + ";"
      db.run(sqlstr);
      break;
    case "Medium":
      sqlstr = "UPDATE data SET nom ='" + data.nom2 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET mail ='" + data.mail2 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET sexe ='" + data.sexe2 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET tel ='" + data.tel2 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET adr ='" + data.adresse2 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET nat ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET stat ='' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET etat ='' WHERE id =" + data.id + ";"
      db.run(sqlstr);
      break;
    case "Maximal":
      sqlstr = "UPDATE data SET nom ='" + data.nom3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET mail ='" + data.mail3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET sexe ='" + data.sexe3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET tel ='" + data.tel3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET adr ='" + data.adresse3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET nat ='" + data.nationalite3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET stat ='" + data.statut3 + "' WHERE id =" + data.id + ";"
      sqlstr += "UPDATE data SET etat ='" + data.etat3 + "' WHERE id =" + data.id + ";"
      db.run(sqlstr);
      break;
  }
}

// Convert actions so it can be interpreted by the smart contract
exports.convertActions = function(data) {
  var actions = [0, 0, 0];
  if (data.includes('Collection'))
    actions[0] = 1;
  if (data.includes('Treatment'))
    actions[1] = 1;
  if (data.includes('Transfer'))
    actions[2] = 1;
  return actions;
}

// Get pack id by name
exports.getPackID = function(pack) {
  return Packs[pack];
}

// Get the time of chosen/done actions by their correspondant transactions hashes
exports.getDateFromTxHashes = function(web3, txs) {
  var result = [];
  for (let i = 0; i < txs.length; i++) {
    var block = web3.eth.getTransaction(txs[i]).blockNumber;
    var date = new Date(web3.eth.getBlock(block).timestamp * 1000).toUTCString();
    result.push(date);
  }
  return result;
}

// Clean allowed actions received from the Blockchain
exports.cleanAllowedActions = function(actions) {
  var result = [];
  for (let i = 0; i < actions.length; i++) {
    var actionsString = "";
    var actionsArray = actions[i].toString().split(",");
    for (let j = 0; j < actionsArray.length; j++) {
      if (actionsArray[j] == "1")
        actionsString += Actions[j + 1] + " ";
    }
    result.push(actionsString);
  }
  return result;
}

// Clean checked done actions received from the Blockchain
exports.cleanDoneActions = function(actions) {
  var result = [];
  for (let i = 0; i < actions.length; i++) {
    var actionsString = "";
    var actionsArray = actions[i][0].toString().split(",");
    for (let j = 0; j < actionsArray.length; j++) {
      if (actionsArray[j] == "1") {
        actionsString += Actions[j + 1];
        result.push([actions[i][1], actionsString]);
      }
    }
  }
  return result;
}

// Clean client pack received from the Blockchain
exports.cleanPack = function(pack) {
  var result = [];
  for (let i = 0; i < pack.length; i++) {
    result.push(unPacks[pack[i].toNumber()]);
  }
  return result;
}

// Clean client infos received from the Blockchain
exports.cleanClientInfo = function(address, info) {
  var result = {};
  result.address = address;
  result.id = info.toNumber();
  return result;
}

// Get dates objects from transactions hashes list
function txsToDates(web3, txs) {
  var result = [];
  for (let i = 0; i < txs.length; i++) {
    var block = web3.eth.getTransaction(txs[i]).blockNumber;
    var date = new Date(web3.eth.getBlock(block).timestamp * 1000);
    result.push(date);
  }
  return result;
}

// Check if action done is in allowed actions
function legal(allowed, done) {
  for (let i = 0; i < done.length; i++) {
    if (done[i] == "1" && allowed[i] != "1")
      return false;
  }
  return true;
}
// Find out illegal actions done by the provider
exports.checkDoneActions = function(web3, allowed, txsOfAllowed, done, txsOfDone) {
  if (done.length == 0)
    return done;
  var result = [];
  var datesOfAllowed = txsToDates(web3, txsOfAllowed);
  var datesOfDone = txsToDates(web3, txsOfDone);
  for (let i = 0; i < done.length; i++) {
    if (allowed.length == 1) {
      if (legal(allowed[0], done[i]))
        result.push([done[i], "Allowed"]);
      else
        result.push([done[i], "Not Allowed!"]);
    } else if (allowed.length == 2) {
      if (datesOfDone[i] < datesOfAllowed[1]) {
        if (legal(allowed[0], done[i]))
          result.push([done[i], "Allowed"]);
        else
          result.push([done[i], "Not Allowed!"]);
      } else {
        if (legal(allowed[1], done[i]))
          result.push([done[i], "Allowed"]);
        else
          result.push([done[i], "Not Allowed!"]);
      }
    } else {
      let j = 0;
      while (j < allowed.length - 1) {
        if (datesOfDone[i] > datesOfAllowed[j] && datesOfDone[i] < datesOfAllowed[j + 1]) {
          if (legal(allowed[j], done[i]))
            result.push([done[i], "Allowed"]);
          else
            result.push([done[i], "Not Allowed!"]);
        } else if (datesOfDone[i] > datesOfAllowed[allowed.length - 1]) {
          if (legal(allowed[allowed.length - 1], done[i]))
            result.push([done[i], "Allowed"]);
          else
            result.push([done[i], "Not Allowed!"]);
          break;
        }
      j++;
    }
  }
}
return result;
}
