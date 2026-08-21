import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { saveAuth } from '../api/authStorage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mailAddress: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.mailAddress.trim()) {
      newErrors.mailAddress = 'メールアドレスを入力してください';
    }
    if (!form.password) {
      newErrors.password = 'パスワードを入力してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await login(form);
      saveAuth({
        accessToken: result.data.accessToken,
        userName: result.data.userName,
      });
      navigate('/memos');
    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('ログインに失敗しました。時間をおいて再度お試しください。');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 16 }}>
      <h1 style={{ textAlign: 'center' }}>ログイン</h1>

      {serverError && (
        <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{serverError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>メールアドレス</label>
          <input
            type="text"
            name="mailAddress"
            value={form.mailAddress}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
          />
          {errors.mailAddress && <div style={{ color: 'red', fontSize: 12 }}>{errors.mailAddress}</div>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label>パスワード</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
          />
          {errors.password && <div style={{ color: 'red', fontSize: 12 }}>{errors.password}</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: 10 }}>
            {submitting ? 'ログイン中...' : 'ログイン'}
          </button>
          <span>
            新規登録は<Link to="/register">こちら</Link>
          </span>
        </div>
      </form>
    </div>
  );
}