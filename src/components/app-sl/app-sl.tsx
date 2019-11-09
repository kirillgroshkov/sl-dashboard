import { dayjs } from '@naturalcycles/time-lib'
import { Component, Element, h, Prop, State } from '@stencil/core'
import { LinearTickOptions } from 'chart.js'
import Chart from 'chart.js'
import { RADHUSET_SITE_ID } from '../../cnst/other'
import { Departure, slApiService } from '../../srv/slApi.service'

const Y_LABEL = {
  3: 'Kungsträdgården',
  2: 'Akalla',
  1: 'Hjulsta',
}

@Component({
  tag: 'app-sl',
  styleUrl: 'app-sl.scss',
})
export class AppSL {
  @Element() el: HTMLElement
  @Prop({ context: 'isServer' }) private isServer: boolean
  @State() departures: Departure[] = []
  @State() latestUpdate: string
  @State() currentTime = dayjs()
  @State() loading = false
  private chart: Chart

  async componentDidLoad() {
    if (this.isServer) return
    // alert('The component did load')
    void this.fetchDepartures()
    this.onTimer()
    setInterval(() => this.onTimer(), 500)

    const ctx = this.el.querySelector('.myChart') as HTMLCanvasElement

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        // labels: ['Kungstradgarden', 'Akalla', 'Hjulsta'],
        datasets: [
          {
            // label: 'Label1',
            // data: [12, 19, 3, 5, 2, 3],
            data: [
              /*
              {x: 1.5, y: 3},
              {x: 2, y: 3},
              {x: 6, y: 3},
              {x: 1, y: 2},
              {x: 4, y: 2},
              {x: 8, y: 2},
              {x: 4, y: 1},
              {x: 7, y: 1},
              {x: 12, y: 1},
              */
            ],
            pointRadius: 10,
            pointHoverRadius: 15,
            showLine: false,
          },
          {
            // label: 'Label1',
            // data: [12, 19, 3, 5, 2, 3],

            data: [
              /*{x: 1.5, y: 3},
              {x: 2, y: 3},
              {x: 6, y: 3},
              {x: 1, y: 2},
              {x: 4, y: 2},
              {x: 8, y: 2},
              {x: 4, y: 1},
              {x: 7, y: 1},
              {x: 12, y: 1},*/
            ],
            // pointBorderColor: 'rgba(200, 0, 0, 0.5)',
            backgroundColor: 'rgba(200, 50, 50, 0.3)',
            pointRadius: 10,
            pointHoverRadius: 15,
            showLine: false,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            // left: 0,
            // right: 0,
            top: 30,
            // bottom: 10
          },
        },
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                // display: false,
              },
              ticks: {
                stepSize: 1,
                min: 1,
                max: 3,
                callback: v => Y_LABEL[v] || v,
              } as LinearTickOptions,
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'minutes to departure',
              },
              ticks: {
                stepSize: 1,
                min: 0,
                max: 30,
              } as LinearTickOptions,
            },
          ],
        },
        elements: {
          point: {
            pointStyle: 'circle',
          },
        },
      },
    })

    this.updateData()
  }

  render() {
    const loading = this.loading ? '...' : ''

    return (
      <div>
        <div class="container-fluid">
          <div class="row row1">
            <div class="col col1">
              <canvas class="myChart" />
            </div>
          </div>
          <div class="row row2">
            <div class="col">
              Time: {this.currentTime.format('HH:mm:ss')}, latestUpdate:{' '}
              {Math.abs(this.secondsDiff(this.latestUpdate))} seconds ago
              {loading}
              <br />
              Departures:
              <br />
              {this.departures.map(d => (
                <div>
                  {d.LineNumber} {d.Destination} {d.DisplayTime} {d.ExpectedDateTime}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  private async fetchDepartures(): Promise<void> {
    this.loading = true
    const r = await slApiService.getDepartures(RADHUSET_SITE_ID, 30)
    this.loading = false
    this.departures = r.ResponseData.Metros
    this.latestUpdate = r.ResponseData.LatestUpdate
    setTimeout(() => this.fetchDepartures(), 15000)
  }

  private onTimer(): void {
    this.currentTime = dayjs()
    this.updateData()
  }

  private secondsDiff(timeStr: string): number {
    if (!timeStr) return 0
    return dayjs(timeStr).diff(this.currentTime, 'second')
  }

  private getDepartureY(d: Departure): number {
    if (d.JourneyDirection === 2) return 3 // Kung
    if (d.LineNumber === '10' && d.JourneyDirection === 1) return 1 // hjulsta
    if (d.LineNumber === '11' && d.JourneyDirection === 1) return 2 // Akalla
  }

  private updateData(): void {
    // console.log(this.departures.length)
    const dataTimetabled = this.departures
      .map(d => {
        const y = this.getDepartureY(d)
        const x = this.secondsDiff(d.TimeTabledDateTime) / 60
        if (x <= 0 || !y) return

        return {
          x,
          y,
        }
      })
      .filter(r => !!r)

    const dataExpected = this.departures
      .map(d => {
        if (d.ExpectedDateTime === d.TimeTabledDateTime) return
        const y = this.getDepartureY(d)
        const x = this.secondsDiff(d.ExpectedDateTime) / 60
        if (x <= 0 || !y) return

        return {
          x,
          y,
        }
      })
      .filter(r => !!r)

    if (!this.chart) return
    this.chart.data.datasets[0].data = dataTimetabled
    this.chart.data.datasets[1].data = dataExpected
    /*[
      {x: 1.5, y: 3},
      {x: 2, y: 3},
      {x: 6, y: 3},
      {x: 1, y: 2},
      {x: 4, y: 2},
      {x: 8, y: 2},
      {x: 4, y: 1},
      {x: 7, y: 1},
      {x: 12, y: 1},
    ]*/

    this.chart.update({
      duration: 0,
    })
  }
}
