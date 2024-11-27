import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';

const MainPage = () => {
  return (
    <div className={styles.maincontainer}>
      <div className={styles.maintext}>
        <h1 className={styles.maintitle}>KNU CSE DIY Reservation Services</h1>
        <p className={styles.mainsubtitle}>KNU CSE DIY실 예약 서비스</p>
        <Link to="/month">
          <button className={styles.mainbutton}>지금 예약하기</button>
        </Link>
      </div>

      <div className={styles.mainstatus}>
        <div className={styles.statustitlewrapper}>
          <div className={styles.statustitle}>실시간 예약 현황</div>
          <div className={styles.statusline}></div>
        </div>
        <div className={styles.statusbox}>
          <div className={styles.status}>
            <h3>2024.11.14 THU</h3>
            <p>12:00 - 14:00</p>
            <div className={styles.statusinfoline}></div>
            <p>호예찬</p>
            <p>산사랑 연극 연습</p>
          </div>
          <div className={styles.status}>
            <h3>2024.11.16 SAT</h3>
            <p>17:00 - 20:00</p>
            <div className={styles.statusinfoline}></div>
            <p>최원아</p>
            <p>할거있음</p>
          </div>
          <div className={styles.status}>
            <h3>2024.11.18 MON</h3>
            <p>09:00 - 11:30</p>
            <div className={styles.statusinfoline}></div>
            <p>최예윤</p>
            <p>교수님 면담</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;