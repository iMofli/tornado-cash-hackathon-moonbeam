import crypto from 'crypto';
import snarkjs from 'snarkjs';
import circomlib from 'circomlib';
import { BigNumber } from 'bignumber.js';

export const rbigint = (nbytes: number): any => snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes));

export const pedersenHash = (data: any) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0]

export const toHex = (number: BigNumber | Buffer | number | string, length: number = 32): string => {
    let str: string = number instanceof Buffer ? number.toString('hex') : new BigNumber(number).toString(16);
    return '0x' + str.padStart(length * 2, '0');
};