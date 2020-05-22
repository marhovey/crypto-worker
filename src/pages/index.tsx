import React, {useState} from 'react';
import './index.scss';
import EncodeWorker from '../workers/encode.worker';
import DecodeWorker from '../workers/decode.worker';

function Index(props: any) {
  
  const [fileList, setFileList] = useState([])

  const changeFile = (files: FileList) => {
    console.log(files)
    const file = files[0]
    if(!file) {
      return
    }
    if(file.size > 1024*1024*50) {
      return alert('文件太大')
    }
    changeFileList({
      id: `-${file.lastModified}`,
      name: file.name,
      content: null
    })
    encodeFile(file)
  }

  const changeFileList = (file) => {
    const ind = fileList.findIndex(
      item =>
        item.id === file.id
    )
    if(ind === -1) {
      fileList.push(file)
    } else {
      fileList.splice(ind, 1, file)
    }
    setFileList([...fileList])
  }
  // 加密
  const encodeFile = (file: File) => {
    const encodeWorker = new EncodeWorker('');
    encodeWorker.postMessage({file, tokenInfo: {fileName: file.name, key: 'axyIIVwxqRnPnqc9RDRzXg=='}})
    encodeWorker.onmessage = function(e) {
      let {content, done} = e.data;
      if(done){
        encodeWorker.terminate()
        changeFileList({
          id: `-${file.lastModified}`,
          name: file.name,
          content: content
        })
        console.log('end-encode', new Date().getTime())
      }
    }
  }
  //解密
  const decodeFile = (file: String | ArrayBuffer, name: String, type: String) => {
    const decodeWorker = new DecodeWorker('');
    decodeWorker.postMessage({file, key: 'axyIIVwxqRnPnqc9RDRzXg==', type})
    decodeWorker.onmessage = function(e) {
      let {content, done} = e.data;
      if(done){
        decodeWorker.terminate()
        console.log('end-decode', new Date().getTime())
        downloadFile(content, name)
      } else {
        console.log(content)
      }
    }
  }

  const downloadFile = (url, name) => {
    let a = document.createElement('a')
    a.href = `${url}`
    a.target = "__blank"
    a.download = name || ""
    a.click()
  }

  const downEncodeFile = (file) => {
    // console.log(file)
    const reader = new FileReader()
    reader.onload = function() {
      console.log(reader.result)
      // downloadFile(reader.result, file.name)
    }
    reader.readAsDataURL(file)
  }

  const downDecodeFile = (file) => {
    const reader = new FileReader()
    reader.onload = function() {
      decodeFile(reader.result, file.name, file.type)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="upload-file">
      <div className="file-btn">
        <span>选择文件</span>
        <input type="file" onChange={(e) => changeFile(e.target.files)} />
      </div>
      <div className="file-list">
        {
          fileList.map((v) => {
            return (
              <div key={v.id} className="file-item">
                {v.name}
                （{v.content?'加密完成':'加密中...'}）
                <span onClick={() => downEncodeFile(v.content)} className="download-btn">下载加密文件</span>
                <span onClick={() => downDecodeFile(v.content)} className="decode-btn">下载解密文件</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Index