import { useState } from 'react';
import { criarEleicao } from '../../web3/contractFunctions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './CreateElection.css';

function CreateElection() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [candidatos, setCandidatos] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lista = candidatos.split(',').map(c => c.trim());
      await criarEleicao(titulo, descricao, lista);
      alert('Eleição criada com sucesso!');
      setTitulo('');
      setDescricao('');
      setCandidatos('');
    } catch (err) {
      alert('Erro ao criar eleição: ' + err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="create-election-container">
        <h1 className="create-election-title">Cadastrar Eleição</h1>
        <form onSubmit={handleSubmit} className="create-election-form">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Candidatos (separados por vírgula)"
            value={candidatos}
            onChange={e => setCandidatos(e.target.value)}
            required
          />
          <button type="submit">Criar Eleição</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateElection;
