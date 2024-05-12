import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getBoardData = async () => {
  const response = await axios.get(`${BASE_URL}/boards`);
  return response.data;
};
