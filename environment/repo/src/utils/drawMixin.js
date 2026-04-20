// 屏幕适配 mixin 函数

// * 默认缩放值
const scale = {
  width: '1',
  height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))

export default {
  data() {
    return {
      drawTiming: null
    }
  },
  mounted () {
    this.calcRate()
    window.addEventListener('resize', this.resize)
    window.addEventListener('fullscreenchange', this.resize)
  },
  activated() {
    window.addEventListener('resize', this.resize)
    window.addEventListener('fullscreenchange', this.resize)
  },
  deactivated() {
    clearTimeout(this.drawTiming)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('fullscreenchange', this.resize)
  },
  beforeDestroy () {
    clearTimeout(this.drawTiming)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('fullscreenchange', this.resize)
  },
  methods: {
    calcRate () {
      const appRef = this.$refs["appRef"]
      if (!appRef) return 
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      appRef.style.transformOrigin = '0 0'
      appRef.style.position = 'absolute'
      appRef.style.left = '50%'
      appRef.style.top = '50%'
      appRef.style.overflow = 'hidden'
      if (currentRate > baseProportion) {
        scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (window.innerHeight / baseHeight).toFixed(5)
        appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      } else {
        scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
        scale.width = (window.innerWidth / baseWidth).toFixed(5)
        appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      }
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    },
    resize () {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
      }, 100)
    }
  },
}