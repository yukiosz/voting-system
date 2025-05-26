import { useState } from 'react';
import CandidateCard from '../CandidateCard/CandidateCard';
import './VoteForm.css';

function VoteForm({ candidates, onVote }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return alert("Selecione um candidato.");
    onVote({ id, password, candidate: selectedCandidate });
  };

  return (
    <form onSubmit={handleSubmit} className="vote-form">
      <input
        type="text"
        placeholder="Identificação"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="candidates-grid">
        {candidates.map((name, idx) => (
          <CandidateCard
            key={idx}
            name={name}
            onSelect={() => setSelectedCandidate(name)}
          />
        ))}
      </div>
      <button type="submit">Confirmar Voto</button>
    </form>
  );
}

export default VoteForm;
