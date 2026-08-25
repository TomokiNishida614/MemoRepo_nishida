import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^[a-zA-Z0-9]{8,20}$/;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userName: '',
        mailAddress: '',
        password: '',
        passwordConfirm: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function validate() {
        const newErrors = {};

        if (!form.userName.trim()) {
            newErrors.userName = 'ユーザー名を入力してください';
        } else if (form.userName.length > 20) {
            newErrors.userName = 'ユーザー名は20文字以内で入力してください';
        }

        if (!form.mailAddress.trim()) {
            newErrors.mailAddress = 'メールアドレスを入力してください';
        } else if (!EMAIL_PATTERN.test(form.mailAddress)) {
            newErrors.mailAddress = '有効なメールアドレスの形式で入力してください';
        } else if (form.mailAddress.length > 50) {
            newErrors.mailAddress = 'メールアドレスは50文字以内で入力してください';
        }

        if (!form.password) {
            newErrors.password = 'パスワードを入力してください';
        } else if (!PASSWORD_PATTERN.test(form.password)) {
            newErrors.password = 'パスワードは8〜20文字の半角英数字で入力してください';
        }

        if (!form.passwordConfirm) {
            newErrors.passwordConfirm = 'パスワード確認用を入力してください';
        } else if (form.password !== form.passwordConfirm) {
            newErrors.passwordConfirm = 'パスワードが一致しません';
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
            await register(form);
            navigate('/login');
        } catch (err) {
            if (err.response?.data?.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError('登録に失敗しました。時間をおいて再度お試しください。');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="page page--narrow">
            <div className="card">
                <h1 className="card__title">新規登録</h1>

                {serverError && <div className="alert alert--error">{serverError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field__label">ユーザー名</label>
                        <input type="text" name="userName" className="field__input" value={form.userName} onChange={handleChange} />
                        {errors.userName && <div className="field__error">{errors.userName}</div>}
                    </div>

                    <div className="field">
                        <label className="field__label">メールアドレス</label>
                        <input type="text" name="mailAddress" className="field__input" placeholder="user@example.com" value={form.mailAddress} onChange={handleChange} />
                        {errors.mailAddress && <div className="field__error">{errors.mailAddress}</div>}
                    </div>

                    <div className="field">
                        <label className="field__label">パスワード</label>
                        <input type="password" name="password" className="field__input" value={form.password} onChange={handleChange} />
                        {errors.password && <div className="field__error">{errors.password}</div>}
                    </div>

                    <div className="field">
                        <label className="field__label">パスワード確認用</label>
                        <input type="password" name="passwordConfirm" className="field__input" value={form.passwordConfirm} onChange={handleChange} />
                        {errors.passwordConfirm && <div className="field__error">{errors.passwordConfirm}</div>}
                    </div>

                    <div className="btn-row">
                        <Link to="/login" className="btn btn--secondary">戻る</Link>
                        <button type="submit" className="btn btn--primary" disabled={submitting}>
                            {submitting ? '登録中...' : '登録'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}