// 混入代码 resize-mixins.js
// 改成 Scale 缩放之后，没有使用这个代码，但是保留
import { debounce } from '@/utils';
const resizeChartMethod = '$__resizeChartMethod';

export default {
  data() {
    return {
      chart: null,
    };
  },
  created() {
    window.addEventListener('resize', this[resizeChartMethod], false);
  },
  activated() {
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this[resizeChartMethod]);
  },
  methods: {
    [resizeChartMethod]: debounce(function() {
      if (this.chart) {
        this.chart.resize();
      }
    }, 300),
  },
};
