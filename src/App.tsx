import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="public/logo192.png"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {`<a>标签+download属性 下载同域文件`}
        </a>
      </header>
    </div>
  );
}

export default App;
