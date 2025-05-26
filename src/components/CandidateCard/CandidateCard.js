import './CandidateCard.css';

function CandidateCard({ name, onSelect }) {
  return (
    <div onClick={onSelect} className="candidate-card">
      <h2>{name}</h2>
    </div>
  );
}

export default CandidateCard;
