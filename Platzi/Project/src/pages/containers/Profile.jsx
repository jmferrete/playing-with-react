import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Post from '../../posts/containers/Post';
import Loading from '../../shared/components/Loading';
import styles from './Page.css';

import api from '../../api';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.initialFetch();
  }

  async initialFetch() {
    const [
      user,
      posts,
    ] = await Promise.all([
      api.users.getSingle(this.props.match.params.id),
      api.users.getPosts(this.props.match.params.id),
    ]);

    this.setState({
      user,
      posts,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <section name="profile" className={styles.section}>
        <h2>
          <FormattedMessage
            id="title.profile"
            values={{
              name: this.state.user.name,
            }}
          />
        </h2>
        <section>
          <fieldset>
            <FormattedMessage id="profile.field.basic" tagName="legend" />
            <input type="email" value={this.state.user.email} disabled />
          </fieldset>

          {this.state.user.address && (
            <fieldset>
              <legend>Address</legend>
              <address>
                {this.state.user.address.street}<br />
                {this.state.user.address.suite}<br />
                {this.state.user.address.city}<br />
                {this.state.user.address.zipcode}<br />
              </address>
            </fieldset>
          )}
        </section>

        <section>
          {this.state.posts
            .map(
              post => (
                <Post key={post.id} user={this.state.user} {...post} />
              ),
            )
          }
        </section>
      </section>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};


export default Profile;
