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
  const result = await contract.listarEleicoes().call();

  const titulos = result.titulos || result[0] || [];
  const descricoes = result.descricoes || result[1] || [];
  const encerradas = result.encerradas || result[2] || [];
  const datas = result.datas || result[3] || []; // <- aqui pegamos a data

  return titulos.map((titulo, idx) => ({
    id: idx,
    titulo,
    descricao: descricoes[idx],
    encerrada: encerradas[idx],
    data: datas[idx] // <- adicionamos a data aqui
  }));
}

export async function getCandidatos(eleicaoId) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.getCandidatos(eleicaoId).call();
}

export async function getEleicao(eleicaoId) {
  await waitForTronWeb();
  const contract = await getContract();
  const result = await contract.getEleicao(eleicaoId).call();
  return {
    titulo: result[0],
    descricao: result[1],
    encerrada: result[2],
    data: result[3] // <- retornando data corretamente
  };
}

export async function criarEleicao(titulo, descricao, candidatos, data) {
  await waitForTronWeb();
  const contract = await getContract();
  return await contract.criarEleicao(titulo, descricao, candidatos, data).send({ feeLimit: 100_000_000 });
}

export async function votar(eleicaoId, identificador, candidato) {
  await waitForTronWeb();
  const contract = await getContract();
  const eleicao = await getEleicao(eleicaoId);
  const hashAuditoria = await gerarHash(identificador + eleicao.titulo + eleicao.data);
  return await contract.votar(eleicaoId, hashAuditoria, candidato).send({ feeLimit: 100_000_000 });
}

export async function jaVotou(eleicaoId, identificador) {
  await waitForTronWeb();
  const contract = await getContract();
  const eleicao = await getEleicao(eleicaoId);
  const hashAuditoria = await gerarHash(identificador + eleicao.titulo + eleicao.data);
  return await contract.jaVotou(eleicaoId, hashAuditoria).call();
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
