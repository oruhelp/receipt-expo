import * as SQLite from 'expo-sqlite';
const TABLE_RECEIPTS = 'receipts';
const TABLE_DONARS = 'donars';
const TABLE_ORGS = 'orgs';

export default class Database {
  constructor(dbName) {
    this.db = SQLite.openDatabase(dbName);

    // create organization
    this.executeQuery(
      'create table if not exists ' +
        TABLE_ORGS +
        ' (id integer primary key autoincrement, orgname text, userName text, registeredCountry text, registeredDate text, registeredNumber text, role text, active integer);',
      []
    );

    // create receipts table
    this.executeQuery(
      'create table if not exists ' +
        TABLE_RECEIPTS +
        ' (id integer primary key autoincrement, title text, dateTime text, donarId text, donarName text, amount text, notes text, footer text);',
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

  // Organization
  addOrg(_orgDetails) {
    return this.executeQuery(
      'insert into ' +
        TABLE_ORGS +
        ' (orgName, userName, registeredCountry, registeredDate, registeredNumber, role, active) values (?, ?, ?, ?, ?, ?, ?)',
      [
        _orgDetails.orgName,
        _orgDetails.userName,
        _orgDetails.registeredCountry,
        _orgDetails.registeredDate,
        _orgDetails.registeredNumber,
        _orgDetails.role,
        1,
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
  addReceipt(receipt) {
    return this.executeQuery(
      'insert into ' +
        TABLE_RECEIPTS +
        ' (id, title, dateTime, donarId, donarName, amount, notes, footer) values (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        parseInt(receipt.id, 10),
        receipt.title,
        receipt.dateTime,
        receipt.donarId.toString(),
        receipt.donarName,
        receipt.amount,
        receipt.notes,
        receipt.footer,
      ]
    );
  }
  getReceipt() {
    return this.executeQuery('');
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
  getDonar() {
    return this.executeQuery('');
  }
  updateDonar() {
    return this.executeQuery('');
  }
  deleteDonar(_id) {
    return this.executeQuery(
      'delete from ' + TABLE_DONARS + ' where id = ' + _id
    );
  }
}
