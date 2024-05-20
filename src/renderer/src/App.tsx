// import Box from '@mui/material/Box'
import TieDisplaySwitch from './components/TieDisplaySwitch'
import DatePickerDay from './components/DatePickerDay'
import Display7dayFromPickedDate from './components/Display7dayFromPickedDate'

function App(): JSX.Element {
  return (
    <>
      <DatePickerDay />
      <TieDisplaySwitch />
      <Display7dayFromPickedDate />
    </>
  )
}

export default App
