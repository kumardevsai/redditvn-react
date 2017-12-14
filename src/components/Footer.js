import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer className="bd-footer">
        <div className="container-fluid p-3 p-md-5">
          <ul className="bd-footer-links">
            <li>
              <NavLink exact to="/search">
                News
              </NavLink>
            </li>
            <li>
              <a href="https://www.facebook.com/366378530426222_448018485595559" target="_blank" rel="noopener noreferrer">
                Support
              </a>
            </li>
          </ul>
          <p>© 2017 Reddit Vietnam Team.</p>
          <p>Bản quyền nội dung thuộc về Reddit Vietnam và tác giả.</p>
          <p>Website này chỉ hỗ trợ cho việc tìm kiếm bài viết.</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
