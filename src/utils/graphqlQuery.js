import gql from 'graphql-tag';

export const getRandom = gql`
  query getRandom($q: String) {
    random(filter: {
      q: $q
    }) {
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
    prevPost: posts(first: 1, after: $cursor) {
      edges {
        node {
          _id
        }
      }
    }
    nextPost: posts(last: 1, before: $cursor) {
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
  query getPosts($query: String, $first: Int, $after: String, $last: Int, $before: String) {
    posts(first: $first, after: $after, last: $last, before: $before, filter: { q: $query }) {
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
  query getPostsWithSubReddit($displayName: String!, $subreddit: String, $first: Int, $after: String, $last: Int, $before: String) {
    r(displayName: $displayName) {
      display_name
      accounts_active
      icon_img
      subscribers
    }
    posts(first: $first, after: $after, last: $last, before: $before, filter: { r: $subreddit }) {
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
      likes(first: $first, since: $since, until: $until) {
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
      comments(first: $first, since: $since, until: $until) {
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
    }
  }
`;

export const getUser = gql`
  query getUser(
    $user_id: ID!
    $post_first: Int
    $post_after: String
    $post_last: Int
    $post_before: String
    $comment_first: Int
    $comment_after: String
    $comment_last: Int
    $comment_before: String
  ) {
    user: node(id: $user_id) {
      id
      ... on User {
        _id
        name
        profile_pic(size: 128)
        posts_count
        comments_count
        posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
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
        comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
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
  query getUser($user_id: ID!, $post_first: Int, $post_after: String, $post_last: Int, $post_before: String) {
    user: node(id: $user_id) {
      id
      ... on User {
        _id
        posts(first: $post_first, after: $post_after, last: $post_last, before: $post_before) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
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
  query getUser($user_id: ID!, $comment_first: Int, $comment_after: String, $comment_last: Int, $comment_before: String) {
    user: node(id: $user_id) {
      id
      ... on User {
        _id
        comments(first: $comment_first, after: $comment_after, last: $comment_last, before: $comment_before) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
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
  query getPostsWithUserReddit($name: String!, $ureddit: String, $first: Int, $after: String, $last: Int, $before: String) {
    u(name: $name) {
      comment_karma
      icon_img
      link_karma
      name
    }
    posts(first: $first, after: $after, last: $last, before: $before, filter: { u: $ureddit }) {
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
