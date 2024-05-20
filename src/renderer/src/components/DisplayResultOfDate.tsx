import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import { displayTimeAtom } from '../atom'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'

const { ipcRenderer } = window.electron

interface DisplayResultOfDateProps {
  targetDate: Date
}

const DisplayResultOfDate = ({ targetDate }: DisplayResultOfDateProps): JSX.Element => {
  const [result, setResult] = useState<Array<{ time: string; result: string }> | string | null>(null)
  const [isDisplayTimeInfo] = useAtom(displayTimeAtom)

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
        return <ThumbUpIcon sx={{ color: 'limegreen' }} />
      case 't':
        return <ThumbsUpDownIcon sx={{ color: 'lightslategray' }} />
      case 'l':
        return <ThumbDownIcon sx={{ color: 'red' }} />
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
      return (
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
          {/* ここに試合結果の概要 全ゲーム数と勝率 */}
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {result.map((item, index) => (
              <li
                key={index}
                style={{ marginBottom: '0.5em', display: 'flex', alignItems: 'center' }}
              >
                {renderIcon(item.result)}
                {isDisplayTimeInfo && (
                  <span style={{ marginLeft: '0.5em' }}>{`(${item.time})`}</span>
                )}
              </li>
            ))}
          </ul>
        </Box>
      )
    }
    return null
  }

  return <div>{renderResult()}</div>
}

export default DisplayResultOfDate
