import axios from 'axios';
const BASE_URL = 'http://localhost:80';

export const login = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    alert("Logged in")
    return data;
    
  } else {
  }
};

export const register = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    alert(response.message)
    return data;
  } else {
    alert("Couldn't sign up")
  }
};