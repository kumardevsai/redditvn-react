import gql from 'graphql-tag';

export const getRandom = gql`
  query getRandom($q: String, $r: String) {
    random(filter: { q: $q, r: $r }) {
      id
      _id
    }
  }
`;

export const getCount = gql`
  query getCount {
    usersCount: count(type: USERS)
    postsCount: count(type: POSTS)
    commentsCount: count(type: COMMENTS)
    subreddits: subreddits(first: 50) {
      edges {
        node {
          _id
          posts_count
        }
      }
    }
  }
`;

export const getPost = gql`
  query getPost($post_id: ID!, $cursor: String) {
    post: node(id: $post_id) {
      id
      ... on Post {
        _id
        user {
          _id
          name
          profile_pic
        }
        r
        u
        message
        created_time
        comments_count
        likes_count
        is_deleted
        attachments {
          edges {
            node {
              url
              src
              type
            }
          }
        }
      }
    }
    nextPost: posts(first: 1, after: $cursor) {
      edges {
        node {
          _id
        }
      }
    }
    prevPost: posts(last: 1, before: $cursor) {
      edges {
        node {
          _id
        }
      }
    }
  }
`;

export const getComments = gql`
  query getComments($post_id: ID!, $cursor: String) {
    node(id: $post_id) {
      id
      ... on Post {
        _id
        comments(first: 20, after: $cursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
          }
          edges {
            cursor
            node {
              _id
              message
              created_time
              user {
                _id
                name
                profile_pic
              }
              replies {
                edges {
                  node {
                    _id
                    message
                    created_time
                    user {
                      _id
                      name
                      profile_pic
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getChart = gql`
  query getChart($type: ChartType!, $group: ChartGroup!) {
    chart(type: $type, group: $group) {
      label
      data
    }
  }
`;

export const getPosts = gql`
  query getPosts($query: String, $subreddit: String, $first: Int, $after: String, $last: Int, $before: String) {
    posts(first: $first, after: $after, last: $last, before: $before, filter: { q: $query, r: $subreddit }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          _id
          user {
            _id
            name
            profile_pic
          }
          r
          u
          message
          created_time
          comments_count
          likes_count
          is_deleted
        }
      }
    }
  }
`;

export const getPostsWithSubReddit = gql`
  query getPostsWithSubReddit($displayName: ID!, $query: String, $subreddit: String, $first: Int, $after: String, $last: Int, $before: String) {
    r: node(id: $displayName) {
      id
      ... on R {
        display_name
        accounts_active
        icon_img
        subscribers
      }
    }
    posts(first: $first, after: $after, last: $last, before: $before, filter: { r: $subreddit, q: $query }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          _id
          user {
            _id
            name
            profile_pic
          }
          r
          u
          message
          created_time
          comments_count
          likes_count
          is_deleted
        }
      }
    }
  }
`;

export const getTop = gql`
  query getTop($first: Int, $since: Int, $until: Int) {
    likes: posts(orderBy: likes_count_DESC, first: $first, filter: { since: $since, until: $until }) {
      edges {
        node {
          _id
          user {
            _id
            name
            profile_pic
          }
          likes_count
        }
      }
    }

    comments: posts(orderBy: comments_count_DESC, first: $first, filter: { since: $since, until: $until }) {
      edges {
        node {
          _id
          user {
            _id
            name
            profile_pic
          }
          comments_count
        }
      }
    }

    top {
      posts_count(first: $first, since: $since, until: $until) {
        edges {
          node {
            _id
            name
            profile_pic
            posts_count
          }
        }
      }
    }
  }
`;

export const getUser = gql`
  query getUser(
    $node_id: ID!, $user_id: String, $query: String
    $post_first: Int, $post_after: String, $post_last: Int, $post_before: String
    $comment_first: Int, $comment_after: String, $comment_last: Int, $comment_before: String
  ) {
    user: node(id: $node_id) {
      id
      ... on User {
        _id
        name
        profile_pic(size: 128)
        posts_count
        comments_count
        posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before, filter: { q: $query, user: $user_id }) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
          edges {
            cursor
            node {
              _id
              user {
                _id
                name
                profile_pic
              }
              r
              u
              message
              created_time
              comments_count
              likes_count
              is_deleted
            }
          }
        }
        comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before, filter: { q: $query, user: $user_id }) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
          edges {
            cursor
            node {
              _id
              user {
                _id
                name
                profile_pic
              }
              message
              created_time
            }
          }
        }
      }
    }
  }
`;

export const getUserPosts = gql`
  query getUserPosts($node_id: ID!, $user_id: String, $query: String, $post_first: Int, $post_after: String, $post_last: Int, $post_before: String) {
    user: node(id: $node_id) {
      id
      ... on User {
        _id
        posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before, filter: { q: $query, user: $user_id }) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
          edges {
            cursor
            node {
              _id
              user {
                _id
                name
                profile_pic
              }
              r
              u
              message
              created_time
              comments_count
              likes_count
              is_deleted
            }
          }
        }
      }

    }
  }
`;

export const getUserComments = gql`
  query getUserComments($node_id: ID!, $user_id: String, $query: String, $comment_first: Int, $comment_after: String, $comment_last: Int, $comment_before: String) {
    user: node(id: $node_id) {
      id
      ... on User {
        _id
        comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before, filter: { q: $query, user: $user_id }) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
          edges {
            cursor
            node {
              _id
              user {
                _id
                name
                profile_pic
              }
              message
              created_time
            }
          }
        }
      }
    }
  }
`;

export const getPostsWithUserReddit = gql`
  query getPostsWithUserReddit($name: ID!, $query: String, $ureddit: String, $first: Int, $after: String, $last: Int, $before: String) {
    u: node(id: $name) {
      id
      ... on U {
        comment_karma
        icon_img
        link_karma
        name
      }
    }
    posts(first: $first, after: $after, last: $last, before: $before, filter: { u: $ureddit, q: $query }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          _id
          user {
            _id
            name
            profile_pic
          }
          r
          u
          message
          created_time
          comments_count
          likes_count
          is_deleted
        }
      }
    }
  }
`;

export const getUsers = gql`
  query getUsers($query: String, $first: Int, $after: String, $last: Int, $before: String) {
    users(first: $first, after: $after, last: $last, before: $before, filter: { q: $query }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          _id
          name
          profile_pic
          posts_count
          comments_count
        }
      }
    }
  }
`;
