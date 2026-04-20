<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import tdTheme from './theme.json'
import '../map/fujian.js'
import { debounce } from '@/utils'

export default {
  name: 'echart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '2.5rem'
    },
    options: {
      type: Object,
      default: ()=>({})
    }
  },
  data () {
    return {
      chart: null,
      resizeHandler: null,
      isDisposed: false
    }
  },
  watch: {
    options: {
      handler (options) {
        if (this.isDisposed) return
        if (this.chart) {
          this.chart.setOption(options, { notMerge: false, lazyUpdate: false })
          this.$nextTick(() => {
            if (this.chart && !this.isDisposed) {
              this.chart.resize()
            }
          })
        } else {
          this.initChart()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$echarts.registerTheme('tdTheme', tdTheme)
    this.isDisposed = false
    this.initChart()
    this.initResizeEvent()
  },
  activated () {
    if (this.chart && !this.isDisposed) {
      this.$nextTick(() => {
        if (this.chart && !this.isDisposed) {
          this.chart.resize()
        }
      })
    }
  },
  deactivated () {
    if (this.chart && !this.isDisposed) {
      this.chart.resize()
    }
  },
  beforeDestroy () {
    this.destroyChart()
  },
  methods: {
    initChart () {
      if (this.isDisposed) return
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
      this.chart = this.$echarts.init(this.$el, 'tdTheme')
      if (this.options && Object.keys(this.options).length > 0) {
        this.chart.setOption(this.options, { notMerge: true })
      }
    },
    initResizeEvent () {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
      }
      this.resizeHandler = debounce(() => {
        if (this.chart && !this.isDisposed) {
          this.chart.resize()
        }
      }, 300)
      window.addEventListener('resize', this.resizeHandler)
    },
    destroyChart () {
      this.isDisposed = true
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
        this.resizeHandler = null
      }
      if (this.chart) {
        this.chart.clear()
        this.chart.dispose()
        this.chart = null
      }
    }
  }
}
</script>

<style>
</style>
