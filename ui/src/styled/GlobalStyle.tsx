import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    --fg: #000;
    --fg2: #333;
    --bg: #fff;
    --code: #f6f5f5;
    --meta: #031b4e99;
  }

  [data-theme="dark"] {
    --fg: #fff;
    --fg2: #ddd;
    --bg: #000;
    --code: #757474;
    --meta: #ccd2ecff;
  }
`