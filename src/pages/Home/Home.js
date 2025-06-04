import Header from '../../components/Header/Header';
import VoteForm from '../../components/VoteForm/VoteForm';
import Footer from '../../components/Footer/Footer';
import './Home.css';

function Home() {
  const candidates = ['Candidato A', 'Candidato B', 'Candidato C'];

  const handleVote = ({ id, password, candidate }) => {
    console.log({ id, password, candidate });
    alert(`Voto confirmado para ${candidate}`);
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
