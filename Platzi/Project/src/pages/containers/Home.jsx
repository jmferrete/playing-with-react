import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Post from '../../posts/containers/Post';
import Loading from '../../shared/components/Loading';
import styles from './Page.css';

import api from '../../api';


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      page: 1,
      loading: true,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  async componentDidMount() {
    const posts = await api.posts.getList(this.state.page);

    this.setState({
      posts,
      page: this.state.page + 1,
      loading: false,
    })

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
        const posts = await api.posts.getList(this.state.page);

        this.setState({
          posts: this.state.posts.concat(posts),
          page: this.state.page + 1,
          loading: false,
        });
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
        <section className={styles.list}>
          {this.state.loading && (
            <Loading />
          )}
          {this.state.posts
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


export default Home;
