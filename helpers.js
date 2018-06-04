// Dictionaries used to convert packs and actions
const Packs = {
  "Minimal": 1,
  "Moyen": 2,
  "Maximal": 3
};
const unPacks = {
  1: "Minimal",
  2: "Moyen",
  3: "Maximal"
};
const Actions = {
  1: "Collecte",
  2: "Traitement",
  3: "Transfert",
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
    case "Moyen":
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
  if (data.includes('Collecte'))
    actions[0] = 1;
  if (data.includes('Traitement'))
    actions[1] = 1;
  if (data.includes('Transfert'))
    actions[2] = 1;
  return actions;
}

// Get pack id by name
exports.getPackID = function(pack) {
  return Packs[pack];
}

// Clean client infos received from the Blockchain
exports.cleanClientInfo = function(address, info) {
  var actionsString = "";
  var actionsArray = info[2].toString().split(",");
  for (let i = 0; i < actionsArray.length; i++) {
    if (actionsArray[i] == "1")
      actionsString += Actions[i + 1] + " ";
  }
  var actionsDoneString = "";
  var actionsDoneArray = info[4].toString().replace(/,/g, '').match(/.{1,3}/g);
  if (actionsDoneArray != null) {
    for (let i = 0; i < actionsDoneArray.length; i++) {
      for (let j = 0; j < actionsDoneArray[i].length; j++) {
        if (actionsDoneArray[i][j] == "1")
          actionsDoneString += Actions[j + 1] + ", ";
      }
    }
  }
  var result = {};
  result.address = address;
  result.id = info[0].toNumber();
  result.pack = unPacks[info[1].toNumber()];
  result.actions = actionsString;
  result.tx = info[3];
  result.actionsDone = actionsDoneString;
  return result;
}
