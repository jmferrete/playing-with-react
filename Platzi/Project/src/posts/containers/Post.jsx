import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage } from 'react-intl';

import api from '../../api';
import styles from './Post.css';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: props.user || null,
      comments: props.comments || [],
    };
  }


  componentDidMount() {
    this.initialFetch();
  }

  async initialFetch() {
    if (!!this.state.user && !!this.state.comments) return this.setState({ loading: false });

    const [
      user,
      comments,
    ] = await Promise.all([
      !this.state.user ? api.users.getSingle(this.props.userId) : Promise.resolve(null),
      !this.state.user ? api.posts.getComments(this.props.id) : Promise.resolve(null),
    ]);

    return this.setState({
      loading: false,
      user: user || this.state.user,
      comments: comments || this.state.comments,
    });
  }

  render() {
    return (
      <article id={`post-${this.props.id}`} className={styles.post}>
        <h2 className={styles.title}>
          <Link to={`/post/${this.props.id}`}>
            {this.props.title}
          </Link>
        </h2>
        <p className={styles.body}>
          {this.props.body}
        </p>
        {!this.state.loading && (
        <div className={styles.meta}>
          <Link to={`/user/${this.state.user.id}`} className={styles.user}>
            {this.state.user.name}
          </Link>
          &nbsp;
          <span className={styles.comments}>
            <FormattedHTMLMessage
              id="post.meta.comments"
              values={{
                amount: this.state.comments.length,
              }}
            />
          </span>
        </div>
      )}
      </article>
    );
  }

}

Post.propTypes = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })),
};

Post.defaultProps = {
  user: null,
  comments: [],
};

export default Post;
