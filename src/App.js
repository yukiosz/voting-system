import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import VotePage from "./pages/VotePage/VotePage";
import CreateElection from "./pages/CreateElection/CreateElection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/votar/:id" element={<VotePage />} />
        <Route path="/criar" element={<CreateElection />} />
      </Routes>
    </Router>
  );
}

export default App;
