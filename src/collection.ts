import OneDB from "./onedb";
import * as path from "path";
import * as fs from "fs";
import UUID from "./uuid";
import NodeCache from "node-cache";

export default class Collection {
    private filename: string;
    private name: string;
    public err: Error | null = null;
    private fd: number;
    private fsize: number;
    private store = new Map();
    private cache = new NodeCache({
        checkperiod: 60,
        maxKeys: 10000,
        stdTTL: 60,
        useClones: false,
    });

    constructor(dir: string, name: string) {
        this.filename = path.join(dir, name);
        this.name = name;
        this.fsize = fs.statSync(this.filename).size;
        this.fd = fs.openSync(this.filename, "a+");
    }

    insert(docs: any): Array<any> {
        let result: Array<string> = new Array();
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        //console.time("test");
        for (const doc of docs) {
            let id = this.put(doc);
            if (this.err) return result;
            result.push(id);
        }
        //console.timeEnd("test");
        return result;
    }

    private put(item: any): any {
        if (item.id === undefined) item.id = UUID();
        const id = String(item.id).padStart(36, " ");
        let sobi = Buffer.from(JSON.stringify(item));

        //lenght = 106
        let header = {
            id: id,
            data: new Date().valueOf(),
            size: String(sobi.length).padStart(20, "0"),
            v: "001",
        };

        let sobh = Buffer.from(
            JSON.stringify(header) + "\n" + sobi.toString() + "\n"
        );

        const pos = this.fsize;

        const numberBytes = fs.writeSync(this.fd, sobh);
        if (numberBytes != 106 + 1 + sobi.length + 1)
            throw new Error("Error write in file");
        this.fsize += numberBytes;

        this.store.set(item.id, { pos: pos, size: numberBytes });
        this.cache.set(item.id, item);

        return item.id;
    }

    private del(item: any): boolean {
        if (item.id === undefined) return false;
        else if (!this.store.has(item.id)) return false;

        const id = String(item.id).padStart(36, " ");

        //lenght = 106
        let header = {
            id: id,
            data: new Date().valueOf(),
            size: String(0).padStart(20, "0"),
            v: "del",
        };

        let sobh = Buffer.from(JSON.stringify(header) + "\n");

        const pos = this.fsize;

        const numberBytes = fs.writeSync(this.fd, sobh);
        if (numberBytes != 106 + 1) throw new Error("Error write in file");
        this.fsize += numberBytes;

        this.store.delete(item.id);
        this.cache.del(item.id);

        return true;
    }

    hex_to_uuid(hexstring: string): string {
        return (
            hexstring.substring(0, 8) +
            "-" +
            hexstring.substring(8, 12) +
            "-" +
            hexstring.substring(12, 16) +
            "-" +
            hexstring.substring(16, 20) +
            "-" +
            hexstring.substring(20)
        );
    }
}
