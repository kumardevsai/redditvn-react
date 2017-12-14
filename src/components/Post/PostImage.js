import React, { PureComponent } from 'react';
import LazyImage from '../LazyImage';
import PropTypes from 'prop-types';

class PostImage extends PureComponent {
  static propTypes = {
    images: PropTypes.array.isRequired
  };

  static defaultProps = {
    images: []
  };

  render() {
    const { images } = this.props;

    if (!images || images.length === 0) {
      return null;
    }

    return (
      <div className="card-body blog-post-image text-center">
        {images.map((item, index) => (
          <div className="mb-2" key={index}>
            <a href={item.url}>
              <LazyImage className="rounded" src={item.src} />
            </a>
          </div>
        ))}
      </div>
    );
  }
}

export default PostImage;
