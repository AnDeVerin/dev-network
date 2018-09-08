import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // eslint-disable-line
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader.jsx';
import ProfileAbout from './ProfileAbout.jsx';
import ProfileCreds from './ProfileCreds.jsx';
// import ProfileGithub from './ProfileGithub.jsx';
import Spinner from '../common/Spinner.jsx';
import { getProfileByHandle } from '../../actions/profileActions';

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push('/not-found');
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
            <div className="col-md-6" />
          </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          <ProfileCreds
            education={profile.education}
            experience={profile.experience}
          />
          {/* {profile.githubusername
            ? (<ProfileGithub username={profile.githubusername} />)
            : null} */}
        </div>
      );
    }

    return (
      <div className="profile mb-4">
        <div className="row">
          <div className="col-md-12">{profileContent}</div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
