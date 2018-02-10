import { departuresMock } from '../mock/departures.mock'

export interface Departure {
  LineNumber: string
  JourneyDirection: number
  Destination: string
  DisplayTime: string
  ExpectedDateTime: string
  TimeTabledDateTime: string
}

class SlApiService {
  async getDepartures (siteId: string, timeWindow: number = 30): Promise<any> {
    // const url = `http://api.sl.se/api2/realtimedeparturesV4.json?key=${secret.REALTIME_API_KEY}&siteid=${siteId}&timewindow=${timeWindow}&Bus=false&Train=false&Tram=false&Ship=false`
    const url = `https://kg-backend.now.sh/sl/departures`

    const r = await fetch(url)
    return r.json()
    // return departuresMock
  }
}

export const slApiService = new SlApiService()
