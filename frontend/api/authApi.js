import client from './client';

function generateRequestId() {
  return `REQ-${Date.now()}`;
}

export async function register({ userName, mailAddress, password, passwordConfirm }) {
  const response = await client.post('/auth/register', {
    requestId: generateRequestId(),
    userName,
    mailAddress,
    password,
    passwordConfirm,
  });
  return response.data;
}

export async function login({ mailAddress, password }) {
  const response = await client.post('/auth/login', {
    requestId: generateRequestId(),
    mailAddress,
    password,
  });
  return response.data;
}