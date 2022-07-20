import crypto from "crypto";
const pool = 31 * 128; // 36 chars minus 4 dashes and 1 four
let r = crypto.randomBytes(pool);
let j = 0;
const str = "10000000-1000-4000-8000-100000000000";
const len = str.length; // 36

let strs = new Array(len);
strs[8] = "-";
strs[13] = "-";
strs[18] = "-";
strs[23] = "-";

function uuid() {
    let ch;
    let chi;

    for (chi = 0; chi < len; chi++) {
        ch = str[chi];
        if ("-" === ch || "4" === ch) {
            strs[chi] = ch;
            continue;
        }

        // no idea why, but this is almost 4x slow if either
        // the increment is moved below or the >= is changed to >
        j++;
        if (j >= r.length) {
            r = crypto.randomBytes(pool);
            j = 0;
        }

        if ("8" === ch) {
            strs[chi] = (8 + (r[j] % 4)).toString(16);
            continue;
        }

        strs[chi] = (r[j] % 16).toString(16);
    }

    return strs.join("");
}

export default uuid;
