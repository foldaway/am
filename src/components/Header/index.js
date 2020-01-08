import React from 'react';

import styles from './styles.scss';

const Header = () => (
  <div className={styles.container}>
    <span>AM</span>
    <span>{process.env.COMMIT_REF || 'dev'}</span>
  </div>
);

export default Header;
