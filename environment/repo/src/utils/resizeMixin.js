// 混入代码 resize-mixins.js
import { debounce } from '@/utils';

const resizeChartMethod = '$__resizeChartMethod';

export default {
  data() {
    return {
      chart: null,
    };
  },
  created() {
    this[resizeChartMethod] = debounce(this.resizeChart.bind(this), 300);
    window.addEventListener('resize', this[resizeChartMethod], false);
  },
  activated() {
    // 防止 keep-alive 之后图表变形
    if (this.chart) {
      this.chart.resize();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this[resizeChartMethod]);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
