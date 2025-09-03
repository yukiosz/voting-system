// src/web3/tronwebConnection.js

export const tronWeb = window.tronWeb; // TronLink injeta isso no browser

const CONTRACT_ADDRESS = 'TBUEbRUc9kUW1QCLk9x8BgZvfi3vmABtNG';
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "titulo", type: "string" },
      { internalType: "string", name: "descricao", type: "string" },
      { internalType: "string[]", name: "candidatos", type: "string[]" }
    ],
    name: "criarEleicao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "listarEleicoes",
    outputs: [
      { internalType: "string[]", name: "titulos", type: "string[]" },
      { internalType: "string[]", name: "descricoes", type: "string[]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "eleicaoId", type: "uint256" }],
    name: "getCandidatos",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "bytes32", name: "hashIdentificador", type: "bytes32" },
      { internalType: "string", name: "nomeCandidato", type: "string" }
    ],
    name: "votar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "bytes32", name: "hashIdentificador", type: "bytes32" }
    ],
    name: "jaVotou",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "string", name: "nomeCandidato", type: "string" }
    ],
    name: "totalVotos",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];

let contractInstance = null;

export async function getContract() {
  if (!window.tronWeb || !window.tronWeb.ready) {
    throw new Error('TronLink não está conectado.');
  }

  if (!contractInstance) {
    contractInstance = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  }

  return contractInstance;
}
