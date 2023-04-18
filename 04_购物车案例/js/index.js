// 单间商品
class UIGoods {
  constructor(g) {
    this.data = g
    this.choose = 0
  }
  // 获取总价
  getTotalPrice() {
    return this.data.price * this.choose
  }
  // 是否选中了此件商品
  isChoose() {
    return this.choose > 0
  }
  // 选择的数量 +1
  increase() {
    this.choose++
  }
  // 选择的数量 -1
  decrease() {
    if (this.choose === 0) {
      return
    }
    this.choose--
  }
}

//整个界面的数据
class UIData {
  constructor() {
    let uiGoods = goods.map((g) => new UIGoods(g))
    this.uiGoods = uiGoods
    this.deliveryThreshold = 30
    this.deliveryPrice = 5
  }
  getTotalPeice() {
    return this.uiGoods.reduce((sum, g) => sum + g.getTotalPrice(), 0)
  }
  // 增加某一件商品的数量
  increase(index) {
    this.uiGoods[index].increase()
  }
  // 减少某一件商品的数量
  decrease(index) {
    this.uiGoods[index].decrease()
  }
  // 得到总共的选择数量
  getTotalChooseNumber() {
    return this.uiGoods.reduce((sum, g) => sum + g.choose, 0)
  }
  // 购物车中没有有东西
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0
  }
  // 是否达到配送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPeice() >= this.deliveryThreshold
  }
  isChoose(index) {
    return this.uiGoods[index].isChoose()
  }
}

// 整个界面
class UI {
  constructor() {
    this.uiData = new UIData()
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      deliveryPrice: document.querySelector(".footer-car-tip"),
      footerPay: document.querySelector(".footer-pay"),
      footerPayInnerSpan: document.querySelector(".footer-pay span"),
      totalPrice: document.querySelector(".footer-car-total"),
      footerCar: document.querySelector(".footer-car"),
      badge: document.querySelector(".footer-car-badge"),
    }
    const carRect = this.doms.footerCar.getBoundingClientRect()
    const jumpClass = "i-jiajianzujianjiahao"
    const jumpTarget = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5,
    }
    this.jumpClass = jumpClass
    this.jumpTarget = jumpTarget
    this.createHTML()
    this.updateFooter()
    this.listenEvent()
  }
  listenEvent() {
    this.doms.footerCar.addEventListener("animationend", () => {
      this.doms.footerCar.classList.remove("animate")
    })
  }
  // 根据商品数据创建商品列表元素
  createHTML() {
    let html = ""
    this.uiData.uiGoods.forEach((item, index) => {
      this.doms.goodsContainer.innerHTML = html += ` <div class="goods-item">
      <img src="${item.data.pic}" alt="" class="goods-pic" />
      <div class="goods-info">
        <h2 class="goods-title">${item.data.title}</h2>
        <p class="goods-desc">
          ${item.data.desc}
        </p>
        <p class="goods-sell">
          <span>月售 ${item.data.sellNumber}</span>
          <span>好评率${item.data.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${item.data.price}</span>
          </p>
          <div class="goods-btns">
            <i index="${index}" class="iconfont i-jianhao"></i>
            <span>${item.choose}</span>
            <i index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
        </div>`
    })
  }
  increase(index) {
    this.uiData.increase(index)
    this.updateGoodsItem(index)
    this.updateFooter()
    this.jump(index)
  }
  decrease(index) {
    this.uiData.decrease(index)
    this.updateGoodsItem(index)
    this.updateFooter()
  }
  // 更新某个商品的显示状态
  updateGoodsItem(index) {
    const goodsDom = this.doms.goodsContainer.children[index]
    if (this.uiData.isChoose(index)) {
      goodsDom.classList.add("active")
    } else {
      goodsDom.classList.remove("active")
    }
    const span = goodsDom.querySelector(".goods-btns span")
    span.textContent = this.uiData.uiGoods[index].choose
  }
  // 更新页脚
  updateFooter() {
    // 得到总价数据
    let total = this.uiData.getTotalPeice()
    // 设置配送费
    this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
    // 设置起送费还差多少
    if (this.uiData.isCrossDeliveryThreshold()) {
      // 到达起送点
      this.doms.footerPay.classList.add("active")
    } else {
      this.doms.footerPay.classList.remove("active")
      // 更新还差多少钱
      let dis = this.uiData.deliveryThreshold - total
      dis = Math.round(dis)
      this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`
    }
    // 设置总价
    this.doms.totalPrice.textContent = total.toFixed(2)
    // 设置购物车的样式状态
    if (this.uiData.hasGoodsInCar()) {
      this.doms.footerCar.classList.add("active")
    } else {
      this.doms.footerCar.classList.remove("active")
    }
    // 设置购物车中的数量
    this.doms.badge.textContent = this.uiData.getTotalChooseNumber()
  }
  carAnimate() {
    this.doms.footerCar.classList.add("animate")
  }
  // 抛物线跳跃的元素
  jump(index) {
    // 找到对应商品的加号
    const btnAdd = this.doms.goodsContainer.children[index].querySelector(
      `.${this.jumpClass}`
    )
    let rect = btnAdd.getBoundingClientRect()
    let start = {
      x: rect.left,
      y: rect.top,
    }
    // 跳跃
    const div = document.createElement("div")
    div.className = "add-to-car"
    const i = document.createElement("i")
    i.className = `iconfont ${this.jumpClass}`
    // 设置初始位置
    div.style.transform = `translateX(${start.x}px`
    i.style.transform = `translateY(${start.y}px)`
    div.appendChild(i)
    document.body.appendChild(div)
    // 强行渲染
    div.clientWidth
    // 设置结束位置
    div.style.transform = `translateX(${this.jumpTarget.x}px`
    i.style.transform = `translateY(${this.jumpTarget.y}px`
    div.addEventListener(
      "transitionend",
      () => {
        div.remove()
        this.carAnimate()
      },
      { once: true } // 事件仅触发一次
    )
  }
}
const ui = new UI()

// 事件
ui.doms.goodsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("i-jiajianzujianjiahao")) {
    let index = +e.target.getAttribute("index")
    ui.increase(index)
  } else if (e.target.classList.contains("i-jianhao")) {
    let index = +e.target.getAttribute("index")
    ui.decrease(index)
  }
})
