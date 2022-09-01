(async () => {
  /**
   * 从网络获取歌词数据
   * @returns Promise
   */
  async function getLrc() {
    return await fetch('https://study.duyiedu.com/api/lyrics')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }
  const doms = {
    lrc: document.querySelector('.lrc'),
    audio: document.querySelector('audio'),
  };
  const size = {
    liheight: 30, // li的高度
    ulheight: 420, // 外面容器的高度
  };
  let lrcData;
  //初始化

  async function index() {
    const c = await getLrc();
    lrcData = c
      .split('\n')
      .filter((s) => s !== '')
      .map((s) => s.split(']'))
      .map((item) => {
        const teim = item[0].replace('[', '').split(':');
        const worder = item[1];
        return {
          teim: teim[0] * 60 + +teim[1],
          worder: worder,
        };
      });
    const li = lrcData.map((s) => `<li>${s.worder}</li>`).join('');
    doms.lrc.innerHTML = li;
  }
  await index();

  // 交互
  // 2点 1 什么事件 2 事件触发了要干嘛
  doms.audio.addEventListener('timeupdate', function () {
    setStaus(this.currentTime);
  });

  /**
   *
   * @param {根据播放时间设置} item
   */
  function setStaus(item) {
    // 根据时间设置样式
    //清除之前的样式
    item += 0.2;
    const aut = document.querySelector('.active');
    aut && aut.classList.remove('active');
    const index = lrcData.findIndex((lc) => lc.teim > item) - 1;
    if (index < 0) {
      return;
    }
    console.log(index);
    doms.lrc.children[index].classList.add('active');
    //设置ul的滚动位置
    let top = size.liheight * index - size.liheight / 2 - size.ulheight / 2;
    top = -top;
    if (top > 0) {
      top = 0;
    }
    doms.lrc.style.transform = `translateY(${top}px)`;
  }
})();
