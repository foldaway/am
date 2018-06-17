import React from 'react';
import { BarLoader } from 'react-spinners';

import styles from './styles.scss';
import styleVars from '../../stylesheets/variables.scss';

const Loader = () => (
  <div className={styles.container}>
    <BarLoader color={styleVars.red} />
  </div>
);

export default Loader;
