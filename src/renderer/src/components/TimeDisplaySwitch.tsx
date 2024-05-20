import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useAtom } from 'jotai'
import { displayTimeAtom } from '../atom'

const TimeDisplaySwitch = (): JSX.Element => {
  const [view, setView] = useAtom(displayTimeAtom)

  const handleToggle = (): void => {
    setView((prev) => !prev)
  }

  return (
    <FormControlLabel
      control={<Switch checked={view} onChange={handleToggle} />}
      label="Show Time"
      sx={{ alignSelf: 'flex-end', m: 2 }}
    />
  )
}

export default TimeDisplaySwitch
