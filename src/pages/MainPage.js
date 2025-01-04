import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/MainPage.module.css';

const MainPage = () => {
  const [reservations, setReservations] = useState([]); // 예약 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // API 호출 함수
  const fetchReservations = async () => {
    try {
      const response = await fetch('https://diy.knucse.site/api/v1/application/reservation/closest'); // API 엔드포인트 호출
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data); // 데이터를 상태에 저장
    } catch (err) {
      setError(err.message); // 에러 메시지 저장
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchReservations(); // 컴포넌트 로드 시 API 호출
  }, []);

  // 시간 포맷팅 함수 (초 제거)
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // "HH:MM:SS"에서 "HH:MM"만 반환
  };

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

        {loading ? (
          <p>Loading...</p> // 로딩 중 표시
        ) : error ? (
          <p>Error: {error}</p> // 에러 발생 시 표시
        ) : reservations.length > 0 ? (
          <div className={styles.statusbox}>
            {reservations.map((reservation, index) => (
              <div key={index} className={styles.status}>
                <h3>{reservation.reservationDate}</h3>
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
          <p>현재 예약이 없습니다.</p> // 예약이 없을 경우 표시
        )}
      </div>
    </div>
  );
};

export default MainPage;
