import { Global } from "@emotion/react";
import React from "react";

const Fonts = () => (
	<Global
		styles={`
      @font-face {
        font-family: 'Quicksand';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/quicksand-v26-latin-regular.woff2') format('woff2');
      }
      :root {
        --font-quicksand: 'Quicksand', sans-serif;
      }
    `}
	/>
);

export default Fonts;
