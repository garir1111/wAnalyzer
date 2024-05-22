import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography, Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import { displayDetailAtom } from '../atom'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

const { ipcRenderer } = window.electron

interface DisplayResultOfDateProps {
  targetDate: Date
}

const DisplayResultOfDate = ({ targetDate }: DisplayResultOfDateProps): JSX.Element => {
  const [result, setResult] = useState<Array<{ time: string; result: string }> | string | null>(
    null
  )
  const [isDisplayDetail] = useAtom(displayDetailAtom)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const result = await ipcRenderer.invoke('checkResult', targetDate)
        setResult(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [targetDate])

  const renderIcon = (result: string): JSX.Element | null => {
    switch (result) {
      case 'w':
        return <ThumbUpIcon fontSize="small" sx={{ color: 'limegreen' }} />
      case 't':
        return <ThumbsUpDownIcon fontSize="small" sx={{ color: 'lightslategray' }} />
      case 'l':
        return <ThumbDownIcon fontSize="small" sx={{ color: 'red' }} />
      default:
        return null
    }
  }

  const renderResult = (): JSX.Element | null => {
    if (result === null) {
      return <CircularProgress />
    }
    if (typeof result === 'string') {
      return <Typography sx={{ textAlign: 'left' }}>{result}</Typography>
    }
    if (Array.isArray(result)) {
      // 当日の勝率の計算、tはないものとして計算している。
      const winRate =
        (100 * result.filter((item) => item.result === 'w').length) /
        result.filter((item) => item.result === 'w' || item.result === 'l').length

      let winRateRounded: string
      if (Math.floor(winRate) === winRate) {
        winRateRounded = winRate.toFixed(0)
      } else {
        winRateRounded = winRate.toFixed(1)
      }
      return (
        <>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px' }}>
            <ThumbUpIcon sx={{ color: 'limegreen' }} />
            <p style={{ margin: '3px' }}>: {winRateRounded}%</p>
            <Tooltip title="without ties.">
              <HelpOutlineIcon fontSize="small" sx={{ margin: '3px', color: 'lightslategray' }} />
            </Tooltip>
          </div>
          {isDisplayDetail && (
            <Box
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: 2,
                textAlign: 'left',
                margin: 0
              }}
            >
              <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
                {result.map((item, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: '0.5em', display: 'flex', alignItems: 'center' }}
                  >
                    {renderIcon(item.result)}
                    <span
                      style={{ marginLeft: '0.5em', fontSize: '0.8rem' }}
                    >{`${item.time.slice(0, -3)}`}</span>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </>
      )
    }
    return null
  }

  return <div>{renderResult()}</div>
}

export default DisplayResultOfDate
