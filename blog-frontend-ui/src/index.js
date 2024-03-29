import React from 'react';
import ReactDOM from 'react-dom';
import 'pivotal-ui/css/typography';
// import 'pivotal-ui/css/forms';
import 'pivotal-ui/css/iconography';

import './index.css';
import App from './App';
import {HelmetProvider} from 'react-helmet-async';
import * as serviceWorker from './serviceWorker';

ReactDOM.hydrate(<HelmetProvider>
    <App renderedContent={new window.RenderedContent()}/>
</HelmetProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
