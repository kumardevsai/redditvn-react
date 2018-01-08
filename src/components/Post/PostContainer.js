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
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { post, prevPost, nextPost } = this.props;
    const showDetail = this.props.showDetail === true;

    if (post.raw_id === undefined) {
      return null;
    }

    return (
      <article className={classNames('card blog-post mb-3', { 'border-danger': post.is_deleted === true })}>
        <PostAuthor user={post.user} createdTime={post.created_time} />
        {!showDetail && <PostTitle postId={post.raw_id} title={splitWord(post.message, 50)} />}
        {showDetail && <PostNavigation prevPost={prevPost} nextPost={nextPost} />}
        <PostContent content={post.message} />
        {showDetail && <PostImage images={post.attachments} />}
        <PostInfo r={post.r} u={post.u} postId={post.raw_id} likesCount={post.likes_count} isDeleted={post.is_deleted} commentsCount={post.comments_count} showDetail={showDetail} />
        {showDetail && <PostComment postId={post.raw_id} opId={post.user.raw_id} />}
        {showDetail && <PostNavigation prevPost={prevPost} nextPost={nextPost} />}
      </article>
    );
  }
}

export default PostContainer;
