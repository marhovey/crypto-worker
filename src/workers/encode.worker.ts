import {encode, createWordArray, wAToB} from '../utils/utils';
const enWorker: Worker = self as any;
enWorker.onmessage =  function(e) {
  const {file, tokenInfo} = e.data
  const reader = new FileReader();
  reader.onload = function() {
    const { key, fileName } = tokenInfo;
    let content = reader.result;
    content = createWordArray(content);
    content = encode(key, content);
    const res = wAToB(content)
    const resFile = new File([res], fileName, {type: file.type})
    enWorker.postMessage({content: resFile, done: true})
  }
  reader.readAsArrayBuffer(file)
}

export default null as any