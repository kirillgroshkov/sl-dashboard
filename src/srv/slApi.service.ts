import { departuresMock } from '../mock/departures.mock'
import { secret } from '../secret'

export interface Departure {
  LineNumber: string
  Destination: string
  DisplayTime: string
}

class SlApiService {
  async getDepartures (siteId: string, timeWindow: number = 20): Promise<any> {
    // const url = `http://api.sl.se/api2/realtimedeparturesV4.json?key=${secret.REALTIME_API_KEY}&siteid=${siteId}&timewindow=${timeWindow}&Bus=false&Train=false&Tram=false&Ship=false`
    const url = `https://sl-dashboard-backend.now.sh/departures`

    const r = await fetch(url)
    return r.json()
    // return departuresMock
  }
}

export const slApiService = new SlApiService()
