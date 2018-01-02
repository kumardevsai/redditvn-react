import React, { Component } from 'react';
import Chart from 'chart.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import { operations } from '../../duck';
import url from 'url';
import querystring from 'querystring';
import { getChart } from '../../utils/graphqlQuery';
import { withApollo, compose } from 'react-apollo';

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.queryString.type,
      group: props.queryString.group,
      data: {},
      loading: true,
      error: undefined
    };
  }

  onTypeChange = e => {
    this.setState({ type: e.target.value });
  };

  onGroupChange = e => {
    this.setState({ group: e.target.value });
  };

  onSubmitForm = e => {
    e.preventDefault();
    const newQueryString = {
      ...this.props.queryString,
      type: this.state.type,
      group: this.state.group
    };
    this.props.push(this.props.location.pathname + '?' + querystring.stringify(newQueryString));
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.queryString.type !== nextProps.queryString.type) {
      this.setState({ type: nextProps.queryString.type });
    }

    if (this.props.queryString.group !== nextProps.queryString.group) {
      this.setState({ group: nextProps.queryString.group });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) && deepEqual(this.state, nextState)) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.queryString, prevProps.queryString) === false) {
      this.fetchChart();
    }

    if (deepEqual(this.state.data, prevState.data) === false) {
      this.updateChart();
    }
  }

  componentDidMount() {
    this.fetchChart();
  }

  fetchChart = async () => {
    this.props.showLoading();
    this.setState({ loading: true });

    const { query } = this.props.client;

    try {
      const response = await query({
        query: getChart,
        variables: {
          type: this.props.queryString.type,
          group: this.props.queryString.group
        }
      });

      const newResult = {
        ...this.state.data,
        chart: response.data.chart
      };

      this.setState({ data: newResult });
    } catch (error) {
      this.setState({ error: error });
    }

    this.props.hideLoading();
    this.setState({ loading: false });
  };

  updateChart = () => {
    const { chart } = this.state.data;

    if (!chart) {
      return;
    }

    const label = chart.label.slice(0);
    const data = chart.data.slice(0);

    const chartConfig = {
      type: 'line',
      data: {
        labels: label,
        datasets: [
          {
            label: this.props.queryString.type,
            data: data,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: '...'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    };

    const chartContainer = this.refs.chart;
    while (chartContainer.firstChild) {
      chartContainer.removeChild(chartContainer.firstChild);
    }

    const node = document.createElement('canvas');
    node.id = 'canvas';
    chartContainer.appendChild(node);
    new Chart(node, chartConfig);
  };

  render() {
    return (
      <div>
        <form className="mb-3" onSubmit={this.onSubmitForm}>
          <div className="form-row">
            <div className="col form-group">
              <select className="form-control" id="input-type" name="type" value={this.state.type} onChange={this.onTypeChange}>
                <option value="POSTS">Posts</option>
                <option value="COMMENTS">Comments</option>
              </select>
            </div>
            <div className="col form-group">
              <select className="form-control" id="input-group" name="group" value={this.state.group} onChange={this.onGroupChange}>
                <option value="HOUR">Hour</option>
                <option value="DAY_OF_WEEK">Day of Week</option>
                <option value="DAY_OF_MONTH">Day of Month</option>
                <option value="MONTH">Month</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Show
          </button>
        </form>
        <div className="card">
          <h5 className="card-header">Statistics</h5>
          <div id="chart" ref="chart" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const query = url.parse(ownProps.location.search, true).query;
  query.type = query.type || 'POSTS';
  query.group = query.group || 'MONTH';

  return {
    queryString: query
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    push,
    showLoading: operations.showLoading,
    hideLoading: operations.hideLoading
  }),
  withApollo
)(Statistics);
