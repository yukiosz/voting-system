import { useState } from 'react';
import CandidateCard from '../CandidateCard/CandidateCard';
import './VoteForm.css';

function VoteForm({ candidates, onVote }) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [token, setToken] = useState('');

  const handleSendEmail = async (e) => {
  e.preventDefault();
  if (!id || !password || !email) return alert("Preencha identificador, senha e email.");

  try {
    const res = await fetch('http://localhost:4000/verificar-eleitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identificacao: id,
        email,
        senha: password
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert("Email de confirmação enviado. Verifique sua caixa de entrada.");
    } else {
      alert(data.message || "Erro ao enviar email.");
    }
  } catch (err) {
    alert("Erro ao enviar email: " + err.message);
  }
};


  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    if (!token) return alert("Informe o token de confirmação.");

    try {
      const res = await fetch(`http://localhost:4000/confirm/${token}`);
      if (res.ok) {
        setConfirmed(true);
        alert("Email confirmado! Agora você pode votar.");
      } else {
        alert("Token inválido ou expirado.");
      }
    } catch (err) {
      alert("Erro ao confirmar email: " + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmed) return alert("Confirme seu email antes de votar.");
    if (!selectedCandidate) return alert("Selecione um candidato.");

    onVote({ id, email, password, candidate: selectedCandidate });
  };

  return (
    <form className="vote-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Identificação" value={id} onChange={(e) => setId(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {!confirmed ? (
        <>
          <button onClick={handleSendEmail}>Enviar Confirmação</button>
          <input type="text" placeholder="Token de confirmação" value={token} onChange={(e) => setToken(e.target.value)} />
          <button onClick={handleConfirmEmail}>Confirmar Email</button>
        </>
      ) : (
        <>
          <div className="candidates-grid">
            {candidates.map((name, idx) => (
              <CandidateCard
                key={idx}
                name={name}
                isSelected={selectedCandidate === name}
                onSelect={() => setSelectedCandidate(name)}
              />
            ))}
          </div>
          <button type="submit">Confirmar Voto</button>
        </>
      )}
    </form>
  );
}

export default VoteForm;
