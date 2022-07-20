import { assert } from "console";
import * as fs from "fs";
import * as path from "path";
import Collection from "./collection";

import Debug from "debug";
const debug = Debug("connect-db");

export type ConnectDBOptions = {
    apiLevel?: number;
};

export default class OneDB {
    private path: string = "";
    private cols: Map<string, Collection> = new Map();
    public err: Error | null = null;
    //private apiLevel: number;
    //   public Collection: any;
    //   public Code: any;
    //   public Binary: any;
    //   public ObjectID: any;

    constructor(dir: string, _options: ConnectDBOptions = { apiLevel: 140 }) {
        debug("create DB instance");
        // Check params
        if (dir && dir != "") {
            this.path = path.resolve(dir || "");
        } else {
            throw new Error("Error path");
        }

        fs.accessSync(this.path, fs.constants.F_OK);
    }
    collection(name: string): Collection | null {
        this.nameCheck(name);
        if (this.err) {
            return null;
        }
        let c = this.cols.get(name);
        if (c) {
            return c;
        }
        c = new Collection(this.path, name);
        if (c.err) {
            this.err = c.err;
            return null;
        }
        this.cols.set(name, c);
        return c;
    }
    private nameCheck(name: string) {
        if (typeof name !== "string")
            this.err = new Error("collection name must be a String");
        else if (name.length == 0)
            this.err = new Error("collection names cannot be empty");
        else if (name.indexOf("$") != -1)
            this.err = new Error("collection names must not contain '$'");
        else {
            var di = name.indexOf(".");
            if (di == 0 || di == name.length - 1)
                this.err = new Error(
                    "collection names must not start or end with '.'"
                );
        }
    }
    static create(dir: string, options: ConnectDBOptions = {}): OneDB {
        return new OneDB(dir, options);
    }
}
