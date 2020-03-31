import * as SQLite from 'expo-sqlite';

export default class Database {
  constructor(dbName) {
    console.log('Creating new DB - ', dbName);
    this.db = SQLite.openDatabase(dbName);

    // create organization
    this.executeQuery(
      'create table if not exists orgs (id integer primary key not null, orgname text);',
      []
    );

    // create receipts table
    this.executeQuery(
      'create table if not exists receipts (id integer primary key not null, title text, dateTime text, donarId text, donarName text, amount text, notes text, footer text);',
      []
    );

    // create donar table
    this.executeQuery(
      'create table if not exists donars (id integer primary key not null, fname text, lname text, orgname text);',
      []
    );
  }

  executeQuery(query, args) {
    this.db.transaction(tx => {
      tx.executeSql(
        query,
        args,
        (_, { rows }) => {
          console.log({ success: true, data: rows });
          return { success: true, data: rows };
        },
        (_, error) => {
          console.log({ success: false, data: error });
          return { success: false, data: error };
        }
      );
    });
  }

  // Organization
  addOrg() {}
  getActiveOrg() {}
  updateOrg() {}
  deleteOrg() {}

  // Receipt
  getReceipts() {}
  addReceipt(receipt) {
    this.executeQuery(
      'insert into receipt (id, title, dateTime, donarId, donarName, amount, notes, footer) values (?, ?, ?, ?, ?, ?, ?, ?)',
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
  getReceipt() {}

  // Donar
  getDonars() {}
  addDonar() {}
  getDonar() {}
  updateDonar() {}
  deleteDonar() {}
}
