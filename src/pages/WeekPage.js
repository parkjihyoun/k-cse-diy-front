import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/WeekPage.module.css";
import ReservationModal from "../components/ReservationModal";
import { getDayName } from "../components/ReservationModal";

const WeekPage = () => {
  const navigate = useNavigate();

  const getWeekDates = (date, isMobile) => {
    if (isMobile) {
      // 모바일: 오늘 날짜 중심으로 3일 계산
      const todayIndex = 1; // 가운데에 오늘 날짜
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - todayIndex);
  
      return Array.from({ length: 3 }, (_, i) => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        return newDate;
      });
    } else {
      // 큰 화면: 일주일 계산
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // 주 시작일: 일요일
      return Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(startOfWeek);
        newDate.setDate(startOfWeek.getDate() + i);
        return newDate;
      });
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
  const [selectedReservation, setSelectedReservation] = useState(null); // 선택한 예약 정보
  const [reservations, setReservations] = useState([
    {
      reservationNum: 1,
      date: "2024-12-05",
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
      date: "2024-12-05",
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
      date: "2024-12-06",
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
      date: "2024-12-06",
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

  const [centeredWeekDates, setCenteredWeekDates] = useState(
    getWeekDates(currentDate, isMobileView)
  );
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600;
      setIsMobileView(isMobile);
      setCenteredWeekDates(getWeekDates(currentDate, isMobile));
    };
  
    handleResize(); // 초기 로드 시 실행
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 추가
    return () => window.removeEventListener("resize", handleResize); // 리스너 정리
  }, [currentDate]);




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
      {
        id: prev.length + 1,
        date: selectedDate,
        day: getDayName(selectedDate), // 요일
        time: `${data.startTime} ~ ${data.endTime}`, // 시간 범위
        title: data.reason, // 예약 사유
        status: "pending",
        authCode: data.password, // 인증번호
        name: data.name, // 예약자 이름
        studentId: data.studentId, // 학번
      },
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
  const weekDates = Array.from({ length: isMobileView ? 3 : 7 }, (_, i) =>
    new Date(startOfWeek).setDate(startOfWeek.getDate() + i)
  );

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    const daysToMove = isMobileView ? 3 : 7; // 모바일: 3일, 큰 화면: 7일
    newDate.setDate(newDate.getDate() + direction * daysToMove);
    setCurrentDate(newDate);
    setCenteredWeekDates(getWeekDates(newDate, isMobileView));
  };
  

  const convertTimeToPosition = (time) => {
    const rowHeight = isMobileView ? 40 : 50; // 반응형 여부에 따라 높이 결정
    const startHour = 9; // 시작 시간 기준 (9:00 AM)
  
    const [start, end] = time.split(" ~ ");
    const [startHourNum, startMinute] = start.split(":").map(Number);
    const [endHourNum, endMinute] = end.split(":").map(Number);
  
    // 시작 시간 위치 계산
    const top =
      (startHourNum - startHour) * rowHeight +
      (startMinute / 60) * rowHeight + 15;
  
    // 지속 시간 계산
    const durationInMinutes =
      (endHourNum - startHourNum) * 60 + (endMinute - startMinute);
    const height = (durationInMinutes / 60) * rowHeight;
  
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
    const todayStr = new Date().toISOString().split("T")[0];
  
    return centeredWeekDates.map((day, index) => {
      const dateString = day.toISOString().split("T")[0];
      const dayReservations = reservations.filter((r) => r.date === dateString);
  
      const isSelected =
        selectedDate &&
        new Date(selectedDate).toISOString().split("T")[0] === dateString;
  
      const isToday = todayStr === dateString;
  
      return (
        <div
          key={index}
          className={`${styles.dayColumn} ${isSelected ? styles.selected : ""} ${
            isToday ? styles.today : ""
          }`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className={styles.dayGrid}>
            {dayReservations.map((res) => {
              const { top, height } = convertTimeToPosition(res.time);
              return (
                <div
                  key={res.reservationNum}
                  className={styles.reservationItem}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onClick={() => handleOpenPopup(res)} // 클릭 핸들러 추가
                >
                  <span className={styles.reservationName}>{res.name}</span>
                  <span className={styles.reservationTitle}>{res.title}</span>
                  <span className={styles.reservationTime}>{res.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const handleOpenPopup = (reservation) => {
    setSelectedReservation(reservation);
    setIsPopupOpen(true);
  };
  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedReservation(null);
  };

  const Popup = ({ reservation, onClose }) => {
    if (!reservation) return null;
  
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <div className={styles.popupLabel}>예약 정보</div>
          <p>
            <div className={styles.popupName}>예약자 {reservation.name}</div>
          </p>
          <p>
            <div className={styles.popupTitle}>예약 사유 {reservation.title}</div>
          </p>
          <p>
            <div className={styles.popupTime}>예약 시간 {reservation.time}</div>
          </p>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    );
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


      {/*년월 + status*/}
      <div className={styles.header}>
        <span className={styles.navText}>
          {currentDate.getFullYear()} . {currentDate.getMonth() + 1}
        </span>

        <div className={styles.statusLegend}>
          <div className={styles.statusItem}>
            <div className={styles.completeDot}></div>
            <span>예약 완료</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.pendingDot}></div>
            <span>예약 대기</span>
          </div>
        </div>
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
          {centeredWeekDates.map((day, index) => (
            <div key={index} className={styles.dateHeader}>
              <div>
                {day.toLocaleDateString("en-US", { day: "numeric", weekday: "short" })}
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

      {isPopupOpen && (
        <Popup reservation={selectedReservation} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default WeekPage;