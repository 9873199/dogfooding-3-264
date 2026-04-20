// 混入代码 resize-mixins.js
// 改成 Scale 缩放之后，没有使用这个代码，但是保留
import { debounce } from '@/utils'

const resizeChartMethod = '$__resizeChartMethod'

export default {
  data() {
    return {
      chart: null
    }
  },
  created() {
    this[resizeChartMethod] = debounce(() => {
      if (this.chart && !this.chart.isDisposed()) {
        this.chart.resize()
      }
    }, 300)
  },
  activated() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.resize()
    }
    window.addEventListener('resize', this[resizeChartMethod], false)
  },
  deactivated() {
    window.removeEventListener('resize', this[resizeChartMethod])
  },
  beforeDestroy() {
    window.removeEventListener('resize', this[resizeChartMethod])
  }
}
