import React, { Component } from 'react';
import PropTypes from 'prop-types'; //eslint-disable-line

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '74670864c26f3133c146',
      clientSecret: 'cc60e64e461f8b9fd94eaf7030142b5790c0f8d5',
      count: 5,
      sort: 'created: asc',
      repos: [],
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { username } = this.props;
    const {
      count, sort, clientId, clientSecret,
    } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`,
    )
      .then(res => res.json())
      .then((data) => {
        if (this.myRef.current) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { repos } = this.state;
    if (repos.length === 0) return null;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref={this.myRef}>
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ProfileGithub;
