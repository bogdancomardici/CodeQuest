import api from "./apiInstance";

export const getChallenges = async () => {
  try {
    const response = await api.get("/challenges/");
    return response.data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
};

export const getChallenge = async (id) => {
  try {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    throw error;
  }
};

export const submitCode = async (challengeId, code) => {
  try {
    const response = await api.post("/submit-code/", {
      challenge_id: challengeId,
      code: code,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting code:", error);
    throw error;
  }
};
