type LogMeta = unknown;

const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;

function format(scope: string, message: string) {
  return `[${scope}] ${message}`;
}

export const logger = {
  debug(scope: string, message: string, meta?: LogMeta) {
    if (!isDev) return;
    if (meta !== undefined) {
      console.debug(format(scope, message), meta);
      return;
    }
    console.debug(format(scope, message));
  },

  info(scope: string, message: string, meta?: LogMeta) {
    if (!isDev) return;
    if (meta !== undefined) {
      console.info(format(scope, message), meta);
      return;
    }
    console.info(format(scope, message));
  },

  warn(scope: string, message: string, meta?: LogMeta) {
    if (meta !== undefined) {
      console.warn(format(scope, message), meta);
      return;
    }
    console.warn(format(scope, message));
  },

  error(scope: string, message: string, meta?: LogMeta) {
    if (meta !== undefined) {
      console.error(format(scope, message), meta);
      return;
    }
    console.error(format(scope, message));
  },
};
