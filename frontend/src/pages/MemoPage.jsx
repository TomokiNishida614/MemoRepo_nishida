import { useNavigate } from 'react-router-dom';
import { getUserName, clearAuth } from '../api/authStorage';

export default function MemoPage() {
  const navigate = useNavigate();
  const userName = getUserName();

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
        <span>{userName}</span>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
      <h1>メモ一覧</h1>
      <p style={{ color: '#888' }}>（このページは次のブランチで実装します）</p>
    </div>
  );
}