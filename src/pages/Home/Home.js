import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import VoteForm from '../../components/VoteForm/VoteForm';
import {
  getCandidatos,
  votar,
  gerarHash,
  jaVotou,
  totalVotos
} from '../../web3/contractFunctions';
import './Home.css';

function Home() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const list = await getCandidatos();
        setCandidates(list);
      } catch (error) {
        alert('Erro ao buscar candidatos: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const handleVote = async ({ id, password, candidate }) => {
    try {
      // Gerar hash do identificador
      const hashId = await gerarHash(id);

      // Verificar se já votou
      const votouAntes = await jaVotou(hashId);
      if (votouAntes) {
        alert('Identificador já votou anteriormente.');
        return;
      }

      // Enviar o voto para blockchain
      await votar(hashId, candidate);

      // Buscar votos atualizados para mostrar
      const votos = await totalVotos(candidate);

      alert(
        `🗳️ Voto registrado com sucesso!\n\n` +
        `Identificador (hash): ${hashId.slice(0, 16)}...\n` +
        `Candidato: ${candidate}\n` +
        `Votos atuais do candidato: ${votos}`
      );
    } catch (error) {
      alert('Erro ao registrar voto: ' + error.message);
    }
  };

  if (loading) return <p>Carregando candidatos...</p>;

  return (
    <>
      <Header />
      <div className="home-container">
        <VoteForm candidates={candidates} onVote={handleVote} />
      </div>
      <Footer />
    </>
  );
}

export default Home;
