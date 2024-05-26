    import { concat, ethers } from "ethers";
    import { signTypedData, SignTypedDataVersion } from "@metamask/eth-sig-util";
    import { randomBytes } from 'crypto';
    //import * as circomlibjs from 'circomlibjs';


    const from = "0xfaeF52C2e261c079C66F593589a6b7D0b844714a";
    const to = "0x372552994bF37e419960aA73262B479713420Fa5";
    const value = 100000000000000000; //0.1DEV

    //Pegar el ABI en esta variable
    const depositAbi = [
        {
        "inputs": [
            {
            "internalType": "contract IVerifier",
            "name": "_verifier",
            "type": "address"
            },
            {
            "internalType": "contract IHasher",
            "name": "_hasher",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "_denomination",
            "type": "uint256"
            },
            {
            "internalType": "uint32",
            "name": "_merkleTreeHeight",
            "type": "uint32"
            },
            {
            "internalType": "address[]",
            "name": "_owners",
            "type": "address[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": true,
            "internalType": "bytes32",
            "name": "commitment",
            "type": "bytes32"
            },
            {
            "indexed": false,
            "internalType": "uint32",
            "name": "leafIndex",
            "type": "uint32"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
            {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "bytes32",
            "name": "nullifierHash",
            "type": "bytes32"
            },
            {
            "indexed": true,
            "internalType": "address",
            "name": "relayer",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
        },
        {
        "inputs": [],
        "name": "FIELD_SIZE",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "ROOT_HISTORY_SIZE",
        "outputs": [
            {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "ZERO_VALUE",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_newOwner",
            "type": "address"
            }
        ],
        "name": "addOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_address",
            "type": "address"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "name": "commitments",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "currentRootIndex",
        "outputs": [
            {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "denomination",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "_commitment",
            "type": "bytes32"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "filledSubtrees",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "getLastRoot",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "contract IHasher",
            "name": "_hasher",
            "type": "address"
            },
            {
            "internalType": "bytes32",
            "name": "_left",
            "type": "bytes32"
            },
            {
            "internalType": "bytes32",
            "name": "_right",
            "type": "bytes32"
            }
        ],
        "name": "hashLeftRight",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "hasher",
        "outputs": [
            {
            "internalType": "contract IHasher",
            "name": "",
            "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "_root",
            "type": "bytes32"
            }
        ],
        "name": "isKnownRoot",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "_nullifierHash",
            "type": "bytes32"
            }
        ],
        "name": "isSpent",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32[]",
            "name": "_nullifierHashes",
            "type": "bytes32[]"
            }
        ],
        "name": "isSpentArray",
        "outputs": [
            {
            "internalType": "bool[]",
            "name": "spent",
            "type": "bool[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_address",
            "type": "address"
            }
        ],
        "name": "isWhiteListed",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "levels",
        "outputs": [
            {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "nextIndex",
        "outputs": [
            {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "name": "nullifierHashes",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "ownerCount",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_address",
            "type": "address"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
            }
        ],
        "name": "removeOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "roots",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "verifier",
        "outputs": [
            {
            "internalType": "contract IVerifier",
            "name": "",
            "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "name": "whiteListAddress",
        "outputs": [
            {
            "internalType": "bool",
            "name": "",
            "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "bytes",
            "name": "_proof",
            "type": "bytes"
            },
            {
            "internalType": "bytes32",
            "name": "_root",
            "type": "bytes32"
            },
            {
            "internalType": "bytes32",
            "name": "_nullifierHash",
            "type": "bytes32"
            },
            {
            "internalType": "address payable",
            "name": "_recipient",
            "type": "address"
            },
            {
            "internalType": "address payable",
            "name": "_relayer",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "_fee",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "_refund",
            "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "i",
            "type": "uint256"
            }
        ],
        "name": "zeros",
        "outputs": [
            {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
        }
    ];
    const abi = new ethers.Interface(depositAbi);

    // Generar el commitment para llamar a la función X con un parametro específico
    let randomBytesValue = randomBytes(32);
    const nullifier = randomBytesValue.toString('hex');
    console.log(`Nullifier: ${nullifier}`);

    randomBytesValue = randomBytes(32);
    const secret = randomBytesValue.toString('hex');
    console.log(`Secret: ${secret}`);

    //TO DO: Pedersen HASH
    //const input = nullifier.concat(secret);
    //const hashBuffer = await circomlibjs.buildPedersenHash(input);      
    //const commitment = '0x' + hashBuffer.toString('hex');

    const commitment = "0x1702594c6b39926be1c2bb987cdc2a0dd62c09df77fcae78b32b18d45c54e58f";
    console.log(`Commitment: ${commitment}`);
    
    const data = abi.encodeFunctionData("deposit", [commitment]);
    const gaslimit = 2100000;
    const nonce = "5";
    const deadline = Date.now()+300000;

    const createPermitMessageData = () => {
    const message = {
        from: from,
        to: to,
        value: value,
        data: data,
        gaslimit: gaslimit,
        nonce: nonce,
        deadline: deadline,
    };

    const typedData = {
        types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        CallPermit: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
            { name: "gaslimit", type: "uint64" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
        },
        primaryType: "CallPermit",
        domain: {
        name: "Call Permit Precompile",
        version: "1",
        chainId: 1287,
        verifyingContract: "0x000000000000000000000000000000000000080a",
        },
        message: message,
    };

    return {
        typedData,
        message,
    };
    };

    const messageData = createPermitMessageData();

    // For demo purposes only. Never store your private key in a JavaScript/TypeScript file
    const signature = signTypedData({
    privateKey: Buffer.from(
        "82e89a6f6d9e67075016fb53bd3d95a93a8e328ff7915d81d25927634266818e",
        "hex"
    ),
    data: messageData.typedData,
    version: SignTypedDataVersion.V4,
    });
    console.log(`Transaction successful with hash: ${signature}`);

    const ethersSignature = ethers.Signature.from(signature);
    const formattedSignature = {
    r: ethersSignature.r,
    s: ethersSignature.s,
    v: ethersSignature.v,
    };
    console.log(formattedSignature);

    const dispatch = from+","+to+","+value+","+data+","+gaslimit+","+deadline+","+formattedSignature.v+","+formattedSignature.r+","+formattedSignature.s;
    console.log(`Dispatch: ${dispatch}`);