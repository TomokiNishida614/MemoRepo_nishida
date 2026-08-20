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