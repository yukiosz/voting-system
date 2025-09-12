// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Eleicoes {
    struct Eleicao {
        string titulo;
        string descricao;
        string[] candidatos;
        mapping(string => uint256) votos;
        mapping(bytes32 => bool) eleitores;
        bool existe;
        bool encerrada;
        string data; // YYYY/MM/DD
    }

    mapping(uint256 => Eleicao) private eleicoes;
    uint256 public totalEleicoes;

    function criarEleicao(
        string memory _titulo,
        string memory _descricao,
        string[] memory _candidatos,
        string memory _data
    ) public {
        Eleicao storage e = eleicoes[totalEleicoes];
        e.titulo = _titulo;
        e.descricao = _descricao;
        e.existe = true;
        e.encerrada = false;
        e.data = _data;

        for (uint i = 0; i < _candidatos.length; i++) {
            e.candidatos.push(_candidatos[i]);
        }

        totalEleicoes++;
    }

    function votar(uint256 eleicaoId, bytes32 hashAuditoria, string memory candidato) public {
        Eleicao storage e = eleicoes[eleicaoId];
        require(e.existe, "Eleicao nao encontrada");
        require(!e.encerrada, "Eleicao encerrada");
        require(!e.eleitores[hashAuditoria], "Ja votou");

        bool valido = false;
        for (uint i = 0; i < e.candidatos.length; i++) {
            if (keccak256(bytes(e.candidatos[i])) == keccak256(bytes(candidato))) {
                valido = true;
                break;
            }
        }
        require(valido, "Candidato invalido");

        e.eleitores[hashAuditoria] = true;
        e.votos[candidato]++;
    }

    function encerrarEleicao(uint256 eleicaoId) public {
        require(eleicoes[eleicaoId].existe, "Eleicao nao encontrada");
        eleicoes[eleicaoId].encerrada = true;
    }

    function getCandidatos(uint256 eleicaoId) public view returns (string[] memory) {
        require(eleicoes[eleicaoId].existe, "Eleicao nao encontrada");
        return eleicoes[eleicaoId].candidatos;
    }

    function totalVotos(uint256 eleicaoId, string memory candidato) public view returns (uint256) {
        return eleicoes[eleicaoId].votos[candidato];
    }

    function listarEleicoes() public view returns (
        string[] memory titulos,
        string[] memory descricoes,
        bool[] memory encerradas,
        string[] memory datas
    ) {
        titulos = new string[](totalEleicoes);
        descricoes = new string[](totalEleicoes);
        encerradas = new bool[](totalEleicoes);
        datas = new string[](totalEleicoes);
        for (uint i = 0; i < totalEleicoes; i++) {
            titulos[i] = eleicoes[i].titulo;
            descricoes[i] = eleicoes[i].descricao;
            encerradas[i] = eleicoes[i].encerrada;
            datas[i] = eleicoes[i].data;
        }
    }

    function jaVotou(uint256 eleicaoId, bytes32 hashAuditoria) public view returns (bool) {
        Eleicao storage e = eleicoes[eleicaoId];
        return e.eleitores[hashAuditoria];
    }

    function getEleicao(uint256 eleicaoId) public view returns (
        string memory titulo,
        string memory descricao,
        bool encerrada,
        string memory data
    ) {
        Eleicao storage e = eleicoes[eleicaoId];
        require(e.existe, "Eleicao nao encontrada");
        return (e.titulo, e.descricao, e.encerrada, e.data);
    }
}
