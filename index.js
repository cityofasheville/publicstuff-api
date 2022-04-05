// https://github.com/node-fetch/node-fetch/blob/HEAD/docs/v3-UPGRADE-GUIDE.md
// import fetch from 'node-fetch';
// import 'dotenv/config'
// import * as pg from 'pg'
// const { Client } = pg
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Client } = require("pg")
require("dotenv").config()

async function go(){
    try{
        let api_url_base = 'https://api.publicstuff.com/app/requests?limit=500&filters[client_id]=819'
        let api_url = api_url_base
        let api_key = process.env.api_key
        let next_page = 0

        const client = new Client({
            host: process.env.host,
            user: process.env.user,
            port: process.env.port,
            password: process.env.password,
            database: process.env.database,
            max: 10,
            idleTimeoutMillis: 10000,
        });
        await client.connect();

        do {
            let res = await fetch(api_url, {
                method: 'GET',
                headers: { 
                    'Authorization': 'Token token=' + api_key
                },
            })
            data = await res.json()
            next_page = data.properties.next_page
            api_url = api_url_base + '&page=' + next_page
                await load_db(client,data.entities)

        } while (next_page)

        await client.end()  

    }catch(err){
        console.log(err)
    }

}
go()

async function load_db(client,rows) {
    try {
        for(const row of rows) {
            let sql = `
            INSERT INTO avl_app_requests (id, json_data)
            VALUES(${row.properties.id},'${JSON.stringify(row).replace(/'/g,"''")}')
            `
            console.log(sql)
            const res = await client.query(sql)
        }
    }
    catch(err){
      throw err
    }
}