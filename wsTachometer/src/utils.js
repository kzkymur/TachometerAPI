import AXIOS from 'axios';

export const axios = AXIOS.create({
  baseURL: `http://localhost:${process.env.ARCHIVE_PORT}`,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
});

export const toEpochTime = (string) => {
  const date = new Date(string);
  return Math.floor(date.getTime() / 1000);
};
