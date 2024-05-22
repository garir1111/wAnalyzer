import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useAtom } from 'jotai'
import { displayDetailAtom } from '../atom'

const DetailDisplaySwitch = (): JSX.Element => {
  const [view, setView] = useAtom(displayDetailAtom)

  const handleToggle = (): void => {
    setView((prev) => !prev)
  }

  return (
    <FormControlLabel
      control={<Switch checked={view} onChange={handleToggle} />}
      label="Show Detail"
      sx={{ alignSelf: 'flex-end', m: 2 }}
    />
  )
}

export default DetailDisplaySwitch
