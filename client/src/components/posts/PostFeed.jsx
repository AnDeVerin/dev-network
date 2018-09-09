import React, { Component } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import PostItem from './PostItem.jsx';

class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    return posts.map(post => <PostItem key={post._id} post={post} />);  // eslint-disable-line
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default PostFeed;
