/**
 * @param {String} str 引数1 - 本文
 * @param {Number} length 引数2 - 最大文字数 (デフォルト「100」)
 * @param {String} delim 引数3 - デリミタ (デフォルト「 」)
 * @param {String} appendix 引数3 - 末尾につける文字 (デフォルト「...」)
 * @return {String} str || trimmedStr 返り値 - excerpt
 */
exports.smartTrim = (str, length = 100, delim = " ", appendix = "...") => {
  if (str.length <= length) {
    return str;
  }

  var trimmedStr = str.substr(0, length, delim.length);
  var lastDelimIndex = trimmedStr.lastIndexOf(delim);

  if (lastDelimIndex >= 0) {
    trimmedStr = trimmedStr.substr(0, lastDelimIndex);
  }

  if (trimmedStr) {
    trimmedStr += appendix;
  }

  return trimmedStr;
};