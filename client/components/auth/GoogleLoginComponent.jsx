import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';

// docs npmjs.com/package/react-google-login
import GoogleLogin from 'react-google-login';

import {loginWithGoogle, authenticate, isAuth} from '../../actions/auth';
import {getProfile, update} from '../../actions/user';
import {GOOGLE_CLIENT_ID} from '../../config';

const GoogleLoginComponent = () => {
  const responseGoogle = response => {
    const tokenId = response.tokenId;
    const user = {tokenId};

    loginWithGoogle(user).then(data => {
      if (data === null || typeof data === 'undefined') {
      } else if (data.error) {
        console.log(data.error);
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
  return (
    <div className="login-with-google-div pb-3">
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme="dark"
      />
    </div>
  );
};

export default GoogleLoginComponent;
