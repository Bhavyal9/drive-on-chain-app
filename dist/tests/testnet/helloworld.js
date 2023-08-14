"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helloworld_1 = require("../../src/contracts/helloworld");
const txHelper_1 = require("../utils/txHelper");
const scrypt_ts_1 = require("scrypt-ts");
const message = 'hello world, sCrypt!';
async function main() {
    await helloworld_1.Helloworld.compile();
    const instance = new helloworld_1.Helloworld((0, scrypt_ts_1.sha256)((0, scrypt_ts_1.toByteString)(message, true)));
    // connect to a signer
    await instance.connect((0, txHelper_1.getDefaultSigner)());
    // contract deployment
    const deployTx = await instance.deploy(txHelper_1.inputSatoshis);
    console.log('Helloworld contract deployed: ', deployTx.id);
    // contract call
    const { tx: callTx } = await instance.methods.unlock((0, scrypt_ts_1.toByteString)(message, true));
    console.log('Helloworld contract `unlock` called: ', callTx.id);
}
describe('Test SmartContract `Helloworld` on testnet', () => {
    it('should succeed', async () => {
        await main();
    });
});
//# sourceMappingURL=helloworld.js.map