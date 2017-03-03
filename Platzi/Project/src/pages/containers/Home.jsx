import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Post from '../../posts/containers/Post.jsx';

import api from '../../api.js';


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: {},
            page: 1,
            loading: true,
        }
    }

    async componentDidMount() {
        const post = await api.posts.getList(this.state.page);

        this.setState({
            posts,
            page: this.stage.page + 1,
            loading: false,
        })
    }

    render() {
        return (
            <section name="Home">
                <h1>Home</h1>

                <section>
                    {this.stage.loading && (
                        <h2>Loading posts...</h2>
                    )}
                    {this.stage.posts
                        .map(post => <Post key={post.id} {...post} />)
                    }
                </section>

                <Link to='/about'>
                    Go to about
                </Link>
            </section>
        )
    }
}


export default Home;