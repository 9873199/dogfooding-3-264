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
      $_resizeHandler: null
    }
  },
  watch: {
    options: {
      handler(options) {
        if (this.chart && !this.chart.isDisposed()) {
          this.chart.setOption(options, true, true)
        }
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.$echarts.registerTheme('tdTheme', tdTheme)
    this.$_resizeHandler = debounce(this.resize, 200)
    this.initChart()
    this.initListener()
  },
  activated() {
    if (!this.chart || this.chart.isDisposed()) {
      this.initChart()
    } else {
      this.resize()
    }
    window.addEventListener('resize', this.$_resizeHandler)
  },
  deactivated() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    this.destroyChart()
  },
  methods: {
    initListener() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options, true)
    },
    resize() {
      if (this.chart && !this.chart.isDisposed()) {
        this.chart.resize()
      }
    },
    destroyChart() {
      window.removeEventListener('resize', this.$_resizeHandler)
      if (this.chart && !this.chart.isDisposed()) {
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
