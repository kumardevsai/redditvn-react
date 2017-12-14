import React, { PureComponent } from 'react';
import { splitWord } from '../../utils/utils';
import PostAuthor from './PostAuthor';
import PostTitle from './PostTitle';
import PostContent from './PostContent';
import PostImage from './PostImage';
import PostInfo from './PostInfo';
import PostNavigation from './PostNavigation';
import PostComment from './PostComment';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class PostContainer extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    images: PropTypes.array,
    comments: PropTypes.array
  };

  static defaultProps = {
    post: {},
    images: undefined,
    comments: undefined
  };

  render() {
    const { post, images, comments } = this.props;
    const showDetail = this.props.showDetail === true;

    if (post._id === undefined) {
      return null;
    }

    return (
      <article className={classNames('card blog-post mb-3', { 'border-danger': post.is_deleted === true })}>
        <PostAuthor user={post.from} createdTime={post.created_time} />
        {!showDetail && <PostTitle postId={post._id} title={splitWord(post.message, 50)} />}
        {showDetail && <PostNavigation prevPost={post.prev_post} nextPost={post.next_post} />}
        <PostContent content={post.message} />
        {showDetail && <PostImage images={images} />}
        <PostInfo postId={post._id} likesCount={post.likes_count} isDeleted={post.is_deleted} commentsCount={post.comments_count} showDetail={showDetail} />
        {showDetail && <PostComment postId={post._id} opId={post.from.id} comments={comments} />}
        {showDetail && <PostNavigation prevPost={post.prev_post} nextPost={post.next_post} />}
      </article>
    );
  }
}

export default PostContainer;
