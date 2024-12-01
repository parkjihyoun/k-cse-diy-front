import { createGlobalStyle } from 'styled-components';
import backgroundImage from '../img/BGImg.jpeg';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    color: #fff; /* 기본 텍스트 색상 */
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${backgroundImage}) no-repeat center center fixed;
    background-size: cover;
    filter: grayscale(70%); /* 흑백 필터 추가 */
    z-index: -1; /* 다른 콘텐츠보다 뒤에 배치 */
  }

  a {
    text-decoration: none;
    color: inherit; /* 부모의 텍스트 색상을 따름 */
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
`;

export default GlobalStyles;
