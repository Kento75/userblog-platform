import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import {
  API
} from '../config';

/**
 * @param  {} blog
 * @param  {} token
 */
export const createBlog = (blog, token) => {
  return fetch(`${API}/blog`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: blog
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

/**
 * 
 */
export const listBlogsWithCategoriesAndTags = () => {
  return fetch(`${API}/blogs-categories-tags`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};