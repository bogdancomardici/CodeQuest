import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "../authentification/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./inbox.css";

function Inbox({ updateNotifications }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardTimer, setRewardTimer] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(null);
  const wheelRef = useRef(null);

  const rewards = [5, 10, 15, 20, 25, 50, 75, 100, 5, 10]; // Reward points for each slice
  const sliceDegrees = 360 / rewards.length; // Degrees for each slice

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/${user.id}/notifications`
      );
      console.log("Fetched notifications:", response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user.id]);

  const fetchRewardTimer = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/${user.id}/reward-timer`
      );
      setRewardTimer(response.data.timer);
    } catch (error) {
      console.error("Error fetching reward timer:", error);
    }
  }, [user.id]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchRewardTimer();
    }
  }, [user, fetchNotifications, fetchRewardTimer]);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:8000/notifications/${notificationId}`
      );
      const updatedNotifications = notifications.filter(
        (n) => n.id !== notificationId
      );
      setNotifications(updatedNotifications);
      updateNotifications(updatedNotifications); // Update notifications in NavBar
      toast.success("Notification deleted successfully!");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const handleDailyRewardClick = () => {
    setShowRewardModal(true);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomSlice = Math.floor(Math.random() * rewards.length);
    const reward = rewards[randomSlice];
    const degrees = 360 * 5 + randomSlice * sliceDegrees;

    wheelRef.current.style.transition = "transform 5s ease-out";
    wheelRef.current.style.transform = `rotate(${degrees}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
      toast.success(`Congratulations! You got ${reward} reward points!`);
      setShowRewardModal(false);

      // Update reward points in the backend
      axios
        .post(`http://localhost:8000/users/${user.id}/reward`, {
          points: reward,
        })
        .then(() => fetchRewardTimer())
        .catch((error) => {
          console.error("Error updating reward points:", error);
          toast.error("Failed to update reward points.");
        });
    }, 5000);
  };

  return (
    <div className="inbox-container">
      <div className="grid-layout-inbox">
        <div className="grid-item-inbox invisible-inbox"></div>
        <div className="grid-item-inbox middle-inbox">
          <div className="main-container-inbox">
            <div className="card-inbox">
              <div className="card-text-inbox">
                <h3>Inbox</h3>
              </div>
              <div className="inner-card-inbox">
                <ul className="notifications-list">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                      <span className="notification-message">
                        {notification.message}
                      </span>
                      <div className="button-container-inbox">
                        <a
                          href={notification.link}
                          className="button-inbox accept-button"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          Accept
                        </a>
                        <button
                          className="button-inbox reject-button"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                  <li className="notification-item">
                    <span className="notification-message">
                      {rewardTimer !== null && rewardTimer > 0
                        ? `Next reward available in ${rewardTimer.toFixed(
                            2
                          )} hours`
                        : "Daily Reward Available! Click to spin the wheel."}
                    </span>
                    {rewardTimer !== null && rewardTimer <= 0 && (
                      <button
                        className="button-inbox reward-button"
                        onClick={handleDailyRewardClick}
                      >
                        Claim Reward
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-item-inbox invisible-inbox"></div>
      </div>
      <ToastContainer />

      {/* Daily Reward Modal */}
      <Modal
        show={showRewardModal}
        onHide={() => setShowRewardModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Daily Reward</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wheel-container">
            <div className="wheel" ref={wheelRef}>
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className="slice"
                  style={{
                    transform: `rotate(${index * sliceDegrees}deg) skewY(-${
                      90 - sliceDegrees
                    }deg)`,
                  }}
                >
                  <span>{reward}</span>
                </div>
              ))}
            </div>
            <div className="pin"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRewardModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSpinWheel}
            disabled={isSpinning}
          >
            Spin the Wheel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Inbox;
