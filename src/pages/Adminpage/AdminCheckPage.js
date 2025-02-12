import React, { useState } from "react";
import Select from 'react-select';
import styles from "../../styles/AdminCheckPage.module.css";

const initialRequests = [
  { id: 1, name: "최예윤", studentId: "202400003", date: "2025-02-10", time: "14:00 - 16:00", reason: "동아리 회의를 할거야 동아리 회의를 할거야", status: "CANCELLED" },
  { id: 2, name: "박지현", studentId: "202400001", date: "2025-02-13", time: "14:00 - 16:00", reason: "놀기", status: "PENDING" },
  { id: 3, name: "최원아", studentId: "202400002", date: "2025-02-07", time: "14:00 - 16:00", reason: "먹기", status: "PENDING" },
  { id: 4, name: "호예찬", studentId: "202400004", date: "2025-02-20", time: "14:00 - 16:00", reason: "공부하기", status: "APPROVED" },
  { id: 5, name: "박지현", studentId: "202400001", date: "2025-02-02", time: "14:00 - 16:00", reason: "자기", status: "APPROVED" },
  { id: 6, name: "호예찬", studentId: "202400004", date: "2025-02-22", time: "14:00 - 16:00", reason: "그냥", status: "PENDING" },
];

const AdminCheckPage = () => {
  const [allRequests, setAllRequests] = useState([...initialRequests]);
  const [searchCategory, setSearchCategory] = useState("name");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortFilter, setSortFilter] = useState("이름순");
  const [checkedItems, setCheckedItems] = useState([]);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // 상태 값을 한글로 변환
  const translateStatus = (status) => {
    if (status === "APPROVED") return "승인";
    if (status === "PENDING") return "대기";
    if (status === "CANCELLED") return "거절";
    return status;
  };

  // 정렬 조건에 따른 데이터 반환
  const getSortedRequests = () => {
    let sortedData = [...allRequests];
    switch (sortFilter) {
      case "이름순":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "학번순":
        sortedData.sort((a, b) => a.studentId.localeCompare(b.studentId));
        break;
      case "날짜순":
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
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
    return sortedData;
  };

  // 검색 조건 및 날짜 범위까지 적용한 최종 데이터
  const filteredRequests = getSortedRequests().filter(req => {
    // 날짜 필터 적용
    const reqDate = new Date(req.date);
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      if (reqDate < fromDate) return false;
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      if (reqDate > toDate) return false;
    }

    // 검색어 필터 적용 (예: 이름, 학번, 상태)
    if (searchCategory === "status") {
      return translateStatus(req.status)
        .toLowerCase()
        .includes(search.toLowerCase());
    }
    return req[searchCategory].toLowerCase().includes(search.toLowerCase());
  });

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
  const handleApprove = () => {
    const hasPending = allRequests.some(
      item => checkedItems.includes(item.id) && item.status === "PENDING"
    );
    
    if (!hasPending) {
      alert("대기 상태인 항목을 선택하세요.");
      return;
    }
  
    setAllRequests(prev =>
      prev.map(item =>
        checkedItems.includes(item.id) && item.status === "PENDING"
          ? { ...item, status: "APPROVED" }
          : item
      )
    );
    setCheckedItems([]);
    alert("승인 완료!");
  };

  // 거절 버튼
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
  const confirmReject = () => {
    // 거절 사유가 입력되지 않았다면
    if (!rejectReason.trim()) {
      alert("거절 사유를 입력하세요");
      return;
    }

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
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

        {/* 정렬 조건 */}
        <select
          className={styles.dropdown}
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
        >
          <option value="이름순">이름 순</option>
          <option value="학번순">학번 순</option>
          <option value="날짜순">날짜 순</option>
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
            <div className={styles.cell}>{item.name}</div>
            <div className={styles.cell}>{item.studentId}</div>
            <div className={styles.cell}>{item.date}</div>
            <div className={styles.cell}>{item.time}</div>
            <div className={styles.cell}>{item.reason}</div>
            <div className={styles.cell}>{translateStatus(item.status)}</div>
          </div>
        ))}
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