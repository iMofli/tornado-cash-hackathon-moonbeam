import React, { useState } from 'react';
import {
  pedersenHash,
  rbigint,
  toHex,
} from "../utils/utils";
import DEVTornadoABI from "../abis/DEVTornado.json";
import { useWriteContract } from "wagmi";
import { parseEther } from 'viem';

interface FactoryProps {
  status: string | undefined;
  address: `0x${string}` | undefined;
}

const Deposit: React.FC<FactoryProps> = ({ status, address }) => {
  console.log(status);
  console.log(address);
  
  // console.log(import.meta.env.VITE_TORNADO_CONTRACT_ADDRESS);

  // const { writeContract } = useWriteContract()

  // function createDeposit({ nullifier, secret }): { nullifier: any, secret: any } {
  //   const deposit: any = { nullifier, secret }
  //   deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
  //   deposit.commitment = pedersenHash(deposit.preimage)
  //   deposit.commitmentHex = toHex(deposit.commitment)
  //   deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
  //   deposit.nullifierHex = toHex(deposit.nullifierHash)
  //   return deposit
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl max-w-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Deposit Funds</h2>
        <div className="space-y-6">
          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-500 to-red-600 hover:from-blue-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            // onClick={() => 
            //   writeContract({ 
            //     address: `${import.meta.env.VITE_TORNADO_CONTRACT_ADDRESS}` as `0x${string}`,
            //     abi: DEVTornadoABI,
            //     functionName: 'deposit',
            //     args: [
            //       '0xd2135CfB216b74109775236E36d4b433F1DF507B',
            //       '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
            //       123n,
            //     ],
            //     value: parseEther("0.1"), // Sending 0.1 ETH
            //  })
            // }
          >
            Deposit 0.1 DEV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
