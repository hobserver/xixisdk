import howLongTillLunch from '../src'

class MockDate {
  private date = 0
  private hours = 0
  private minutes = 0
  private seconds = 0
  private milliseconds = 0

  getDate(): number {
    return this.date
  }

  setDate(date: number): void {
    this.date = date
  }

  setHours(h: number) {
    this.hours = h
  }

  setMinutes(m: number): void {
    this.minutes = m
  }

  setSeconds(s: number): void {
    this.seconds = s
  }

  setMilliseconds(ms: number): void {
    this.milliseconds = ms
  }

  getTime(): number {
    return this.valueOf()
  }

  valueOf(): number {
    return (
      this.milliseconds +
      this.seconds * 1e3 +
      this.minutes * 1e3 * 60 +
      this.hours * 1e3 * 60 * 60 +
      this.date * 1e3 * 60 * 60 * 24
    )
  }
}

global.Date = MockDate as unknown as typeof Date

const date = new MockDate()
Date.now = function now() {
  return date.getTime()
}

describe('how long till lunch', () => {
  const lunchtime = [12, 30]

  function testTime(
    hours: number,
    minutes: number,
    seconds: number,
    expected: string
  ): void {
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(seconds)
    expect(howLongTillLunch(lunchtime[0], lunchtime[1])).toEqual(expected)
  }

  test('1 hour', () => testTime(11, 30, 0, '1 hour'))
  test('2 hours', () => testTime(10, 30, 0, '2 hours'))
  test('5 minutes', () => testTime(12, 25, 0, '5 minutes'))
  test('5 minutes', () => testTime(12, 25, 0, '5 minutes'))
  test('45 seconds', () => testTime(12, 29, 15, '45 seconds'))
  test('23 hours', () => testTime(13, 30, 0, '23 hours'))
})
