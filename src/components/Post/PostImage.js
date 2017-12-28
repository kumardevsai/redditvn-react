import React, { PureComponent } from 'react';
import LazyImage from '../LazyImage';
import PropTypes from 'prop-types';
import _ from 'lodash';

class PostImage extends PureComponent {
  static propTypes = {
    images: PropTypes.object.isRequired
  };

  static defaultProps = {
    images: {}
  };

  render() {
    const { images } = this.props;

    const edges = _.get(images, 'edges', undefined);
    if (!edges) {
      return null;
    }

    return (
      <div className="card-body blog-post-image text-center">
        {edges.map((item, index) => (
          <div className="mb-2" key={index}>
            <a href={item.node.url}>
              <LazyImage className="rounded" src={item.node.src} />
            </a>
          </div>
        ))}
      </div>
    );
  }
}

export default PostImage;
