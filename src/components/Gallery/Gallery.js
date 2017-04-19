import React, { Component } from 'react';
import Masonry from 'react-masonry-component';
import './Gallery.css';

let masonryOptions = {
    transitionDuration: '0.1s', // Instant reflowing
    columnWidth: 300,
    gutter: 10
};


class Gallery extends Component {
  render() {
    const { elements } = this.props

    return (
      <Masonry
        className={'gallery'} // default ''
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
        {elements}
      </Masonry>
    );
  }
}

export default Gallery;
