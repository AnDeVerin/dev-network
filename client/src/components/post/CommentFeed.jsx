import React, { Component } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import CommentItem from './CommentItem.jsx';

class CommentFeed extends Component {
  render() {
    const { comments, postId } = this.props;

    return comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={postId} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
};

export default CommentFeed;
