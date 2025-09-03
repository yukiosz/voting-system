import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VoteForm from '../../components/VoteForm/VoteForm';
import { getCandidatos, votar, gerarHash, jaVotou, totalVotos } from '../../web3/contractFunctions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function VotePage() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const list = await getCandidatos(Number(id));
        setCandidates(list);
      } catch (err) {
        alert('Erro ao carregar candidatos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, [id]);

  const handleVote = async ({ id: identificador, password, candidate }) => {
    try {
      const hashId = await gerarHash(identificador + password);
      const votouAntes = await jaVotou(Number(id), hashId);

      if (votouAntes) return alert('Você já votou nesta eleição.');

      await votar(Number(id), hashId, candidate);
      const votos = await totalVotos(Number(id), candidate);

      alert(`Voto registrado! Total de votos para ${candidate}: ${votos}`);
    } catch (err) {
      alert('Erro ao votar: ' + err.message);
    }
  };

  if (loading) return <p>Carregando candidatos...</p>;

  return (
    <>
      <Header />
      <div className="vote-page">
        <h1>Votação</h1>
        <VoteForm candidates={candidates} onVote={handleVote} />
      </div>
      <Footer />
    </>
  );
}

export default VotePage;
