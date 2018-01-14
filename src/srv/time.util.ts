import { DateTime } from 'luxon'

class TimeUtil {
  now (): DateTime {
    return DateTime.local()
  }
}

export const timeUtil = new TimeUtil()
