import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserName, clearAuth } from '../api/authStorage';
import { listMemos, createMemo, deleteMemo } from '../api/memoApi';

const IMPORTANCE_OPTIONS = ['高', '中', '低'];
const IMPORTANCE_CLASS = { '高': 'high', '中': 'mid', '低': 'low' };

function todayForDateInput() {
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

  useEffect(() => { fetchMemos(); }, []);

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
    if (!form.title.trim()) errors.title = 'タイトルを入力してください';
    else if (form.title.length > 10) errors.title = 'タイトルは10文字以内で入力してください';

    if (!form.content.trim()) errors.content = '本文を入力してください';
    else if (form.content.length > 200) errors.content = '本文は200文字以内で入力してください';

    if (!form.importance) errors.importance = '重要度を選択してください';

    if (!form.postingDeadline) errors.postingDeadline = '掲載期限を選択してください';
    else if (form.postingDeadline < todayForDateInput()) errors.postingDeadline = '過去の日付は選択できません。本日以降の日付を選択してください';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormServerError('');
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createMemo({ ...form, postingDeadline: `${form.postingDeadline}T23:59:59` });
      setForm({ title: '', content: '', importance: '', postingDeadline: '' });
      setFormErrors({});
      await fetchMemos();
    } catch (err) {
      setFormServerError(err.response?.data?.message || 'メモの作成に失敗しました。');
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
      setDeleteError(err.response?.data?.message || 'メモの削除に失敗しました。');
    } finally {
      setDeletingId(null);
    }
  }

  function formatDeadline(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <span className="topbar__brand">メモ</span>
        <div className="topbar__user">
          <span>{userName}</span>
          <button className="btn btn--secondary" onClick={handleLogout}>ログアウト</button>
        </div>
      </div>

      <div className="page">
        <div className="card">
          <h2 className="card__title" style={{ textAlign: 'left', fontSize: 20 }}>メモ作成</h2>
          {formServerError && <div className="alert alert--error">{formServerError}</div>}

          <form onSubmit={handleCreate}>
            <div className="field">
              <label className="field__label">タイトル</label>
              <input type="text" name="title" className="field__input" value={form.title} onChange={handleFormChange} />
              {formErrors.title && <div className="field__error">{formErrors.title}</div>}
            </div>

            <div className="field">
              <label className="field__label">本文</label>
              <textarea name="content" className="field__textarea" value={form.content} onChange={handleFormChange} />
              {formErrors.content && <div className="field__error">{formErrors.content}</div>}
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field__label">重要度</label>
                <select name="importance" className="field__select" value={form.importance} onChange={handleFormChange}>
                  <option value="">選択してください</option>
                  {IMPORTANCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {formErrors.importance && <div className="field__error">{formErrors.importance}</div>}
              </div>

              <div className="field">
                <label className="field__label">掲載期限</label>
                <input
                  type="date"
                  name="postingDeadline"
                  className="field__input"
                  value={form.postingDeadline}
                  min={todayForDateInput()}
                  onChange={handleFormChange}
                />
                {formErrors.postingDeadline && <div className="field__error">{formErrors.postingDeadline}</div>}
              </div>
            </div>

            <div className="btn-row">
              <button type="button" className="btn btn--secondary" onClick={handleClear}>クリア</button>
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>

        <h2 className="section-heading">メモ一覧</h2>
        {deleteError && <div className="alert alert--error">{deleteError}</div>}
        {loading && <p>読み込み中...</p>}
        {listError && <div className="alert alert--error">{listError}</div>}

        {!loading && !listError && memos.length === 0 && (
          <div className="empty-state">まだメモがありません。上のフォームから最初のメモを作成してください。</div>
        )}

        {!loading && !listError && memos.map((memo) => (
          <div key={memo.memoId} className={`memo-card memo-card--${IMPORTANCE_CLASS[memo.importance] || ''}`}>
            <div className="memo-card__body">
              <div className="memo-card__head">
                <span className="memo-card__title">{memo.title}</span>
                <span className={`memo-badge memo-badge--${IMPORTANCE_CLASS[memo.importance] || ''}`}>
                  {memo.importance}
                </span>
              </div>
              <div className="memo-card__content">{memo.content}</div>
              <div className="memo-card__meta">
                <span>投稿者: {memo.userName}</span>
                <span>掲載期限: {formatDeadline(memo.postingDeadline)}</span>
              </div>
            </div>
            <div className="memo-card__actions">
              {memo.isOwner ? (
                <button
                  className="btn btn--danger"
                  onClick={() => handleDelete(memo.memoId)}
                  disabled={deletingId === memo.memoId}
                >
                  {deletingId === memo.memoId ? '削除中...' : '削除'}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}