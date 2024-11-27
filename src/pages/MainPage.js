import React from 'react';
import '../styles/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <div className= "main-text">
        <h1 className="main-title">KNU CSE DIY Reservation Services</h1>
        <p className="main-subtitle">KNU CSE DIY실 예약 서비스</p>
        <button className="main-button">지금 예약하기</button>
      </div>

      <div className="main-status">
        <div className="status-title-wrapper">
          <div className="status-title">실시간 예약 현황</div>
          <div className="status-line"></div>
        </div>
        <div className="status-box">
          <div className="status">
            <h3>2024.11.14 THU</h3>
            <p>12:00 - 14:00</p>
            <div className="status-info-line"></div>
            <p>호예찬</p>
            <p>산사랑 연극 연습</p>
          </div>
          <div className="status">
            <h3>2024.11.16 SAT</h3>
            <p>17:00 - 20:00</p>
            <div className="status-info-line"></div>
            <p>최원아</p>
            <p>할거있음</p>
          </div>
          <div className="status">
            <h3>2024.11.18 MON</h3>
            <p>09:00 - 11:30</p>
            <div className="status-info-line"></div>
            <p>최예윤</p>
            <p>교수님 면담</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;