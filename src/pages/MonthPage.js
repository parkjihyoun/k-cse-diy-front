import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MonthPage.module.css";
import ReservationModal from "../components/ReservationModal";

const MonthPage = () => {
  const [month, setMonth] = useState(10); // November (0-indexed)
  const [year, setYear] = useState(2024);
  const [selectedView, setSelectedView] = useState("Month ▼");
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [reservations, setReservations] = useState([
    { id: 1, date: "2024-11-13", status: "complete" },
    { id: 2, date: "2024-11-13", status: "pending" },
    { id: 3, date: "2024-11-14", status: "complete" },
    { id: 4, date: "2024-11-18", status: "pending" },
    { id: 5, date: "2024-11-18", status: "complete" },
    { id: 6, date: "2024-11-23", status: "complete" },
    { id: 7, date: "2024-11-26", status: "complete" },
  ]);

  const navigate = useNavigate();

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    } else if (direction === "next") {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };

  const handleViewChange = (view) => {
    if (view === "Week") {
      navigate("/week");
    } else {
      setSelectedView(view);
    }
  };

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

  const renderDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendar = [];
    let currentDay = 1;

    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else if (currentDay > daysInMonth) {
          weekRow.push(<td key={`empty-${week}-${day}`} className={styles.empty}></td>);
        } else {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const hasReservation = reservations.some((r) => r.date === dateStr);

          weekRow.push(
            <td
              key={`day-${currentDay}`}
              className={`${styles.dayCell} ${isSelected ? styles.selected : ""}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <div className={styles.dateNumber}>{currentDay}</div>
              <div className={styles.dotsContainer}>
                {reservations
                  .filter((r) => r.date === dateStr)
                  .slice(0, 2)
                  .map((r, index) => (
                    <div
                      key={`status-${r.id}`}
                      className={r.status === "complete" ? styles.completeDot : styles.pendingDot}
                    ></div>
                  ))}
                {reservations.filter((r) => r.date === dateStr).length > 2 && (
                  <span className={styles.extraDots}>
                    +{reservations.filter((r) => r.date === dateStr).length - 2}
                  </span>
                )}
              </div>
            </td>
          );
          currentDay++;
        }
      }
      calendar.push(<tr key={`week-${week}`}>{weekRow}</tr>);
    }
    return calendar;
  };

  return (
    <div className={styles.page}>
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
        <div className={styles.headerRow}>
          <div className={styles.navigation}>
            <button onClick={() => handleMonthChange("prev")} className={styles.navButton}>
              ◀
            </button>
            <span className={styles.navText}>
              {year} {String(month + 1).padStart(2, "0")}
            </span>
            <button onClick={() => handleMonthChange("next")} className={styles.navButton}>
              ▶
            </button>
          </div>
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
      </div>
      <div className={styles.calendar}>
        <table>
          <thead>
            <tr>
              <th>SUN</th>
              <th>MON</th>
              <th>TUE</th>
              <th>WED</th>
              <th>THU</th>
              <th>FRI</th>
              <th>SAT</th>
            </tr>
          </thead>
          <tbody>{renderDays()}</tbody>
        </table>
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

export default MonthPage;