import { useEffect, useState } from 'react';
import { listarEleicoes } from '../../web3/contractFunctions';

function ElectionList() {
  const [eleicoes, setEleicoes] = useState([]);

  useEffect(() => {
    async function fetchElections() {
      try {
        const { titulos, descricoes } = await listarEleicoes();
        const list = titulos.map((t, i) => ({ titulo: t, descricao: descricoes[i] }));
        setEleicoes(list);
      } catch (err) {
        alert("Erro ao carregar eleições: " + err.message);
      }
    }
    fetchElections();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Eleições Cadastradas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eleicoes.map((e, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <h2 className="font-bold">{e.titulo}</h2>
            <p>{e.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElectionList;
