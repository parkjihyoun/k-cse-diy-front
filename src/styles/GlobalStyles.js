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
    background: url(${backgroundImage}) no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    color: #fff; /* 기본 텍스트 색상 */
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