import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChallengesWithPagination, addChallenge } from "../../api/challenges";
import { useAuth } from "../authentification/AuthContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./challenges.css";

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    input: "",
    output: "",
    difficulty: "",
    language: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallengesWithPagination(page * 5, 5);
        setChallenges(data);
        setIsLastPage(data.length < 5);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };
    fetchChallenges();
  }, [page]);

  useEffect(() => {
    setFilteredChallenges(
      challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.language.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, challenges]);

  const handleAddChallenge = async () => {
    const challengeToSubmit = {
      title: newChallenge.title,
      description: newChallenge.description,
      input: newChallenge.input,
      output: newChallenge.output,
      difficulty: newChallenge.difficulty,
      language: newChallenge.language,
    };

    try {
      await addChallenge(challengeToSubmit);
      console.log("Challenge added successfully!");
      setShowModal(false);
      setNewChallenge({
        title: "",
        description: "",
        input: "",
        output: "",
        difficulty: "",
        language: "",
      });
      setPage(0);
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  return (
    <div className="challenges-container">
      <div className="grid-layout-challenges">
        <div className="grid-item-challenges invisible-challenges"></div>
        <div className="grid-item-challenges middle-challenges">
          <div className="main-container-challenges">
            <div className="search-bar-challenges">
              <input
                type="text"
                placeholder="Search for challenges..."
                className="search-input-challenges"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="list-container-challenges">
              <ul className="list-challenges">
                {filteredChallenges.map((challenge) => (
                  <li key={challenge.id} className="list-item-challenges">
                    <span>{challenge.title}</span>
                    <span>{challenge.language}</span>
                    <span>{challenge.difficulty}</span>
                    <div className="button-container-challenges">
                      <button
                        className="button-challenges solo-button"
                        onClick={() => navigate(`/soloChallenge/${challenge.id}`)}
                      >
                        Solo Challenge
                      </button>
                      <button className="button-challenges friend-button">
                        Challenge a Friend
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pagination-controls">
                <button
                  className="pagination-button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <button
                  className="pagination-button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLastPage}
                >
                  Next
                </button>
              </div>
            </div>

            {user && user.role === "admin" && (
              <div>
                <button onClick={() => setShowModal(true)} className="button-add">
                  Add Challenge
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid-item-challenges invisible-challenges"></div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Challenge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newChallenge.title}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={newChallenge.description}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Input</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter input"
                value={newChallenge.input}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, input: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Output</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter output"
                value={newChallenge.output}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, output: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                as="select"
                value={newChallenge.difficulty}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, difficulty: e.target.value })
                }
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter language"
                value={newChallenge.language}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, language: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddChallenge}>
            Add Challenge
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Challenges;
