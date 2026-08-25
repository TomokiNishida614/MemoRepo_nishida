import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, clearAuth } from '../api/authStorage';
import { listMemos, createMemo, deleteMemo } from '../api/memoApi';

const IMPORTANCE_OPTIONS = ['高', '中', '低'];

// datetime-local用のyyyy-MM-dd形式（今日以降しか選べないようにmin属性に使う）
function todayForDataInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export default function MemoPage() {
  const navigate = useNavigate();
  const userName = getUserName();

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [form, setForm] = useState({ title: '', content: '', importance: '', postingDeadline: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formServerError, setFormServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchMemos();
  }, []);

  async function fetchMemos() {
    setLoading(true);
    setListError('');
    try {
      const result = await listMemos();
      setMemos(result.data.memos);
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuth();
        navigate('/login');
        return;
      }
      setListError('メモ一覧の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = 'タイトルを入力してください';
    } else if (form.title.length > 10) {
      errors.title = 'タイトルは10文字以内で入力してください';
    }

    if (!form.content.trim()) {
      errors.content = '本文を入力してください';
    } else if (form.content.length > 200) {
      errors.content = '本文は200文字以内で入力してください';
    }

    if (!form.importance) {
      errors.importance = '重要度を選択してください';
    }

    if (!form.postingDeadline) {
      errors.postingDeadline = '掲載期限を選択してください';
    } else if (form.postingDeadline < todayForDataInput()) {
      errors.postingDeadline = '過去の日時は選択できません。現在より後の日時を選択してください';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormServerError('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createMemo({
        ...form,
        postingDeadline: `${form.postingDeadline}T23:59:59`
      });
      setForm({ title: '', content: '', importance: '', postingDeadline: '' });
      setFormErrors({});
      await fetchMemos();
    } catch (err) {
      if (err.response?.data?.message) {
        setFormServerError(err.response.data.message);
      } else {
        setFormServerError('メモの作成に失敗しました。');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setForm({ title: '', content: '', importance: '', postingDeadline: '' });
    setFormErrors({});
    setFormServerError('');
  }

  async function handleDelete(memoId) {
    if (!window.confirm('本当に削除しますか？')) return;

    setDeleteError('');
    setDeletingId(memoId);
    try {
      await deleteMemo(memoId);
      await fetchMemos();
    } catch (err) {
      if (err.response?.data?.message) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError('メモの削除に失敗しました。');
      }
    } finally {
      setDeletingId(null);
    }
  }

  function formatDeadline(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <span>{userName}</span>
        <button onClick={handleLogout}>ログアウト</button>
      </div>

      <h2>メモ作成</h2>
      {formServerError && <div style={{ color: 'red', marginBottom: 12 }}>{formServerError}</div>}

      <form onSubmit={handleCreate} style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 12 }}>
          <label>タイトル</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            style={{ width: '100%', padding: 8 }}
          />
          {formErrors.title && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.title}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>本文</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleFormChange}
            rows={4}
            style={{ width: '100%', padding: 8 }}
          />
          {formErrors.content && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.content}</div>}
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
          <div>
            <label>重要度</label><br />
            <select name="importance" value={form.importance} onChange={handleFormChange}>
              <option value="">-</option>
              {IMPORTANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {formErrors.importance && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.importance}</div>}
          </div>

          <div>
            <label>掲載期限</label><br />
            <input
              type="date"
              name="postingDeadline"
              value={form.postingDeadline}
              min={todayForDataInput()}
              onChange={handleFormChange}
            />
            {formErrors.postingDeadline && <div style={{ color: 'red', fontSize: 12 }}>{formErrors.postingDeadline}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={handleClear}>クリア</button>
          <button type="submit" disabled={submitting}>
            {submitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>

      <h2>メモ一覧</h2>
      {deleteError && <div style={{ color: 'red', marginBottom: 12 }}>{deleteError}</div>}

      {loading && <p>読み込み中...</p>}
      {listError && <p style={{ color: 'red' }}>{listError}</p>}

      {!loading && !listError && (
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
                  {memo.isOwner ? (
                    <button
                      onClick={() => handleDelete(memo.memoId)}
                      disabled={deletingId === memo.memoId}
                    >
                      {deletingId === memo.memoId ? '削除中...' : '削除'}
                    </button>
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