import sqlite3 from "sqlite3";
import fs from "fs"

"use strict";

const DB_PATH = "database/app.db";
const SCHEMA_FILE = "database/schema.sql";
const SEED_FILE = "database/seed.sql";

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) throw err;
});


async function createSchema() {
    const schemaQuery = fs.readFileSync(SCHEMA_FILE).toString();

    return new Promise((resolve, reject) => {
        db.exec(schemaQuery, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

async function seedDatabase() {
    const seedQuery = fs.readFileSync(SEED_FILE).toString();

    return new Promise((resolve, reject) => {
        db.exec(seedQuery, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

async function databaseEmpty() {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM stations", (err, row) => {
            if (err) {
                return resolve(false);
            }
            if (row) {
                return resolve(false);
            }
            resolve(true);
        });
    });
}

export async function initDatabase() {
    await createSchema();
    const empty = await databaseEmpty();
    if (!empty) {
        console.log("Database already initialized, skipping initialization.");
        return;
    }
    try {
        await seedDatabase();
        console.log("Database initialized successfully.");
    }
    catch (err) {
        console.error("Failed to initialize database with error:", err);
    }
}

export default db;