export interface Departure {
  LineNumber: string
  JourneyDirection: number
  Destination: string
  DisplayTime: string
  ExpectedDateTime: string
  TimeTabledDateTime: string
}

class SlApiService {
  async getDepartures(siteId: string, timeWindow: number = 30): Promise<any> {
    const url = `https://kg-backend3.appspot.com/sl/departures`

    const r = await fetch(url)
    return r.json()
    // return departuresMock
  }
}

export const slApiService = new SlApiService()
