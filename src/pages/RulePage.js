import React from 'react';
import styles from '../styles/RulePage.module.css';

const RulePage = () => {
  return (
    <div>
    <div className={styles.RulePage}>
      <div className={styles.Rules}>
        <ol>
          <li>DIY실에 개인물품 보관은 금지되어 있습니다.</li>
          <li>난방, 에어컨, 조명 사용 후 반드시 전원을 꺼주세요.</li>
          <li>DIY실은 개인을 위한 대여 및 사용이 불가합니다. 동아리, 프로젝트 등 단체를 위한 공간으로만 사용해주세요.</li>
          <li>원활한 사용을 위해 예약 시간과 반납 시간을 지켜주세요. 이용 시간 초과 시 패널티가 부여됩니다.</li>
          <li> 반드시 본인 명의로 이용해주세요.</li>
          <li>열쇠 분실 시 책임은 이용 당사자에게 있습니다. (약 2만원 비용 발생)</li>
          <li>기타 문의사항은 동연의장 이동혁 (Kakao ID : abc123)으로 문의 바랍니다.</li>
        </ol>
      </div>
      <div className={styles.penalty}>
        <div className={styles.penaltyTitle}>
            <h2>패널티</h2>
            <div className={styles.line}></div>
        </div>
        <ol>
          <li>예약시간 이후 반납 시 : 익일 기준 <strong>7일 </strong>이용 정지 <strong>(1회 경고)</strong></li>
          <li>누적 경고 횟수 <strong>3회</strong> 발생 시 : 익일 기준 <strong>2주</strong> 이용 정지</li>
          <li>누적 경고 횟수 <strong>5회</strong> 발생 시 : 익일 기준 <strong>1달</strong> 이용 정지</li>
        </ol>
      </div>
    </div>
  </div>
  );
  
};

export default RulePage;

