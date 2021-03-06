import {useState, useEffect} from 'react';
import {signin, authenticate, isAuth} from '../../actions/auth';
import Router from 'next/router';
import Link from 'next/link';
import GoogleLoginComponent from './GoogleLoginComponent';

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    showForm: true,
  });

  const {email, password, error, loading, message, showForm} = values;

  // ログインしてる場合、homeへ飛ばす
  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setValues({...values, loading: true, error: false});
    const user = {email, password};

    signin(user).then(data => {
      if (data === null || typeof data === 'undefined') {
      } else if (data.error) {
        setValues({...values, error: data.error});
      } else {
        authenticate(data, () => {
          // 管理者の場合
          if (isAuth() && data.user.role === 1) {
            Router.push(`/admin`);
          } else {
            // 一般の場合
            Router.push(`/user`);
          }
        });
      }
    });
  };

  const handleChange = name => e => {
    setValues({...values, error: false, [name]: e.target.value});
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : '';

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';

  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : '';

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange('email')}
            type="email"
            className="form-control"
            placeholder="Type your email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange('password')}
            type="password"
            className="form-control"
            placeholder="Type your password"
          />
        </div>
        <div>
          <button className="btn btn-primary">Signin</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      <GoogleLoginComponent />
      {showForm && signinForm()}
      <br />
      <Link href="/auth/password/forgot">
        <a className="btn btn-sm btn-outline-danger">Reset password</a>
      </Link>
    </React.Fragment>
  );
};

export default SigninComponent;
