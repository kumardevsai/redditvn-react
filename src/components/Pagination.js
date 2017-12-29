import React, { PureComponent } from 'react';
import classNames from 'classnames';

class Pagination extends PureComponent {
  render() {
    const { hasNextPage, hasPreviousPage, onClickNextPage, onClickPreviousPage } = this.props;

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={classNames('page-item', { disabled: !hasPreviousPage })}>
            <a className="page-link" onClick={onClickPreviousPage}>
              Previous
            </a>
          </li>
          <li className={classNames('page-item', { disabled: !hasNextPage })}>
            <a className="page-link" onClick={onClickNextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Pagination;
