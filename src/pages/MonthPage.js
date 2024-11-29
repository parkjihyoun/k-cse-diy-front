import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MonthPage.module.css";

const MonthPage = () => {
  const [month, setMonth] = useState(10); // November (0-indexed)
  const [year, setYear] = useState(2024);
  const [selectedView, setSelectedView] = useState("Month"); // Default view
  const [selectedDate, setSelectedDate] = useState(null); // Tracks selected date
  const navigate = useNavigate(); // For navigation to other pages

  const [reservations, setReservations] = useState([
    { id: 1, date: "2024-11-13", status: "complete" },
    { id: 2, date: "2024-11-13", status: "pending" },
    { id: 3, date: "2024-11-14", status: "complete" },
    { id: 4, date: "2024-11-18", status: "pending" },
    { id: 5, date: "2024-11-18", status: "complete" },
    { id: 6, date: "2024-11-23", status: "complete" },
    { id: 7, date: "2024-11-26", status: "complete" },
  ]);

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
      setSelectedView(view); // Keep current view (Month)
    }
  };

  const renderDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 1일의 요일
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

          weekRow.push(
            <td
              key={`day-${currentDay}`}
              className={`${styles.dayCell} ${isSelected ? styles.selected : ""}`}
              onClick={() => setSelectedDate(dateStr)} // Change color on click
            >
              <div className={styles.dateNumber}>{currentDay}</div>
              <div className={styles.dotsContainer}>
                {reservations
                  .filter((r) => r.date === dateStr)
                  .slice(0, 2) // 최대 2개만 표시
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
        <button className={styles.reserveButton}>예약하기</button>
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton}>{selectedView}</button>
          <ul className={styles.dropdownMenu}>
            <li onClick={() => handleViewChange("Month")}>Month</li>
            <li onClick={() => handleViewChange("Week")}>Week</li>
          </ul>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button onClick={() => handleMonthChange("prev")} className={styles.navButton}>
            &lt;
          </button>
          <span className={styles.navText}>
            {year} {String(month + 1).padStart(2, "0")}
          </span>
          <button onClick={() => handleMonthChange("next")} className={styles.navButton}>
            &gt;
          </button>
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
    </div>
  );
};

export default MonthPage;