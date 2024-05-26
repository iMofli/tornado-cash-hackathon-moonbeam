import crypto from 'crypto';
import circomlib from 'circomlib';
import {BigNumber} from 'bignumber.js';
import {ethers} from 'hardhat';
import * as dotenv from 'dotenv';
import * as process from "node:process";
import {DEVTornado} from "../typechain-types";
import * as ffjavascript from "ffjavascript";


dotenv.config()

const Scalar = ffjavascript.Scalar;
const leBuff2int = (buff: Buffer) => {
    if (buff.length < 32) {
        const paddedBuffer = Buffer.concat([buff, Buffer.alloc(32 - buff.length)]);
        return Scalar.fromRprLE(paddedBuffer);
    }
    return Scalar.fromRprLE(buff);
}

export const rbigint = (nbytes: any): any => leBuff2int(crypto.randomBytes(nbytes));

export const pedersenHash = (data: any) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0]

export const toHex = (number: BigNumber | Buffer | number | string, length: number = 32): string => {
    let str: string = number instanceof Buffer ? number.toString('hex') : new BigNumber(number).toString(16);
    return '0x' + str.padStart(length * 2, '0');
}

export async function printETHBalance({ address, name }: any) {
    const provider = ethers.provider;
    const balanceInWei = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balanceInWei);
    console.log(`${name} ETH balance is ${balanceInEth}`);
}

export async function getTornadoContract(): Promise<DEVTornado> {
    return await (await ethers.getContractFactory("DEVTornado")).attach(process.env.TORNADO_CONTRACT_ADDRESS)
}

export async function getSigner() {
    const [signer] = await ethers.getSigners()
    return signer
}

export const createDepositFromNote = (note: string) => {
    let deposit: any = {};
    deposit.preimage = Buffer.from(note.slice(2), 'hex');
    deposit.commitment = pedersenHash(deposit.preimage);
    deposit.commitmentHex = toHex(deposit.commitment);

    const nullifierBuffer: Buffer = deposit.preimage.slice(0, 31);
    const secretBuffer: Buffer = deposit.preimage.slice(31, 31 + 31);
    deposit.nullifier = leBuff2int(nullifierBuffer);
    deposit.secret = leBuff2int(secretBuffer);

    deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
    deposit.nullifierHex = toHex(deposit.nullifierHash)
    return deposit
}