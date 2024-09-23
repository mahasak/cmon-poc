import colors from 'colors';
import { redisClient } from "./cache";
import { FemtoLogLevel } from "./types"
export const debug = (label: string, ...data: any[]) => {
  console.log(colors.yellow(`---------- debug: ${label} ----------`))
  data.forEach(item => console.log(colors.yellow(item)))
}

export const log = async (level: FemtoLogLevel, trace_id: string, contents: any) => {
  const log_object = {
    level: level,
    trace_id: trace_id,
    contents: contents
  }
  await redisClient.publish('logger', JSON.stringify(log_object));
}

export const debug_log = async (trace_id: string, contents: any) => {
  await log(FemtoLogLevel.DEBUG, trace_id, contents);
}

export const info_log = async (trace_id: string, contents: any) => {
  await log(FemtoLogLevel.INFO, trace_id, contents);
}

export const warn_log = async (trace_id: string, contents: any) => {
  await log(FemtoLogLevel.WARN, trace_id, contents);
}

export const verbose_log = async (trace_id: string, contents: any) => {
  await log(FemtoLogLevel.VERBOSE, trace_id, contents);
}

export const error_log = async (trace_id: string, contents: any) => {
  await log(FemtoLogLevel.ERROR, trace_id, contents);
}
