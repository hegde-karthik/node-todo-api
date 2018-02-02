const {SHA256} = require('crypto-js');

let msg = "this is a message from me";
let hash = SHA256(msg).toString();
console.log(`msg:${msg}`);
console.log(`Hash:${hash}`);
