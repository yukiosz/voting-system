import './CandidateCard.css';

function CandidateCard({ name, onSelect, isSelected }) {
  return (
    <div
      onClick={onSelect}
      className={`candidate-card ${isSelected ? 'selected' : ''}`}
    >
      <h2>{name}</h2>
    </div>
  );
}

export default CandidateCard;