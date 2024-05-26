// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

library Pairing {
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return r the sum of two points of G1
     */
    function plus(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {
        uint256[4] memory input = [
            p1.X, p1.Y,
            p2.X, p2.Y
        ];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-add-failed");
    }

    /*
     * @return r the product of a point on G1 and a scalar, i.e.
     *         p == p.scalarMul(1) and p.plus(p) == p.scalarMul(2) for all
     *         points p.
     */
    function scalarMul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {
        uint256[3] memory input = [p.X, p.Y, s];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-mul-failed");
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {
        uint256[24] memory input = [
            a1.X, a1.Y, a2.X[0], a2.X[1], a2.Y[0], a2.Y[1],
            b1.X, b1.Y, b2.X[0], b2.X[1], b2.Y[0], b2.Y[1],
            c1.X, c1.Y, c2.X[0], c2.X[1], c2.Y[0], c2.Y[1],
            d1.X, d1.Y, d2.X[0], d2.X[1], d2.Y[0], d2.Y[1]
        ];
        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, input, mul(24, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-opcode-failed");
        return out[0] != 0;
    }
}

contract Verifier {
    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[7] IC;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(uint256(13703050446183881697830705402547762676561920801765461369631442144348693848372), uint256(3050176349088139262445953701883717130451347717852759074615973568975917970927));
        vk.beta2 = Pairing.G2Point([uint256(12510580984228797887317292390803778361492231744144679241012660503236631358163), uint256(11383198964855877388175237247288200050408813477343684163961543652829803892863)], [uint256(7060259199225696820466272999081285486642917657126797493008760974107253310948), uint256(102788112002828082048138979464923599060586884810827480253049706370218609677)]);
        vk.gamma2 = Pairing.G2Point([uint256(4639265323077796629381172518574657639976898814823896094574116545109415131197), uint256(6835017121325381846334765230874846461424547156728017763450963595041411534911)], [uint256(21155178632349357761547485615646611147320035142670749960588990900662991744734), uint256(4755556934468077542590607614712075936555739972647135173342449349709689242669)]);
        vk.delta2 = Pairing.G2Point([uint256(19104354430218351283178796524703327114259914018828270525539983751177973026248), uint256(17865978076591370196833972649068273674097214385961137533663547720642652346427)], [uint256(21742441455946929637199729000795969520398681268577842640849284778996948706403), uint256(15204082768068873948741721430360165993322322660397873666082364834987705852699)]);
        vk.IC[0] = Pairing.G1Point(uint256(3042311489853985097111520157574201959493766831698844749163105586718690153865), uint256(10542919747188261121008300142710111717978413017939254096429012798552233707196));
        vk.IC[1] = Pairing.G1Point(uint256(12815501037355543199062544113600039004940972203056726969644292602325775004610), uint256(6588603583972934788341222277896656901307105242401803378941558334887436643058));
        vk.IC[2] = Pairing.G1Point(uint256(6385649279974272675400150638750342894314992689614639438079827619335399098274), uint256(10811491695916995418276503345940690532779557811469826029729005023904261984934));
        vk.IC[3] = Pairing.G1Point(uint256(10894268700481868906715106014109810014592573920648288560317702658839957176620), uint256(18916151367274791773832337003214696395827097913764419695147389757255654740610));
        vk.IC[4] = Pairing.G1Point(uint256(15777299122482397021594655426662821067805354186467370740847855879722539972440), uint256(8573133108089269637652939795673240285951521870065710972363425018997292287632));
        vk.IC[5] = Pairing.G1Point(uint256(12971532402411403228274439674785783026617029678976829559999141307411406238158), uint256(12621618555037920420859435372794106542046212295427520857069925459845924228726));
        vk.IC[6] = Pairing.G1Point(uint256(11282664900103796053151720648307782414352756597369388190000662572603840070471), uint256(13637765929136914999155253842810708406681551766710010796206957501128115295622));

    }

    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        bytes memory proof,
        uint256[6] memory input
    ) public view returns (bool) {
        uint256[8] memory p = abi.decode(proof, (uint256[8]));
        for (uint8 i = 0; i < p.length; i++) {
            // Make sure that each element in the proof is less than the prime q
            require(p[i] < PRIME_Q, "verifier-proof-element-gte-prime-q");
        }
        Pairing.G1Point memory proofA = Pairing.G1Point(p[0], p[1]);
        Pairing.G2Point memory proofB = Pairing.G2Point([p[2], p[3]], [p[4], p[5]]);
        Pairing.G1Point memory proofC = Pairing.G1Point(p[6], p[7]);

        VerifyingKey memory vk = verifyingKey();
        // Compute the linear combination vkX
        Pairing.G1Point memory vkX = vk.IC[0];
        for (uint256 i = 0; i < input.length; i++) {
            // Make sure that every input is less than the snark scalar field
            require(input[i] < SNARK_SCALAR_FIELD, "verifier-input-gte-snark-scalar-field");
            vkX = Pairing.plus(vkX, Pairing.scalarMul(vk.IC[i + 1], input[i]));
        }

        return Pairing.pairing(
            Pairing.negate(proofA),
            proofB,
            vk.alfa1,
            vk.beta2,
            vkX,
            vk.gamma2,
            proofC,
            vk.delta2
        );
    }
}

