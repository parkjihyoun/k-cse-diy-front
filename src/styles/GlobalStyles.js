import { createGlobalStyle } from 'styled-components';
import backgroundImage from '../img/BGImg.png'; 

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: url(${backgroundImage}) no-repeat center center fixed; 
    background-size: cover;
    min-height: 100vh; 
    z-index: -1;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyles;