// import Box from '@mui/material/Box'
import TimeDisplaySwitch from './components/TimeDisplaySwitch'
import DatePickerDay from './components/DatePickerDay'
import Display7dayFromPickedDate from './components/Display7dayFromPickedDate'

function App(): JSX.Element {
  return (
    <>
      <DatePickerDay />
      <TimeDisplaySwitch />
      <Display7dayFromPickedDate />
    </>
  )
}

export default App
