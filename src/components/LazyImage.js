import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';

class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
      alt: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({ src: nextProps.src });
    }
  }

  onLoadedImage = () => {
    this.setState({ alt: this.props.alt });
  };

  onErrorImage = () => {
    this.setState({ src: '/gray.png' });
  };

  render() {
    const sizeStyle = {
      height: this.props.height,
      width: this.props.width
    };
    return (
      <LazyLoad height={this.props.height} placeholder={<div style={sizeStyle} />} offset={100}>
        <img
          style={sizeStyle}
          onError={this.onErrorImage}
          onLoad={this.onLoadedImage}
          className={this.props.className}
          src={this.state.src}
          alt={this.state.alt}
          title={this.state.alt}
        />
      </LazyLoad>
    );
  }
}

export default LazyImage;
