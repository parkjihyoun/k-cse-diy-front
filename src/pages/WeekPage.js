import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/WeekPage.module.css";
import ReservationModal from "../components/ReservationModal";

const WeekPage = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [reservations, setReservations] = useState([
    {
      reservationNum: 1,
      date: "2024-11-28",
      day: "THU",
      time: "12:00 ~ 13:30",
      title: "산사랑 연극 연습",
      status: "승인",
      authCode: "1234",
      name: "박지현",
      studentId: "2023000001",
    },
    {
      reservationNum: 2,
      date: "2024-11-28",
      day: "THU",
      time: "16:30 ~ 17:30",
      title: "동아리 회의",
      status: "승인",
      authCode: "5678",
      name: "홍길동",
      studentId: "2023000002",
    },
    {
      reservationNum: 3,
      date: "2024-11-29",
      day: "FRI",
      time: "10:00 ~ 11:30",
      title: "스터디 모임",
      status: "승인",
      authCode: "9012",
      name: "이영희",
      studentId: "2023000003",
    },
    {
      reservationNum: 4,
      date: "2024-11-29",
      day: "FRI",
      time: "15:00 ~ 17:00",
      title: "캡스톤 프로젝트 회의",
      status: "승인",
      authCode: "3456",
      name: "최민수",
      studentId: "2023000004",
    },
    {
      reservationNum: 5,
      date: "2024-11-30",
      day: "SAT",
      time: "09:00 ~ 10:00",
      title: "헬스클럽 트레이닝",
      status: "승인",
      authCode: "7890",
      name: "김수영",
      studentId: "2023000005",
    },
    {
      reservationNum: 6,
      date: "2024-11-30",
      day: "SAT",
      time: "11:30 ~ 14:00",
      title: "보컬 트레이닝",
      status: "승인",
      authCode: "6543",
      name: "오하늘",
      studentId: "2023000006",
    },
    {
      reservationNum: 7,
      date: "2024-11-24",
      day: "SUN",
      time: "18:00 ~ 20:30",
      title: "영화 감상회",
      status: "승인",
      authCode: "4321",
      name: "이지은",
      studentId: "2023000007",
    },
  ]);

  const handleOpenModal = () => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요!");
      return;
    }
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleSaveReservation = (data) => {
    setReservations((prev) => [
      ...prev,
      { ...data, date: selectedDate, id: prev.length + 1, status: "pending" },
    ]);
    alert("예약이 저장되었습니다!");
  };

  const handleViewChange = (view) => {
    if (view === "Month") {
      navigate("/month");
    } else {
      setSelectedView(view);
    }
  };

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day; // Start from Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    new Date(startOfWeek).setDate(startOfWeek.getDate() + i)
  );

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const convertTimeToPosition = (time) => {
    const [start, end] = time.split(" ~ ");
    const [startHour, startMinute] = start.split(":").map((t) => parseInt(t, 10));
    const [endHour, endMinute] = end.split(":").map((t) => parseInt(t, 10));
  
    // Offset start time relative to 9:00 AM
    const top = ((startHour - 9) * 50) + (startMinute / 60) * 50;
  
    // Calculate duration in minutes and convert to height
    const durationInMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    const height = (durationInMinutes / 60) * 50;
  
    console.log(`Time: ${time}, Top: ${top}px, Height: ${height}px`);
    return { top, height };
  };

  const renderGrid = () => {
    const hours = Array.from({ length: 24 }, (_, i) => (9 + i) % 24);
    
    return hours.map((hour) => (
      <div key={hour} className={styles.hourRow}>
        <span className={styles.hourLabel}>
          {hour < 10 ? `0${hour}:00` : `${hour}:00`}
        </span>
      </div>
    ));
  };
  

  const renderWeekColumns = () => {
    return weekDates.map((day, index) => {
      const dateString = new Date(day).toISOString().split("T")[0];
      const dayReservations = reservations.filter(
        (r) => r.date === dateString
      );

      // 선택된 날짜와 비교
      const isSelected =
        selectedDate &&
        new Date(selectedDate).toISOString().split("T")[0] === dateString;


      return (
        <div
          key={index}
          className={`${styles.dayColumn} ${isSelected ? styles.selected : ""}`}
          onClick={() => setSelectedDate(day)} // Click handler
        >
          <div className={styles.dayGrid} >
            {dayReservations.map((res) => {
              const { top, height } = convertTimeToPosition(res.time);
              return (
                <div
                  key={res.reservationNum}
                  className={styles.reservationItem}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <span className={styles.reservationTitle}>{res.title}</span>
                  <span className={styles.reservationDetails}>
                    {res.time}
                  </span>
                  <span className={styles.reservationDetails}>
                    {res.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.page}>
      {/* 상단 버튼 */}
      <div className={styles.rightControls}>
        <button className={styles.reserveButton} onClick={handleOpenModal}>
          예약하기
        </button>
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton}>{selectedView}</button>
          <ul className={styles.dropdownMenu}>
            <li onClick={() => handleViewChange("Month")}>Month</li>
            <li onClick={() => handleViewChange("Week")}>Week</li>
          </ul>
        </div>
      </div>


      <div className={styles.header}>
        <span className={styles.navText}>
          {currentDate.getFullYear()} {currentDate.getMonth() + 1}
          </span>
      </div>

      {/* 날짜 */}
      <div className={styles.weekDaysContainer}>
        <button
          onClick={() => handleDateChange(-1)}
          className={styles.navButton}
        >
          ◀
        </button>

        <div className={styles.weekDaysHeader}>
          {weekDates.map((day, index) => (
            <div key={index} className={styles.dateHeader}>
              <div>
                {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div>
                {new Date(day).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleDateChange(1)}
          className={styles.navButton}
        >
          ▶
        </button>
      </div>
      <div className={styles.weekGrid}>
        <div className={styles.timeColumn}>{renderGrid()}</div>
        {renderWeekColumns()}
      </div>

      {isModalOpen && (
        <ReservationModal
          selectedDate={selectedDate}
          onClose={handleCloseModal}
          handleSave={handleSaveReservation}
        />
      )}
    </div>
  );
};

export default WeekPage;