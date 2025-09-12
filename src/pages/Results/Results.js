import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listarEleicoes, getCandidatos, totalVotos } from '../../web3/contractFunctions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Results.css';

function Resultado() {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [votos, setVotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResultados() {
      try {
        // pega todas eleições e filtra pela id
        const eleicoes = await listarEleicoes();
        const eleicao = eleicoes.find(e => e.id === Number(id));

        if (eleicao) {
          setTitulo(eleicao.titulo);
        } else {
          setTitulo(`Eleição ${id}`);
        }

        // pega candidatos
        const cands = await getCandidatos(id);
        setCandidatos(cands);

        // pega votos de cada candidato
        const votosMap = {};
        for (let c of cands) {
          const count = await totalVotos(id, c);
          votosMap[c] = count.toString();
        }
        setVotos(votosMap);
      } catch (err) {
        alert('Erro ao carregar resultados: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResultados();
  }, [id]);

  if (loading) return <p>Carregando resultados...</p>;

  return (
    <>
      <Header />
      <div className="resultado-container">
        <h1>Resultados da Eleição: {titulo}</h1>
        <ul className="resultado-lista">
          {candidatos.map(c => (
            <li key={c}>
              <span className="candidato">{c}</span>
              <span className="votos">{votos[c] ?? 0} votos</span>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Resultado;
