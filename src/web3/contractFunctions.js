let contractInstance = null;
const contractAddress = 'TFqynJsLEfjVXRiYiHF2dWeuf3PB48Cavw';

// Aguarda até que o window.tronWeb esteja pronto
async function waitForTronWeb(timeout = 10000) {
  const pollInterval = 100; // ms
  let waited = 0;

  while (waited < timeout) {
    if (window.tronWeb && window.tronWeb.ready) {
      return window.tronWeb;
    }
    await new Promise((res) => setTimeout(res, pollInterval));
    waited += pollInterval;
  }

  throw new Error('TronLink não está conectado. Abra a extensão e conecte-se à rede.');
}

async function getTronWeb() {
  if (window.tronWeb && window.tronWeb.ready) {
    return window.tronWeb;
  }
  // Se não estiver pronto, aguarda por até 10s
  return await waitForTronWeb();
}

async function getContract() {
  if (!contractInstance) {
    const tronWeb = await getTronWeb();
    contractInstance = await tronWeb.contract().at(contractAddress);
  }
  return contractInstance;
}

export async function votar(hashIdentificador, nomeCandidato) {
  const contract = await getContract();
  return await contract.votar(hashIdentificador, nomeCandidato).send();
}

export async function totalVotos(nomeCandidato) {
  const contract = await getContract();
  return await contract.totalVotos(nomeCandidato).call();
}

export async function jaVotou(hashIdentificador) {
  const contract = await getContract();
  return await contract.jaVotou(hashIdentificador).call();
}

export async function getCandidatos() {
  const contract = await getContract();
  return await contract.getCandidatos().call();
}

export async function gerarHash(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return '0x' + Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
