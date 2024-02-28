
// This version fetches data from the publicstuff API and write it to a file in SQL format.
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const fs = require('fs');

async function go() {
  try {
    const api_url_base = 'https://api.publicstuff.com/app/requests?limit=500&filters[client_id]=819';
    let api_url = api_url_base; 
    const api_key = process.env.api_key;
    let next_page = 0;
    var stream = fs.createWriteStream("data.sql", { flags: 'a' });
    do {
      let res = await fetch(api_url, {
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + api_key
        },
      })
      data = await res.json();
      next_page = data.properties.next_page;
      api_url = api_url_base + '&page=' + next_page;
      await appendSQLFile(stream,data.entities);
    } while (next_page);
  } catch (err) {
    console.log(err);
  } finally {
    stream.end();
  }

}
go();

async function appendSQLFile(stream,rows) {
  let sql = 'INSERT INTO avlapp_requests (id, json_data) VALUES ';
  try {
    for (const row of rows) {
      sql = sql + `
(${row.properties.id},'${JSON.stringify(row).replace(/'/g, "''")}'),`;
    }
    stream.write(sql.slice(0, -1) + ';\n');
  } catch (err) {
    throw err;
  }
}