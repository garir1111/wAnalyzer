import { app, dialog } from 'electron'
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

class gameResultDB {
  dbFilePath: string
  // eslint-disable-next-line
  db: any

  constructor() {
    this.dbFilePath = app.isPackaged
      ? path.join(__dirname, '../../../../result.db')
      : path.join(__dirname, '../../result.db')

    // 一つ上の階層にresult.dbファイルが存在しない場合、ファイルを作成する
    if (!fs.existsSync(this.dbFilePath)) {
      dialog.showMessageBoxSync({
        title: 'wlAnalyzer',
        type: 'error',
        message: '読み取り対象のDBが存在しないため、アプリを終了します',
        noLink: true
      })
      // ダイアログを閉じたらアプリを終了させる
      throw new Error()
    }

    this.db = new sqlite3.Database(this.dbFilePath, (err: Error) => {
      if (err) {
        console.error('データベース接続エラー:', err.message)
      } else {
        console.log('データベース接続成功')
      }
    })
  }

  initialCheck(): void {
    this.db.all(`PRAGMA table_info(game_results);`, (err, tableInfo) => {
      if (err) {
        throw new Error('DBの正常チェック中に不明なエラーがありました')
      }

      // テーブルが存在しない場合、処理を中止
      if (tableInfo.length === 0) {
        dialog.showMessageBoxSync({
          title: 'wlAnalyzer',
          type: 'error',
          message: '読み込んだDBが仕様外のため、アプリを終了します',
          noLink: true
        })
        throw new Error('Table game_results does not exist.')
      }

      // 必要なカラムがなければ中止」
      const requiredColumns = ['id', 'day', 'time', 'result']
      for (const column of requiredColumns) {
        const exists = tableInfo.some((col) => col.name === column)
        if (!exists) {
          dialog.showMessageBoxSync({
            title: 'wlAnalyzer',
            type: 'error',
            message: '読み込んだDBが仕様外のため、アプリを終了します',
            noLink: true
          })
          throw new Error(`Column ${column} does not exist in table game_results.`)
        }
      }
      console.log('Database structure is valid.')
    })
  }

  getResult(date: Date): Promise<Array<{ time: string; result: string }> | string> {
    return new Promise((resolve, reject) => {
      // 日付をSQLiteのフォーマットに変換 (YYYY-MM-DD)
      const formattedDate = date.toISOString().split('T')[0]

      // 日付に一致する結果を取得するSQLクエリ
      const sql = `
        SELECT time, result
        FROM game_results
        WHERE day = ?
        ORDER BY id;
      `

      // SQLクエリを実行し、結果を取得
      this.db.all(
        sql,
        [formattedDate],
        (err: Error, rows: Array<{ time: string; result: string }>) => {
          if (err) {
            reject('結果の取得中にエラーが発生しました')
            return
          }

          if (!rows || rows.length === 0) {
            resolve('No Game...')
            return
          }
          resolve(rows)
        }
      )
    })
  }

  close(): void {
    this.db.close((err: Error) => {
      if (err) {
        console.error('データベース閉鎖エラー:', err.message)
      } else {
        console.log('データベース閉鎖成功')
      }
    })
  }
}

export default gameResultDB
