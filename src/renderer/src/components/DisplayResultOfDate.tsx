import { useEffect, useState } from 'react'
const { ipcRenderer } = window.electron

interface DisplayResultOfDateProps {
  targetDate: Date
}

const DisplayResultOfDate = ({ targetDate }: DisplayResultOfDateProps): JSX.Element => {
  const [result, setResult] = useState<Array<{ time: string; result: string }> | string | null>(
    null
  )

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

  const renderResult = (): JSX.Element | null => {
    if (result === null) {
      return <p>Loading...</p>
    }
    if (typeof result === 'string') {
      return <p>{result}</p>
    }
    if (Array.isArray(result)) {
      return (
        <ul>
          {result.map((item, index) => (
            <li key={index}>{`${item.result}(${item.time})`}</li>
          ))}
        </ul>
      )
    }
    return null
  }

  // 取得した結果を表示する
  return <div>{renderResult()}</div>
}

export default DisplayResultOfDate
