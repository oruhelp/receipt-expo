import * as SQLite from 'expo-sqlite';
const TABLE_USER = 'user';
const TABLE_RECEIPTS = 'receipts';
const TABLE_DONARS = 'donars';
const TABLE_ORGS = 'orgs';

export default class Database {
  constructor(dbName) {
    this.db = SQLite.openDatabase(dbName);

    // create user
    this.executeQuery(
      'create table if not exists ' +
        TABLE_USER +
        ' (id integer primary key autoincrement, name text, email text, phoneNumber text, userName text, activeOrg text, lookupId text);',
      []
    );

    // create organization
    this.executeQuery(
      'create table if not exists ' +
        TABLE_ORGS +
        ' (id integer primary key autoincrement, name text, addressLine1 text, addressLine2 text, registeredCountry text, pincode text, role text, phoneNumber text, email text, website text, userName text, registeredDate text, registeredNumber text, active integer, templateName text, templateColor text, logoSrc text, lookupId integer, senderName text, senderPhoneNumber text, senderEmail text);',
      []
    );

    // create receipts table
    this.executeQuery(
      'create table if not exists ' +
        TABLE_RECEIPTS +
        ' (id integer primary key autoincrement, number text, dateTime text, donarId text, amount text, notes text, footer text, shortUrl text, sentTo text);',
      []
    );

    // create donar table
    this.executeQuery(
      'create table if not exists ' +
        TABLE_DONARS +
        ' (id integer primary key autoincrement, name text, number text, email text, website text, contactBookId text);',
      []
    );
  }

  executeQuery = (query, args = []) =>
    new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          query,
          args,
          (_, results) => {
            resolve(results);
          },
          error => {
            console.log('Error executed some query', error, query, args);
            reject(error);
          }
        );
      });
    });

  // user
  addUser(_userDetails) {
    return this.executeQuery(
      'insert into ' +
        TABLE_USER +
        ' (id, name, email, phoneNumber, userName, lookupId) values (?, ?, ?, ?, ?, ?)',
      [
        1,
        _userDetails.name,
        _userDetails.email,
        _userDetails.phoneNumber,
        _userDetails.userName,
        1,
      ]
    );
  }

  getActiveUserName() {
    return this.executeQuery('select * from ' + TABLE_USER);
  }

  updateActiveOrgOfUser(_orgUserName) {
    return this.executeQuery(
      'update ' +
        TABLE_USER +
        ' set activeOrg = "' +
        _orgUserName +
        '" where id = 1'
    );
  }

  // Organization
  addOrg(_orgDetails) {
    console.log('Adding ORG- database service -> ', _orgDetails);
    return this.executeQuery(
      'insert into ' +
        TABLE_ORGS +
        ' (name, addressLine1, addressLine2, registeredCountry, pincode, role, phoneNumber, email, website, userName, registeredDate, registeredNumber, active, templateName, templateColor, logoSrc, lookupId, senderName, senderPhoneNumber, senderEmail) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)',
      [
        _orgDetails.name,
        _orgDetails.addressLine1,
        _orgDetails.addressLine2,
        _orgDetails.registeredCountry,
        _orgDetails.pincode,
        _orgDetails.sender.role,
        _orgDetails.phoneNumber,
        _orgDetails.email,
        _orgDetails.website,
        _orgDetails.userName,
        _orgDetails.registeredDate.toString(),
        _orgDetails.registeredNumber,
        1,
        _orgDetails.templateName,
        _orgDetails.templateColor,
        _orgDetails.logoSrc,
        1,
        _orgDetails.sender.name,
        _orgDetails.sender.phoneNumber,
        _orgDetails.sender.email,
      ]
    );
  }
  getActiveOrg() {
    return this.executeQuery(
      'select * from ' + TABLE_ORGS + ' where active = 1'
    );
  }
  updateOrg() {
    return this.executeQuery('');
  }
  deleteOrg() {
    return this.executeQuery('');
  }

  // Receipt
  getReceipts() {
    return this.executeQuery('select * from ' + TABLE_RECEIPTS);
  }
  addReceipt(_receipt) {
    return this.executeQuery(
      'insert into ' +
        TABLE_RECEIPTS +
        ' (id, number, dateTime, donarId, amount, notes, footer) values (?, ?, ?, ?, ?, ?, ?)',
      [
        parseInt(_receipt.number),
        _receipt.number,
        _receipt.dateTime,
        _receipt.donarId.toString(),
        _receipt.amount,
        _receipt.notes,
        _receipt.footer,
      ]
    );
  }
  getReceiptsOfDonar(_donarId) {
    return this.executeQuery(
      'select * from ' + TABLE_RECEIPTS + ' where donarId = ' + _donarId
    );
  }
  updateshortUrlOfReceipt(_receiptId, _shortUrl) {
    return this.executeQuery(
      'update ' +
        TABLE_RECEIPTS +
        ' set shortUrl = "' +
        _shortUrl +
        '" where id = ' +
        parseInt(_receiptId)
    );
  }

  // Donar
  getDonars() {
    return this.executeQuery('select * from ' + TABLE_DONARS);
  }
  addDonar(_donar) {
    return this.executeQuery(
      'insert into ' +
        TABLE_DONARS +
        ' (name, number, email, website, contactBookId) values (?, ?, ?, ?, ?)',
      [
        _donar.name,
        _donar.number,
        _donar.email,
        _donar.website,
        _donar.contactBookId,
      ]
    )
      .then(res => console.log('SUCCESS', res))
      .catch(err => console.log(err));
  }
  deleteDonar(_id) {
    return this.executeQuery(
      'delete from ' + TABLE_DONARS + ' where id = ' + _id
    );
  }
}
