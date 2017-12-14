import React, { Component } from 'react';
import ReactPaginate from './ReactPaginate/PaginationBoxView';

class CustomPaginate extends Component {
  render() {
    return (
      <ReactPaginate
        previousLabel={'«'}
        nextLabel={'»'}
        breakLabel={'...'}
        breakClassName={'page-link disable'}
        initialPage={this.props.currentPage}
        forcePage={this.props.currentPage}
        pageCount={this.props.totalPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={4}
        onPageChange={this.props.onPageChange}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        disableInitialCallback={true}
      />
    );
  }
}

export default CustomPaginate;
