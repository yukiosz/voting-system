// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Votacao {
    struct Eleitor {
        bool votou;
    }

    mapping(bytes32 => Eleitor) public eleitores;
    mapping(string => uint256) public votosPorCandidato;
    string[] public candidatos;

    constructor() {
        // Candidatos fixos no backend
        candidatos.push("Candidato A");
        candidatos.push("Candidato B");
        candidatos.push("Candidato C");
        candidatos.push("Candidato K");
    }

    function votar(bytes32 hashIdentificador, string memory nomeCandidato) public {
        require(!eleitores[hashIdentificador].votou, "Ja votou.");

        bool candidatoValido = false;
        for (uint i = 0; i < candidatos.length; i++) {
            if (keccak256(bytes(candidatos[i])) == keccak256(bytes(nomeCandidato))) {
                candidatoValido = true;
                break;
            }
        }

        require(candidatoValido, "Candidato invalido.");

        eleitores[hashIdentificador].votou = true;
        votosPorCandidato[nomeCandidato]++;
    }

    function totalVotos(string memory nomeCandidato) public view returns (uint256) {
        return votosPorCandidato[nomeCandidato];
    }

    function getCandidatos() public view returns (string[] memory) {
        return candidatos;
    }

    function jaVotou(bytes32 hashIdentificador) public view returns (bool) {
        return eleitores[hashIdentificador].votou;
    }
}
