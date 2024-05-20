import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAtom } from 'jotai'
import { startDateAtom } from '../atom'

const DatePickerDay = (): JSX.Element => {
  const [startDate, setStartDate] = useAtom(startDateAtom)

  const handleChange = (date: Date): void => {
    setStartDate(date)
  }
  return <DatePicker selected={startDate} onChange={handleChange} />
}

export default DatePickerDay
