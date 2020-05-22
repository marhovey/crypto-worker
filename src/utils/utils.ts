import CryptoJs, {WordArray, AES} from 'crypto-js';
/**
 * 加密函数使用的CryptoJs的AES/CBC/pkcs7进行加密
 * @param {*} key 加密用的秘钥，由于项目中的key使用了base64编码，所以需要解码
 * @param {*} content 要加密的内容，CryptoJs接收WordArray | string
 * @returns res返回值为加密后的WordArray, 大端序。
 */ 
export const encode = (key: string, content: string | WordArray) => {
  const encodeKey = CryptoJs.enc.Base64.parse(key)
  const ivWords = [...encodeKey.words].splice(0, 4)
  const iv = CryptoJs.lib.WordArray.create(ivWords)
  const res = AES.encrypt(content, encodeKey, {
    iv: iv,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7
  }).ciphertext
  return res
}

/**
 * 
 * @param {*} array 要初始化为WordArray的typedArray
 * @returns res返回值为WordArray(Crypto使用的WordArray)
 */
export type typedArray = String | ArrayBuffer | Int32Array | Uint32Array | Int16Array | Uint16Array
        | Int8Array | Uint8ClampedArray | Uint8Array | Float32Array | Float64Array
export const createWordArray = (array: typedArray) => {
  return CryptoJs.lib.WordArray.create(array)
}

/**
 * @param {*} array 要解密的WordArray
 * @returns res返回值为CipherParams(CryptoJS解密用的)
 */
 export const formatCipher = (array: WordArray) => {
   return CryptoJs.lib.CipherParams.create({ciphertext: array})
 }

 /**
  * 解密函数
  * @param {*} key //解密时候用的key
  * @param {*} content // 要解密的内容(CryptoJS接收string | WordArray)
  * @returns res // 解密后的文件内容，通过base64编码
  */
 export const decode = (key: string, content: string | WordArray) => {
  const decodeKey = CryptoJs.enc.Base64.parse(key)
  const ivWords = [...decodeKey.words].splice(0, 4)
  const iv = CryptoJs.lib.WordArray.create(ivWords)
  var res = AES.decrypt(content, decodeKey, {
    iv: iv,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7
  }).toString(CryptoJs.enc.Base64)
  return res
 }
/**
 * WordArray 转化为DataView
 * @param wordArray 
 * @returns DataView
 */
 export const wAToB = (wordArray: WordArray) => {
  const buffer = new ArrayBuffer(wordArray.sigBytes)
  let resView = new DataView(buffer)
  for(let i = 0; i < wordArray.words.length; i++) {
    resView.setInt32(i * 4, wordArray.words[i])
  }
  return resView
}
