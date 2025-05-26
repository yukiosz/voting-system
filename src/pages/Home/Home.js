import Header from '../../components/Header/Header';
import VoteForm from '../../components/VoteForm/VoteForm';
import './Home.css';

function Home() {
  const candidates = ['Candidato A', 'Candidato B', 'Candidato C'];

  const handleVote = ({ id, password, candidate }) => {
    console.log({ id, password, candidate });
    alert(`Voto confirmado para ${candidate}`);
  };

  return (
    <div className="home-container">
      <Header />
      <VoteForm candidates={candidates} onVote={handleVote} />
    </div>
  );
}

export default Home;
