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
 * @param  {} skip
 * @param  {} limit
 */
export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip
  };
  return fetch(`${API}/blogs-categories-tags`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

/**
 * @param  {} slug
 */
export const singleBlog = (slug) => {
  return fetch(`${API}/blog/${slug}`, {
      method: "GET",
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

/**
 * @param  {} skip
 * @param  {} limit
 */
export const listRelated = blog => {
  return fetch(`${API}/blogs/related`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blog)
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const list = () => {
  return fetch(`${API}/blogs`, {
      method: "GET",
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

/**
 * @param  {} slug
 * @param  {} token
 */
export const removeBlog = (slug, token) => {
  return fetch(`${API}/blog/${slug}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

/**
 * @param  {} blog
 * @param  {} token
 * @param  {} slug
 */
export const createBlog = (blog, token, slug) => {
  return fetch(`${API}/blog/${slug}`, {
      method: 'PUT',
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