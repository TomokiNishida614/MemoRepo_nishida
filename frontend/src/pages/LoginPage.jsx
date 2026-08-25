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
    <div className="page page--narrow">
      <div className="card">
        <h1 className="card__title">ログイン</h1>

        {serverError && <div className="alert alert--error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label">メールアドレス</label>
            <input
              type="text"
              name="mailAddress"
              className="field__input"
              value={form.mailAddress}
              onChange={handleChange}
            />
            {errors.mailAddress && <div className="field__error">{errors.mailAddress}</div>}
          </div>

          <div className="field">
            <label className="field__label">パスワード</label>
            <input
              type="password"
              name="password"
              className="field__input"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="field__error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'ログイン中...' : 'ログイン'}
          </button>

          <div className="link-line">
            新規登録は<Link to="/register">こちら</Link>
          </div>
        </form>
      </div>
    </div>
  );
}