import {createDepositFromNote, getSigner, getTornadoContract, toHex} from "./utils";
import * as fs from 'fs';
import merkleTree from 'fixed-merkle-tree'
import assert from "assert";
import {ethers} from "ethers";
import websnarkUtils from "websnark/src/utils";
import buildGroth16 from "websnark/src/groth16";


async function withdraw(note: string, recipient: string) {
    let tornadoContract = await getTornadoContract()
    let signer = await getSigner()
    const { proof, args } = await generateProof(note, recipient)
    console.log('Proof:', proof)
    console.log('Submitting withdraw transaction')
    // @ts-ignore
    let tx = await tornadoContract.withdraw(proof, ...args, {
        from: signer,
        value: 0,
        gasLimit: 1e7,
    }).then((tx: any) => tx.wait())

    console.log('Withdraw transaction hash:', tx.transactionHash)
}

async function generateProof(note: string, recipient: string) {
    let groth16 = await buildGroth16()
    const deposit = createDepositFromNote(note)
    const { root, pathElements, pathIndices } = await generateMerkleProof(deposit)

    // Prepare circuit input
    const input = {
        // Public snark inputs
        root: root,
        nullifierHash: deposit.nullifierHash,
        recipient: BigInt(recipient),
        relayer: BigInt(ethers.ZeroAddress),
        fee: BigInt(0),
        refund: BigInt(0),

        // Private snark inputs
        nullifier: deposit.nullifier,
        secret: deposit.secret,
        pathElements: pathElements,
        pathIndices: pathIndices,
    }

    const circuit = await loadCircuit()
    const proving_key = await loadProvingKey()
    const proofData = await websnarkUtils.genWitnessAndProve(groth16, input, circuit, proving_key)
    const { proof } = await websnarkUtils.toSolidityInput(proofData)
    const args = [
        toHex(input.root),
        toHex(input.nullifierHash),
        toHex(input.recipient, 20),
        toHex(input.relayer, 20),
        toHex(input.fee),
        toHex(input.refund),
    ]
    return { proof, args }
}

async function generateMerkleProof(deposit: any) {
    let tornadoContract = await getTornadoContract()
    console.log('Deposit:', deposit)
    console.log('Getting current state from tornado contract')

    const filter = tornadoContract.filters.Deposit();
    const events = await tornadoContract.queryFilter(filter, 7190000, 'latest')
    const leaves = events
        .sort((a, b) => Number(a.args.leafIndex - b.args.leafIndex)) // Sort events in chronological order
        .map(e => e.args.commitment)
    const tree = new merkleTree(process.env.MERKLE_TREE_HEIGHT, leaves)

    const depositEvent = events.find(e => e.args.commitment === deposit.commitmentHex)
    const leafIndex = depositEvent ? depositEvent.args.leafIndex : -1

    const root = tree.root()
    const isValidRoot = await tornadoContract.isKnownRoot(toHex(root))
    const isSpent = await tornadoContract.isSpent(deposit.nullifierHex)
    assert(isValidRoot === true, 'Merkle tree is corrupted')
    assert(isSpent === false, 'The note is already spent')
    assert(leafIndex >= 0, 'The deposit is not found in the tree')

    // Compute merkle proof of our commitment
    const { pathElements, pathIndices } = tree.path(Number(leafIndex))
    return { pathElements, pathIndices, root: tree.root() }
}

async function loadCircuit() {
    const circuitPath = 'build/circuits/withdraw.json';
    const circuitData = fs.readFileSync(circuitPath, 'utf8');
    return JSON.parse(circuitData);
}

async function loadProvingKey() {
    const provingKeyPath = 'build/circuits/withdraw_proving_key.bin';
    return fs.readFileSync(provingKeyPath).buffer;
}

async function keepAlive() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            console.log("Keeping alive...");
        }, 10000); // Log every 10 seconds to keep the event loop active
        process.on('exit', () => clearInterval(interval)); // Clean up interval on exit
    });
}

async function main() {
    withdraw('0xe6b068d2928e00de36e707acc1e4c678f44b67dd8eadc36e50789dd4df96fbf805d18a395a2f0df49b1973cdbff9f966cc98ccca98c178458f82d473b52c', '0x7ca9774bF5e6913fB192C60CEF79E25b61559Ee1')
        .then(c => console.log(c))
        .catch(e => console.error(e))
    await keepAlive();
}

main().catch((error) => console.error(error));


/*
async function generateProof(note: string, recipient: string) {
    const deposit = createDepositFromNote(note)
    const { root, pathElements, pathIndices } = await generateMerkleProof(deposit)

    const input = {
        root: root.toString(),
        nullifierHash: deposit.nullifierHash.toString(),
        recipient:BigInt(recipient).toString(),
        relayer: BigInt(ethers.ZeroAddress).toString(),
        fee: BigInt(0).toString(),
        refund: BigInt(0).toString(),
        nullifier: deposit.nullifier.toString(),
        secret: deposit.secret.toString(),
        pathElements: pathElements.map((el: any) => el.toString()),
        pathIndices: pathIndices.map((el: any) => el.toString())
    };

    const circuit = await loadCircuit();
    const proving_key = await loadProvingKey();

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, circuit, proving_key);

    const solidityProof = snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    const proofArgs = JSON.parse('[' + solidityProof + ']');

    const args = [
        toHex(input.root),
        toHex(input.nullifierHash),
        toHex(input.recipient, 20),
        toHex(input.relayer, 20),
        toHex(input.fee),
        toHex(input.refund),
    ];

    return { proof: proofArgs, args };
}
 */