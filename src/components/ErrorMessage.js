import React, { PureComponent } from 'react';

const images404Array = [
  'https://www.redditstatic.com/reddit404a.png',
  'https://www.redditstatic.com/reddit404b.png',
  'https://www.redditstatic.com/reddit404c.png',
  'https://www.redditstatic.com/reddit404d.png',
  'https://www.redditstatic.com/reddit404e.png'
];

class ErrorMessage extends PureComponent {
  render() {
    let { error } = this.props;

    if (!error) error = new Error('');
    console.log(error);

    if (error.response && error.response.data) {
      error = { ...error, ...error.response.data.error };
    }

    if (error.code === 404) error.title = 'page not found';

    error.code = error.code || 400;
    error.image = images404Array[Math.floor(Math.random() * images404Array.length)];
    error.title = error.title || 'something when wrong...';
    error.message = error.message || JSON.stringify(error, undefined, 2);

    return (
      <div className="text-center">
        {error.image ? <img className="img-fluid" src={error.image} alt="" /> : null}
        {error.title ? <h4 className="mt-4">{error.title}</h4> : null}
        {error.message ? (
          <div className="errorpage-message">
            <p>
              [{error.code}] {error.message}
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ErrorMessage;
