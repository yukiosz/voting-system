pragma solidity ^0.8.0;

contract Eleicoes {
    struct Eleicao {
        string titulo;
        string descricao;
        string[] candidatos;
        mapping(string => uint256) votos;
        mapping(bytes32 => bool) eleitores;
        bool existe;
    }

    mapping(uint256 => Eleicao) private eleicoes;
    uint256 public totalEleicoes;

    function criarEleicao(string memory _titulo, string memory _descricao, string[] memory _candidatos) public {
        Eleicao storage e = eleicoes[totalEleicoes];
        e.titulo = _titulo;
        e.descricao = _descricao;
        e.existe = true;

        for (uint i = 0; i < _candidatos.length; i++) {
            e.candidatos.push(_candidatos[i]);
        }

        totalEleicoes++;
    }

    function votar(uint256 eleicaoId, bytes32 hashIdentificador, string memory candidato) public {
        require(eleicoes[eleicaoId].existe, "Eleicao nao encontrada");
        require(!eleicoes[eleicaoId].eleitores[hashIdentificador], "Ja votou");

        bool valido = false;
        for (uint i = 0; i < eleicoes[eleicaoId].candidatos.length; i++) {
            if (keccak256(bytes(eleicoes[eleicaoId].candidatos[i])) == keccak256(bytes(candidato))) {
                valido = true;
                break;
            }
        }
        require(valido, "Candidato invalido");

        eleicoes[eleicaoId].eleitores[hashIdentificador] = true;
        eleicoes[eleicaoId].votos[candidato]++;
    }

    function getCandidatos(uint256 eleicaoId) public view returns (string[] memory) {
        require(eleicoes[eleicaoId].existe, "Eleicao nao encontrada");
        return eleicoes[eleicaoId].candidatos;
    }

    function totalVotos(uint256 eleicaoId, string memory candidato) public view returns (uint256) {
        return eleicoes[eleicaoId].votos[candidato];
    }

    function listarEleicoes() public view returns (string[] memory titulos, string[] memory descricoes) {
        titulos = new string[](totalEleicoes);
        descricoes = new string[](totalEleicoes);
        for (uint i = 0; i < totalEleicoes; i++) {
            titulos[i] = eleicoes[i].titulo;
            descricoes[i] = eleicoes[i].descricao;
        }
    }

    function jaVotou(uint256 eleicaoId, bytes32 hashIdentificador) public view returns (bool) {
        return eleicoes[eleicaoId].eleitores[hashIdentificador];
    }
}