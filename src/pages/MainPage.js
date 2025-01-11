import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';
import { getDayName } from "../components/ReservationModal";

const MainPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 호출
  const fetchReservations = async () => {
    try {
      const response = await fetch('https://diy.knucse.site/api/v1/application/reservation/closest');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 로드 시 API 호출
  useEffect(() => {
    fetchReservations();
  }, []);

  // 시간 포맷팅
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  return (
    <div className={styles.maincontainer}>
      {/* 메인 */}
      <div className={styles.maintext}>
        <h1 className={styles.maintitle}>KNU CSE DIY Reservation Services</h1>
        <p className={styles.mainsubtitle}>KNU CSE DIY실 예약 서비스</p>
        <Link to="/month">
          <button className={styles.mainbutton}>지금 예약하기</button>
        </Link>
      </div>

      {/* 실시간 예약 현황 */}
      <div className={styles.mainstatus}>
        <div className={styles.statustitlewrapper}>
          <div className={styles.statustitle}>실시간 예약 현황</div>
          <div className={styles.statusline}></div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : reservations.length > 0 ? (
          <div className={styles.statusbox}>
            {reservations.map((reservation, index) => (
              <div key={index} className={styles.status}>
                <h3>{reservation.reservationDate} {getDayName(reservation.reservationDate)}</h3>
                <p>
                  {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                </p>
                <div className={styles.statusinfoline}></div>
                <p>{reservation.studentName}</p>
                <p>{reservation.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>현재 예약이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
