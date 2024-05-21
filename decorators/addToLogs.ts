import type { SimpleClass } from 'homey'

const FIRST_CHAR = 0
const PARENTHESES = '()'

export default <T extends abstract new (...args: any[]) => SimpleClass>(
    ...logs: string[]
  ) =>
  (target: T, _context: ClassDecoratorContext): T => {
    abstract class LogDecorator extends target {
      public override error(...args: unknown[]): void {
        this.#commonLog('error', ...args)
      }

      public override log(...args: unknown[]): void {
        this.#commonLog('log', ...args)
      }

      #commonLog(logType: 'error' | 'log', ...args: unknown[]): void {
        super[logType](
          ...logs.flatMap((log) => {
            let arg: unknown = log
            if (log in this) {
              arg = this[log as keyof this]
            } else if (log.endsWith(PARENTHESES)) {
              const funcName = log.slice(FIRST_CHAR, -PARENTHESES.length)
              if (
                funcName in this &&
                typeof this[funcName as keyof this] === 'function'
              ) {
                const func = this[funcName as keyof this] as (
                  ...funcArgs: unknown[]
                ) => unknown
                if (!func.length) {
                  arg = func.call(this)
                }
              }
            }
            return [arg, '-']
          }),
          ...args,
        )
      }
    }
    return LogDecorator
  }
