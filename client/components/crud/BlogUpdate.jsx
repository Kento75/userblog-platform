import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {singleBlog, updateBlog} from '../../actions/blog';
import {QuillFormats, QuillModules} from '../../helpers/quill';
import {DOMAIN} from '../../config';

// react-quill エディタを簡単に実装できる便利なやつ
// Repository -> https://github.com/zenoamaro/react-quill
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const BlogUpdate = ({router}) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategory, setCheckedCategory] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); //tags

  const [body, setBody] = useState(''); // blog
  const [values, setValues] = useState({
    error: '',
    success: '',
    formData: '',
    title: '',
    body: '',
  });

  const {error, success, formData, title} = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({...values, formData: new FormData()});
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  // カテゴリ一覧取得
  const initCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setCategories(data);
      }
    });
  };

  // タグ一覧取得
  const initTags = () => {
    getTags().then(data => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setTags(data);
      }
    });
  };

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({...values, title: data.title});
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  // ブログからカテゴリ一覧を生成
  const setCategoriesArray = blogCategories => {
    let categoriesArray = [];
    blogCategories.map((category, index) => {
      categoriesArray.push(category._id);
    });

    setCheckedCategory(categoriesArray);
  };

  // ブログからタグ一覧を生成
  const setTagsArray = blogTags => {
    let tagsArray = [];
    blogTags.map((tag, index) => {
      tagsArray.push(tag._id);
    });
    setCheckedTag(tagsArray);
  };

  // カテゴリ一覧表示コンポーネント
  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleCategoriesToggle(category._id)}
            checked={findOutCategory(category._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  // タグ一覧表示コンポーネント
  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleTagsToggle(tag._id)}
            checked={findOutTag(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  // 既に洗濯済みである場合checked
  // arg -> category._id
  const findOutCategory = c => {
    const result = checkedCategory.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  // 既に洗濯済みである場合checked
  // arg -> tag._id
  const findOutTag = t => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  // カテゴリトグル
  const handleCategoriesToggle = c => () => {
    setValues({...values, error: ''});
    // return thhe first index or -1
    const clickedCategory = checkedCategory.indexOf(c);
    const all = [...checkedCategory];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setCheckedCategory(all);
    formData.set('categories', all);
  };

  // タグトグル
  const handleTagsToggle = t => () => {
    setValues({...values, error: ''});
    // return thhe first index or -1
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({...values, [name]: value, formData, error: ''});
  };

  const handleBody = e => {
    setBody(e);
    formData.set('body', e);
  };

  // ブログ更新
  const editBlog = e => {
    e.preventDefault();
    console.log(router.query.slug);
    updateBlog(formData, token, router.query.slug).then(data => {
      if (data.error) {
        console.log(data.error);
        setValues({...values, error: data.error});
      } else {
        setValues({
          ...values,
          title: '',
          success: `Blog titled "${data.title}" is successfully updated`,
        });

        // 管理者の場合
        if (isAuth() && isAuth().role === 1) {
          Router.replace(`/admin/crud/${router.query.slug}`);
          // 一般の場合
        } else if (isAuth() && isAuth().role === 0) {
          Router.replace(`/user/crud/${router.query.slug}`);
        }
      }
    });
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing ..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 text-break">
          {updateBlogForm()}
          <div className="pt-3">
            <p>show success and error msg</p>
            <hr />
            {JSON.stringify(categories)}
            <hr />
            {JSON.stringify(tags)}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5>Featured image</h5>
            <hr />
            <small className="text-muted">Max size: 1mb</small>
            <br />
            <label className="btn btn-outline-info">
              Upload featured image
              <input
                onChange={handleChange('photo')}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
          </div>
          <h5>Categories</h5>
          <hr />
          <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
            {showCategories()}
          </ul>
          <h5>Tags</h5>
          <hr />
          <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
            {showTags()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
