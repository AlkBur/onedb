import { exit } from "process";
import DB from "../src/onedb";

const path = "./example/db";
const db = new DB(path);
let collection = db.collection("document");
if (db.err || !collection) {
    console.log(db?.err?.message);
    exit(1);
}
let result = collection.insert([
    { hello: "world_safe1" },
    { hello: "world_safe2" },
]);
if (collection.err) {
    console.log(collection.err.message);
    exit(1);
}
console.log(result);
