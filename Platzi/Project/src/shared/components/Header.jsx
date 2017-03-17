import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.css';

function Header() {
    return (
        <header className={styles.header}>
            <h1>
                Mi primera app con React
            </h1>

            <nav role="navigation">
                <Link to="/">
                    Home
                </Link>
                <a href="https://github.com/jmferrete" target="_blank">@jmferrete</a>
            </nav>
        </header>
    )
}

export default Header;