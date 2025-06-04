import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import './Result.css';
import Footer from '../../components/Footer/Footer';

function Result() {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votes')) || {};
    const sortedVotes = Object.entries(storedVotes)
      .sort((a, b) => b[1] - a[1]);
    setVotes(sortedVotes);
  }, []);

  return (
    <>
      <Header />
      <div className="result-container">
        <h2 className="result-title">Resultados Parciais</h2>
        <ul className="vote-list">
          {votes.map(([name, count], index) => (
            <li key={index} className="vote-item">
              {name}: <strong>{count} voto(s)</strong>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </>

  );
}

export default Result;
