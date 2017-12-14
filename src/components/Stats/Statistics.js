import React, { Component } from 'react';
import Chart from 'chart.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import deepEqual from 'deep-equal';
import { operations } from '../../duck';
import url from 'url';

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      group: props.group
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
    this.props.push(`/stats/?type=${this.state.type}&group=${this.state.group}`);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({ type: nextProps.type });
    }

    if (this.props.group !== nextProps.group) {
      this.setState({ group: nextProps.group });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (deepEqual(this.props, nextProps) === true && deepEqual(this.state, nextState) === true) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (deepEqual(this.props.type, prevProps.type) === false) {
      this.fetchNewStatistics();
    } else if (deepEqual(this.props.group, prevProps.group) === false) {
      this.fetchNewStatistics();
    }
    if (deepEqual(this.props.chart, prevProps.chart) === false) {
      this.updateChart();
    }
  }

  componentDidMount() {
    this.fetchNewStatistics();
    this.updateChart();
  }

  fetchNewStatistics = () => {
    this.props.fetchStatistics(this.props.type, this.props.group);
  };

  updateChart = () => {
    if (!this.props.chart || !this.props.chart.dbStats) {
      return;
    }

    const chartConfig = {
      type: 'line',
      data: {
        labels: this.props.chart.dbStats.labels,
        datasets: [
          {
            label: this.props.chart.dbStats.xLabel,
            data: this.props.chart.dbStats.data,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: this.props.chart.dbStats.title
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.props.chart.dbStats.xLabel
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.props.chart.dbStats.yLabel
              }
            }
          ]
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
                <option value="posts">Posts</option>
                <option value="comments">Comments</option>
              </select>
            </div>
            <div className="col form-group">
              <select className="form-control" id="input-group" name="group" value={this.state.group} onChange={this.onGroupChange}>
                <option value="hour">Hour</option>
                <option value="dow">Day of Week</option>
                <option value="dom">Day of Month</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Show
          </button>
        </form>
        <div className="card">
          <h5 className="card-header">Posts per Month</h5>
          <div id="chart" ref="chart" />
          {/* <canvas id="canvas" ref="canvas" /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parsed = url.parse(ownProps.location.search, true).query;

  return {
    type: parsed.type || 'posts',
    group: parsed.group || 'month',
    chart: state.stats.chart
  };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchStatistics: operations.fetchStatistics,
    push
  })(Statistics)
);
