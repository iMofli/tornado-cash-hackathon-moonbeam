import React, { useState } from 'react';
import { useBalance } from 'wagmi';

import {
  getSigner,
  getTornadoContract,
  pedersenHash,
  printETHBalance,
  rbigint,
  toHex,
} from "../utils/utils";
import { ethers } from "ethers";

interface FactoryProps {
  status: string | undefined;
  address: `0x${string}` | undefined;
}

let netId = 1287

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

function createDeposit({ nullifier, secret }): { nullifier: any, secret: any } {
  const deposit: any = { nullifier, secret }
  deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
  deposit.commitment = pedersenHash(deposit.preimage)
  deposit.commitmentHex = toHex(deposit.commitment)
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
  deposit.nullifierHex = toHex(deposit.nullifierHash)
  return deposit
}

const Deposit: React.FC<FactoryProps> = ({ status, address }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const { data, isError, isLoading } = useBalance({
    address: address
  });

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const noteString = await deposit(0.1);
      setBalance(data?.formatted || null);
      setNote(noteString);
    } catch (error) {
      setBalance('Error during deposit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl max-w-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Deposit Funds</h2>
        <div className="space-y-6">
          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-500 to-red-600 hover:from-blue-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            onClick={handleDeposit}
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Processing...' : 'Deposit 0.1 DEV'}
          </button>
          {balance !== null && (
            <div className="mt-4 text-center">
              <p>Balance: {balance} DEV</p>
            </div>
          )}
          {note && (
            <div className="mt-4 text-center">
              <p>Note: {note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Deposit;