import { Component, Prop, State } from '@stencil/core'
import { RADHUSET_SITE_ID } from '../../cnst/other'
import { Departure, slApiService } from '../../srv/slApi.service'

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  @State() departures: Departure[] = []

  async componentDidLoad () {
    // alert('The component did load')
    const r = await slApiService.getDepartures(RADHUSET_SITE_ID, 20)
    this.departures = r.ResponseData.Metros
    console.log(this.departures)
  }

  render () {
    return (
      <div>
        <div class="container">
          <div class="row">
            <div class="col">
              Departures:<br/>
              {this.departures.map(d => (
                <div>{d.LineNumber} {d.Destination} {d.DisplayTime}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
