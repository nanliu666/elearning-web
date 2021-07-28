export default {
  bind(el, binding) {
    // el-table 内容滚动区域
    const bodyWrap = el.querySelector('.el-table__body-wrapper')
    bodyWrap.addEventListener('scroll', function() {
      let sign = 0
      // 滚动到底部
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
}
