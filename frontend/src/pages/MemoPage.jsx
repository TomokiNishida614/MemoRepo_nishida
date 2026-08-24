import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, clearAuth } from '../api/authStorage';
import { listMemos } from '../api/memoApi';

export default function MemoPage() {
  const navigate = useNavigate();
  const userName = getUserName();

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemos();
  }, []);

  async function fetchMemos() {
    setLoading(true);
    setError('');
    try {
      const result = await listMemos();
      setMemos(result.data.memos);
    } catch (err) {
      if (err.response?.status === 401) {
        // トークン切れなどでサーバーに拒否された場合はログイン画面へ
        clearAuth();
        navigate('/login');
        return;
      }
      setError('メモ一覧の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  function formatDeadline(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <span>{userName}</span>
        <button onClick={handleLogout}>ログアウト</button>
      </div>

      <div style={{ padding: 16, border: '1px dashed #ccc', borderRadius: 8, marginBottom: 32, color: '#888', textAlign: 'center' }}>
        メモ作成フォームは次のブランチで実装します
      </div>

      <h2>メモ一覧</h2>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f4ff' }}>
              <th style={thStyle}>タイトル</th>
              <th style={thStyle}>本文</th>
              <th style={thStyle}>重要度</th>
              <th style={thStyle}>投稿者</th>
              <th style={thStyle}>掲載期限</th>
              <th style={thStyle}>削除</th>
            </tr>
          </thead>
          <tbody>
            {memos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                  表示できるメモがありません
                </td>
              </tr>
            )}
            {memos.map((memo) => (
              <tr key={memo.memoId}>
                <td style={tdStyle}>{memo.title}</td>
                <td style={tdStyle}>{memo.content}</td>
                <td style={tdStyle}>{memo.importance}</td>
                <td style={tdStyle}>{memo.userName}</td>
                <td style={tdStyle}>{formatDeadline(memo.postingDeadline)}</td>
                <td style={tdStyle}>
                  {/* 削除APIは次のブランチで実装。is_ownerがtrueの行だけ将来ボタンを出す想定 */}
                  {memo.isOwner ? (
                    <button disabled title="削除APIは未実装です">削除</button>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: 8, borderBottom: '2px solid #ddd' };
const tdStyle = { padding: 8, borderBottom: '1px solid #eee' };