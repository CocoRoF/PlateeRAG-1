import React from 'react';
import styles from '@/app/model/assets/Store.module.scss';
import HubPage from './hub/HubPage';

const StoreLayout: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentArea}>
          <HubPage></HubPage>
        </div>
      </div>
    </>
  );
};

export default StoreLayout;