import { ChalkLogger, DEBUG, Level } from '@guanghechen/chalk-logger'
import chalk from 'chalk'

export const logger = new ChalkLogger({
  name: '@radius/cli',
  level: DEBUG,   // the default value is INFO
  date: false,    // the default value is false.
  colorful: true, // the default value is true.
}, process.argv)


logger.formatHeader = function (_level: Level): string {
  let { name } = this
  const header = `${chalk.bgWhite.hex('#d44527').bold(` ${name} `)}`
  return `${header}`
}