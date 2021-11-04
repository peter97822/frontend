export interface ChartData {
    timestamp: string
    burned: number
    issuance: number
    rewards: number
    tips: number
    netReduction: number
}

export type TimeBucket = 'hour' | 'day' | 'month'

export interface ChartDataBucket {
    type: TimeBucket
    data: ChartData[]
}