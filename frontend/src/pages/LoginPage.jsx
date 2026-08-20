import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 16 }}>
      <h1 style={{ textAlign: 'center' }}>ログイン</h1>
      <p style={{ textAlign: 'center', color: '#888' }}>（このページは次のブランチで実装します）</p>
      <p style={{ textAlign: 'center' }}>
        新規登録は<Link to="/register">こちら</Link>
      </p>
    </div>
  );
}