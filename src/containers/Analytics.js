import { Component } from 'react';
import ReactGA from 'react-ga';

class Analytics extends Component {
  componentDidMount() {
    this.sendPageChange(this.props.location.pathname, this.props.location.search)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname
      || this.props.location.search !== prevProps.location.search) {
      this.sendPageChange(this.props.location.pathname, this.props.location.search)
    }
  }

  sendPageChange(pathname, search = "") {
    const page = pathname + search
    ReactGA.set({page});
    ReactGA.pageview(page);
    ReactGA.modalview(pathname);
  }

  render() {
    return null
  }
}

export default Analytics;
