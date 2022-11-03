import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const downloadByBlob = (type: number) => {
    
  }

  return (
    <div className="App">
      <div className='App-container'>
        <div className="header">
          {`通过<a>标签下载`}
        </div>
        <div className="container">

          <div className="card">
            <div className="description">
              <p>{`不加任何属性，通过<a>标签下载`}</p>
            </div>
            <div className="action">
              <a
                className="App-link"
                href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                target="_blank"
                rel="noopener noreferrer"
              >
                图片，会直接打开
              </a>
            </div>
            <div className="action">
              <a
                className="App-link"
                href="http://samples.mplayerhq.hu/anim/anim3_BirdofPrey.anim"
                target="_blank"
                rel="noopener noreferrer"
              >
                其它文件，无法预览
              </a>
            </div>
            <div className="description">
              <p>{`通过<a>标签href设置文件链接，直接下载`}</p>
              <p>{`问题：对于浏览器能够预览的格式，会直接在浏览器打开，而非下载`}</p>
              <p>{`不能预览的文件在下载时还会出现闪烁（target="_blank"开了一个新tab）`}</p>
            </div>
          </div>

          <div className="card">
            <div className="description">
              <p>{`避免浏览器预览：download属性`}</p>
            </div>
            <div className="action">
              <a
                className="App-link"
                href="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                跨域图片，还是会直接打开
              </a>
            </div>
            <div className="action">
              <a
                className="App-link"
                href={logo}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                同源图片，能下载，且无闪烁
              </a>
            </div>
            <div className="action">
              <a
                className="App-link"
                href="http://samples.mplayerhq.hu/anim/anim3_BirdofPrey.anim"
                target="_self"
                rel="noopener noreferrer"
                download
              >
                跨域文件（target="_self"）
              </a>
            </div>
            <div className="description">
              <p>{`<a>标签加 download 属性，让所有文件都下载，不直接打开`}</p>
              <p>{`问题：下载跨域文件时，download 失效，表现和不使用 download 时一致`}</p>
            </div>
          </div>
        </div>
        <div className="header">
          {`利用Blob对象下载`}
        </div>
        <div className="container">
          <div className="card">
            <div className="action">
              <a
                href="javascript:void(0)"
                className="App-link"
                onClick={() => { downloadByBlob(1) }}
              >
                {`通过事件触发，利用Blob下载`}
              </a>
            </div>
            <div className="action">
              <a
                href="javascript:void(0)"
                className="App-link"
                onClick={() => { downloadByBlob(2) }}
              >
                {`（大文件测试）浏览器不显示下载进度`}
              </a>
            </div>
            <div className="description">
              <p>{`通过xhr对象构建请求，获取到blob后，创建一个隐藏的<a>标签触发浏览器下载`}</p>
              <p>{`问题：浏览器无法知晓实际进度，表现为点击后无反应，然后下载瞬间完成`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
