import React, { useState, useEffect } from "react";
import { getUsersOrderedByPoints } from "../../api/users";
import "./leaderboard.css";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getUsersOrderedByPoints(page * 5, 5);
        setLeaderboard(data);

        if (data.length < 5) {
          setIsLastPage(true);
        } else {
          setIsLastPage(false);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [page]);

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="grid-layout-leaderboard">
        <div className="grid-item-leaderboard invisible-leaderboard"></div>
        <div className="grid-item-leaderboard middle-leaderboard">
          <div className="main-container-leaderboard">
            <h2>Leaderboard</h2>
            <div className="list-container-leaderboard">
              <ul className="list-leaderboard">
                {leaderboard.map((user) => (
                  <li key={user.id} className="list-item-leaderboard">
                    <span className="username">{user.username}</span>
                    <span className="points">Points: {user.score}</span>
                    <button
                      className="see-profile-button"
                      onClick={() => alert(`Viewing profile of ${user.username}`)}
                    >
                      See Profile
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                Previous
              </button>
              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={isLastPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="grid-item-leaderboard invisible-leaderboard"></div>
      </div>
    </div>
  );
}

export default Leaderboard;
