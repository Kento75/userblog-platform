import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';

// react-quill マークダウンエディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import 'react-quill/dist/quill.snow.css';

const CreateBlog = ({router}) => {
  return (
    <div>
      <h2>create blog form</h2>
      {JSON.stringify(router)}
    </div>
  );
};
export default withRouter(CreateBlog);
