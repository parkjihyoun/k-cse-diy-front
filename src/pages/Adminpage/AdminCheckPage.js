
import React, { useEffect, useState } from "react";

import styles from "../../styles/AdminCheckPage.module.css";
import { format } from "date-fns";

const initialRequests = [
  { id: 1, name: "최예윤", studentId: "202400003", date: "2025-02-10", time: "14:00 - 16:00", reason: "동아리 회의를 할거야 동아리 회의를 할거야", status: "CANCELLED" },
  { id: 2, name: "박지현", studentId: "202400001", date: "2025-02-13", time: "14:00 - 16:00", reason: "놀기", status: "PENDING" },
  { id: 3, name: "최원아", studentId: "202400002", date: "2025-02-07", time: "14:00 - 16:00", reason: "먹기", status: "PENDING" },
  { id: 4, name: "호예찬", studentId: "202400004", date: "2025-02-20", time: "14:00 - 16:00", reason: "공부하기", status: "APPROVED" },
  { id: 5, name: "박지현", studentId: "202400001", date: "2025-02-02", time: "14:00 - 16:00", reason: "자기", status: "APPROVED" },
  { id: 6, name: "호예찬", studentId: "202400004", date: "2025-02-22", time: "14:00 - 16:00", reason: "그냥", status: "PENDING" },
];

const AdminCheckPage = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [searchCategory, setSearchCategory] = useState("name");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortFilter, setSortFilter] = useState("최신순");
  const [checkedItems, setCheckedItems] = useState([]);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);

  // 상태 값을 한글로 변환
  const translateStatus = (status) => {
    if (status === "APPROVED") return "승인";
    if (status === "PENDING") return "대기";
    if (status === "CANCELLED") return "거절";
    return status;
  };

  //날짜 포맷팅
  const formatTime = (startTime, endTime) => {
    return startTime + " - " + endTime
  }

  // 검색 필터링 적용
  useEffect(() => {
    let filteredData = [...allRequests];

    if (search.trim() !== "") {
      if (searchCategory === "name") {
        filteredData = filteredData.filter(req =>
          req.studentName?.toLowerCase().includes(search.toLowerCase())
        );
      } else if (searchCategory === "status") {
        filteredData = filteredData.filter(req =>
          translateStatus(req.status).toLowerCase().includes(search.toLowerCase())
        );
      } else if (searchCategory === "studentId") {
        filteredData = filteredData.filter(req =>
          req.studentNumber.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    setFilteredRequests(filteredData);
  }, [search, searchCategory, allRequests]);

  useEffect(() => {
    setCheckedItems([]);

    let sortedData = [...allRequests];  // ✅ allRequests 사용

    switch (sortFilter) {
      case "최신순":
        sortedData.sort((a, b) => new Date(b.reservationDate ?? 0) - new Date(a.reservationDate ?? 0));
        break;
      case "대기":
        sortedData = sortedData.filter(item => item.status === "PENDING");
        break;
      case "승인":
        sortedData = sortedData.filter(item => item.status === "APPROVED");
        break;
      case "거절":
        sortedData = sortedData.filter(item => item.status === "CANCELLED");
        break;
      default:
        break;
    }

    setFilteredRequests(sortedData);  // 상태 업데이트 시 의존성 루프 제거
  }, [sortFilter, allRequests]);  // ✅ filteredRequests 제거, allRequests와 sortFilter만 의존



  // 체크박스
  const handleCheck = (id) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 전체 체크
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(filteredRequests.map(item => item.id));
    } else {
      setCheckedItems(prev => prev.filter(id => !filteredRequests.some(item => item.id === id)));
    }
  };

  const isAllChecked =
    filteredRequests.length > 0 &&
    filteredRequests.every(item => checkedItems.includes(item.id));

  // 승인 버튼
  const handleApprove = async () => {
    const token = localStorage.getItem("token");
    console.log(checkedItems);
    const hasPending = allRequests.some(
      item => checkedItems.includes(item.id) && item.status === "PENDING"
    );

    if (!hasPending) {
      alert("대기 상태인 항목을 선택하세요.");
      return;
    }

    try {
      await fetch("https://diy.knucse.site/api/v1/admin/reservation/treatment-list", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(checkedItems) // JSON 형식으로 변환
      });

    } catch (error) {
      alert(`예약 승인중 오류가 발생했습니다: ${error.message}`);
    }

    setFilteredRequests(prev =>
      prev.map(item =>
        checkedItems.includes(item.id) && item.status === "PENDING"
          ? { ...item, status: "APPROVED" }
          : item
      )
    );
    setCheckedItems([]);
    alert("승인 완료!");
  };

  // 거절 버튼 (거절 모달 띄우기)
  const handleReject = () => {
    const hasPending = allRequests.some(
      item => checkedItems.includes(item.id) && item.status === "PENDING"
    );

    if (!hasPending) {
      alert("대기 상태인 항목을 선택하세요.");
      return;
    }

    setRejectModal(true);
  };

  // 거절 모달 확인
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert("거절 사유를 입력하세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch("https://diy.knucse.site/api/v1/admin/reservation/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          reservationIds: checkedItems,
          cancelledReason: rejectReason
        })
      });

      setAllRequests(prev =>
        prev.map(item =>
          checkedItems.includes(item.id) && item.status === "PENDING"
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );

      setRejectModal(false);
      setRejectReason("");
      setCheckedItems([]);
      alert(`거절 완료! (거절 사유: ${rejectReason})`);
    } catch (error) {
      alert(`예약 거절 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  /*
   조회 로직
  */
  const handleSearch2 = async () => {
    if (dateRange.from === "" || dateRange.to === "") {
      alert("조회 기간을 먼저 설정해주세요.");
      return;
    }

    try {
      setCheckedItems([]);
      const response = await fetch(
        `https://diy.knucse.site/api/v1/application/reservation/range?startDate=${dateRange.from}&endDate=${dateRange.to}`
      );

      if (!response.ok) {
        throw new Error("예약 정보를 가져오는데 실패했습니다.");
      }

      const result = await response.json();

      if (result.response && Array.isArray(result.response)) {
        setAllRequests(result.response); // API 데이터 업데이트
      } else {
        setAllRequests([]); // 데이터 없음 처리
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className={styles.page}>

      {/* 승인/거절 버튼 섹션 */}
      <div className={styles.buttonSection}>
        <button className={styles.approveBtn} onClick={handleApprove}>승인</button>
        <button className={styles.rejectBtn} onClick={handleReject}>거절</button>
      </div>

      {/* 검색 및 정렬 섹션 */}
      <div className={styles.searchSection}>

        {/* 검색 조건 */}
        <select
          className={styles.searchSelect}
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="name">이름</option>
          <option value="studentId">학번</option>
          <option value="status">상태</option>
        </select>

        {/* 검색창 */}
        <input
          className={styles.searchBox}
          type="text"
          placeholder={
            searchCategory === "all"
              ? "검색 조건을 선택하여 검색할 수 있습니다."
              : "검색어를 입력하세요"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={searchCategory === "all"}  //  전체 모드일 때 비활성화
        />


        {/* 날짜 선택 */}
        <div className={styles.dateRange}>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <span>~</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>

        <button className={styles.searchButton} onClick={handleSearch2}>
          조회
        </button>

        {/* 정렬 조건 */}
        <select
          className={styles.dropdown}
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
        >
          <option value="최신순">최신 순</option>
          <option value="대기">대기 상태</option>
          <option value="승인">승인 상태</option>
          <option value="거절">거절 상태</option>
        </select>
      </div>

      {/* 테이블 섹션 */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div>
            <input
              type="checkbox"
              className={styles.customCheckbox}
              checked={isAllChecked}
              onChange={handleCheckAll}
            />
          </div>
          <div>이름</div>
          <div>학번</div>
          <div>대여 날짜</div>
          <div>대여 시간</div>
          <div>사유</div>
          <div>대여 상태</div>
        </div>

        <div className={styles.gridItems}>
          {filteredRequests.map(item => (
            <div
              key={item.id}
              className={styles.row}
              onClick={() => handleCheck(item.id)}
            >
              <div className={styles.cell}>
                <input
                  type="checkbox"
                  className={styles.customCheckbox}
                  checked={checkedItems.includes(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleCheck(item.id)}
                />
              </div>
              <div className={styles.cell}>{item.studentName}</div>
              <div className={styles.cell}>{item.studentNumber}</div>
              <div className={styles.cell}>{item.reservationDate}</div>
              <div className={styles.cell}>{formatTime(item.startTime, item.endTime)}</div>
              <div className={styles.cell}>{item.reason}</div>
              <div className={styles.cell}>{translateStatus(item.status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 거절 사유 입력 모달 */}
      {rejectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalLabel}>거절 사유</div>
            <div className={styles.modalContent}>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="거절 사유를 입력하세요."
                className={styles.modalInput}
              />
              <button className={styles.closeButton} onClick={confirmReject}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCheckPage;