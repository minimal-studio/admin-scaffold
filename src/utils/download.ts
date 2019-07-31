/**
 * 下载
 *
 * @param {string} url 下载的地址
 * @param {string} name 下载的文件名
 */
function download(url, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default download;
