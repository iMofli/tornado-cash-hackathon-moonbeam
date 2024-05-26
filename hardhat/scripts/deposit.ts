import {getSigner, getTornadoContract, pedersenHash, printETHBalance, rbigint, test, toHex,} from "./utils";
import {ethers} from "hardhat";
import crypto from 'crypto';
import snarkjs from "snarkjs";
import {Log} from "ethers";
import {BigNumber} from "bignumber.js";

let netId = 1287

function createDeposit({ nullifier, secret }): { nullifier: any, secret: any } {
    console.log('Creating deposit for nullifier', nullifier, 'and secret', secret)
    const deposit: any = { nullifier, secret }
    deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
    deposit.commitment = pedersenHash(deposit.preimage)
    console.log(`Commitment: ${toHex(deposit.commitment)}`)
    deposit.commitmentHex = toHex(deposit.commitment)
    console.log(`Commitment Hex: ${deposit.commitmentHex}`)
    deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
    console.log(`Nullifier Hash: ${toHex(deposit.nullifierHash)}`)
    deposit.nullifierHex = toHex(deposit.nullifierHash)
    console.log(`Nullifier Hex: ${deposit.nullifierHex}`)
    return deposit
}

async function deposit(amount: number) {
    let tornadoContract = await getTornadoContract()
    let signer = await getSigner()
    const deposit: any = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) })
    const note = toHex(deposit.preimage, 62)
    const noteString = `tornado-dev-${amount}-${netId}-${note}`
    console.log(`Your note: ${noteString}`)
    await printETHBalance({ address: await tornadoContract.getAddress(), name: 'Tornado' })
    await printETHBalance({ address: await signer.address, name: 'Sender account' })
    const value = ethers.parseEther(amount.toString())
    console.log('Submitting deposit transaction')
    await tornadoContract.deposit(deposit.commitmentHex, { value: value, gasPrice: 2e9 })
    await printETHBalance({ address: await tornadoContract.getAddress(), name: 'Tornado' })
    await printETHBalance({ address: await signer.address, name: 'Sender account' })
    return noteString
}

function createDeposit2({ nullifier, secret }): { nullifier: any, secret: any } {
    console.log('Creating deposit for nullifier', nullifier, 'and secret', secret)
    const deposit: any = { nullifier, secret }
    deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
    const preimageHex = toHex(deposit.preimage, 62);
    console.log(`Preimage Hex: ${preimageHex}`);

    const recoveredPreimage = Buffer.from("0xe6b068d2928e00de36e707acc1e4c678f44b67dd8eadc36e50789dd4df96fbf805d18a395a2f0df49b1973cdbff9f966cc98ccca98c178458f82d473b52c".slice(2), 'hex');// Remueve "0x" antes de convertir
    const commitment = pedersenHash(recoveredPreimage);
    console.log(`Commitment: ${toHex(commitment)}`)
    // random
    const nullifierBuffer: Buffer = deposit.preimage.slice(0, 31);
    const secretBuffer: Buffer = deposit.preimage.slice(31, 31 + 31);
    const extractedNullifier = snarkjs.bigInt.leBuff2int(nullifierBuffer);
    const extractedSecret = snarkjs.bigInt.leBuff2int(secretBuffer);
    const newPreimage = Buffer.concat([
        extractedNullifier.leInt2Buff(31),
        extractedSecret.leInt2Buff(31)
    ]);
    // random
    deposit.commitment = pedersenHash(deposit.preimage)
    deposit.commitmentHex = toHex(deposit.commitment)
    deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
    deposit.nullifierHex = toHex(deposit.nullifierHash)
    return deposit
}

function random() {
    test()
    const deposit: any = createDeposit2({ nullifier: rbigint(31), secret: rbigint(31) })
    const preimage = deposit.preimage
    const nullifierBuffer = preimage.slice(0, 32);
    const secretBuffer = preimage.slice(32, 32 * 31);
    console.log(`Nullifier: ${(nullifierBuffer.toString('hex'))}`)
    console.log(`Secret: ${secretBuffer.toString('hex')}`)
    const r = Buffer.from("0x37f8ac18d8b7aaad762cd15a989b4724e271c6a77da3806009a075f9fba870dd137e0f0c34a764b6f6ae6992912a7e459520b5398ebcca288a4f8f82fb51")
    console.log(`commitment: ${toHex(pedersenHash(r))}`);
}

//deposit(0.1).then(c => console.log(c)).catch(e => console.error(e))
random()