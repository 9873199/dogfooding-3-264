<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import tdTheme from './theme.json'
import '../map/fujian.js'

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
      chart: null
    }
  },
  watch: {
    options: {
      handler(options) {
        if (this.chart) {
          this.chart.setOption(options, true)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$echarts.registerTheme('tdTheme', tdTheme)
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  activated() {
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      if (!this.id) return
      const chartDom = document.getElementById(this.id)
      if (!chartDom) return

      this.chart = this.$echarts.init(chartDom, 'tdTheme')
      this.chart.setOption(this.options, true)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style>
</style>
