// import Box from '@mui/material/Box'
import DetailDisplaySwitch from './components/DetailDisplaySwitch'
import DatePickerDay from './components/DatePickerDay'
import Display7dayFromPickedDate from './components/Display7dayFromPickedDate'

function App(): JSX.Element {
  return (
    <>
      <DatePickerDay />
      <DetailDisplaySwitch />
      <Display7dayFromPickedDate />
    </>
  )
}

export default App
