import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VoteForm from '../../components/VoteForm/VoteForm';
import { listarEleicoes, getEleicao, getCandidatos, votar, jaVotou, totalVotos, gerarHash } from '../../web3/contractFunctions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './VotePage.css';

function VotePage() {
  const { id } = useParams();
  const [eleicao, setEleicao] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEleicao() {
      try {
        const todasEleicoes = await listarEleicoes();
        const eleicaoData = todasEleicoes.find(e => e.id === Number(id));
        setEleicao(eleicaoData); // agora eleicaoData.data está definido

        const list = await getCandidatos(Number(id));
        setCandidates(list);
      } catch (err) {
        alert('Erro ao carregar eleição ou candidatos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEleicao();
  }, [id]);

  const handleVote = async ({ id: identificador, password, candidate }) => {
    try {
      const hashId = await gerarHash(identificador + password + eleicao.data);
      const votouAntes = await jaVotou(Number(id), hashId);

      if (votouAntes) return alert('Você já votou nesta eleição.');

      await votar(Number(id), hashId, candidate);
      const votos = await totalVotos(Number(id), candidate);

      alert(`Voto registrado! Total de votos para ${candidate}: ${votos}`);
    } catch (err) {
      alert('Erro ao votar: ' + err.message);
    }
  };

  if (loading) return <p>Carregando eleição e candidatos...</p>;

  return (
    <>
      <Header />
      <div className="vote-page">
        <h1>Votação: {eleicao.titulo}</h1>
        <p>Data: {eleicao.data}</p>
        <div className="vote-form">
          <VoteForm
            candidates={candidates}
            onVote={handleVote}
            data={eleicao.data}
          />

        </div>
      </div>
      <Footer />
    </>
  );
}

export default VotePage;
