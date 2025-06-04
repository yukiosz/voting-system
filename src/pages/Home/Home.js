import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import VoteForm from '../../components/VoteForm/VoteForm';
import './Home.css';

function Home() {
  const candidates = ['Candidato A', 'Candidato B', 'Candidato C'];
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem('votes')) || {};
    setVotes(savedVotes);
  }, []);

  const handleVote = async ({ id, password, candidate }) => {
    if (!id || !password || !candidate) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(id);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(36).padStart(2, '0')).join('');

    const updatedVotes = {
      ...votes,
      [candidate]: (votes[candidate] || 0) + 1
    };

    setVotes(updatedVotes);
    localStorage.setItem('votes', JSON.stringify(updatedVotes));

    alert(
      `🗳️ Voto registrado com sucesso!\n\n` +
      `Identificador: ${hashHex.slice(0, 16)}...\n` +
      `Candidato: ${candidate}`
    );
  };

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
