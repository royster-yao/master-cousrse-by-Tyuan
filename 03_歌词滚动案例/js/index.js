/**
 * 解析歌词字符串
 * 得到的是一个歌词对象的数组
 * 每个歌词对象:
 * {time:开始时间,words: 歌词内容}
 */

const parseLrc = () => {
  const lines = lrc.split("\n")
  const result = []
  lines.forEach((item) => {
    const obj = {
      time: parseTime(item.split("]")[0].substring(1)),
      words: item.split("]")[1],
    }
    result.push(obj)
  })
  return result
}

/**
 * 将时间字符串解析为数字(秒)
 * @param {*} timeStr 时间字符串
 * @returns
 */
const parseTime = (timeStr) => {
  const parts = timeStr.split(":")
  return +parts[0] * 60 + +parts[1]
}

const lrcData = parseLrc()

// 获取需要的 DOM
const doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".container ul"),
  container: document.querySelector(".container"),
}

/**
 * 计算出,在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到 -1
 */
const findIndex = () => {
  let curTime = doms.audio.currentTime
  for (let i = 0; i < lrcData.length; i++) {
    if (curTime < lrcData[i].time) {
      return i - 1
    }
  }
  // 循环完了也没有找到(说明播放到了最后)
  return lrcData.length - 1
}
findIndex()

// 界面

/**
 * 创建歌词元素 li
 */
const createLrcElements = () => {
  const frag = document.createDocumentFragment()
  for (let i = 0; i < lrcData.length; i++) {
    const li = document.createElement("li")
    li.textContent = lrcData[i].words
    frag.appendChild(li) // 修改了 dom 树
  }
  doms.ul.appendChild(frag)
}
createLrcElements()

// 容器高度
const containerHeight = doms.container.clientHeight
// 每个li的高度
const liHeight = doms.ul.children[0].clientHeight
// 最大偏移量
const maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 设置 ul 元素的偏移量
 */
const setOffset = () => {
  let index = findIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  // 去掉之前的 active 样式
  let li = doms.ul.querySelector(".active")
  if (li) {
    li.classList.remove("active")
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  li = doms.ul.children[index]
  if (li) {
    li.classList.add("active")
  }
}

doms.audio.addEventListener("timeupdate", setOffset)
