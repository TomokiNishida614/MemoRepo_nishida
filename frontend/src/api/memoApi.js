import client from './client';

function generateRequestId() {
  return `REQ-${Date.now()}`;
}

export async function listMemos() {
  const response = await client.get('/memos');
  return response.data;
}

export async function createMemo({ title, content, importance, postingDeadline }) {
  const response = await client.post('/memos', {
    requestId: generateRequestId(),
    title,
    content,
    importance,
    postingDeadline,
  });
  return response.data;
}

export async function deleteMemo(memoId) {
  const response = await client.delete(`/memos/${memoId}`);
  return response.data;
}