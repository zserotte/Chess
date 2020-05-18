import { MongoClient } from 'mongodb';

var url = 'mongodb://localhost/Chess';

MongoClient.connect(url, function(err, db) {
    console.log("We made it!");
        db.close();
})

// Credit to: https://www.digitalocean.com/community/tutorials/how-to-integrate-mongodb-with-your-node-application

/* import mongoose from 'mongoose';

// import { MongoClient as mongo } from 'mongodb';

const MONGO_USERNAME = 'Zach';
const MONGO_PASSWORD = 'Chess';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'Chess';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url, {useNewUrlParser: true}, {useMongoClient:true});

const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db');

const path = __dirname + '/views/'; */

/* function database() {
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err)
            return
        }
    const db = client.db('Chess')
    const collection = db.collection('Players')
        collection.find().toArray((err, items) => {
            return (items);
        })
    })
}
export default database */
