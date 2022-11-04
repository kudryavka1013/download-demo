import React from 'react';
import smlImg from './demo1.jpg';
import { saveAs } from 'file-saver'
import streamSaver from 'streamsaver'
import './App.css';

function App() {
  const getFileName = (url: string) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return fileName
  }

  const downloadByBlob = async (type: number) => {
    const bigZip = 'https://gh.con.sh/https://github.com/AaronFeng753/Waifu2x-Extension-GUI/releases/download/v2.21.12/Waifu2x-Extension-GUI-v2.21.12-Portable.7z'
    try {
      const url = type ? smlImg : bigZip
      const blob = await getBlobFromUrl(url)
      saveAs(blob, getFileName(url))
      //downloadFileFromBlob(blob)
    } catch (error) {
      console.log(error)
    }
  }

  const getBlobFromUrl = (url: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'blob'
      console.log('download start')
      xhr.onprogress = function onProgress(e: any) {
        const { total, loaded } = e
        const percentage = (loaded / total).toFixed(2)
        console.log('percentage: ', percentage)
      }
      xhr.onload = function onLoad() {
        if (this.status === 200) {
          console.log('download end')
          resolve(this.response)
        }
      }
      xhr.onerror = function onError() {
        reject()
      }
      xhr.send()
    })
  }

  // file-saver 内部大致实现
  const downloadFileFromBlob = (blob: any, name?: string) => {
    const a = document.createElement('a')
    // 一般需要先获取文件名字，不写后缀会自动识别，可能会错
    a.download = name || blob.name
    a.rel = 'noopener'
    // URL.createObjectURL 为这个blob对象生成一个临时可访问的链接
    a.href = URL.createObjectURL(blob)
    a.target = '_blank'
    // 40s后移除这个临时链接
    setTimeout(function () { URL.revokeObjectURL(a.href) }, 40 * 1000) // 40s
    // 触发a标签，执行下载
    setTimeout(function () {
      a.dispatchEvent(new MouseEvent('click'))
    }, 0)
  }

  //参考官方Example：https://github.com/jimmywarting/StreamSaver.js/blob/master/examples/fetch.html
  const downloadByStream = () => {
    const url = 'https://gh.con.sh/https://github.com/AaronFeng753/Waifu2x-Extension-GUI/releases/download/v2.21.12/Waifu2x-Extension-GUI-v2.21.12-Portable.7z'
    fetch(url).then(res => {
      if (res.body && res.headers.get('content-length') !== null) {
        const size = res.headers.get('content-length')
        const fileStream = streamSaver.createWriteStream(getFileName(url), {
          size: Number(size)
        })

        const readableStream = res.body;
        //more optimized
        if (window.WritableStream && readableStream && readableStream.pipeTo) {
          console.log('start writing')
          return readableStream.pipeTo(fileStream)
            .then(() => console.log('done writing'))
        }
        // 不支持上面方式的话，手动写入
        (window as any).writer = fileStream.getWriter()
        const reader = res.body.getReader()
        // 下载完成前，持续读res里的数据，并写入
        const pump = () => reader.read()
          .then(res => res.done
            ? (window as any).writer.close()
            : (window as any).writer.write(res.value).then(pump))
        pump()
      }
    })
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
                href={smlImg}
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
              <p>{`问题：download 受同源策略的影响，下载跨域文件时失效，表现和不使用 download 时一致`}</p>
              <p>{`Tips：后端oss可以批量设置HTTP头，设置HTTP请求头为 Content-Disposition 为 attachment`}</p>
            </div>
          </div>
        </div>
        <div className="header">
          {`利用Blob对象下载（FileSaver）`}
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
                onClick={() => { downloadByBlob(0) }}
              >
                {`（大文件测试）浏览器不显示下载进度`}
              </a>
            </div>
            <div className="description">
              <p>{`通过xhr对象构建请求，获取到blob后，创建一个隐藏的<a>标签触发浏览器下载`}</p>
              <p>{`问题1：浏览器无法知晓实际进度，表现为点击后无反应，然后下载瞬间完成`}</p>
              <p>{`问题2：跨域不能直接下载`}</p>
              <p>{`打开控制台查看进度`}</p>
            </div>
          </div>
        </div>
        <div className="header">
          {`流式下载（Fetch + StreamSaver）`}
        </div>
        <div className="container">
          <div className="card">
            <div className="action">
              <a
                href="javascript:void(0)"
                className="App-link"
                onClick={() => { downloadByStream() }}
              >
                {`通过事件触发，利用Stream下载`}
              </a>
            </div>
            <div className="description">
              <p>{`通过Fetch请求数据，并创建一个写入流持续往里写数据，`}</p>
              <p>{`Fetch比xhr区别在于只要响应马上就可以开始弹出浏览器下载`}</p>
              <p>{`浏览器能直接查看进度`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
