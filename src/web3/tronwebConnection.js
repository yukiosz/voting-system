export const tronWeb = window.tronWeb;

const CONTRACT_ADDRESS = 'TLcDd1UtoVfao7eSiKmAduJjKBBxCmwjjz';
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_titulo", type: "string" },
      { internalType: "string", name: "_descricao", type: "string" },
      { internalType: "string[]", name: "_candidatos", type: "string[]" },
      { internalType: "string", name: "_data", type: "string" }
    ],
    name: "criarEleicao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "string", name: "identificador", type: "string" },
      { internalType: "string", name: "email", type: "string" },
      { internalType: "string", name: "candidato", type: "string" }
    ],
    name: "votar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "bytes32", name: "hashAuditoria", type: "bytes32" }
    ],
    name: "jaVotou",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "eleicaoId", type: "uint256" }],
    name: "encerrarEleicao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "eleicaoId", type: "uint256" },
      { internalType: "string", name: "candidato", type: "string" }
    ],
    name: "totalVotos",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "eleicaoId", type: "uint256" }],
    name: "getEleicao",
    outputs: [
      { internalType: "string", name: "titulo", type: "string" },
      { internalType: "string", name: "descricao", type: "string" },
      { internalType: "bool", name: "encerrada", type: "bool" },
      { internalType: "string", name: "data", type: "string" }
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
    inputs: [],
    name: "listarEleicoes",
    outputs: [
      { internalType: "string[]", name: "titulos", type: "string[]" },
      { internalType: "string[]", name: "descricoes", type: "string[]" },
      { internalType: "bool[]", name: "encerradas", type: "bool[]" },
      { internalType: "string[]", name: "datas", type: "string[]" }
    ],
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
