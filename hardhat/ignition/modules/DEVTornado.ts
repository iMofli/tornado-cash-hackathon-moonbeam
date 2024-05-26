import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HASHER_ADDRESS = '0xA0C3cc7D8091EbcC184Ec77aa3a7c1F96DA64EAB'
const VERIFIER_ADDRESS = '0xE5ad2A4f376e51958e18405Fd966d37fF7185E4a'

const DevTornadoModule = buildModule("DevTornadoModule", (m) => {
    const _verifier = m.getParameter("_verififer", VERIFIER_ADDRESS)
    const _hasher = m.getParameter("_hasher", HASHER_ADDRESS);
    const _denomination = m.getParameter("_denomination", 100000000000000000n);
    const _merkleTreeHeight = m.getParameter("_merkleTreeHeight", 20);
    const _owners = m.getParameter("_owners", ['0x7ca9774bF5e6913fB192C60CEF79E25b61559Ee1']);


    const devTornado = m.contract("DEVTornado", [_verifier, _hasher, _denomination, _merkleTreeHeight, _owners], {
    });

    return { devTornado };
});

export default DevTornadoModule;