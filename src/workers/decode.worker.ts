import {decode, formatCipher, createWordArray} from '../utils/utils';
const deWorker: Worker = self as any;
deWorker.onmessage = function(e) {
  const {file, key, type} = e.data
  let content = createWordArray(file)
  content = formatCipher(content)
  const res = decode(key, content)
  const resStr = `data:${type};base64,${res}`
  deWorker.postMessage({content: resStr, done: true})
}
export default null as any