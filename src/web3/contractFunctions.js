import { getContract } from './tronwebConnection';

async function waitForTronWeb(timeout = 10000) {
  const pollInterval = 100;
  let waited = 0;

  while (waited < timeout) {
    if (window.tronWeb && window.tronWeb.ready) return window.tronWeb;
    await new Promise(res => setTimeout(res, pollInterval));
    waited += pollInterval;
  }
  throw new Error('TronLink não está conectado ou TronWeb não está pronto.');
}

export async function listarEleicoes() {
  await waitForTronWeb();
  const contract = await getContract();
  const [titulos, descricoes] = await contract.listarEleicoes().call();

  return titulos.map((titulo, idx) => ({
    id: idx,
    titulo,
    descricao: descricoes[idx]
  }));
}

export async function getCandidatos(eleicaoId) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.getCandidatos(eleicaoId).call();
}

export async function criarEleicao(titulo, descricao, candidatos) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.criarEleicao(titulo, descricao, candidatos).send({
    feeLimit: 100_000_000
  });
}

export async function votar(eleicaoId, hashIdentificador, candidato) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.votar(eleicaoId, hashIdentificador, candidato).send({
    feeLimit: 100_000_000
  });
}

export async function jaVotou(eleicaoId, hashIdentificador) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.jaVotou(eleicaoId, hashIdentificador).call();
}

export async function totalVotos(eleicaoId, candidato) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.totalVotos(eleicaoId, candidato).call();
}

export async function gerarHash(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return '0x' + Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
