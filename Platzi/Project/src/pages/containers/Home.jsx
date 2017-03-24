import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Post from '../../posts/containers/Post';
import Loading from '../../shared/components/Loading';
import styles from './Page.css';

import api from '../../api';

import actions from '../../actions';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: props.posts,
      page: props.page,
      loading: true,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.initialFetch();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async initialFetch() {
    const posts = await api.posts.getList(this.props.page);

    this.props.dispatch(
      actions.setPost(posts),
    );

    this.setState({
      loading: false,
    });

    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (this.state.loading) return null;
    const MIN_SCROLL_POINT_TO_LOAD_POSTS = 300;

    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.body.clientHeight;

    if (!(scrolled + viewportHeight + MIN_SCROLL_POINT_TO_LOAD_POSTS >= fullHeight)) {
      return null;
    }

    this.setState({ loading: true }, async () => {
      try {
        const posts = await api.posts.getList(this.props.page);

        this.props.dispatch(
          actions.setPost(posts),
        );

        this.setState({ loading: false });
      } catch (error) {
        console.error(error);
        this.setState({ loading: false });
      }
    });

    return null;
  }

  render() {
    return (
      <section name="Home" className={styles.section}>
        <h2>
          <FormattedMessage id="title.home" />
        </h2>
        <section className={styles.list}>
          {this.state.loading && (
            <Loading />
          )}
          {this.props.posts
            .map(post => <Post key={post.id} {...post} />)
          }
        </section>

        <Link to="/about">
          Go to about
        </Link>
      </section>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object),
  page: PropTypes.number,
};

Home.getDefaultProps = {
  posts: [],
  page: 1,
};

function mapStateToProps(state) {
  return {
    posts: state.posts.entities,
    page: state.posts.page,
  };
}

/*
function mapDispatchToProps(dispatch, props) {
  return {
    dispatch,
  };
}
*/

export default connect(mapStateToProps)(Home);
