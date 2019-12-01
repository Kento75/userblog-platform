import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';
import {QuillFormats, QuillModules} from '../../helpers/quill';

// react-quill エディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const BlogUpdate = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <p>create blog form</p>
          <div className="pt-3">show success and error msg</div>
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogUpdate;
