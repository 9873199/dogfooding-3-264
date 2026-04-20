// 屏幕适配 mixin 函数

const scale = {
  width: '1',
  height: '1',
}

const baseWidth = 1920
const baseHeight = 1080
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
    window.addEventListener('fullscreenchange', this.handleFullScreenChange)
    document.addEventListener('webkitfullscreenchange', this.handleFullScreenChange)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('fullscreenchange', this.handleFullScreenChange)
    document.removeEventListener('webkitfullscreenchange', this.handleFullScreenChange)
    if (this.drawTiming) {
      clearTimeout(this.drawTiming)
      this.drawTiming = null
    }
  },
  methods: {
    calcRate () {
      const appRef = this.$refs["appRef"]
      if (!appRef) return 
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      if (currentRate > baseProportion) {
        scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (window.innerHeight / baseHeight).toFixed(5)
        appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      } else {
        scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
        scale.width = (window.innerWidth / baseWidth).toFixed(5)
        appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      }
    },
    resize () {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
        this.triggerChartResize()
      }, 200)
    },
    handleFullScreenChange () {
      this.$nextTick(() => {
        this.calcRate()
        setTimeout(() => {
          this.triggerChartResize()
        }, 100)
      })
    },
    triggerChartResize () {
      const charts = document.querySelectorAll('div[_echarts_instance_]')
      charts.forEach(chartDom => {
        const chartInstance = this.$echarts.getInstanceByDom(chartDom)
        if (chartInstance) {
          chartInstance.resize()
        }
      })
    }
  },
}