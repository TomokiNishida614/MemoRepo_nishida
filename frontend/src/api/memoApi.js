import client from './client';

export async function listMemos() {
  const response = await client.get('/memos');
  return response.data;
}