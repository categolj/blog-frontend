import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    --fg: #000;
    --fg2: #333;
    --bg: #fff;
    --code-fg: #333;
    --code-bg: #f6f5f5;
    --meta: #031b4e99;
  }

  [data-theme="dark"] {
    --fg: #fff;
    --fg2: #ddd;
    --bg: #000;
    --code-fg: #061433;
    --code-bg: #dbdde7;
    --meta: #ccd2ecff;
  }
`