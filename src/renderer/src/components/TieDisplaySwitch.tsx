import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useAtom } from 'jotai'
import { displayTieAtom } from '../atom'

const TieDisplaySwitch = (): JSX.Element => {
  const [view, setView] = useAtom(displayTieAtom) // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleToggle = (): void => {
    setView((prev) => !prev)
  }

  return (
    <FormControlLabel
      control={<Switch checked={view} onChange={handleToggle} />}
      label="Show Tie"
      sx={{ alignSelf: 'flex-end', m: 2 }}
    />
  )
}

export default TieDisplaySwitch
