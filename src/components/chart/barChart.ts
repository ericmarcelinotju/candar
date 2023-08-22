import { computed, defineComponent, h } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    labels: {
      type: Array,
      default: () => ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs']
    },
    data: {
      type: Array,
      default: () => [[100, 50], [92, 43]]
    },
    dataLabels: {
      type: Array,
      default: () => ['VueJs', 'EmberJs']
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const chartData = computed(() => {
      const backgroundColors = ['#CD5B8A', '#CDC25B', '#B8DFFF', '#5BCD9F']
      const datasets = props.data.map((data, i) => ({
        label: props.dataLabels[i],
        backgroundColor: backgroundColors[i],
        data: data
      }))
      return {
        labels: props.labels,
        datasets: datasets
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    }

    return () =>
      h(Bar, {
        chartData: chartData.value,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      })
  }
})
