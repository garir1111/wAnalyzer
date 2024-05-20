import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

class SystemLogger {
  logDir: string
  private logStream: fs.WriteStream | null = null
  private logFilePath: string | null = null

  constructor() {
    this.logDir = app.isPackaged
      ? path.join(__dirname, '../../../../syslog')
      : path.join(__dirname, '../../syslog')
  }

  // 初期化を行う関数
  public init(): void {
    try {
      // ディレクトリが存在するか確認し、なければ作成する
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true })
      }

      // 現在の日時を取得し、ファイル名を作成する
      const date = new Date()
      const fileName = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.log`

      this.logFilePath = path.join(this.logDir, fileName)

      // WriteStreamを作成
      this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' })

      // デバッグ情報の出力
      console.log('Log file created at:', this.logFilePath)
    } catch (error) {
      console.error('Failed to initialize log:', error)
      throw error // エラーを再スローして上位で処理する
    }
  }

  // 文字列を受け取って書き込む関数
  public write(message: string): void {
    if (!this.logStream) {
      throw new Error('Log file is not initialized. Call initializeLog first.')
    }

    const timestamp = new Date().toISOString()
    this.logStream.write(`[${timestamp}] ${message}\n`)
  }

  // ファイルを閉じる関数
  public close(): void {
    if (this.logStream) {
      this.logStream.end()
      this.logStream = null
      this.logFilePath = null
    }
  }
}

export default SystemLogger
