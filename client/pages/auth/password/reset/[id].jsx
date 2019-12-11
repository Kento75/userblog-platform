import {useState} from 'react';
import {withRouter} from 'next/router';

import Layout from '../../../../components/Layout';
import {resetPassword} from '../../../../actions/auth';

const ResetPassword = ({router}) => {
  const [values, setValues] = useState ({
    name: '',
    newPassword: '',
    error: '',
    message: '',
    showForm: true,
  });

  const {name, newPassword, error, message, showForm} = values;

  const handleSubmit = e => {
    e.preventDefault ();
    // router.query.id -> 1time token
    resetPassword ({
      newPassword,
      resetPasswordLink: router.query.id,
    }).then (data => {
      if (data === null || typeof data === 'undefined') {
      } else if (data.error) {
        setValues ({
          ...values,
          error: data.error,
          showForm: false,
          newPassword: '',
        });
      } else {
        setValues ({
          ...values,
          message: data.message,
          showForm: false,
          error: false,
          newPassword: '',
        });
      }
    });
  };

  const passwordResetForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            className="form-control"
            type="password"
            onChange={e => setValues ({...values, newPassword: e.target.value})}
            value={newPassword}
            placeholder="Type new password"
            required
          />
        </div>
        <div>
          <button className="btn btn-primary">Change password</button>
        </div>
      </form>
    </div>
  );

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';

  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : '';

  return (
    <Layout>
      <div className="container">
        <h2>Reset password</h2>
        <hr />
        {showError ()}
        {showMessage ()}
        {showForm && passwordResetForm ()}
      </div>
    </Layout>
  );
};

export default withRouter (ResetPassword);
