import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { startDateAtom } from '../atom'
import { Box } from '@mui/material'
import DisplayResultOfDate from './DisplayResultOfDate'

const Display7dayFromPickedDate = (): JSX.Element => {
  const [startDate] = useAtom(startDateAtom)
  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate)
      const newDates: Date[] = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        newDates.push(date)
      }
      setDates(newDates)
    }
  }, [startDate])

  return (
    <Box display="flex" gap="10px">
      {dates.map((date, index) => (
        <Box key={index} border={1} borderColor="grey.500" borderRadius="borderRadius" p={1}>
          {/* 日付はここでローカライズしてstr */}
          {date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
          })}
          <DisplayResultOfDate targetDate={date} />
        </Box>
      ))}
    </Box>
  )
}

export default Display7dayFromPickedDate
