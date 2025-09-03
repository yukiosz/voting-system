import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEleicoes } from '../../web3/contractFunctions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';

function Home() {
  const [eleicoes, setEleicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEleicoes() {
      try {
        const data = await listarEleicoes();
        setEleicoes(data);
      } catch (err) {
        alert('Erro ao carregar eleições: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEleicoes();
  }, []);

  if (loading) return <p>Carregando eleições...</p>;

  return (
    <>
      <Header />
      <div className="home-container">
        <h1>Eleições disponíveis</h1>
        <div className="eleicoes-grid">
          {eleicoes.map(e => (
            <div key={e.id} className="eleicao-card">
              <h2>{e.titulo}</h2>
              <p>{e.descricao}</p>
              <button onClick={() => navigate(`/votar/${e.id}`)}>Votar</button>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/criar')} className="create-btn">
          Criar Eleição
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Home;
