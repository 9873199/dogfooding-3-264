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
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null,
      $_resizeHandler: null,
      $_hasListener: false
    }
  },
  watch: {
    options: {
      handler(options) {
        if (this.chart && !this.chart.isDisposed()) {
          this.chart.setOption(options, true, false)
          this.chart.resize()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$echarts.registerTheme('tdTheme', tdTheme)
    this.$_resizeHandler = debounce(this.resize, 100)
    this.initChart()
    this.initListener()
  },
  activated() {
    if (!this.chart || this.chart.isDisposed()) {
      this.initChart()
    } else {
      this.chart.setOption(this.options, true, false)
      this.resize()
    }
    if (!this.$_hasListener) {
      this.initListener()
    }
  },
  deactivated() {
    this.removeListener()
  },
  beforeDestroy() {
    this.destroyChart()
  },
  methods: {
    initListener() {
      if (this.$_hasListener) return
      window.addEventListener('resize', this.$_resizeHandler)
      window.addEventListener('fullscreenchange', this.$_resizeHandler)
      this.$_hasListener = true
    },
    removeListener() {
      if (!this.$_hasListener) return
      window.removeEventListener('resize', this.$_resizeHandler)
      window.removeEventListener('fullscreenchange', this.$_resizeHandler)
      this.$_hasListener = false
    },
    initChart() {
      if (this.chart && !this.chart.isDisposed()) {
        this.chart.dispose()
      }
      this.chart = this.$echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options, true, false)
    },
    resize() {
      if (this.chart && !this.chart.isDisposed()) {
        this.chart.resize({
          width: 'auto',
          height: 'auto'
        })
      }
    },
    destroyChart() {
      this.removeListener()
      if (this.chart && !this.chart.isDisposed()) {
        this.chart.clear()
        this.chart.dispose()
      }
      this.chart = null
      this.$_resizeHandler = null
    }
  }
}
</script>

<style>
</style>
