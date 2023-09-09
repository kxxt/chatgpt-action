exports.id = 679;
exports.ids = [679];
exports.modules = {

/***/ 8815:
/***/ ((module) => {

"use strict";


module.exports = function union(init) {
  if (!Array.isArray(init)) {
    throw new TypeError('arr-union expects the first argument to be an array.');
  }

  var len = arguments.length;
  var i = 0;

  while (++i < len) {
    var arg = arguments[i];
    if (!arg) continue;

    if (!Array.isArray(arg)) {
      arg = [arg];
    }

    for (var j = 0; j < arg.length; j++) {
      var ele = arg[j];

      if (init.indexOf(ele) >= 0) {
        continue;
      }
      init.push(ele);
    }
  }
  return init;
};


/***/ }),

/***/ 4679:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ChatGPTAPI": () => (/* binding */ ChatGPTAPI),
  "ChatGPTAPIBrowser": () => (/* binding */ ChatGPTAPIBrowser),
  "ChatGPTConversation": () => (/* binding */ ChatGPTConversation),
  "ChatGPTError": () => (/* binding */ ChatGPTError),
  "browserPostEventStream": () => (/* binding */ browserPostEventStream),
  "defaultChromeExecutablePath": () => (/* binding */ defaultChromeExecutablePath),
  "getBrowser": () => (/* binding */ getBrowser),
  "getOpenAIAuth": () => (/* binding */ getOpenAIAuth),
  "isRelevantRequest": () => (/* binding */ isRelevantRequest),
  "markdownToText": () => (/* binding */ markdownToText),
  "maximizePage": () => (/* binding */ maximizePage),
  "minimizePage": () => (/* binding */ minimizePage)
});

// NAMESPACE OBJECT: ./node_modules/micromark/lib/constructs.js
var constructs_namespaceObject = {};
__webpack_require__.r(constructs_namespaceObject);
__webpack_require__.d(constructs_namespaceObject, {
  "attentionMarkers": () => (attentionMarkers),
  "contentInitial": () => (contentInitial),
  "disable": () => (disable),
  "document": () => (constructs_document),
  "flow": () => (constructs_flow),
  "flowInitial": () => (flowInitial),
  "insideSpan": () => (insideSpan),
  "string": () => (constructs_string),
  "text": () => (constructs_text)
});

// EXTERNAL MODULE: ./node_modules/expiry-map/dist/index.js
var dist = __webpack_require__(1027);
;// CONCATENATED MODULE: ./node_modules/p-timeout/index.js
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;

	const wrappedPromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	});

	const cancelablePromise = wrappedPromise.finally(() => {
		cancelablePromise.clear();
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}

// EXTERNAL MODULE: ./node_modules/chatgpt/node_modules/uuid/dist/index.js
var uuid_dist = __webpack_require__(6201);
;// CONCATENATED MODULE: ./node_modules/chatgpt/node_modules/uuid/wrapper.mjs

const v1 = uuid_dist.v1;
const v3 = uuid_dist.v3;
const v4 = uuid_dist.v4;
const v5 = uuid_dist.v5;
const NIL = uuid_dist/* NIL */.zR;
const version = uuid_dist/* version */.i8;
const validate = uuid_dist/* validate */.Gu;
const stringify = uuid_dist/* stringify */.Pz;
const parse = uuid_dist/* parse */.Qc;

;// CONCATENATED MODULE: ./node_modules/eventsource-parser/dist/index.mjs
function createParser(onParse) {
  let isFirstChunk;
  let buffer;
  let startingPosition;
  let startingFieldLength;
  let eventId;
  let eventName;
  let data;
  reset();
  return {
    feed,
    reset
  };

  function reset() {
    isFirstChunk = true;
    buffer = "";
    startingPosition = 0;
    startingFieldLength = -1;
    eventId = void 0;
    eventName = void 0;
    data = "";
  }

  function feed(chunk) {
    buffer = buffer ? buffer + chunk : chunk;

    if (isFirstChunk && hasBom(buffer)) {
      buffer = buffer.slice(BOM.length);
    }

    isFirstChunk = false;
    const length = buffer.length;
    let position = 0;
    let discardTrailingNewline = false;

    while (position < length) {
      if (discardTrailingNewline) {
        if (buffer[position] === "\n") {
          ++position;
        }

        discardTrailingNewline = false;
      }

      let lineLength = -1;
      let fieldLength = startingFieldLength;
      let character;

      for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
        character = buffer[index];

        if (character === ":" && fieldLength < 0) {
          fieldLength = index - position;
        } else if (character === "\r") {
          discardTrailingNewline = true;
          lineLength = index - position;
        } else if (character === "\n") {
          lineLength = index - position;
        }
      }

      if (lineLength < 0) {
        startingPosition = length - position;
        startingFieldLength = fieldLength;
        break;
      } else {
        startingPosition = 0;
        startingFieldLength = -1;
      }

      parseEventStreamLine(buffer, position, fieldLength, lineLength);
      position += lineLength + 1;
    }

    if (position === length) {
      buffer = "";
    } else if (position > 0) {
      buffer = buffer.slice(position);
    }
  }

  function parseEventStreamLine(lineBuffer, index, fieldLength, lineLength) {
    if (lineLength === 0) {
      if (data.length > 0) {
        onParse({
          type: "event",
          id: eventId,
          event: eventName || void 0,
          data: data.slice(0, -1)
        });
        data = "";
        eventId = void 0;
      }

      eventName = void 0;
      return;
    }

    const noValue = fieldLength < 0;
    const field = lineBuffer.slice(index, index + (noValue ? lineLength : fieldLength));
    let step = 0;

    if (noValue) {
      step = lineLength;
    } else if (lineBuffer[index + fieldLength + 1] === " ") {
      step = fieldLength + 2;
    } else {
      step = fieldLength + 1;
    }

    const position = index + step;
    const valueLength = lineLength - step;
    const value = lineBuffer.slice(position, position + valueLength).toString();

    if (field === "data") {
      data += value ? "".concat(value, "\n") : "\n";
    } else if (field === "event") {
      eventName = value;
    } else if (field === "id" && !value.includes("\0")) {
      eventId = value;
    } else if (field === "retry") {
      const retry = parseInt(value, 10);

      if (!Number.isNaN(retry)) {
        onParse({
          type: "reconnect-interval",
          value: retry
        });
      }
    }
  }
}

const BOM = [239, 187, 191];

function hasBom(buffer) {
  return BOM.every((charCode, index) => buffer.charCodeAt(index) === charCode);
}


//# sourceMappingURL=index.mjs.map

;// CONCATENATED MODULE: ./node_modules/bail/index.js
/**
 * Throw a given error.
 *
 * @param {Error|null|undefined} [error]
 *   Maybe error.
 * @returns {asserts error is null|undefined}
 */
function bail(error) {
  if (error) {
    throw error
  }
}

// EXTERNAL MODULE: ./node_modules/unified/node_modules/is-buffer/index.js
var is_buffer = __webpack_require__(8810);
// EXTERNAL MODULE: ./node_modules/extend/index.js
var extend = __webpack_require__(8171);
;// CONCATENATED MODULE: ./node_modules/is-plain-obj/index.js
function isPlainObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

;// CONCATENATED MODULE: ./node_modules/trough/index.js
/**
 * @typedef {(error?: Error|null|undefined, ...output: Array<any>) => void} Callback
 * @typedef {(...input: Array<any>) => any} Middleware
 *
 * @typedef {(...input: Array<any>) => void} Run
 *   Call all middleware.
 * @typedef {(fn: Middleware) => Pipeline} Use
 *   Add `fn` (middleware) to the list.
 * @typedef {{run: Run, use: Use}} Pipeline
 *   Middleware.
 */

/**
 * Create new middleware.
 *
 * @returns {Pipeline}
 */
function trough() {
  /** @type {Array<Middleware>} */
  const fns = []
  /** @type {Pipeline} */
  const pipeline = {run, use}

  return pipeline

  /** @type {Run} */
  function run(...values) {
    let middlewareIndex = -1
    /** @type {Callback} */
    const callback = values.pop()

    if (typeof callback !== 'function') {
      throw new TypeError('Expected function as last argument, not ' + callback)
    }

    next(null, ...values)

    /**
     * Run the next `fn`, or we’re done.
     *
     * @param {Error|null|undefined} error
     * @param {Array<any>} output
     */
    function next(error, ...output) {
      const fn = fns[++middlewareIndex]
      let index = -1

      if (error) {
        callback(error)
        return
      }

      // Copy non-nullish input into values.
      while (++index < values.length) {
        if (output[index] === null || output[index] === undefined) {
          output[index] = values[index]
        }
      }

      // Save the newly created `output` for the next call.
      values = output

      // Next or done.
      if (fn) {
        wrap(fn, next)(...output)
      } else {
        callback(null, ...output)
      }
    }
  }

  /** @type {Use} */
  function use(middelware) {
    if (typeof middelware !== 'function') {
      throw new TypeError(
        'Expected `middelware` to be a function, not ' + middelware
      )
    }

    fns.push(middelware)
    return pipeline
  }
}

/**
 * Wrap `middleware`.
 * Can be sync or async; return a promise, receive a callback, or return new
 * values and errors.
 *
 * @param {Middleware} middleware
 * @param {Callback} callback
 */
function wrap(middleware, callback) {
  /** @type {boolean} */
  let called

  return wrapped

  /**
   * Call `middleware`.
   * @this {any}
   * @param {Array<any>} parameters
   * @returns {void}
   */
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length
    /** @type {any} */
    let result

    if (fnExpectsCallback) {
      parameters.push(done)
    }

    try {
      result = middleware.apply(this, parameters)
    } catch (error) {
      const exception = /** @type {Error} */ (error)

      // Well, this is quite the pickle.
      // `middleware` received a callback and called it synchronously, but that
      // threw an error.
      // The only thing left to do is to throw the thing instead.
      if (fnExpectsCallback && called) {
        throw exception
      }

      return done(exception)
    }

    if (!fnExpectsCallback) {
      if (result instanceof Promise) {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  /**
   * Call `callback`, only once.
   * @type {Callback}
   */
  function done(error, ...output) {
    if (!called) {
      called = true
      callback(error, ...output)
    }
  }

  /**
   * Call `done` with one value.
   *
   * @param {any} [value]
   */
  function then(value) {
    done(null, value)
  }
}

// EXTERNAL MODULE: ./node_modules/vfile/node_modules/is-buffer/index.js
var node_modules_is_buffer = __webpack_require__(2157);
;// CONCATENATED MODULE: ./node_modules/unist-util-stringify-position/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Point} Point
 * @typedef {import('unist').Position} Position
 */

/**
 * @typedef NodeLike
 * @property {string} type
 * @property {PositionLike | null | undefined} [position]
 *
 * @typedef PositionLike
 * @property {PointLike | null | undefined} [start]
 * @property {PointLike | null | undefined} [end]
 *
 * @typedef PointLike
 * @property {number | null | undefined} [line]
 * @property {number | null | undefined} [column]
 * @property {number | null | undefined} [offset]
 */

/**
 * Serialize the positional info of a point, position (start and end points),
 * or node.
 *
 * @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
 *   Node, position, or point.
 * @returns {string}
 *   Pretty printed positional info of a node (`string`).
 *
 *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
 *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
 *   column, `s` for `start`, and `e` for end.
 *   An empty string (`''`) is returned if the given value is neither `node`,
 *   `position`, nor `point`.
 */
function stringifyPosition(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if ('position' in value || 'type' in value) {
    return position(value.position)
  }

  // Position.
  if ('start' in value || 'end' in value) {
    return position(value)
  }

  // Point.
  if ('line' in value || 'column' in value) {
    return point(value)
  }

  // ?
  return ''
}

/**
 * @param {Point | PointLike | null | undefined} point
 * @returns {string}
 */
function point(point) {
  return index(point && point.line) + ':' + index(point && point.column)
}

/**
 * @param {Position | PositionLike | null | undefined} pos
 * @returns {string}
 */
function position(pos) {
  return point(pos && pos.start) + '-' + point(pos && pos.end)
}

/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
function index(value) {
  return value && typeof value === 'number' ? value : 1
}

;// CONCATENATED MODULE: ./node_modules/vfile-message/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 * @typedef {object & {type: string, position?: Position | undefined}} NodeLike
 */



/**
 * Message.
 */
class VFileMessage extends Error {
  /**
   * Create a message for `reason` at `place` from `origin`.
   *
   * When an error is passed in as `reason`, the `stack` is copied.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   *
   *   > 👉 **Note**: you should use markdown.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // To do: next major: expose `undefined` everywhere instead of `null`.
  constructor(reason, place, origin) {
    /** @type {[string | null, string | null]} */
    const parts = [null, null]
    /** @type {Position} */
    let position = {
      // @ts-expect-error: we always follows the structure of `position`.
      start: {line: null, column: null},
      // @ts-expect-error: "
      end: {line: null, column: null}
    }

    super()

    if (typeof place === 'string') {
      origin = place
      place = undefined
    }

    if (typeof origin === 'string') {
      const index = origin.indexOf(':')

      if (index === -1) {
        parts[1] = origin
      } else {
        parts[0] = origin.slice(0, index)
        parts[1] = origin.slice(index + 1)
      }
    }

    if (place) {
      // Node.
      if ('type' in place || 'position' in place) {
        if (place.position) {
          // To do: next major: deep clone.
          // @ts-expect-error: looks like a position.
          position = place.position
        }
      }
      // Position.
      else if ('start' in place || 'end' in place) {
        // @ts-expect-error: looks like a position.
        // To do: next major: deep clone.
        position = place
      }
      // Point.
      else if ('line' in place || 'column' in place) {
        // To do: next major: deep clone.
        position.start = place
      }
    }

    // Fields from `Error`.
    /**
     * Serialized positional info of error.
     *
     * On normal errors, this would be something like `ParseError`, buit in
     * `VFile` messages we use this space to show where an error happened.
     */
    this.name = stringifyPosition(place) || '1:1'

    /**
     * Reason for message.
     *
     * @type {string}
     */
    this.message = typeof reason === 'object' ? reason.message : reason

    /**
     * Stack of message.
     *
     * This is used by normal errors to show where something happened in
     * programming code, irrelevant for `VFile` messages,
     *
     * @type {string}
     */
    this.stack = ''

    if (typeof reason === 'object' && reason.stack) {
      this.stack = reason.stack
    }

    /**
     * Reason for message.
     *
     * > 👉 **Note**: you should use markdown.
     *
     * @type {string}
     */
    this.reason = this.message

    /* eslint-disable no-unused-expressions */
    /**
     * State of problem.
     *
     * * `true` — marks associated file as no longer processable (error)
     * * `false` — necessitates a (potential) change (warning)
     * * `null | undefined` — for things that might not need changing (info)
     *
     * @type {boolean | null | undefined}
     */
    this.fatal

    /**
     * Starting line of error.
     *
     * @type {number | null}
     */
    this.line = position.start.line

    /**
     * Starting column of error.
     *
     * @type {number | null}
     */
    this.column = position.start.column

    /**
     * Full unist position.
     *
     * @type {Position | null}
     */
    this.position = position

    /**
     * Namespace of message (example: `'my-package'`).
     *
     * @type {string | null}
     */
    this.source = parts[0]

    /**
     * Category of message (example: `'my-rule'`).
     *
     * @type {string | null}
     */
    this.ruleId = parts[1]

    /**
     * Path of a file (used throughout the `VFile` ecosystem).
     *
     * @type {string | null}
     */
    this.file

    // The following fields are “well known”.
    // Not standard.
    // Feel free to add other non-standard fields to your messages.

    /**
     * Specify the source value that’s being reported, which is deemed
     * incorrect.
     *
     * @type {string | null}
     */
    this.actual

    /**
     * Suggest acceptable values that can be used instead of `actual`.
     *
     * @type {Array<string> | null}
     */
    this.expected

    /**
     * Link to docs for the message.
     *
     * > 👉 **Note**: this must be an absolute URL that can be passed as `x`
     * > to `new URL(x)`.
     *
     * @type {string | null}
     */
    this.url

    /**
     * Long form description of the message (you should use markdown).
     *
     * @type {string | null}
     */
    this.note
    /* eslint-enable no-unused-expressions */
  }
}

VFileMessage.prototype.file = ''
VFileMessage.prototype.name = ''
VFileMessage.prototype.reason = ''
VFileMessage.prototype.message = ''
VFileMessage.prototype.stack = ''
VFileMessage.prototype.fatal = null
VFileMessage.prototype.column = null
VFileMessage.prototype.line = null
VFileMessage.prototype.source = null
VFileMessage.prototype.ruleId = null
VFileMessage.prototype.position = null

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(5622);
// EXTERNAL MODULE: external "process"
var external_process_ = __webpack_require__(1765);
;// CONCATENATED MODULE: ./node_modules/vfile/lib/minurl.shared.js
/**
 * @typedef URL
 * @property {string} hash
 * @property {string} host
 * @property {string} hostname
 * @property {string} href
 * @property {string} origin
 * @property {string} password
 * @property {string} pathname
 * @property {string} port
 * @property {string} protocol
 * @property {string} search
 * @property {any} searchParams
 * @property {string} username
 * @property {() => string} toString
 * @property {() => string} toJSON
 */

/**
 * Check if `fileUrlOrPath` looks like a URL.
 *
 * @param {unknown} fileUrlOrPath
 *   File path or URL.
 * @returns {fileUrlOrPath is URL}
 *   Whether it’s a URL.
 */
// From: <https://github.com/nodejs/node/blob/fcf8ba4/lib/internal/url.js#L1501>
function isUrl(fileUrlOrPath) {
  return (
    fileUrlOrPath !== null &&
    typeof fileUrlOrPath === 'object' &&
    // @ts-expect-error: indexable.
    fileUrlOrPath.href &&
    // @ts-expect-error: indexable.
    fileUrlOrPath.origin
  )
}

// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(8835);
;// CONCATENATED MODULE: ./node_modules/vfile/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Position} Position
 * @typedef {import('unist').Point} Point
 * @typedef {import('./minurl.shared.js').URL} URL
 * @typedef {import('../index.js').Data} Data
 * @typedef {import('../index.js').Value} Value
 */

/**
 * @typedef {Record<string, unknown> & {type: string, position?: Position | undefined}} NodeLike
 *
 * @typedef {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} BufferEncoding
 *   Encodings supported by the buffer class.
 *
 *   This is a copy of the types from Node, copied to prevent Node globals from
 *   being needed.
 *   Copied from: <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/90a4ec8/types/node/buffer.d.ts#L170>
 *
 * @typedef {Options | URL | Value | VFile} Compatible
 *   Things that can be passed to the constructor.
 *
 * @typedef VFileCoreOptions
 *   Set multiple values.
 * @property {Value | null | undefined} [value]
 *   Set `value`.
 * @property {string | null | undefined} [cwd]
 *   Set `cwd`.
 * @property {Array<string> | null | undefined} [history]
 *   Set `history`.
 * @property {URL | string | null | undefined} [path]
 *   Set `path`.
 * @property {string | null | undefined} [basename]
 *   Set `basename`.
 * @property {string | null | undefined} [stem]
 *   Set `stem`.
 * @property {string | null | undefined} [extname]
 *   Set `extname`.
 * @property {string | null | undefined} [dirname]
 *   Set `dirname`.
 * @property {Data | null | undefined} [data]
 *   Set `data`.
 *
 * @typedef Map
 *   Raw source map.
 *
 *   See:
 *   <https://github.com/mozilla/source-map/blob/58819f0/source-map.d.ts#L15-L23>.
 * @property {number} version
 *   Which version of the source map spec this map is following.
 * @property {Array<string>} sources
 *   An array of URLs to the original source files.
 * @property {Array<string>} names
 *   An array of identifiers which can be referenced by individual mappings.
 * @property {string | undefined} [sourceRoot]
 *   The URL root from which all sources are relative.
 * @property {Array<string> | undefined} [sourcesContent]
 *   An array of contents of the original source files.
 * @property {string} mappings
 *   A string of base64 VLQs which contain the actual mappings.
 * @property {string} file
 *   The generated file this source map is associated with.
 *
 * @typedef {{[key: string]: unknown} & VFileCoreOptions} Options
 *   Configuration.
 *
 *   A bunch of keys that will be shallow copied over to the new file.
 *
 * @typedef {Record<string, unknown>} ReporterSettings
 *   Configuration for reporters.
 */

/**
 * @template {ReporterSettings} Settings
 *   Options type.
 * @callback Reporter
 *   Type for a reporter.
 * @param {Array<VFile>} files
 *   Files to report.
 * @param {Settings} options
 *   Configuration.
 * @returns {string}
 *   Report.
 */







/**
 * Order of setting (least specific to most), we need this because otherwise
 * `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
 * stem can be set.
 *
 * @type {Array<'basename' | 'dirname' | 'extname' | 'history' | 'path' | 'stem'>}
 */
const order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname']

class VFile {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Buffer` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    /** @type {Options | VFile} */
    let options

    if (!value) {
      options = {}
    } else if (typeof value === 'string' || buffer(value)) {
      options = {value}
    } else if (isUrl(value)) {
      options = {path: value}
    } else {
      options = value
    }

    /**
     * Place to store custom information (default: `{}`).
     *
     * It’s OK to store custom data directly on the file but moving it to
     * `data` is recommended.
     *
     * @type {Data}
     */
    this.data = {}

    /**
     * List of messages associated with the file.
     *
     * @type {Array<VFileMessage>}
     */
    this.messages = []

    /**
     * List of filepaths the file moved between.
     *
     * The first is the original path and the last is the current path.
     *
     * @type {Array<string>}
     */
    this.history = []

    /**
     * Base of `path` (default: `process.cwd()` or `'/'` in browsers).
     *
     * @type {string}
     */
    this.cwd = external_process_.cwd()

    /* eslint-disable no-unused-expressions */
    /**
     * Raw value.
     *
     * @type {Value}
     */
    this.value

    // The below are non-standard, they are “well-known”.
    // As in, used in several tools.

    /**
     * Whether a file was saved to disk.
     *
     * This is used by vfile reporters.
     *
     * @type {boolean}
     */
    this.stored

    /**
     * Custom, non-string, compiled, representation.
     *
     * This is used by unified to store non-string results.
     * One example is when turning markdown into React nodes.
     *
     * @type {unknown}
     */
    this.result

    /**
     * Source map.
     *
     * This type is equivalent to the `RawSourceMap` type from the `source-map`
     * module.
     *
     * @type {Map | null | undefined}
     */
    this.map
    /* eslint-enable no-unused-expressions */

    // Set path related properties in the correct order.
    let index = -1

    while (++index < order.length) {
      const prop = order[index]

      // Note: we specifically use `in` instead of `hasOwnProperty` to accept
      // `vfile`s too.
      if (
        prop in options &&
        options[prop] !== undefined &&
        options[prop] !== null
      ) {
        // @ts-expect-error: TS doesn’t understand basic reality.
        this[prop] = prop === 'history' ? [...options[prop]] : options[prop]
      }
    }

    /** @type {string} */
    let prop

    // Set non-path related properties.
    for (prop in options) {
      // @ts-expect-error: fine to set other things.
      if (!order.includes(prop)) {
        // @ts-expect-error: fine to set other things.
        this[prop] = options[prop]
      }
    }
  }

  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   */
  get path() {
    return this.history[this.history.length - 1]
  }

  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {string | URL} path
   */
  set path(path) {
    if (isUrl(path)) {
      path = (0,external_url_.fileURLToPath)(path)
    }

    assertNonEmpty(path, 'path')

    if (this.path !== path) {
      this.history.push(path)
    }
  }

  /**
   * Get the parent path (example: `'~'`).
   */
  get dirname() {
    return typeof this.path === 'string' ? external_path_.dirname(this.path) : undefined
  }

  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   */
  set dirname(dirname) {
    assertPath(this.basename, 'dirname')
    this.path = external_path_.join(dirname || '', this.basename)
  }

  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   */
  get basename() {
    return typeof this.path === 'string' ? external_path_.basename(this.path) : undefined
  }

  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set basename(basename) {
    assertNonEmpty(basename, 'basename')
    assertPart(basename, 'basename')
    this.path = external_path_.join(this.dirname || '', basename)
  }

  /**
   * Get the extname (including dot) (example: `'.js'`).
   */
  get extname() {
    return typeof this.path === 'string' ? external_path_.extname(this.path) : undefined
  }

  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   */
  set extname(extname) {
    assertPart(extname, 'extname')
    assertPath(this.dirname, 'extname')

    if (extname) {
      if (extname.charCodeAt(0) !== 46 /* `.` */) {
        throw new Error('`extname` must start with `.`')
      }

      if (extname.includes('.', 1)) {
        throw new Error('`extname` cannot contain multiple dots')
      }
    }

    this.path = external_path_.join(this.dirname, this.stem + (extname || ''))
  }

  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   */
  get stem() {
    return typeof this.path === 'string'
      ? external_path_.basename(this.path, this.extname)
      : undefined
  }

  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set stem(stem) {
    assertNonEmpty(stem, 'stem')
    assertPart(stem, 'stem')
    this.path = external_path_.join(this.dirname || '', stem + (this.extname || ''))
  }

  /**
   * Serialize the file.
   *
   * @param {BufferEncoding | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Buffer`
   *   (default: `'utf8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    return (this.value || '').toString(encoding || undefined)
  }

  /**
   * Create a warning message associated with the file.
   *
   * Its `fatal` is set to `false` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(reason, place, origin) {
    const message = new VFileMessage(reason, place, origin)

    if (this.path) {
      message.name = this.path + ':' + message.name
      message.file = this.path
    }

    message.fatal = false

    this.messages.push(message)

    return message
  }

  /**
   * Create an info message associated with the file.
   *
   * Its `fatal` is set to `null` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(reason, place, origin) {
    const message = this.message(reason, place, origin)

    message.fatal = null

    return message
  }

  /**
   * Create a fatal error associated with the file.
   *
   * Its `fatal` is set to `true` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * > 👉 **Note**: a fatal error means that a file is no longer processable.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Message.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(reason, place, origin) {
    const message = this.message(reason, place, origin)

    message.fatal = true

    throw message
  }
}

/**
 * Assert that `part` is not a path (as in, does not contain `path.sep`).
 *
 * @param {string | null | undefined} part
 *   File path part.
 * @param {string} name
 *   Part name.
 * @returns {void}
 *   Nothing.
 */
function assertPart(part, name) {
  if (part && part.includes(external_path_.sep)) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + external_path_.sep + '`'
    )
  }
}

/**
 * Assert that `part` is not empty.
 *
 * @param {string | undefined} part
 *   Thing.
 * @param {string} name
 *   Part name.
 * @returns {asserts part is string}
 *   Nothing.
 */
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

/**
 * Assert `path` exists.
 *
 * @param {string | undefined} path
 *   Path.
 * @param {string} name
 *   Dependency name.
 * @returns {asserts path is string}
 *   Nothing.
 */
function assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}

/**
 * Assert `value` is a buffer.
 *
 * @param {unknown} value
 *   thing.
 * @returns {value is Buffer}
 *   Whether `value` is a Node.js buffer.
 */
function buffer(value) {
  return node_modules_is_buffer(value)
}

;// CONCATENATED MODULE: ./node_modules/unified/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFileCompatible} VFileCompatible
 * @typedef {import('vfile').VFileValue} VFileValue
 * @typedef {import('..').Processor} Processor
 * @typedef {import('..').Plugin} Plugin
 * @typedef {import('..').Preset} Preset
 * @typedef {import('..').Pluggable} Pluggable
 * @typedef {import('..').PluggableList} PluggableList
 * @typedef {import('..').Transformer} Transformer
 * @typedef {import('..').Parser} Parser
 * @typedef {import('..').Compiler} Compiler
 * @typedef {import('..').RunCallback} RunCallback
 * @typedef {import('..').ProcessCallback} ProcessCallback
 *
 * @typedef Context
 * @property {Node} tree
 * @property {VFile} file
 */








// Expose a frozen processor.
const unified = base().freeze()

const own = {}.hasOwnProperty

// Function to create the first processor.
/**
 * @returns {Processor}
 */
function base() {
  const transformers = trough()
  /** @type {Processor['attachers']} */
  const attachers = []
  /** @type {Record<string, unknown>} */
  let namespace = {}
  /** @type {boolean|undefined} */
  let frozen
  let freezeIndex = -1

  // Data management.
  // @ts-expect-error: overloads are handled.
  processor.data = data
  processor.Parser = undefined
  processor.Compiler = undefined

  // Lock.
  processor.freeze = freeze

  // Plugins.
  processor.attachers = attachers
  // @ts-expect-error: overloads are handled.
  processor.use = use

  // API.
  processor.parse = parse
  processor.stringify = stringify
  // @ts-expect-error: overloads are handled.
  processor.run = run
  processor.runSync = runSync
  // @ts-expect-error: overloads are handled.
  processor.process = process
  processor.processSync = processSync

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  /** @type {Processor} */
  function processor() {
    const destination = base()
    let index = -1

    while (++index < attachers.length) {
      destination.use(...attachers[index])
    }

    destination.data(extend(true, {}, namespace))

    return destination
  }

  /**
   * @param {string|Record<string, unknown>} [key]
   * @param {unknown} [value]
   * @returns {unknown}
   */
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen)
        namespace[key] = value
        return processor
      }

      // Get `key`.
      return (own.call(namespace, key) && namespace[key]) || null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen)
      namespace = key
      return processor
    }

    // Get space.
    return namespace
  }

  /** @type {Processor['freeze']} */
  function freeze() {
    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      const [attacher, ...options] = attachers[freezeIndex]

      if (options[0] === false) {
        continue
      }

      if (options[0] === true) {
        options[0] = undefined
      }

      /** @type {Transformer|void} */
      const transformer = attacher.call(processor, ...options)

      if (typeof transformer === 'function') {
        transformers.use(transformer)
      }
    }

    frozen = true
    freezeIndex = Number.POSITIVE_INFINITY

    return processor
  }

  /**
   * @param {Pluggable|null|undefined} [value]
   * @param {...unknown} options
   * @returns {Processor}
   */
  function use(value, ...options) {
    /** @type {Record<string, unknown>|undefined} */
    let settings

    assertUnfrozen('use', frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin(value, ...options)
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new TypeError('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = Object.assign(namespace.settings || {}, settings)
    }

    return processor

    /**
     * @param {import('..').Pluggable<unknown[]>} value
     * @returns {void}
     */
    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value)
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          const [plugin, ...options] = value
          addPlugin(plugin, ...options)
        } else {
          addPreset(value)
        }
      } else {
        throw new TypeError('Expected usable value, not `' + value + '`')
      }
    }

    /**
     * @param {Preset} result
     * @returns {void}
     */
    function addPreset(result) {
      addList(result.plugins)

      if (result.settings) {
        settings = Object.assign(settings || {}, result.settings)
      }
    }

    /**
     * @param {PluggableList|null|undefined} [plugins]
     * @returns {void}
     */
    function addList(plugins) {
      let index = -1

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (Array.isArray(plugins)) {
        while (++index < plugins.length) {
          const thing = plugins[index]
          add(thing)
        }
      } else {
        throw new TypeError('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    /**
     * @param {Plugin} plugin
     * @param {...unknown} [value]
     * @returns {void}
     */
    function addPlugin(plugin, value) {
      let index = -1
      /** @type {Processor['attachers'][number]|undefined} */
      let entry

      while (++index < attachers.length) {
        if (attachers[index][0] === plugin) {
          entry = attachers[index]
          break
        }
      }

      if (entry) {
        if (isPlainObject(entry[1]) && isPlainObject(value)) {
          value = extend(true, entry[1], value)
        }

        entry[1] = value
      } else {
        // @ts-expect-error: fine.
        attachers.push([...arguments])
      }
    }
  }

  /** @type {Processor['parse']} */
  function parse(doc) {
    processor.freeze()
    const file = vfile(doc)
    const Parser = processor.Parser
    assertParser('parse', Parser)

    if (newable(Parser, 'parse')) {
      // @ts-expect-error: `newable` checks this.
      return new Parser(String(file), file).parse()
    }

    // @ts-expect-error: `newable` checks this.
    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  /** @type {Processor['stringify']} */
  function stringify(node, doc) {
    processor.freeze()
    const file = vfile(doc)
    const Compiler = processor.Compiler
    assertCompiler('stringify', Compiler)
    assertNode(node)

    if (newable(Compiler, 'compile')) {
      // @ts-expect-error: `newable` checks this.
      return new Compiler(node, file).compile()
    }

    // @ts-expect-error: `newable` checks this.
    return Compiler(node, file) // eslint-disable-line new-cap
  }

  /**
   * @param {Node} node
   * @param {VFileCompatible|RunCallback} [doc]
   * @param {RunCallback} [callback]
   * @returns {Promise<Node>|void}
   */
  function run(node, doc, callback) {
    assertNode(node)
    processor.freeze()

    if (!callback && typeof doc === 'function') {
      callback = doc
      doc = undefined
    }

    if (!callback) {
      return new Promise(executor)
    }

    executor(null, callback)

    /**
     * @param {null|((node: Node) => void)} resolve
     * @param {(error: Error) => void} reject
     * @returns {void}
     */
    function executor(resolve, reject) {
      // @ts-expect-error: `doc` can’t be a callback anymore, we checked.
      transformers.run(node, vfile(doc), done)

      /**
       * @param {Error|null} error
       * @param {Node} tree
       * @param {VFile} file
       * @returns {void}
       */
      function done(error, tree, file) {
        tree = tree || node
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(tree)
        } else {
          // @ts-expect-error: `callback` is defined if `resolve` is not.
          callback(null, tree, file)
        }
      }
    }
  }

  /** @type {Processor['runSync']} */
  function runSync(node, file) {
    /** @type {Node|undefined} */
    let result
    /** @type {boolean|undefined} */
    let complete

    processor.run(node, file, done)

    assertDone('runSync', 'run', complete)

    // @ts-expect-error: we either bailed on an error or have a tree.
    return result

    /**
     * @param {Error|null} [error]
     * @param {Node} [tree]
     * @returns {void}
     */
    function done(error, tree) {
      bail(error)
      result = tree
      complete = true
    }
  }

  /**
   * @param {VFileCompatible} doc
   * @param {ProcessCallback} [callback]
   * @returns {Promise<VFile>|undefined}
   */
  function process(doc, callback) {
    processor.freeze()
    assertParser('process', processor.Parser)
    assertCompiler('process', processor.Compiler)

    if (!callback) {
      return new Promise(executor)
    }

    executor(null, callback)

    /**
     * @param {null|((file: VFile) => void)} resolve
     * @param {(error?: Error|null|undefined) => void} reject
     * @returns {void}
     */
    function executor(resolve, reject) {
      const file = vfile(doc)

      processor.run(processor.parse(file), file, (error, tree, file) => {
        if (error || !tree || !file) {
          done(error)
        } else {
          /** @type {unknown} */
          const result = processor.stringify(tree, file)

          if (result === undefined || result === null) {
            // Empty.
          } else if (looksLikeAVFileValue(result)) {
            file.value = result
          } else {
            file.result = result
          }

          done(error, file)
        }
      })

      /**
       * @param {Error|null|undefined} [error]
       * @param {VFile|undefined} [file]
       * @returns {void}
       */
      function done(error, file) {
        if (error || !file) {
          reject(error)
        } else if (resolve) {
          resolve(file)
        } else {
          // @ts-expect-error: `callback` is defined if `resolve` is not.
          callback(null, file)
        }
      }
    }
  }

  /** @type {Processor['processSync']} */
  function processSync(doc) {
    /** @type {boolean|undefined} */
    let complete

    processor.freeze()
    assertParser('processSync', processor.Parser)
    assertCompiler('processSync', processor.Compiler)

    const file = vfile(doc)

    processor.process(file, done)

    assertDone('processSync', 'process', complete)

    return file

    /**
     * @param {Error|null|undefined} [error]
     * @returns {void}
     */
    function done(error) {
      complete = true
      bail(error)
    }
  }
}

/**
 * Check if `value` is a constructor.
 *
 * @param {unknown} value
 * @param {string} name
 * @returns {boolean}
 */
function newable(value, name) {
  return (
    typeof value === 'function' &&
    // Prototypes do exist.
    // type-coverage:ignore-next-line
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    // type-coverage:ignore-next-line
    (keys(value.prototype) || name in value.prototype)
  )
}

/**
 * Check if `value` is an object with keys.
 *
 * @param {Record<string, unknown>} value
 * @returns {boolean}
 */
function keys(value) {
  /** @type {string} */
  let key

  for (key in value) {
    if (own.call(value, key)) {
      return true
    }
  }

  return false
}

/**
 * Assert a parser is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Parser}
 */
function assertParser(name, value) {
  if (typeof value !== 'function') {
    throw new TypeError('Cannot `' + name + '` without `Parser`')
  }
}

/**
 * Assert a compiler is available.
 *
 * @param {string} name
 * @param {unknown} value
 * @returns {asserts value is Compiler}
 */
function assertCompiler(name, value) {
  if (typeof value !== 'function') {
    throw new TypeError('Cannot `' + name + '` without `Compiler`')
  }
}

/**
 * Assert the processor is not frozen.
 *
 * @param {string} name
 * @param {unknown} frozen
 * @returns {asserts frozen is false}
 */
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot call `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.'
    )
  }
}

/**
 * Assert `node` is a unist node.
 *
 * @param {unknown} node
 * @returns {asserts node is Node}
 */
function assertNode(node) {
  // `isPlainObj` unfortunately uses `any` instead of `unknown`.
  // type-coverage:ignore-next-line
  if (!isPlainObject(node) || typeof node.type !== 'string') {
    throw new TypeError('Expected node, got `' + node + '`')
    // Fine.
  }
}

/**
 * Assert that `complete` is `true`.
 *
 * @param {string} name
 * @param {string} asyncName
 * @param {unknown} complete
 * @returns {asserts complete is true}
 */
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}

/**
 * @param {VFileCompatible} [value]
 * @returns {VFile}
 */
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value)
}

/**
 * @param {VFileCompatible} [value]
 * @returns {value is VFile}
 */
function looksLikeAVFile(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'message' in value &&
      'messages' in value
  )
}

/**
 * @param {unknown} [value]
 * @returns {value is VFileValue}
 */
function looksLikeAVFileValue(value) {
  return typeof value === 'string' || is_buffer(value)
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-string/lib/index.js
/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [includeImageAlt=true]
 *   Whether to use `alt` for `image`s.
 * @property {boolean | null | undefined} [includeHtml=true]
 *   Whether to use `value` of HTML.
 */

/** @type {Options} */
const emptyOptions = {}

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} value
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
function lib_toString(value, options) {
  const settings = options || emptyOptions
  const includeImageAlt =
    typeof settings.includeImageAlt === 'boolean'
      ? settings.includeImageAlt
      : true
  const includeHtml =
    typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true

  return one(value, includeImageAlt, includeHtml)
}

/**
 * One node or several nodes.
 *
 * @param {unknown} value
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized node.
 */
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ('value' in value) {
      return value.type === 'html' && !includeHtml ? '' : value.value
    }

    if (includeImageAlt && 'alt' in value && value.alt) {
      return value.alt
    }

    if ('children' in value) {
      return lib_all(value.children, includeImageAlt, includeHtml)
    }
  }

  if (Array.isArray(value)) {
    return lib_all(value, includeImageAlt, includeHtml)
  }

  return ''
}

/**
 * Serialize a list of nodes.
 *
 * @param {Array<unknown>} values
 *   Thing to serialize.
 * @param {boolean} includeImageAlt
 *   Include image `alt`s.
 * @param {boolean} includeHtml
 *   Include HTML.
 * @returns {string}
 *   Serialized nodes.
 */
function lib_all(values, includeImageAlt, includeHtml) {
  /** @type {Array<string>} */
  const result = []
  let index = -1

  while (++index < values.length) {
    result[index] = one(values[index], includeImageAlt, includeHtml)
  }

  return result.join('')
}

/**
 * Check if `value` looks like a node.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Node}
 *   Whether `value` is a node.
 */
function node(value) {
  return Boolean(value && typeof value === 'object')
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-chunked/index.js
/**
 * Like `Array#splice`, but smarter for giant arrays.
 *
 * `Array#splice` takes all items to be inserted as individual argument which
 * causes a stack overflow in V8 when trying to insert 100k items for instance.
 *
 * Otherwise, this does not return the removed items, and takes `items` as an
 * array instead of rest parameters.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {number} start
 *   Index to remove/insert at (can be negative).
 * @param {number} remove
 *   Number of items to remove.
 * @param {Array<T>} items
 *   Items to inject into `list`.
 * @returns {void}
 *   Nothing.
 */
function splice(list, start, remove, items) {
  const end = list.length
  let chunkStart = 0
  /** @type {Array<unknown>} */
  let parameters

  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start
  } else {
    start = start > end ? end : start
  }
  remove = remove > 0 ? remove : 0

  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < 10000) {
    parameters = Array.from(items)
    parameters.unshift(start, remove)
    // @ts-expect-error Hush, it’s fine.
    list.splice(...parameters)
  } else {
    // Delete `remove` items starting from `start`
    if (remove) list.splice(start, remove)

    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 10000)
      parameters.unshift(start, 0)
      // @ts-expect-error Hush, it’s fine.
      list.splice(...parameters)
      chunkStart += 10000
      start += 10000
    }
  }
}

/**
 * Append `items` (an array) at the end of `list` (another array).
 * When `list` was empty, returns `items` instead.
 *
 * This prevents a potentially expensive operation when `list` is empty,
 * and adds items in batches to prevent V8 from hanging.
 *
 * @template {unknown} T
 *   Item type.
 * @param {Array<T>} list
 *   List to operate on.
 * @param {Array<T>} items
 *   Items to add to `list`.
 * @returns {Array<T>}
 *   Either `list` or `items`.
 */
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items)
    return list
  }
  return items
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-combine-extensions/index.js
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Handles} Handles
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
 */



const micromark_util_combine_extensions_hasOwnProperty = {}.hasOwnProperty

/**
 * Combine multiple syntax extensions into one.
 *
 * @param {Array<Extension>} extensions
 *   List of syntax extensions.
 * @returns {NormalizedExtension}
 *   A single combined extension.
 */
function combineExtensions(extensions) {
  /** @type {NormalizedExtension} */
  const all = {}
  let index = -1

  while (++index < extensions.length) {
    syntaxExtension(all, extensions[index])
  }

  return all
}

/**
 * Merge `extension` into `all`.
 *
 * @param {NormalizedExtension} all
 *   Extension to merge into.
 * @param {Extension} extension
 *   Extension to merge.
 * @returns {void}
 */
function syntaxExtension(all, extension) {
  /** @type {keyof Extension} */
  let hook

  for (hook in extension) {
    const maybe = micromark_util_combine_extensions_hasOwnProperty.call(all, hook) ? all[hook] : undefined
    /** @type {Record<string, unknown>} */
    const left = maybe || (all[hook] = {})
    /** @type {Record<string, unknown> | undefined} */
    const right = extension[hook]
    /** @type {string} */
    let code

    if (right) {
      for (code in right) {
        if (!micromark_util_combine_extensions_hasOwnProperty.call(left, code)) left[code] = []
        const value = right[code]
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        )
      }
    }
  }
}

/**
 * Merge `list` into `existing` (both lists of constructs).
 * Mutates `existing`.
 *
 * @param {Array<unknown>} existing
 * @param {Array<unknown>} list
 * @returns {void}
 */
function constructs(existing, list) {
  let index = -1
  /** @type {Array<unknown>} */
  const before = []

  while (++index < list.length) {
    // @ts-expect-error Looks like an object.
    ;(list[index].add === 'after' ? existing : before).push(list[index])
  }

  splice(existing, 0, 0, before)
}

/**
 * Combine multiple HTML extensions into one.
 *
 * @param {Array<HtmlExtension>} htmlExtensions
 *   List of HTML extensions.
 * @returns {HtmlExtension}
 *   A single combined HTML extension.
 */
function combineHtmlExtensions(htmlExtensions) {
  /** @type {HtmlExtension} */
  const handlers = {}
  let index = -1

  while (++index < htmlExtensions.length) {
    htmlExtension(handlers, htmlExtensions[index])
  }

  return handlers
}

/**
 * Merge `extension` into `all`.
 *
 * @param {HtmlExtension} all
 *   Extension to merge into.
 * @param {HtmlExtension} extension
 *   Extension to merge.
 * @returns {void}
 */
function htmlExtension(all, extension) {
  /** @type {keyof HtmlExtension} */
  let hook

  for (hook in extension) {
    const maybe = micromark_util_combine_extensions_hasOwnProperty.call(all, hook) ? all[hook] : undefined
    const left = maybe || (all[hook] = {})
    const right = extension[hook]
    /** @type {keyof Handles} */
    let type

    if (right) {
      for (type in right) {
        // @ts-expect-error assume document vs regular handler are managed correctly.
        left[type] = right[type]
      }
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-character/lib/unicode-punctuation-regex.js
// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.

/**
 * Regular expression that matches a unicode punctuation character.
 */
const unicodePunctuationRegex =
  /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/

;// CONCATENATED MODULE: ./node_modules/micromark-util-character/index.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 */



/**
 * Check whether the character code represents an ASCII alpha (`a` through `z`,
 * case insensitive).
 *
 * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
 *
 * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
 * to U+005A (`Z`).
 *
 * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
 * to U+007A (`z`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlpha = regexCheck(/[A-Za-z]/)

/**
 * Check whether the character code represents an ASCII alphanumeric (`a`
 * through `z`, case insensitive, or `0` through `9`).
 *
 * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
 * (see `asciiAlpha`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/)

/**
 * Check whether the character code represents an ASCII atext.
 *
 * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
 * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
 * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
 * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
 * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
 * (`{`) to U+007E TILDE (`~`).
 *
 * See:
 * **\[RFC5322]**:
 * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
 * P. Resnick.
 * IETF.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/)

/**
 * Check whether a character code is an ASCII control character.
 *
 * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
 * to U+001F (US), or U+007F (DEL).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < 32 || code === 127)
  )
}

/**
 * Check whether the character code represents an ASCII digit (`0` through `9`).
 *
 * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
 * U+0039 (`9`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiDigit = regexCheck(/\d/)

/**
 * Check whether the character code represents an ASCII hex digit (`a` through
 * `f`, case insensitive, or `0` through `9`).
 *
 * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
 * digit, or an ASCII lower hex digit.
 *
 * An **ASCII upper hex digit** is a character in the inclusive range U+0041
 * (`A`) to U+0046 (`F`).
 *
 * An **ASCII lower hex digit** is a character in the inclusive range U+0061
 * (`a`) to U+0066 (`f`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiHexDigit = regexCheck(/[\dA-Fa-f]/)

/**
 * Check whether the character code represents ASCII punctuation.
 *
 * An **ASCII punctuation** is a character in the inclusive ranges U+0021
 * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
 * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
 * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/)

/**
 * Check whether a character code is a markdown line ending.
 *
 * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
 * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
 *
 * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
 * RETURN (CR) are replaced by these virtual characters depending on whether
 * they occurred together.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEnding(code) {
  return code !== null && code < -2
}

/**
 * Check whether a character code is a markdown line ending (see
 * `markdownLineEnding`) or markdown space (see `markdownSpace`).
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < 0 || code === 32)
}

/**
 * Check whether a character code is a markdown space.
 *
 * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
 * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
 *
 * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
 * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
 * SPACE (VS) characters, depending on the column at which the tab occurred.
 *
 * @param {Code} code
 *   Code.
 * @returns {boolean}
 *   Whether it matches.
 */
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32
}

// Size note: removing ASCII from the regex and using `asciiPunctuation` here
// In fact adds to the bundle size.
/**
 * Check whether the character code represents Unicode punctuation.
 *
 * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
 * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
 * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
 * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
 * punctuation (see `asciiPunctuation`).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodePunctuation = regexCheck(unicodePunctuationRegex)

/**
 * Check whether the character code represents Unicode whitespace.
 *
 * Note that this does handle micromark specific markdown whitespace characters.
 * See `markdownLineEndingOrSpace` to check that.
 *
 * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
 * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
 * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
 *
 * See:
 * **\[UNICODE]**:
 * [The Unicode Standard](https://www.unicode.org/versions/).
 * Unicode Consortium.
 *
 * @param code
 *   Code.
 * @returns
 *   Whether it matches.
 */
const unicodeWhitespace = regexCheck(/\s/)

/**
 * Create a code check from a regex.
 *
 * @param {RegExp} regex
 * @returns {(code: Code) => boolean}
 */
function regexCheck(regex) {
  return check

  /**
   * Check whether a code matches the bound regex.
   *
   * @param {Code} code
   *   Character code.
   * @returns {boolean}
   *   Whether the character code matches the bound regex.
   */
  function check(code) {
    return code !== null && regex.test(String.fromCharCode(code))
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-factory-space/index.js
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */



// To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type (`' \t'`).
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns
 *   Start state.
 */
function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY
  let size = 0
  return start

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type)
      return prefix(code)
    }
    return ok(code)
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code)
      return prefix
    }
    effects.exit(type)
    return ok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/initialize/content.js
/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */



/** @type {InitialConstruct} */
const content = {
  tokenize: initializeContent
}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  )
  /** @type {Token} */
  let previous
  return contentStart

  /** @type {State} */
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code)
      return
    }
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, contentStart, 'linePrefix')
  }

  /** @type {State} */
  function paragraphInitial(code) {
    effects.enter('paragraph')
    return lineStart(code)
  }

  /** @type {State} */
  function lineStart(code) {
    const token = effects.enter('chunkText', {
      contentType: 'text',
      previous
    })
    if (previous) {
      previous.next = token
    }
    previous = token
    return data(code)
  }

  /** @type {State} */
  function data(code) {
    if (code === null) {
      effects.exit('chunkText')
      effects.exit('paragraph')
      effects.consume(code)
      return
    }
    if (markdownLineEnding(code)) {
      effects.consume(code)
      effects.exit('chunkText')
      return lineStart
    }

    // Data.
    effects.consume(code)
    return data
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/initialize/document.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */

/**
 * @typedef {[Construct, ContainerState]} StackItem
 */




/** @type {InitialConstruct} */
const document_document = {
  tokenize: initializeDocument
}

/** @type {Construct} */
const containerConstruct = {
  tokenize: tokenizeContainer
}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeDocument(effects) {
  const self = this
  /** @type {Array<StackItem>} */
  const stack = []
  let continued = 0
  /** @type {TokenizeContext | undefined} */
  let childFlow
  /** @type {Token | undefined} */
  let childToken
  /** @type {number} */
  let lineStartOffset
  return start

  /** @type {State} */
  function start(code) {
    // First we iterate through the open blocks, starting with the root
    // document, and descending through last children down to the last open
    // block.
    // Each block imposes a condition that the line must satisfy if the block is
    // to remain open.
    // For example, a block quote requires a `>` character.
    // A paragraph requires a non-blank line.
    // In this phase we may match all or just some of the open blocks.
    // But we cannot close unmatched blocks yet, because we may have a lazy
    // continuation line.
    if (continued < stack.length) {
      const item = stack[continued]
      self.containerState = item[1]
      return effects.attempt(
        item[0].continuation,
        documentContinue,
        checkNewContainers
      )(code)
    }

    // Done.
    return checkNewContainers(code)
  }

  /** @type {State} */
  function documentContinue(code) {
    continued++

    // Note: this field is called `_closeFlow` but it also closes containers.
    // Perhaps a good idea to rename it but it’s already used in the wild by
    // extensions.
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = undefined
      if (childFlow) {
        closeFlow()
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when dealing with lazy lines in `writeToChild`.
      const indexBeforeExits = self.events.length
      let indexBeforeFlow = indexBeforeExits
      /** @type {Point | undefined} */
      let point

      // Find the flow chunk.
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === 'chunkFlow'
        ) {
          point = self.events[indexBeforeFlow][1].end
          break
        }
      }
      exitContainers(continued)

      // Fix positions.
      let index = indexBeforeExits
      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point)
        index++
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      )

      // Discard the duplicate exits.
      self.events.length = index
      return checkNewContainers(code)
    }
    return start(code)
  }

  /** @type {State} */
  function checkNewContainers(code) {
    // Next, after consuming the continuation markers for existing blocks, we
    // look for new block starts (e.g. `>` for a block quote).
    // If we encounter a new block start, we close any blocks unmatched in
    // step 1 before creating the new block as a child of the last matched
    // block.
    if (continued === stack.length) {
      // No need to `check` whether there’s a container, of `exitContainers`
      // would be moot.
      // We can instead immediately `attempt` to parse one.
      if (!childFlow) {
        return documentContinued(code)
      }

      // If we have concrete content, such as block HTML or fenced code,
      // we can’t have containers “pierce” into them, so we can immediately
      // start.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code)
      }

      // If we do have flow, it could still be a blank line,
      // but we’d be interrupting it w/ a new container if there’s a current
      // construct.
      // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
      // needed in micromark-extension-gfm-table@1.0.6).
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
      )
    }

    // Check if there is a new container.
    self.containerState = {}
    return effects.check(
      containerConstruct,
      thereIsANewContainer,
      thereIsNoNewContainer
    )(code)
  }

  /** @type {State} */
  function thereIsANewContainer(code) {
    if (childFlow) closeFlow()
    exitContainers(continued)
    return documentContinued(code)
  }

  /** @type {State} */
  function thereIsNoNewContainer(code) {
    self.parser.lazy[self.now().line] = continued !== stack.length
    lineStartOffset = self.now().offset
    return flowStart(code)
  }

  /** @type {State} */
  function documentContinued(code) {
    // Try new containers.
    self.containerState = {}
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code)
  }

  /** @type {State} */
  function containerContinue(code) {
    continued++
    stack.push([self.currentConstruct, self.containerState])
    // Try another.
    return documentContinued(code)
  }

  /** @type {State} */
  function flowStart(code) {
    if (code === null) {
      if (childFlow) closeFlow()
      exitContainers(0)
      effects.consume(code)
      return
    }
    childFlow = childFlow || self.parser.flow(self.now())
    effects.enter('chunkFlow', {
      contentType: 'flow',
      previous: childToken,
      _tokenizer: childFlow
    })
    return flowContinue(code)
  }

  /** @type {State} */
  function flowContinue(code) {
    if (code === null) {
      writeToChild(effects.exit('chunkFlow'), true)
      exitContainers(0)
      effects.consume(code)
      return
    }
    if (markdownLineEnding(code)) {
      effects.consume(code)
      writeToChild(effects.exit('chunkFlow'))
      // Get ready for the next line.
      continued = 0
      self.interrupt = undefined
      return start
    }
    effects.consume(code)
    return flowContinue
  }

  /**
   * @param {Token} token
   * @param {boolean | undefined} [eof]
   * @returns {void}
   */
  function writeToChild(token, eof) {
    const stream = self.sliceStream(token)
    if (eof) stream.push(null)
    token.previous = childToken
    if (childToken) childToken.next = token
    childToken = token
    childFlow.defineSkip(token.start)
    childFlow.write(stream)

    // Alright, so we just added a lazy line:
    //
    // ```markdown
    // > a
    // b.
    //
    // Or:
    //
    // > ~~~c
    // d
    //
    // Or:
    //
    // > | e |
    // f
    // ```
    //
    // The construct in the second example (fenced code) does not accept lazy
    // lines, so it marked itself as done at the end of its first line, and
    // then the content construct parses `d`.
    // Most constructs in markdown match on the first line: if the first line
    // forms a construct, a non-lazy line can’t “unmake” it.
    //
    // The construct in the third example is potentially a GFM table, and
    // those are *weird*.
    // It *could* be a table, from the first line, if the following line
    // matches a condition.
    // In this case, that second line is lazy, which “unmakes” the first line
    // and turns the whole into one content block.
    //
    // We’ve now parsed the non-lazy and the lazy line, and can figure out
    // whether the lazy line started a new flow block.
    // If it did, we exit the current containers between the two flow blocks.
    if (self.parser.lazy[token.start.line]) {
      let index = childFlow.events.length
      while (index--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index][1].start.offset < lineStartOffset &&
          // …and either is not ended yet…
          (!childFlow.events[index][1].end ||
            // …or ends after it.
            childFlow.events[index][1].end.offset > lineStartOffset)
        ) {
          // Exit: there’s still something open, which means it’s a lazy line
          // part of something.
          return
        }
      }

      // Note: this algorithm for moving events around is similar to the
      // algorithm when closing flow in `documentContinue`.
      const indexBeforeExits = self.events.length
      let indexBeforeFlow = indexBeforeExits
      /** @type {boolean | undefined} */
      let seen
      /** @type {Point | undefined} */
      let point

      // Find the previous chunk (the one before the lazy line).
      while (indexBeforeFlow--) {
        if (
          self.events[indexBeforeFlow][0] === 'exit' &&
          self.events[indexBeforeFlow][1].type === 'chunkFlow'
        ) {
          if (seen) {
            point = self.events[indexBeforeFlow][1].end
            break
          }
          seen = true
        }
      }
      exitContainers(continued)

      // Fix positions.
      index = indexBeforeExits
      while (index < self.events.length) {
        self.events[index][1].end = Object.assign({}, point)
        index++
      }

      // Inject the exits earlier (they’re still also at the end).
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      )

      // Discard the duplicate exits.
      self.events.length = index
    }
  }

  /**
   * @param {number} size
   * @returns {void}
   */
  function exitContainers(size) {
    let index = stack.length

    // Exit open containers.
    while (index-- > size) {
      const entry = stack[index]
      self.containerState = entry[1]
      entry[0].exit.call(self, effects)
    }
    stack.length = size
  }
  function closeFlow() {
    childFlow.write([null])
    childToken = undefined
    childFlow = undefined
    self.containerState._closeFlow = undefined
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContainer(effects, ok, nok) {
  // Always populated by defaults.

  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok, nok),
    'linePrefix',
    this.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4
  )
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/blank-line.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const blankLine = {
  tokenize: tokenizeBlankLine,
  partial: true
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLine(effects, ok, nok) {
  return start

  /**
   * Start of blank line.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *     ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    return markdownSpace(code)
      ? factorySpace(effects, after, 'linePrefix')(code)
      : after(code)
  }

  /**
   * At eof/eol, after optional whitespace.
   *
   * > 👉 **Note**: `␠` represents a space character.
   *
   * ```markdown
   * > | ␠␠␊
   *       ^
   * > | ␊
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-subtokenize/index.js
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Token} Token
 */


/**
 * Tokenize subcontent.
 *
 * @param {Array<Event>} events
 *   List of events.
 * @returns {boolean}
 *   Whether subtokens were found.
 */
function subtokenize(events) {
  /** @type {Record<string, number>} */
  const jumps = {}
  let index = -1
  /** @type {Event} */
  let event
  /** @type {number | undefined} */
  let lineIndex
  /** @type {number} */
  let otherIndex
  /** @type {Event} */
  let otherEvent
  /** @type {Array<Event>} */
  let parameters
  /** @type {Array<Event>} */
  let subevents
  /** @type {boolean | undefined} */
  let more
  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index]
    }
    event = events[index]

    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (
      index &&
      event[1].type === 'chunkFlow' &&
      events[index - 1][1].type === 'listItemPrefix'
    ) {
      subevents = event[1]._tokenizer.events
      otherIndex = 0
      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'lineEndingBlank'
      ) {
        otherIndex += 2
      }
      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'content'
      ) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === 'content') {
            break
          }
          if (subevents[otherIndex][1].type === 'chunkText') {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true
            otherIndex++
          }
        }
      }
    }

    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index))
        index = jumps[index]
        more = true
      }
    }
    // Exit.
    else if (event[1]._container) {
      otherIndex = index
      lineIndex = undefined
      while (otherIndex--) {
        otherEvent = events[otherIndex]
        if (
          otherEvent[1].type === 'lineEnding' ||
          otherEvent[1].type === 'lineEndingBlank'
        ) {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = 'lineEndingBlank'
            }
            otherEvent[1].type = 'lineEnding'
            lineIndex = otherIndex
          }
        } else {
          break
        }
      }
      if (lineIndex) {
        // Fix position.
        event[1].end = Object.assign({}, events[lineIndex][1].start)

        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index)
        parameters.unshift(event)
        splice(events, lineIndex, index - lineIndex + 1, parameters)
      }
    }
  }
  return !more
}

/**
 * Tokenize embedded tokens.
 *
 * @param {Array<Event>} events
 * @param {number} eventIndex
 * @returns {Record<string, number>}
 */
function subcontent(events, eventIndex) {
  const token = events[eventIndex][1]
  const context = events[eventIndex][2]
  let startPosition = eventIndex - 1
  /** @type {Array<number>} */
  const startPositions = []
  const tokenizer =
    token._tokenizer || context.parser[token.contentType](token.start)
  const childEvents = tokenizer.events
  /** @type {Array<[number, number]>} */
  const jumps = []
  /** @type {Record<string, number>} */
  const gaps = {}
  /** @type {Array<Chunk>} */
  let stream
  /** @type {Token | undefined} */
  let previous
  let index = -1
  /** @type {Token | undefined} */
  let current = token
  let adjust = 0
  let start = 0
  const breaks = [start]

  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (current) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== current) {
      // Empty.
    }
    startPositions.push(startPosition)
    if (!current._tokenizer) {
      stream = context.sliceStream(current)
      if (!current.next) {
        stream.push(null)
      }
      if (previous) {
        tokenizer.defineSkip(current.start)
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true
      }
      tokenizer.write(stream)
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined
      }
    }

    // Unravel the next token.
    previous = current
    current = current.next
  }

  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  current = token
  while (++index < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index][0] === 'exit' &&
      childEvents[index - 1][0] === 'enter' &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      start = index + 1
      breaks.push(start)
      // Help GC.
      current._tokenizer = undefined
      current.previous = undefined
      current = current.next
    }
  }

  // Help GC.
  tokenizer.events = []

  // If there’s one more token (which is the cases for lines that end in an
  // EOF), that’s perfect: the last point we found starts it.
  // If there isn’t then make sure any remaining content is added to it.
  if (current) {
    // Help GC.
    current._tokenizer = undefined
    current.previous = undefined
  } else {
    breaks.pop()
  }

  // Now splice the events from the subtokenizer into the current events,
  // moving back to front so that splice indices aren’t affected.
  index = breaks.length
  while (index--) {
    const slice = childEvents.slice(breaks[index], breaks[index + 1])
    const start = startPositions.pop()
    jumps.unshift([start, start + slice.length - 1])
    splice(events, start, 2, slice)
  }
  index = -1
  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1]
    adjust += jumps[index][1] - jumps[index][0] - 1
  }
  return gaps
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/content.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */




/**
 * No name because it must not be turned off.
 * @type {Construct}
 */
const content_content = {
  tokenize: tokenizeContent,
  resolve: resolveContent
}

/** @type {Construct} */
const continuationConstruct = {
  tokenize: tokenizeContinuation,
  partial: true
}

/**
 * Content is transparent: it’s parsed right now. That way, definitions are also
 * parsed right now: before text in paragraphs (specifically, media) are parsed.
 *
 * @type {Resolver}
 */
function resolveContent(events) {
  subtokenize(events)
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContent(effects, ok) {
  /** @type {Token | undefined} */
  let previous
  return chunkStart

  /**
   * Before a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^
   * ```
   *
   * @type {State}
   */
  function chunkStart(code) {
    effects.enter('content')
    previous = effects.enter('chunkContent', {
      contentType: 'content'
    })
    return chunkInside(code)
  }

  /**
   * In a content chunk.
   *
   * ```markdown
   * > | abc
   *     ^^^
   * ```
   *
   * @type {State}
   */
  function chunkInside(code) {
    if (code === null) {
      return contentEnd(code)
    }

    // To do: in `markdown-rs`, each line is parsed on its own, and everything
    // is stitched together resolving.
    if (markdownLineEnding(code)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code)
    }

    // Data.
    effects.consume(code)
    return chunkInside
  }

  /**
   *
   *
   * @type {State}
   */
  function contentEnd(code) {
    effects.exit('chunkContent')
    effects.exit('content')
    return ok(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function contentContinue(code) {
    effects.consume(code)
    effects.exit('chunkContent')
    previous.next = effects.enter('chunkContent', {
      contentType: 'content',
      previous
    })
    previous = previous.next
    return chunkInside
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeContinuation(effects, ok, nok) {
  const self = this
  return startLookahead

  /**
   *
   *
   * @type {State}
   */
  function startLookahead(code) {
    effects.exit('chunkContent')
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, prefixed, 'linePrefix')
  }

  /**
   *
   *
   * @type {State}
   */
  function prefixed(code) {
    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }

    // Always populated by defaults.

    const tail = self.events[self.events.length - 1]
    if (
      !self.parser.constructs.disable.null.includes('codeIndented') &&
      tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
    ) {
      return ok(code)
    }
    return effects.interrupt(self.parser.constructs.flow, nok, ok)(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/initialize/flow.js
/**
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */




/** @type {InitialConstruct} */
const flow = {
  tokenize: initializeFlow
}

/**
 * @this {TokenizeContext}
 * @type {Initializer}
 */
function initializeFlow(effects) {
  const self = this
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content_content, afterConstruct)
        ),
        'linePrefix'
      )
    )
  )
  return initial

  /** @type {State} */
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code)
      return
    }
    effects.enter('lineEndingBlank')
    effects.consume(code)
    effects.exit('lineEndingBlank')
    self.currentConstruct = undefined
    return initial
  }

  /** @type {State} */
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code)
      return
    }
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    self.currentConstruct = undefined
    return initial
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/initialize/text.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').Initializer} Initializer
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

const resolver = {
  resolveAll: createResolver()
}
const string = initializeFactory('string')
const text_text = initializeFactory('text')

/**
 * @param {'string' | 'text'} field
 * @returns {InitialConstruct}
 */
function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === 'text' ? resolveAllLineSuffixes : undefined
    )
  }

  /**
   * @this {TokenizeContext}
   * @type {Initializer}
   */
  function initializeText(effects) {
    const self = this
    const constructs = this.parser.constructs[field]
    const text = effects.attempt(constructs, start, notText)
    return start

    /** @type {State} */
    function start(code) {
      return atBreak(code) ? text(code) : notText(code)
    }

    /** @type {State} */
    function notText(code) {
      if (code === null) {
        effects.consume(code)
        return
      }
      effects.enter('data')
      effects.consume(code)
      return data
    }

    /** @type {State} */
    function data(code) {
      if (atBreak(code)) {
        effects.exit('data')
        return text(code)
      }

      // Data.
      effects.consume(code)
      return data
    }

    /**
     * @param {Code} code
     * @returns {boolean}
     */
    function atBreak(code) {
      if (code === null) {
        return true
      }
      const list = constructs[code]
      let index = -1
      if (list) {
        // Always populated by defaults.

        while (++index < list.length) {
          const item = list[index]
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true
          }
        }
      }
      return false
    }
  }
}

/**
 * @param {Resolver | undefined} [extraResolver]
 * @returns {Resolver}
 */
function createResolver(extraResolver) {
  return resolveAllText

  /** @type {Resolver} */
  function resolveAllText(events, context) {
    let index = -1
    /** @type {number | undefined} */
    let enter

    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === 'data') {
          enter = index
          index++
        }
      } else if (!events[index] || events[index][1].type !== 'data') {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end
          events.splice(enter + 2, index - enter - 2)
          index = enter + 2
        }
        enter = undefined
      }
    }
    return extraResolver ? extraResolver(events, context) : events
  }
}

/**
 * A rather ugly set of instructions which again looks at chunks in the input
 * stream.
 * The reason to do this here is that it is *much* faster to parse in reverse.
 * And that we can’t hook into `null` to split the line suffix before an EOF.
 * To do: figure out if we can make this into a clean utility, or even in core.
 * As it will be useful for GFMs literal autolink extension (and maybe even
 * tables?)
 *
 * @type {Resolver}
 */
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0 // Skip first.

  while (++eventIndex <= events.length) {
    if (
      (eventIndex === events.length ||
        events[eventIndex][1].type === 'lineEnding') &&
      events[eventIndex - 1][1].type === 'data'
    ) {
      const data = events[eventIndex - 1][1]
      const chunks = context.sliceStream(data)
      let index = chunks.length
      let bufferIndex = -1
      let size = 0
      /** @type {boolean | undefined} */
      let tabs
      while (index--) {
        const chunk = chunks[index]
        if (typeof chunk === 'string') {
          bufferIndex = chunk.length
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++
            bufferIndex--
          }
          if (bufferIndex) break
          bufferIndex = -1
        }
        // Number
        else if (chunk === -2) {
          tabs = true
          size++
        } else if (chunk === -1) {
          // Empty
        } else {
          // Replacement character, exit.
          index++
          break
        }
      }
      if (size) {
        const token = {
          type:
            eventIndex === events.length || tabs || size < 2
              ? 'lineSuffix'
              : 'hardBreakTrailing',
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index
              ? bufferIndex
              : data.start._bufferIndex + bufferIndex
          },
          end: Object.assign({}, data.end)
        }
        data.end = Object.assign({}, token.start)
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token)
        } else {
          events.splice(
            eventIndex,
            0,
            ['enter', token, context],
            ['exit', token, context]
          )
          eventIndex += 2
        }
      }
      eventIndex++
    }
  }
  return events
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-resolve-all/index.js
/**
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * Call all `resolveAll`s.
 *
 * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
 *   List of constructs, optionally with `resolveAll`s.
 * @param {Array<Event>} events
 *   List of events.
 * @param {TokenizeContext} context
 *   Context used by `tokenize`.
 * @returns {Array<Event>}
 *   Changed events.
 */
function resolveAll(constructs, events, context) {
  /** @type {Array<Resolver>} */
  const called = []
  let index = -1

  while (++index < constructs.length) {
    const resolve = constructs[index].resolveAll

    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context)
      called.push(resolve)
    }
  }

  return events
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/create-tokenizer.js
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenType} TokenType
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 */

/**
 * @callback Restore
 * @returns {void}
 *
 * @typedef Info
 * @property {Restore} restore
 * @property {number} from
 *
 * @callback ReturnHandle
 *   Handle a successful run.
 * @param {Construct} construct
 * @param {Info} info
 * @returns {void}
 */




/**
 * Create a tokenizer.
 * Tokenizers deal with one type of data (e.g., containers, flow, text).
 * The parser is the object dealing with it all.
 * `initialize` works like other constructs, except that only its `tokenize`
 * function is used, in which case it doesn’t receive an `ok` or `nok`.
 * `from` can be given to set the point before the first character, although
 * when further lines are indented, they must be set with `defineSkip`.
 *
 * @param {ParseContext} parser
 * @param {InitialConstruct} initialize
 * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
 * @returns {TokenizeContext}
 */
function createTokenizer(parser, initialize, from) {
  /** @type {Point} */
  let point = Object.assign(
    from
      ? Object.assign({}, from)
      : {
          line: 1,
          column: 1,
          offset: 0
        },
    {
      _index: 0,
      _bufferIndex: -1
    }
  )
  /** @type {Record<string, number>} */
  const columnStart = {}
  /** @type {Array<Construct>} */
  const resolveAllConstructs = []
  /** @type {Array<Chunk>} */
  let chunks = []
  /** @type {Array<Token>} */
  let stack = []
  /** @type {boolean | undefined} */
  let consumed = true

  /**
   * Tools used for tokenizing.
   *
   * @type {Effects}
   */
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  }

  /**
   * State and tools for resolving and serializing.
   *
   * @type {TokenizeContext}
   */
  const context = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  }

  /**
   * The state function.
   *
   * @type {State | void}
   */
  let state = initialize.tokenize.call(context, effects)

  /**
   * Track which character we expect to be consumed, to catch bugs.
   *
   * @type {Code}
   */
  let expectedCode
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize)
  }
  return context

  /** @type {TokenizeContext['write']} */
  function write(slice) {
    chunks = push(chunks, slice)
    main()

    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== null) {
      return []
    }
    addResult(initialize, 0)

    // Otherwise, resolve, and exit.
    context.events = resolveAll(resolveAllConstructs, context.events, context)
    return context.events
  }

  //
  // Tools.
  //

  /** @type {TokenizeContext['sliceSerialize']} */
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs)
  }

  /** @type {TokenizeContext['sliceStream']} */
  function sliceStream(token) {
    return sliceChunks(chunks, token)
  }

  /** @type {TokenizeContext['now']} */
  function now() {
    // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
    const {line, column, offset, _index, _bufferIndex} = point
    return {
      line,
      column,
      offset,
      _index,
      _bufferIndex
    }
  }

  /** @type {TokenizeContext['defineSkip']} */
  function defineSkip(value) {
    columnStart[value.line] = value.column
    accountForPotentialSkip()
  }

  //
  // State management.
  //

  /**
   * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
   * `consume`).
   * Here is where we walk through the chunks, which either include strings of
   * several characters, or numerical character codes.
   * The reason to do this in a loop instead of a call is so the stack can
   * drain.
   *
   * @returns {void}
   */
  function main() {
    /** @type {number} */
    let chunkIndex
    while (point._index < chunks.length) {
      const chunk = chunks[point._index]

      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0
        }
        while (
          point._index === chunkIndex &&
          point._bufferIndex < chunk.length
        ) {
          go(chunk.charCodeAt(point._bufferIndex))
        }
      } else {
        go(chunk)
      }
    }
  }

  /**
   * Deal with one code.
   *
   * @param {Code} code
   * @returns {void}
   */
  function go(code) {
    consumed = undefined
    expectedCode = code
    state = state(code)
  }

  /** @type {Effects['consume']} */
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++
      point.column = 1
      point.offset += code === -3 ? 2 : 1
      accountForPotentialSkip()
    } else if (code !== -1) {
      point.column++
      point.offset++
    }

    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++
    } else {
      point._bufferIndex++

      // At end of string chunk.
      // @ts-expect-error Points w/ non-negative `_bufferIndex` reference
      // strings.
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1
        point._index++
      }
    }

    // Expose the previous character.
    context.previous = code

    // Mark as consumed.
    consumed = true
  }

  /** @type {Effects['enter']} */
  function enter(type, fields) {
    /** @type {Token} */
    // @ts-expect-error Patch instead of assign required fields to help GC.
    const token = fields || {}
    token.type = type
    token.start = now()
    context.events.push(['enter', token, context])
    stack.push(token)
    return token
  }

  /** @type {Effects['exit']} */
  function exit(type) {
    const token = stack.pop()
    token.end = now()
    context.events.push(['exit', token, context])
    return token
  }

  /**
   * Use results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from)
  }

  /**
   * Discard results.
   *
   * @type {ReturnHandle}
   */
  function onsuccessfulcheck(_, info) {
    info.restore()
  }

  /**
   * Factory to attempt/check/interrupt.
   *
   * @param {ReturnHandle} onreturn
   * @param {{interrupt?: boolean | undefined} | undefined} [fields]
   */
  function constructFactory(onreturn, fields) {
    return hook

    /**
     * Handle either an object mapping codes to constructs, a list of
     * constructs, or a single construct.
     *
     * @param {Array<Construct> | Construct | ConstructRecord} constructs
     * @param {State} returnState
     * @param {State | undefined} [bogusState]
     * @returns {State}
     */
    function hook(constructs, returnState, bogusState) {
      /** @type {Array<Construct>} */
      let listOfConstructs
      /** @type {number} */
      let constructIndex
      /** @type {Construct} */
      let currentConstruct
      /** @type {Info} */
      let info
      return Array.isArray(constructs) /* c8 ignore next 1 */
        ? handleListOfConstructs(constructs)
        : 'tokenize' in constructs
        ? // @ts-expect-error Looks like a construct.
          handleListOfConstructs([constructs])
        : handleMapOfConstructs(constructs)

      /**
       * Handle a list of construct.
       *
       * @param {ConstructRecord} map
       * @returns {State}
       */
      function handleMapOfConstructs(map) {
        return start

        /** @type {State} */
        function start(code) {
          const def = code !== null && map[code]
          const all = code !== null && map.null
          const list = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...(Array.isArray(def) ? def : def ? [def] : []),
            ...(Array.isArray(all) ? all : all ? [all] : [])
          ]
          return handleListOfConstructs(list)(code)
        }
      }

      /**
       * Handle a list of construct.
       *
       * @param {Array<Construct>} list
       * @returns {State}
       */
      function handleListOfConstructs(list) {
        listOfConstructs = list
        constructIndex = 0
        if (list.length === 0) {
          return bogusState
        }
        return handleConstruct(list[constructIndex])
      }

      /**
       * Handle a single construct.
       *
       * @param {Construct} construct
       * @returns {State}
       */
      function handleConstruct(construct) {
        return start

        /** @type {State} */
        function start(code) {
          // To do: not needed to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store()
          currentConstruct = construct
          if (!construct.partial) {
            context.currentConstruct = construct
          }

          // Always populated by defaults.

          if (
            construct.name &&
            context.parser.constructs.disable.null.includes(construct.name)
          ) {
            return nok(code)
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code)
        }
      }

      /** @type {State} */
      function ok(code) {
        consumed = true
        onreturn(currentConstruct, info)
        return returnState
      }

      /** @type {State} */
      function nok(code) {
        consumed = true
        info.restore()
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex])
        }
        return bogusState
      }
    }
  }

  /**
   * @param {Construct} construct
   * @param {number} from
   * @returns {void}
   */
  function addResult(construct, from) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct)
    }
    if (construct.resolve) {
      splice(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context)
      )
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context)
    }
  }

  /**
   * Store state.
   *
   * @returns {Info}
   */
  function store() {
    const startPoint = now()
    const startPrevious = context.previous
    const startCurrentConstruct = context.currentConstruct
    const startEventsIndex = context.events.length
    const startStack = Array.from(stack)
    return {
      restore,
      from: startEventsIndex
    }

    /**
     * Restore state.
     *
     * @returns {void}
     */
    function restore() {
      point = startPoint
      context.previous = startPrevious
      context.currentConstruct = startCurrentConstruct
      context.events.length = startEventsIndex
      stack = startStack
      accountForPotentialSkip()
    }
  }

  /**
   * Move the current point a bit forward in the line when it’s on a column
   * skip.
   *
   * @returns {void}
   */
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line]
      point.offset += columnStart[point.line] - 1
    }
  }
}

/**
 * Get the chunks from a slice of chunks in the range of a token.
 *
 * @param {Array<Chunk>} chunks
 * @param {Pick<Token, 'end' | 'start'>} token
 * @returns {Array<Chunk>}
 */
function sliceChunks(chunks, token) {
  const startIndex = token.start._index
  const startBufferIndex = token.start._bufferIndex
  const endIndex = token.end._index
  const endBufferIndex = token.end._bufferIndex
  /** @type {Array<Chunk>} */
  let view
  if (startIndex === endIndex) {
    // @ts-expect-error `_bufferIndex` is used on string chunks.
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)]
  } else {
    view = chunks.slice(startIndex, endIndex)
    if (startBufferIndex > -1) {
      const head = view[0]
      if (typeof head === 'string') {
        view[0] = head.slice(startBufferIndex)
      } else {
        view.shift()
      }
    }
    if (endBufferIndex > 0) {
      // @ts-expect-error `_bufferIndex` is used on string chunks.
      view.push(chunks[endIndex].slice(0, endBufferIndex))
    }
  }
  return view
}

/**
 * Get the string value of a slice of chunks.
 *
 * @param {Array<Chunk>} chunks
 * @param {boolean | undefined} [expandTabs=false]
 * @returns {string}
 */
function serializeChunks(chunks, expandTabs) {
  let index = -1
  /** @type {Array<string>} */
  const result = []
  /** @type {boolean | undefined} */
  let atTab
  while (++index < chunks.length) {
    const chunk = chunks[index]
    /** @type {string} */
    let value
    if (typeof chunk === 'string') {
      value = chunk
    } else
      switch (chunk) {
        case -5: {
          value = '\r'
          break
        }
        case -4: {
          value = '\n'
          break
        }
        case -3: {
          value = '\r' + '\n'
          break
        }
        case -2: {
          value = expandTabs ? ' ' : '\t'
          break
        }
        case -1: {
          if (!expandTabs && atTab) continue
          value = ' '
          break
        }
        default: {
          // Currently only replacement character.
          value = String.fromCharCode(chunk)
        }
      }
    atTab = chunk === -2
    result.push(value)
  }
  return result.join('')
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/thematic-break.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0
  /** @type {NonNullable<Code>} */
  let marker
  return start

  /**
   * Start of thematic break.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('thematicBreak')
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * After optional whitespace, at marker.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    marker = code
    return atBreak(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.enter('thematicBreakSequence')
      return sequence(code)
    }
    if (size >= 3 && (code === null || markdownLineEnding(code))) {
      effects.exit('thematicBreak')
      return ok(code)
    }
    return nok(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   * > | ***
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequence(code) {
    if (code === marker) {
      effects.consume(code)
      size++
      return sequence
    }
    effects.exit('thematicBreakSequence')
    return markdownSpace(code)
      ? factorySpace(effects, atBreak, 'whitespace')(code)
      : atBreak(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/list.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').ContainerState} ContainerState
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */






/** @type {Construct} */
const list = {
  name: 'list',
  tokenize: tokenizeListStart,
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd
}

/** @type {Construct} */
const listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
}

/** @type {Construct} */
const indentConstruct = {
  tokenize: tokenizeIndent,
  partial: true
}

// To do: `markdown-rs` parses list items on their own and later stitches them
// together.

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListStart(effects, ok, nok) {
  const self = this
  const tail = self.events[self.events.length - 1]
  let initialSize =
    tail && tail[1].type === 'linePrefix'
      ? tail[2].sliceSerialize(tail[1], true).length
      : 0
  let size = 0
  return start

  /** @type {State} */
  function start(code) {
    const kind =
      self.containerState.type ||
      (code === 42 || code === 43 || code === 45
        ? 'listUnordered'
        : 'listOrdered')
    if (
      kind === 'listUnordered'
        ? !self.containerState.marker || code === self.containerState.marker
        : asciiDigit(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind
        effects.enter(kind, {
          _container: true
        })
      }
      if (kind === 'listUnordered') {
        effects.enter('listItemPrefix')
        return code === 42 || code === 45
          ? effects.check(thematicBreak, nok, atMarker)(code)
          : atMarker(code)
      }
      if (!self.interrupt || code === 49) {
        effects.enter('listItemPrefix')
        effects.enter('listItemValue')
        return inside(code)
      }
    }
    return nok(code)
  }

  /** @type {State} */
  function inside(code) {
    if (asciiDigit(code) && ++size < 10) {
      effects.consume(code)
      return inside
    }
    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === 41 || code === 46)
    ) {
      effects.exit('listItemValue')
      return atMarker(code)
    }
    return nok(code)
  }

  /**
   * @type {State}
   **/
  function atMarker(code) {
    effects.enter('listItemMarker')
    effects.consume(code)
    effects.exit('listItemMarker')
    self.containerState.marker = self.containerState.marker || code
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    )
  }

  /** @type {State} */
  function onBlank(code) {
    self.containerState.initialBlankLine = true
    initialSize++
    return endOfPrefix(code)
  }

  /** @type {State} */
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter('listItemPrefixWhitespace')
      effects.consume(code)
      effects.exit('listItemPrefixWhitespace')
      return endOfPrefix
    }
    return nok(code)
  }

  /** @type {State} */
  function endOfPrefix(code) {
    self.containerState.size =
      initialSize +
      self.sliceSerialize(effects.exit('listItemPrefix'), true).length
    return ok(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListContinuation(effects, ok, nok) {
  const self = this
  self.containerState._closeFlow = undefined
  return effects.check(blankLine, onBlank, notBlank)

  /** @type {State} */
  function onBlank(code) {
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines ||
      self.containerState.initialBlankLine

    // We have a blank line.
    // Still, try to consume at most the items size.
    return factorySpace(
      effects,
      ok,
      'listItemIndent',
      self.containerState.size + 1
    )(code)
  }

  /** @type {State} */
  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = undefined
      self.containerState.initialBlankLine = undefined
      return notInCurrentItem(code)
    }
    self.containerState.furtherBlankLines = undefined
    self.containerState.initialBlankLine = undefined
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code)
  }

  /** @type {State} */
  function notInCurrentItem(code) {
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined
    // Always populated by defaults.

    return factorySpace(
      effects,
      effects.attempt(list, ok, nok),
      'linePrefix',
      self.parser.constructs.disable.null.includes('codeIndented')
        ? undefined
        : 4
    )(code)
  }
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeIndent(effects, ok, nok) {
  const self = this
  return factorySpace(
    effects,
    afterPrefix,
    'listItemIndent',
    self.containerState.size + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === 'listItemIndent' &&
      tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
      ? ok(code)
      : nok(code)
  }
}

/**
 * @type {Exiter}
 * @this {TokenizeContext}
 */
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type)
}

/**
 * @type {Tokenizer}
 * @this {TokenizeContext}
 */
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  const self = this

  // Always populated by defaults.

  return factorySpace(
    effects,
    afterPrefix,
    'listItemPrefixWhitespace',
    self.parser.constructs.disable.null.includes('codeIndented')
      ? undefined
      : 4 + 1
  )

  /** @type {State} */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return !markdownSpace(code) &&
      tail &&
      tail[1].type === 'listItemPrefixWhitespace'
      ? ok(code)
      : nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/block-quote.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const blockQuote = {
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart,
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteStart(effects, ok, nok) {
  const self = this
  return start

  /**
   * Start of block quote.
   *
   * ```markdown
   * > | > a
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 62) {
      const state = self.containerState
      if (!state.open) {
        effects.enter('blockQuote', {
          _container: true
        })
        state.open = true
      }
      effects.enter('blockQuotePrefix')
      effects.enter('blockQuoteMarker')
      effects.consume(code)
      effects.exit('blockQuoteMarker')
      return after
    }
    return nok(code)
  }

  /**
   * After `>`, before optional whitespace.
   *
   * ```markdown
   * > | > a
   *      ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter('blockQuotePrefixWhitespace')
      effects.consume(code)
      effects.exit('blockQuotePrefixWhitespace')
      effects.exit('blockQuotePrefix')
      return ok
    }
    effects.exit('blockQuotePrefix')
    return ok(code)
  }
}

/**
 * Start of block quote continuation.
 *
 * ```markdown
 *   | > a
 * > | > b
 *     ^
 * ```
 *
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  const self = this
  return contStart

  /**
   * Start of block quote continuation.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contStart(code) {
    if (markdownSpace(code)) {
      // Always populated by defaults.

      return factorySpace(
        effects,
        contBefore,
        'linePrefix',
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : 4
      )(code)
    }
    return contBefore(code)
  }

  /**
   * At `>`, after optional whitespace.
   *
   * Also used to parse the first block quote opening.
   *
   * ```markdown
   *   | > a
   * > | > b
   *     ^
   * ```
   *
   * @type {State}
   */
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code)
  }
}

/** @type {Exiter} */
function exit(effects) {
  effects.exit('blockQuote')
}

;// CONCATENATED MODULE: ./node_modules/micromark-factory-destination/index.js
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


/**
 * Parse destinations.
 *
 * ###### Examples
 *
 * ```markdown
 * <a>
 * <a\>b>
 * <a b>
 * <a)>
 * a
 * a\)b
 * a(b)c
 * a(b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type for whole (`<a>` or `b`).
 * @param {TokenType} literalType
 *   Type when enclosed (`<a>`).
 * @param {TokenType} literalMarkerType
 *   Type for enclosing (`<` and `>`).
 * @param {TokenType} rawType
 *   Type when not enclosed (`b`).
 * @param {TokenType} stringType
 *   Type for the value (`a` or `b`).
 * @param {number | undefined} [max=Infinity]
 *   Depth of nested parens (inclusive).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryDestination(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max
) {
  const limit = max || Number.POSITIVE_INFINITY
  let balance = 0
  return start

  /**
   * Start of destination.
   *
   * ```markdown
   * > | <aa>
   *     ^
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 60) {
      effects.enter(type)
      effects.enter(literalType)
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      return enclosedBefore
    }

    // ASCII control, space, closing paren.
    if (code === null || code === 32 || code === 41 || asciiControl(code)) {
      return nok(code)
    }
    effects.enter(type)
    effects.enter(rawType)
    effects.enter(stringType)
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return raw(code)
  }

  /**
   * After `<`, at an enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      effects.exit(literalType)
      effects.exit(type)
      return ok
    }
    effects.enter(stringType)
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return enclosed(code)
  }

  /**
   * In enclosed destination.
   *
   * ```markdown
   * > | <aa>
   *      ^
   * ```
   *
   * @type {State}
   */
  function enclosed(code) {
    if (code === 62) {
      effects.exit('chunkString')
      effects.exit(stringType)
      return enclosedBefore(code)
    }
    if (code === null || code === 60 || markdownLineEnding(code)) {
      return nok(code)
    }
    effects.consume(code)
    return code === 92 ? enclosedEscape : enclosed
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | <a\*a>
   *        ^
   * ```
   *
   * @type {State}
   */
  function enclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code)
      return enclosed
    }
    return enclosed(code)
  }

  /**
   * In raw destination.
   *
   * ```markdown
   * > | aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function raw(code) {
    if (
      !balance &&
      (code === null || code === 41 || markdownLineEndingOrSpace(code))
    ) {
      effects.exit('chunkString')
      effects.exit(stringType)
      effects.exit(rawType)
      effects.exit(type)
      return ok(code)
    }
    if (balance < limit && code === 40) {
      effects.consume(code)
      balance++
      return raw
    }
    if (code === 41) {
      effects.consume(code)
      balance--
      return raw
    }

    // ASCII control (but *not* `\0`) and space and `(`.
    // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
    // doesn’t.
    if (code === null || code === 32 || code === 40 || asciiControl(code)) {
      return nok(code)
    }
    effects.consume(code)
    return code === 92 ? rawEscape : raw
  }

  /**
   * After `\`, at special character.
   *
   * ```markdown
   * > | a\*a
   *       ^
   * ```
   *
   * @type {State}
   */
  function rawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code)
      return raw
    }
    return raw(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-factory-label/index.js
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */


/**
 * Parse labels.
 *
 * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
 *
 * ###### Examples
 *
 * ```markdown
 * [a]
 * [a
 * b]
 * [a\]b]
 * ```
 *
 * @this {TokenizeContext}
 *   Tokenize context.
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole label (`[a]`).
 * @param {TokenType} markerType
 *   Type for the markers (`[` and `]`).
 * @param {TokenType} stringType
 *   Type for the identifier (`a`).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  const self = this
  let size = 0
  /** @type {boolean} */
  let seen
  return start

  /**
   * Start of label.
   *
   * ```markdown
   * > | [a]
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    effects.enter(stringType)
    return atBreak
  }

  /**
   * In label, at something, before something else.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (
      size > 999 ||
      code === null ||
      code === 91 ||
      (code === 93 && !seen) ||
      // To do: remove in the future once we’ve switched from
      // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
      // which doesn’t need this.
      // Hidden footnotes hook.
      /* c8 ignore next 3 */
      (code === 94 &&
        !size &&
        '_hiddenFootnoteSupport' in self.parser.constructs)
    ) {
      return nok(code)
    }
    if (code === 93) {
      effects.exit(stringType)
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    // To do: indent? Link chunks and EOLs together?
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return atBreak
    }
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return labelInside(code)
  }

  /**
   * In label, in text.
   *
   * ```markdown
   * > | [a]
   *      ^
   * ```
   *
   * @type {State}
   */
  function labelInside(code) {
    if (
      code === null ||
      code === 91 ||
      code === 93 ||
      markdownLineEnding(code) ||
      size++ > 999
    ) {
      effects.exit('chunkString')
      return atBreak(code)
    }
    effects.consume(code)
    if (!seen) seen = !markdownSpace(code)
    return code === 92 ? labelEscape : labelInside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | [a\*a]
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code)
      size++
      return labelInside
    }
    return labelInside(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-factory-title/index.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenType} TokenType
 */



/**
 * Parse titles.
 *
 * ###### Examples
 *
 * ```markdown
 * "a"
 * 'b'
 * (c)
 * "a
 * b"
 * 'a
 *     b'
 * (a\)b)
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole title (`"a"`, `'b'`, `(c)`).
 * @param {TokenType} markerType
 *   Type for the markers (`"`, `'`, `(`, and `)`).
 * @param {TokenType} stringType
 *   Type for the value (`a`).
 * @returns {State}
 *   Start state.
 */ // eslint-disable-next-line max-params
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  /** @type {NonNullable<Code>} */
  let marker
  return start

  /**
   * Start of title.
   *
   * ```markdown
   * > | "a"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (code === 34 || code === 39 || code === 40) {
      effects.enter(type)
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      marker = code === 40 ? 41 : code
      return begin
    }
    return nok(code)
  }

  /**
   * After opening marker.
   *
   * This is also used at the closing marker.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }
    effects.enter(stringType)
    return atBreak(code)
  }

  /**
   * At something, before something else.
   *
   * ```markdown
   * > | "a"
   *      ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType)
      return begin(marker)
    }
    if (code === null) {
      return nok(code)
    }

    // Note: blank lines can’t exist in content.
    if (markdownLineEnding(code)) {
      // To do: use `space_or_tab_eol_with_options`, connect.
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return factorySpace(effects, atBreak, 'linePrefix')
    }
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return inside(code)
  }

  /**
   *
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker || code === null || markdownLineEnding(code)) {
      effects.exit('chunkString')
      return atBreak(code)
    }
    effects.consume(code)
    return code === 92 ? escape : inside
  }

  /**
   * After `\`, at a special character.
   *
   * ```markdown
   * > | "a\*b"
   *      ^
   * ```
   *
   * @type {State}
   */
  function escape(code) {
    if (code === marker || code === 92) {
      effects.consume(code)
      return inside
    }
    return inside(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-factory-whitespace/index.js
/**
 * @typedef {import('micromark-util-types').Effects} Effects
 * @typedef {import('micromark-util-types').State} State
 */



/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   line endings or spaces in markdown are often optional, in which case this
 *     factory can be used and `ok` will be switched to whether spaces were found
 *     or not
 * *   one line ending or space can be detected with
 *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @returns
 *   Start state.
 */
function factoryWhitespace(effects, ok) {
  /** @type {boolean} */
  let seen
  return start

  /** @type {State} */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      seen = true
      return start
    }
    if (markdownSpace(code)) {
      return factorySpace(
        effects,
        start,
        seen ? 'linePrefix' : 'lineSuffix'
      )(code)
    }
    return ok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-normalize-identifier/index.js
/**
 * Normalize an identifier (as found in references, definitions).
 *
 * Collapses markdown whitespace, trim, and then lower- and uppercase.
 *
 * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
 * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
 * uppercase character (U+0398 (`Θ`)).
 * So, to get a canonical form, we perform both lower- and uppercase.
 *
 * Using uppercase last makes sure keys will never interact with default
 * prototypal values (such as `constructor`): nothing in the prototype of
 * `Object` is uppercase.
 *
 * @param {string} value
 *   Identifier to normalize.
 * @returns {string}
 *   Normalized identifier.
 */
function normalizeIdentifier(value) {
  return (
    value
      // Collapse markdown whitespace.
      .replace(/[\t\n\r ]+/g, ' ')
      // Trim.
      .replace(/^ | $/g, '')
      // Some characters are considered “uppercase”, but if their lowercase
      // counterpart is uppercased will result in a different uppercase
      // character.
      // Hence, to get that form, we perform both lower- and uppercase.
      // Upper case makes sure keys will not interact with default prototypal
      // methods: no method is uppercase.
      .toLowerCase()
      .toUpperCase()
  )
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/definition.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */








/** @type {Construct} */
const definition = {
  name: 'definition',
  tokenize: tokenizeDefinition
}

/** @type {Construct} */
const titleBefore = {
  tokenize: tokenizeTitleBefore,
  partial: true
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeDefinition(effects, ok, nok) {
  const self = this
  /** @type {string} */
  let identifier
  return start

  /**
   * At start of a definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // Do not interrupt paragraphs (but do follow definitions).
    // To do: do `interrupt` the way `markdown-rs` does.
    // To do: parse whitespace the way `markdown-rs` does.
    effects.enter('definition')
    return before(code)
  }

  /**
   * After optional whitespace, at `[`.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    // To do: parse whitespace the way `markdown-rs` does.

    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      'definitionLabel',
      'definitionLabelMarker',
      'definitionLabelString'
    )(code)
  }

  /**
   * After label.
   *
   * ```markdown
   * > | [a]: b "c"
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelAfter(code) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    )
    if (code === 58) {
      effects.enter('definitionMarker')
      effects.consume(code)
      effects.exit('definitionMarker')
      return markerAfter
    }
    return nok(code)
  }

  /**
   * After marker.
   *
   * ```markdown
   * > | [a]: b "c"
   *         ^
   * ```
   *
   * @type {State}
   */
  function markerAfter(code) {
    // Note: whitespace is optional.
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, destinationBefore)(code)
      : destinationBefore(code)
  }

  /**
   * Before destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * ```
   *
   * @type {State}
   */
  function destinationBefore(code) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      'definitionDestination',
      'definitionDestinationLiteral',
      'definitionDestinationLiteralMarker',
      'definitionDestinationRaw',
      'definitionDestinationString'
    )(code)
  }

  /**
   * After destination.
   *
   * ```markdown
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code)
  }

  /**
   * After definition.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return markdownSpace(code)
      ? factorySpace(effects, afterWhitespace, 'whitespace')(code)
      : afterWhitespace(code)
  }

  /**
   * After definition, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function afterWhitespace(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('definition')

      // Note: we don’t care about uniqueness.
      // It’s likely that that doesn’t happen very frequently.
      // It is more likely that it wastes precious time.
      self.parser.defined.push(identifier)

      // To do: `markdown-rs` interrupt.
      // // You’d be interrupting.
      // tokenizer.interrupt = true
      return ok(code)
    }
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore

  /**
   * After destination, at whitespace.
   *
   * ```markdown
   * > | [a]: b
   *           ^
   * > | [a]: b "c"
   *           ^
   * ```
   *
   * @type {State}
   */
  function titleBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, beforeMarker)(code)
      : nok(code)
  }

  /**
   * At title.
   *
   * ```markdown
   *   | [a]: b
   * > | "c"
   *     ^
   * ```
   *
   * @type {State}
   */
  function beforeMarker(code) {
    return factoryTitle(
      effects,
      titleAfter,
      nok,
      'definitionTitle',
      'definitionTitleMarker',
      'definitionTitleString'
    )(code)
  }

  /**
   * After title.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfter(code) {
    return markdownSpace(code)
      ? factorySpace(effects, titleAfterOptionalWhitespace, 'whitespace')(code)
      : titleAfterOptionalWhitespace(code)
  }

  /**
   * After title, after optional whitespace.
   *
   * ```markdown
   * > | [a]: b "c"
   *               ^
   * ```
   *
   * @type {State}
   */
  function titleAfterOptionalWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/code-indented.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
}

/** @type {Construct} */
const furtherStart = {
  tokenize: tokenizeFurtherStart,
  partial: true
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  const self = this
  return start

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.

    effects.enter('codeIndented')
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? atBreak(code)
      : nok(code)
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === null) {
      return after(code)
    }
    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code)
    }
    effects.enter('codeFlowValue')
    return inside(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue')
      return atBreak(code)
    }
    effects.consume(code)
    return inside
  }

  /** @type {State} */
  function after(code) {
    effects.exit('codeIndented')
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this
  return furtherStart

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return furtherStart
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    //
    // To do: use an improved `space_or_tab` function like `markdown-rs`,
    // so that we can drop the next state.
    return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
  }

  /**
   * At start, after 1 or 4 spaces.
   *
   * ```markdown
   * > |     aaa
   *         ^
   * ```
   *
   * @type {State}
   */
  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === 'linePrefix' &&
      tail[2].sliceSerialize(tail[1], true).length >= 4
      ? ok(code)
      : markdownLineEnding(code)
      ? furtherStart(code)
      : nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/heading-atx.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */




/** @type {Construct} */
const headingAtx = {
  name: 'headingAtx',
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
}

/** @type {Resolver} */
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2
  let contentStart = 3
  /** @type {Token} */
  let content
  /** @type {Token} */
  let text

  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === 'whitespace') {
    contentStart += 2
  }

  // Suffix whitespace, part of the closing.
  if (
    contentEnd - 2 > contentStart &&
    events[contentEnd][1].type === 'whitespace'
  ) {
    contentEnd -= 2
  }
  if (
    events[contentEnd][1].type === 'atxHeadingSequence' &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart &&
        events[contentEnd - 2][1].type === 'whitespace'))
  ) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4
  }
  if (contentEnd > contentStart) {
    content = {
      type: 'atxHeadingText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    }
    text = {
      type: 'chunkText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: 'text'
    }
    splice(events, contentStart, contentEnd - contentStart + 1, [
      ['enter', content, context],
      ['enter', text, context],
      ['exit', text, context],
      ['exit', content, context]
    ])
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0
  return start

  /**
   * Start of a heading (atx).
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    effects.enter('atxHeading')
    return before(code)
  }

  /**
   * After optional whitespace, at `#`.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('atxHeadingSequence')
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | ## aa
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code)
      return sequenceOpen
    }

    // Always at least one `#`.
    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingSequence')
      return atBreak(code)
    }
    return nok(code)
  }

  /**
   * After something, before something else.
   *
   * ```markdown
   * > | ## aa
   *       ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === 35) {
      effects.enter('atxHeadingSequence')
      return sequenceFurther(code)
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit('atxHeading')
      // To do: interrupt like `markdown-rs`.
      // // Feel free to interrupt.
      // tokenizer.interrupt = false
      return ok(code)
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, 'whitespace')(code)
    }

    // To do: generate `data` tokens, add the `text` token later.
    // Needs edit map, see: `markdown.rs`.
    effects.enter('atxHeadingText')
    return data(code)
  }

  /**
   * In further sequence (after whitespace).
   *
   * Could be normal “visible” hashes in the heading or a final sequence.
   *
   * ```markdown
   * > | ## aa ##
   *           ^
   * ```
   *
   * @type {State}
   */
  function sequenceFurther(code) {
    if (code === 35) {
      effects.consume(code)
      return sequenceFurther
    }
    effects.exit('atxHeadingSequence')
    return atBreak(code)
  }

  /**
   * In text.
   *
   * ```markdown
   * > | ## aa
   *        ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingText')
      return atBreak(code)
    }
    effects.consume(code)
    return data
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/setext-underline.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const setextUnderline = {
  name: 'setextUnderline',
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
}

/** @type {Resolver} */
function resolveToSetextUnderline(events, context) {
  // To do: resolve like `markdown-rs`.
  let index = events.length
  /** @type {number | undefined} */
  let content
  /** @type {number | undefined} */
  let text
  /** @type {number | undefined} */
  let definition

  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === 'content') {
        content = index
        break
      }
      if (events[index][1].type === 'paragraph') {
        text = index
      }
    }
    // Exit
    else {
      if (events[index][1].type === 'content') {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1)
      }
      if (!definition && events[index][1].type === 'definition') {
        definition = index
      }
    }
  }
  const heading = {
    type: 'setextHeading',
    start: Object.assign({}, events[text][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  }

  // Change the paragraph to setext heading text.
  events[text][1].type = 'setextHeadingText'

  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context])
    events.splice(definition + 1, 0, ['exit', events[content][1], context])
    events[content][1].end = Object.assign({}, events[definition][1].end)
  } else {
    events[content][1] = heading
  }

  // Add the heading exit at the end.
  events.push(['exit', heading, context])
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeSetextUnderline(effects, ok, nok) {
  const self = this
  /** @type {NonNullable<Code>} */
  let marker
  return start

  /**
   * At start of heading (setext) underline.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    let index = self.events.length
    /** @type {boolean | undefined} */
    let paragraph
    // Find an opening.
    while (index--) {
      // Skip enter/exit of line ending, line prefix, and content.
      // We can now either have a definition or a paragraph.
      if (
        self.events[index][1].type !== 'lineEnding' &&
        self.events[index][1].type !== 'linePrefix' &&
        self.events[index][1].type !== 'content'
      ) {
        paragraph = self.events[index][1].type === 'paragraph'
        break
      }
    }

    // To do: handle lazy/pierce like `markdown-rs`.
    // To do: parse indent like `markdown-rs`.
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
      effects.enter('setextHeadingLine')
      marker = code
      return before(code)
    }
    return nok(code)
  }

  /**
   * After optional whitespace, at `-` or `=`.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('setextHeadingLineSequence')
    return inside(code)
  }

  /**
   * In sequence.
   *
   * ```markdown
   *   | aa
   * > | ==
   *     ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code)
      return inside
    }
    effects.exit('setextHeadingLineSequence')
    return markdownSpace(code)
      ? factorySpace(effects, after, 'lineSuffix')(code)
      : after(code)
  }

  /**
   * After sequence, after optional whitespace.
   *
   * ```markdown
   *   | aa
   * > | ==
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('setextHeadingLine')
      return ok(code)
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-html-tag-name/index.js
/**
 * List of lowercase HTML “block” tag names.
 *
 * The list, when parsing HTML (flow), results in more relaxed rules (condition
 * 6).
 * Because they are known blocks, the HTML-like syntax doesn’t have to be
 * strictly parsed.
 * For tag names not in this list, a more strict algorithm (condition 7) is used
 * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
 *
 * This is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
 */
const htmlBlockNames = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'search',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
]

/**
 * List of lowercase HTML “raw” tag names.
 *
 * The list, when parsing HTML (flow), results in HTML that can include lines
 * without exiting, until a closing tag also in this list is found (condition
 * 1).
 *
 * This module is copied from:
 * <https://spec.commonmark.org/0.30/#html-blocks>.
 *
 * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
 */
const htmlRawNames = ['pre', 'script', 'style', 'textarea']

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/html-flow.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */





/** @type {Construct} */
const htmlFlow = {
  name: 'htmlFlow',
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
}

/** @type {Construct} */
const blankLineBefore = {
  tokenize: tokenizeBlankLineBefore,
  partial: true
}
const nonLazyContinuationStart = {
  tokenize: tokenizeNonLazyContinuationStart,
  partial: true
}

/** @type {Resolver} */
function resolveToHtmlFlow(events) {
  let index = events.length
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
      break
    }
  }
  if (index > 1 && events[index - 2][1].type === 'linePrefix') {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start
    // Remove the line prefix.
    events.splice(index - 2, 2)
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlFlow(effects, ok, nok) {
  const self = this
  /** @type {number} */
  let marker
  /** @type {boolean} */
  let closingTag
  /** @type {string} */
  let buffer
  /** @type {number} */
  let index
  /** @type {Code} */
  let markerB
  return start

  /**
   * Start of HTML (flow).
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse indent like `markdown-rs`.
    return before(code)
  }

  /**
   * At `<`, after optional whitespace.
   *
   * ```markdown
   * > | <x />
   *     ^
   * ```
   *
   * @type {State}
   */
  function before(code) {
    effects.enter('htmlFlow')
    effects.enter('htmlFlowData')
    effects.consume(code)
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | <x />
   *      ^
   * > | <!doctype>
   *      ^
   * > | <!--xxx-->
   *      ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code)
      return declarationOpen
    }
    if (code === 47) {
      effects.consume(code)
      closingTag = true
      return tagCloseStart
    }
    if (code === 63) {
      effects.consume(code)
      marker = 3
      // To do:
      // tokenizer.concrete = true
      // To do: use `markdown-rs` style interrupt.
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok : continuationDeclarationInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code)
      return tagName
    }
    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | <!doctype>
   *       ^
   * > | <!--xxx-->
   *       ^
   * > | <![CDATA[>&<]]>
   *       ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code)
      marker = 2
      return commentOpenInside
    }
    if (code === 91) {
      effects.consume(code)
      marker = 5
      index = 0
      return cdataOpenInside
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code)
      marker = 4
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }
    return nok(code)
  }

  /**
   * After `<!-`, inside a comment, at another `-`.
   *
   * ```markdown
   * > | <!--xxx-->
   *        ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code)
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuationDeclarationInside
    }
    return nok(code)
  }

  /**
   * After `<![`, inside CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *        ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = 'CDATA['
    if (code === value.charCodeAt(index++)) {
      effects.consume(code)
      if (index === value.length) {
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok : continuation
      }
      return cdataOpenInside
    }
    return nok(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | </x>
   *       ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer = String.fromCharCode(code)
      return tagName
    }
    return nok(code)
  }

  /**
   * In tag name.
   *
   * ```markdown
   * > | <ab>
   *      ^^
   * > | </ab>
   *       ^^
   * ```
   *
   * @type {State}
   */
  function tagName(code) {
    if (
      code === null ||
      code === 47 ||
      code === 62 ||
      markdownLineEndingOrSpace(code)
    ) {
      const slash = code === 47
      const name = buffer.toLowerCase()
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = 1
        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = 6
        if (slash) {
          effects.consume(code)
          return basicSelfClosing
        }

        // // Do not form containers.
        // tokenizer.concrete = true
        return self.interrupt ? ok(code) : continuation(code)
      }
      marker = 7
      // Do not support complete HTML when interrupting.
      return self.interrupt && !self.parser.lazy[self.now().line]
        ? nok(code)
        : closingTag
        ? completeClosingTagAfter(code)
        : completeAttributeNameBefore(code)
    }

    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      buffer += String.fromCharCode(code)
      return tagName
    }
    return nok(code)
  }

  /**
   * After closing slash of a basic tag name.
   *
   * ```markdown
   * > | <div/>
   *          ^
   * ```
   *
   * @type {State}
   */
  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code)
      // // Do not form containers.
      // tokenizer.concrete = true
      return self.interrupt ? ok : continuation
    }
    return nok(code)
  }

  /**
   * After closing slash of a complete tag name.
   *
   * ```markdown
   * > | <x/>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeClosingTagAfter
    }
    return completeEnd(code)
  }

  /**
   * At an attribute name.
   *
   * At first, this state is used after a complete tag name, after whitespace,
   * where it expects optional attributes or the end of the tag.
   * It is also reused after attributes, when expecting more optional
   * attributes.
   *
   * ```markdown
   * > | <a />
   *        ^
   * > | <a :b>
   *        ^
   * > | <a _b>
   *        ^
   * > | <a b>
   *        ^
   * > | <a >
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code)
      return completeEnd
    }

    // ASCII alphanumerical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code)
      return completeAttributeName
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeNameBefore
    }
    return completeEnd(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | <a :b>
   *         ^
   * > | <a _b>
   *         ^
   * > | <a b>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeName(code) {
    // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code)
      return completeAttributeName
    }
    return completeAttributeNameAfter(code)
  }

  /**
   * After attribute name, at an optional initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | <a b>
   *         ^
   * > | <a b=c>
   *         ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code)
      return completeAttributeValueBefore
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeNameAfter
    }
    return completeAttributeNameBefore(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * > | <a b="c">
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 34 || code === 39) {
      effects.consume(code)
      markerB = code
      return completeAttributeValueQuoted
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeValueBefore
    }
    return completeAttributeValueUnquoted(code)
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | <a b="c">
   *           ^
   * > | <a b='c'>
   *           ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code)
      markerB = null
      return completeAttributeValueQuotedAfter
    }
    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }
    effects.consume(code)
    return completeAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | <a b=c>
   *          ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 47 ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96 ||
      markdownLineEndingOrSpace(code)
    ) {
      return completeAttributeNameAfter(code)
    }
    effects.consume(code)
    return completeAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the
   * end of the tag.
   *
   * ```markdown
   * > | <a b="c">
   *            ^
   * ```
   *
   * @type {State}
   */
  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownSpace(code)) {
      return completeAttributeNameBefore(code)
    }
    return nok(code)
  }

  /**
   * In certain circumstances of a complete tag where only an `>` is allowed.
   *
   * ```markdown
   * > | <a b="c">
   *             ^
   * ```
   *
   * @type {State}
   */
  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code)
      return completeAfter
    }
    return nok(code)
  }

  /**
   * After `>` in a complete tag.
   *
   * ```markdown
   * > | <x>
   *        ^
   * ```
   *
   * @type {State}
   */
  function completeAfter(code) {
    if (code === null || markdownLineEnding(code)) {
      // // Do not form containers.
      // tokenizer.concrete = true
      return continuation(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAfter
    }
    return nok(code)
  }

  /**
   * In continuation of any HTML kind.
   *
   * ```markdown
   * > | <!--xxx-->
   *          ^
   * ```
   *
   * @type {State}
   */
  function continuation(code) {
    if (code === 45 && marker === 2) {
      effects.consume(code)
      return continuationCommentInside
    }
    if (code === 60 && marker === 1) {
      effects.consume(code)
      return continuationRawTagOpen
    }
    if (code === 62 && marker === 4) {
      effects.consume(code)
      return continuationClose
    }
    if (code === 63 && marker === 3) {
      effects.consume(code)
      return continuationDeclarationInside
    }
    if (code === 93 && marker === 5) {
      effects.consume(code)
      return continuationCdataInside
    }
    if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
      effects.exit('htmlFlowData')
      return effects.check(
        blankLineBefore,
        continuationAfter,
        continuationStart
      )(code)
    }
    if (code === null || markdownLineEnding(code)) {
      effects.exit('htmlFlowData')
      return continuationStart(code)
    }
    effects.consume(code)
    return continuation
  }

  /**
   * In continuation, at eol.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStart(code) {
    return effects.check(
      nonLazyContinuationStart,
      continuationStartNonLazy,
      continuationAfter
    )(code)
  }

  /**
   * In continuation, at eol, before non-lazy content.
   *
   * ```markdown
   * > | <x>
   *        ^
   *   | asd
   * ```
   *
   * @type {State}
   */
  function continuationStartNonLazy(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return continuationBefore
  }

  /**
   * In continuation, before non-lazy content.
   *
   * ```markdown
   *   | <x>
   * > | asd
   *     ^
   * ```
   *
   * @type {State}
   */
  function continuationBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return continuationStart(code)
    }
    effects.enter('htmlFlowData')
    return continuation(code)
  }

  /**
   * In comment continuation, after one `-`, expecting another.
   *
   * ```markdown
   * > | <!--xxx-->
   *             ^
   * ```
   *
   * @type {State}
   */
  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code)
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In raw continuation, after `<`, at `/`.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                            ^
   * ```
   *
   * @type {State}
   */
  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code)
      buffer = ''
      return continuationRawEndTag
    }
    return continuation(code)
  }

  /**
   * In raw continuation, after `</`, in a raw tag name.
   *
   * ```markdown
   * > | <script>console.log(1)</script>
   *                             ^^^^^^
   * ```
   *
   * @type {State}
   */
  function continuationRawEndTag(code) {
    if (code === 62) {
      const name = buffer.toLowerCase()
      if (htmlRawNames.includes(name)) {
        effects.consume(code)
        return continuationClose
      }
      return continuation(code)
    }
    if (asciiAlpha(code) && buffer.length < 8) {
      effects.consume(code)
      // @ts-expect-error: not null.
      buffer += String.fromCharCode(code)
      return continuationRawEndTag
    }
    return continuation(code)
  }

  /**
   * In cdata continuation, after `]`, expecting `]>`.
   *
   * ```markdown
   * > | <![CDATA[>&<]]>
   *                  ^
   * ```
   *
   * @type {State}
   */
  function continuationCdataInside(code) {
    if (code === 93) {
      effects.consume(code)
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In declaration or instruction continuation, at `>`.
   *
   * ```markdown
   * > | <!-->
   *         ^
   * > | <?>
   *       ^
   * > | <!q>
   *        ^
   * > | <!--ab-->
   *             ^
   * > | <![CDATA[>&<]]>
   *                   ^
   * ```
   *
   * @type {State}
   */
  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code)
      return continuationClose
    }

    // More dashes.
    if (code === 45 && marker === 2) {
      effects.consume(code)
      return continuationDeclarationInside
    }
    return continuation(code)
  }

  /**
   * In closed continuation: everything we get until the eol/eof is part of it.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationClose(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('htmlFlowData')
      return continuationAfter(code)
    }
    effects.consume(code)
    return continuationClose
  }

  /**
   * Done.
   *
   * ```markdown
   * > | <!doctype>
   *               ^
   * ```
   *
   * @type {State}
   */
  function continuationAfter(code) {
    effects.exit('htmlFlow')
    // // Feel free to interrupt.
    // tokenizer.interrupt = false
    // // No longer concrete.
    // tokenizer.concrete = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuationStart(effects, ok, nok) {
  const self = this
  return start

  /**
   * At eol, before continuation.
   *
   * ```markdown
   * > | * ```js
   *            ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return after
    }
    return nok(code)
  }

  /**
   * A continuation.
   *
   * ```markdown
   *   | * ```js
   * > | b
   *     ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start

  /**
   * Before eol, expecting blank line.
   *
   * ```markdown
   * > | <div>
   *          ^
   *   |
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return effects.attempt(blankLine, ok, nok)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/code-fenced.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const nonLazyContinuation = {
  tokenize: tokenizeNonLazyContinuation,
  partial: true
}

/** @type {Construct} */
const codeFenced = {
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced,
  concrete: true
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeFenced(effects, ok, nok) {
  const self = this
  /** @type {Construct} */
  const closeStart = {
    tokenize: tokenizeCloseStart,
    partial: true
  }
  let initialPrefix = 0
  let sizeOpen = 0
  /** @type {NonNullable<Code>} */
  let marker
  return start

  /**
   * Start of code.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: parse whitespace like `markdown-rs`.
    return beforeSequenceOpen(code)
  }

  /**
   * In opening fence, after prefix, at sequence.
   *
   * ```markdown
   * > | ~~~js
   *     ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeSequenceOpen(code) {
    const tail = self.events[self.events.length - 1]
    initialPrefix =
      tail && tail[1].type === 'linePrefix'
        ? tail[2].sliceSerialize(tail[1], true).length
        : 0
    marker = code
    effects.enter('codeFenced')
    effects.enter('codeFencedFence')
    effects.enter('codeFencedFenceSequence')
    return sequenceOpen(code)
  }

  /**
   * In opening fence sequence.
   *
   * ```markdown
   * > | ~~~js
   *      ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++
      effects.consume(code)
      return sequenceOpen
    }
    if (sizeOpen < 3) {
      return nok(code)
    }
    effects.exit('codeFencedFenceSequence')
    return markdownSpace(code)
      ? factorySpace(effects, infoBefore, 'whitespace')(code)
      : infoBefore(code)
  }

  /**
   * In opening fence, after the sequence (and optional whitespace), before info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function infoBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFencedFence')
      return self.interrupt
        ? ok(code)
        : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }
    effects.enter('codeFencedFenceInfo')
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return info(code)
  }

  /**
   * In info.
   *
   * ```markdown
   * > | ~~~js
   *        ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function info(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString')
      effects.exit('codeFencedFenceInfo')
      return infoBefore(code)
    }
    if (markdownSpace(code)) {
      effects.exit('chunkString')
      effects.exit('codeFencedFenceInfo')
      return factorySpace(effects, metaBefore, 'whitespace')(code)
    }
    if (code === 96 && code === marker) {
      return nok(code)
    }
    effects.consume(code)
    return info
  }

  /**
   * In opening fence, after info and whitespace, before meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function metaBefore(code) {
    if (code === null || markdownLineEnding(code)) {
      return infoBefore(code)
    }
    effects.enter('codeFencedFenceMeta')
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return meta(code)
  }

  /**
   * In meta.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^
   *   | alert(1)
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString')
      effects.exit('codeFencedFenceMeta')
      return infoBefore(code)
    }
    if (code === 96 && code === marker) {
      return nok(code)
    }
    effects.consume(code)
    return meta
  }

  /**
   * At eol/eof in code, before a non-lazy closing fence or content.
   *
   * ```markdown
   * > | ~~~js
   *          ^
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function atNonLazyBreak(code) {
    return effects.attempt(closeStart, after, contentBefore)(code)
  }

  /**
   * Before code content, not a closing fence, at eol.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *             ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentBefore(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return contentStart
  }

  /**
   * Before code content, not a closing fence.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code)
      ? factorySpace(
          effects,
          beforeContentChunk,
          'linePrefix',
          initialPrefix + 1
        )(code)
      : beforeContentChunk(code)
  }

  /**
   * Before code content, after optional prefix.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function beforeContentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
    }
    effects.enter('codeFlowValue')
    return contentChunk(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   *   | ~~~js
   * > | alert(1)
   *     ^^^^^^^^
   *   | ~~~
   * ```
   *
   * @type {State}
   */
  function contentChunk(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue')
      return beforeContentChunk(code)
    }
    effects.consume(code)
    return contentChunk
  }

  /**
   * After code.
   *
   * ```markdown
   *   | ~~~js
   *   | alert(1)
   * > | ~~~
   *        ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    effects.exit('codeFenced')
    return ok(code)
  }

  /**
   * @this {TokenizeContext}
   * @type {Tokenizer}
   */
  function tokenizeCloseStart(effects, ok, nok) {
    let size = 0
    return startBefore

    /**
     *
     *
     * @type {State}
     */
    function startBefore(code) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return start
    }

    /**
     * Before closing fence, at optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function start(code) {
      // Always populated by defaults.

      // To do: `enter` here or in next state?
      effects.enter('codeFencedFence')
      return markdownSpace(code)
        ? factorySpace(
            effects,
            beforeSequenceClose,
            'linePrefix',
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : 4
          )(code)
        : beforeSequenceClose(code)
    }

    /**
     * In closing fence, after optional whitespace, at sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects.enter('codeFencedFenceSequence')
        return sequenceClose(code)
      }
      return nok(code)
    }

    /**
     * In closing fence sequence.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *     ^
     * ```
     *
     * @type {State}
     */
    function sequenceClose(code) {
      if (code === marker) {
        size++
        effects.consume(code)
        return sequenceClose
      }
      if (size >= sizeOpen) {
        effects.exit('codeFencedFenceSequence')
        return markdownSpace(code)
          ? factorySpace(effects, sequenceCloseAfter, 'whitespace')(code)
          : sequenceCloseAfter(code)
      }
      return nok(code)
    }

    /**
     * After closing fence sequence, after optional whitespace.
     *
     * ```markdown
     *   | ~~~js
     *   | alert(1)
     * > | ~~~
     *        ^
     * ```
     *
     * @type {State}
     */
    function sequenceCloseAfter(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit('codeFencedFence')
        return ok(code)
      }
      return nok(code)
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeNonLazyContinuation(effects, ok, nok) {
  const self = this
  return start

  /**
   *
   *
   * @type {State}
   */
  function start(code) {
    if (code === null) {
      return nok(code)
    }
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return lineStart
  }

  /**
   *
   *
   * @type {State}
   */
  function lineStart(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/character-entities/index.js
/**
 * Map of named character references.
 *
 * @type {Record<string, string>}
 */
const characterEntities = {
  AElig: 'Æ',
  AMP: '&',
  Aacute: 'Á',
  Abreve: 'Ă',
  Acirc: 'Â',
  Acy: 'А',
  Afr: '𝔄',
  Agrave: 'À',
  Alpha: 'Α',
  Amacr: 'Ā',
  And: '⩓',
  Aogon: 'Ą',
  Aopf: '𝔸',
  ApplyFunction: '⁡',
  Aring: 'Å',
  Ascr: '𝒜',
  Assign: '≔',
  Atilde: 'Ã',
  Auml: 'Ä',
  Backslash: '∖',
  Barv: '⫧',
  Barwed: '⌆',
  Bcy: 'Б',
  Because: '∵',
  Bernoullis: 'ℬ',
  Beta: 'Β',
  Bfr: '𝔅',
  Bopf: '𝔹',
  Breve: '˘',
  Bscr: 'ℬ',
  Bumpeq: '≎',
  CHcy: 'Ч',
  COPY: '©',
  Cacute: 'Ć',
  Cap: '⋒',
  CapitalDifferentialD: 'ⅅ',
  Cayleys: 'ℭ',
  Ccaron: 'Č',
  Ccedil: 'Ç',
  Ccirc: 'Ĉ',
  Cconint: '∰',
  Cdot: 'Ċ',
  Cedilla: '¸',
  CenterDot: '·',
  Cfr: 'ℭ',
  Chi: 'Χ',
  CircleDot: '⊙',
  CircleMinus: '⊖',
  CirclePlus: '⊕',
  CircleTimes: '⊗',
  ClockwiseContourIntegral: '∲',
  CloseCurlyDoubleQuote: '”',
  CloseCurlyQuote: '’',
  Colon: '∷',
  Colone: '⩴',
  Congruent: '≡',
  Conint: '∯',
  ContourIntegral: '∮',
  Copf: 'ℂ',
  Coproduct: '∐',
  CounterClockwiseContourIntegral: '∳',
  Cross: '⨯',
  Cscr: '𝒞',
  Cup: '⋓',
  CupCap: '≍',
  DD: 'ⅅ',
  DDotrahd: '⤑',
  DJcy: 'Ђ',
  DScy: 'Ѕ',
  DZcy: 'Џ',
  Dagger: '‡',
  Darr: '↡',
  Dashv: '⫤',
  Dcaron: 'Ď',
  Dcy: 'Д',
  Del: '∇',
  Delta: 'Δ',
  Dfr: '𝔇',
  DiacriticalAcute: '´',
  DiacriticalDot: '˙',
  DiacriticalDoubleAcute: '˝',
  DiacriticalGrave: '`',
  DiacriticalTilde: '˜',
  Diamond: '⋄',
  DifferentialD: 'ⅆ',
  Dopf: '𝔻',
  Dot: '¨',
  DotDot: '⃜',
  DotEqual: '≐',
  DoubleContourIntegral: '∯',
  DoubleDot: '¨',
  DoubleDownArrow: '⇓',
  DoubleLeftArrow: '⇐',
  DoubleLeftRightArrow: '⇔',
  DoubleLeftTee: '⫤',
  DoubleLongLeftArrow: '⟸',
  DoubleLongLeftRightArrow: '⟺',
  DoubleLongRightArrow: '⟹',
  DoubleRightArrow: '⇒',
  DoubleRightTee: '⊨',
  DoubleUpArrow: '⇑',
  DoubleUpDownArrow: '⇕',
  DoubleVerticalBar: '∥',
  DownArrow: '↓',
  DownArrowBar: '⤓',
  DownArrowUpArrow: '⇵',
  DownBreve: '̑',
  DownLeftRightVector: '⥐',
  DownLeftTeeVector: '⥞',
  DownLeftVector: '↽',
  DownLeftVectorBar: '⥖',
  DownRightTeeVector: '⥟',
  DownRightVector: '⇁',
  DownRightVectorBar: '⥗',
  DownTee: '⊤',
  DownTeeArrow: '↧',
  Downarrow: '⇓',
  Dscr: '𝒟',
  Dstrok: 'Đ',
  ENG: 'Ŋ',
  ETH: 'Ð',
  Eacute: 'É',
  Ecaron: 'Ě',
  Ecirc: 'Ê',
  Ecy: 'Э',
  Edot: 'Ė',
  Efr: '𝔈',
  Egrave: 'È',
  Element: '∈',
  Emacr: 'Ē',
  EmptySmallSquare: '◻',
  EmptyVerySmallSquare: '▫',
  Eogon: 'Ę',
  Eopf: '𝔼',
  Epsilon: 'Ε',
  Equal: '⩵',
  EqualTilde: '≂',
  Equilibrium: '⇌',
  Escr: 'ℰ',
  Esim: '⩳',
  Eta: 'Η',
  Euml: 'Ë',
  Exists: '∃',
  ExponentialE: 'ⅇ',
  Fcy: 'Ф',
  Ffr: '𝔉',
  FilledSmallSquare: '◼',
  FilledVerySmallSquare: '▪',
  Fopf: '𝔽',
  ForAll: '∀',
  Fouriertrf: 'ℱ',
  Fscr: 'ℱ',
  GJcy: 'Ѓ',
  GT: '>',
  Gamma: 'Γ',
  Gammad: 'Ϝ',
  Gbreve: 'Ğ',
  Gcedil: 'Ģ',
  Gcirc: 'Ĝ',
  Gcy: 'Г',
  Gdot: 'Ġ',
  Gfr: '𝔊',
  Gg: '⋙',
  Gopf: '𝔾',
  GreaterEqual: '≥',
  GreaterEqualLess: '⋛',
  GreaterFullEqual: '≧',
  GreaterGreater: '⪢',
  GreaterLess: '≷',
  GreaterSlantEqual: '⩾',
  GreaterTilde: '≳',
  Gscr: '𝒢',
  Gt: '≫',
  HARDcy: 'Ъ',
  Hacek: 'ˇ',
  Hat: '^',
  Hcirc: 'Ĥ',
  Hfr: 'ℌ',
  HilbertSpace: 'ℋ',
  Hopf: 'ℍ',
  HorizontalLine: '─',
  Hscr: 'ℋ',
  Hstrok: 'Ħ',
  HumpDownHump: '≎',
  HumpEqual: '≏',
  IEcy: 'Е',
  IJlig: 'Ĳ',
  IOcy: 'Ё',
  Iacute: 'Í',
  Icirc: 'Î',
  Icy: 'И',
  Idot: 'İ',
  Ifr: 'ℑ',
  Igrave: 'Ì',
  Im: 'ℑ',
  Imacr: 'Ī',
  ImaginaryI: 'ⅈ',
  Implies: '⇒',
  Int: '∬',
  Integral: '∫',
  Intersection: '⋂',
  InvisibleComma: '⁣',
  InvisibleTimes: '⁢',
  Iogon: 'Į',
  Iopf: '𝕀',
  Iota: 'Ι',
  Iscr: 'ℐ',
  Itilde: 'Ĩ',
  Iukcy: 'І',
  Iuml: 'Ï',
  Jcirc: 'Ĵ',
  Jcy: 'Й',
  Jfr: '𝔍',
  Jopf: '𝕁',
  Jscr: '𝒥',
  Jsercy: 'Ј',
  Jukcy: 'Є',
  KHcy: 'Х',
  KJcy: 'Ќ',
  Kappa: 'Κ',
  Kcedil: 'Ķ',
  Kcy: 'К',
  Kfr: '𝔎',
  Kopf: '𝕂',
  Kscr: '𝒦',
  LJcy: 'Љ',
  LT: '<',
  Lacute: 'Ĺ',
  Lambda: 'Λ',
  Lang: '⟪',
  Laplacetrf: 'ℒ',
  Larr: '↞',
  Lcaron: 'Ľ',
  Lcedil: 'Ļ',
  Lcy: 'Л',
  LeftAngleBracket: '⟨',
  LeftArrow: '←',
  LeftArrowBar: '⇤',
  LeftArrowRightArrow: '⇆',
  LeftCeiling: '⌈',
  LeftDoubleBracket: '⟦',
  LeftDownTeeVector: '⥡',
  LeftDownVector: '⇃',
  LeftDownVectorBar: '⥙',
  LeftFloor: '⌊',
  LeftRightArrow: '↔',
  LeftRightVector: '⥎',
  LeftTee: '⊣',
  LeftTeeArrow: '↤',
  LeftTeeVector: '⥚',
  LeftTriangle: '⊲',
  LeftTriangleBar: '⧏',
  LeftTriangleEqual: '⊴',
  LeftUpDownVector: '⥑',
  LeftUpTeeVector: '⥠',
  LeftUpVector: '↿',
  LeftUpVectorBar: '⥘',
  LeftVector: '↼',
  LeftVectorBar: '⥒',
  Leftarrow: '⇐',
  Leftrightarrow: '⇔',
  LessEqualGreater: '⋚',
  LessFullEqual: '≦',
  LessGreater: '≶',
  LessLess: '⪡',
  LessSlantEqual: '⩽',
  LessTilde: '≲',
  Lfr: '𝔏',
  Ll: '⋘',
  Lleftarrow: '⇚',
  Lmidot: 'Ŀ',
  LongLeftArrow: '⟵',
  LongLeftRightArrow: '⟷',
  LongRightArrow: '⟶',
  Longleftarrow: '⟸',
  Longleftrightarrow: '⟺',
  Longrightarrow: '⟹',
  Lopf: '𝕃',
  LowerLeftArrow: '↙',
  LowerRightArrow: '↘',
  Lscr: 'ℒ',
  Lsh: '↰',
  Lstrok: 'Ł',
  Lt: '≪',
  Map: '⤅',
  Mcy: 'М',
  MediumSpace: ' ',
  Mellintrf: 'ℳ',
  Mfr: '𝔐',
  MinusPlus: '∓',
  Mopf: '𝕄',
  Mscr: 'ℳ',
  Mu: 'Μ',
  NJcy: 'Њ',
  Nacute: 'Ń',
  Ncaron: 'Ň',
  Ncedil: 'Ņ',
  Ncy: 'Н',
  NegativeMediumSpace: '​',
  NegativeThickSpace: '​',
  NegativeThinSpace: '​',
  NegativeVeryThinSpace: '​',
  NestedGreaterGreater: '≫',
  NestedLessLess: '≪',
  NewLine: '\n',
  Nfr: '𝔑',
  NoBreak: '⁠',
  NonBreakingSpace: ' ',
  Nopf: 'ℕ',
  Not: '⫬',
  NotCongruent: '≢',
  NotCupCap: '≭',
  NotDoubleVerticalBar: '∦',
  NotElement: '∉',
  NotEqual: '≠',
  NotEqualTilde: '≂̸',
  NotExists: '∄',
  NotGreater: '≯',
  NotGreaterEqual: '≱',
  NotGreaterFullEqual: '≧̸',
  NotGreaterGreater: '≫̸',
  NotGreaterLess: '≹',
  NotGreaterSlantEqual: '⩾̸',
  NotGreaterTilde: '≵',
  NotHumpDownHump: '≎̸',
  NotHumpEqual: '≏̸',
  NotLeftTriangle: '⋪',
  NotLeftTriangleBar: '⧏̸',
  NotLeftTriangleEqual: '⋬',
  NotLess: '≮',
  NotLessEqual: '≰',
  NotLessGreater: '≸',
  NotLessLess: '≪̸',
  NotLessSlantEqual: '⩽̸',
  NotLessTilde: '≴',
  NotNestedGreaterGreater: '⪢̸',
  NotNestedLessLess: '⪡̸',
  NotPrecedes: '⊀',
  NotPrecedesEqual: '⪯̸',
  NotPrecedesSlantEqual: '⋠',
  NotReverseElement: '∌',
  NotRightTriangle: '⋫',
  NotRightTriangleBar: '⧐̸',
  NotRightTriangleEqual: '⋭',
  NotSquareSubset: '⊏̸',
  NotSquareSubsetEqual: '⋢',
  NotSquareSuperset: '⊐̸',
  NotSquareSupersetEqual: '⋣',
  NotSubset: '⊂⃒',
  NotSubsetEqual: '⊈',
  NotSucceeds: '⊁',
  NotSucceedsEqual: '⪰̸',
  NotSucceedsSlantEqual: '⋡',
  NotSucceedsTilde: '≿̸',
  NotSuperset: '⊃⃒',
  NotSupersetEqual: '⊉',
  NotTilde: '≁',
  NotTildeEqual: '≄',
  NotTildeFullEqual: '≇',
  NotTildeTilde: '≉',
  NotVerticalBar: '∤',
  Nscr: '𝒩',
  Ntilde: 'Ñ',
  Nu: 'Ν',
  OElig: 'Œ',
  Oacute: 'Ó',
  Ocirc: 'Ô',
  Ocy: 'О',
  Odblac: 'Ő',
  Ofr: '𝔒',
  Ograve: 'Ò',
  Omacr: 'Ō',
  Omega: 'Ω',
  Omicron: 'Ο',
  Oopf: '𝕆',
  OpenCurlyDoubleQuote: '“',
  OpenCurlyQuote: '‘',
  Or: '⩔',
  Oscr: '𝒪',
  Oslash: 'Ø',
  Otilde: 'Õ',
  Otimes: '⨷',
  Ouml: 'Ö',
  OverBar: '‾',
  OverBrace: '⏞',
  OverBracket: '⎴',
  OverParenthesis: '⏜',
  PartialD: '∂',
  Pcy: 'П',
  Pfr: '𝔓',
  Phi: 'Φ',
  Pi: 'Π',
  PlusMinus: '±',
  Poincareplane: 'ℌ',
  Popf: 'ℙ',
  Pr: '⪻',
  Precedes: '≺',
  PrecedesEqual: '⪯',
  PrecedesSlantEqual: '≼',
  PrecedesTilde: '≾',
  Prime: '″',
  Product: '∏',
  Proportion: '∷',
  Proportional: '∝',
  Pscr: '𝒫',
  Psi: 'Ψ',
  QUOT: '"',
  Qfr: '𝔔',
  Qopf: 'ℚ',
  Qscr: '𝒬',
  RBarr: '⤐',
  REG: '®',
  Racute: 'Ŕ',
  Rang: '⟫',
  Rarr: '↠',
  Rarrtl: '⤖',
  Rcaron: 'Ř',
  Rcedil: 'Ŗ',
  Rcy: 'Р',
  Re: 'ℜ',
  ReverseElement: '∋',
  ReverseEquilibrium: '⇋',
  ReverseUpEquilibrium: '⥯',
  Rfr: 'ℜ',
  Rho: 'Ρ',
  RightAngleBracket: '⟩',
  RightArrow: '→',
  RightArrowBar: '⇥',
  RightArrowLeftArrow: '⇄',
  RightCeiling: '⌉',
  RightDoubleBracket: '⟧',
  RightDownTeeVector: '⥝',
  RightDownVector: '⇂',
  RightDownVectorBar: '⥕',
  RightFloor: '⌋',
  RightTee: '⊢',
  RightTeeArrow: '↦',
  RightTeeVector: '⥛',
  RightTriangle: '⊳',
  RightTriangleBar: '⧐',
  RightTriangleEqual: '⊵',
  RightUpDownVector: '⥏',
  RightUpTeeVector: '⥜',
  RightUpVector: '↾',
  RightUpVectorBar: '⥔',
  RightVector: '⇀',
  RightVectorBar: '⥓',
  Rightarrow: '⇒',
  Ropf: 'ℝ',
  RoundImplies: '⥰',
  Rrightarrow: '⇛',
  Rscr: 'ℛ',
  Rsh: '↱',
  RuleDelayed: '⧴',
  SHCHcy: 'Щ',
  SHcy: 'Ш',
  SOFTcy: 'Ь',
  Sacute: 'Ś',
  Sc: '⪼',
  Scaron: 'Š',
  Scedil: 'Ş',
  Scirc: 'Ŝ',
  Scy: 'С',
  Sfr: '𝔖',
  ShortDownArrow: '↓',
  ShortLeftArrow: '←',
  ShortRightArrow: '→',
  ShortUpArrow: '↑',
  Sigma: 'Σ',
  SmallCircle: '∘',
  Sopf: '𝕊',
  Sqrt: '√',
  Square: '□',
  SquareIntersection: '⊓',
  SquareSubset: '⊏',
  SquareSubsetEqual: '⊑',
  SquareSuperset: '⊐',
  SquareSupersetEqual: '⊒',
  SquareUnion: '⊔',
  Sscr: '𝒮',
  Star: '⋆',
  Sub: '⋐',
  Subset: '⋐',
  SubsetEqual: '⊆',
  Succeeds: '≻',
  SucceedsEqual: '⪰',
  SucceedsSlantEqual: '≽',
  SucceedsTilde: '≿',
  SuchThat: '∋',
  Sum: '∑',
  Sup: '⋑',
  Superset: '⊃',
  SupersetEqual: '⊇',
  Supset: '⋑',
  THORN: 'Þ',
  TRADE: '™',
  TSHcy: 'Ћ',
  TScy: 'Ц',
  Tab: '\t',
  Tau: 'Τ',
  Tcaron: 'Ť',
  Tcedil: 'Ţ',
  Tcy: 'Т',
  Tfr: '𝔗',
  Therefore: '∴',
  Theta: 'Θ',
  ThickSpace: '  ',
  ThinSpace: ' ',
  Tilde: '∼',
  TildeEqual: '≃',
  TildeFullEqual: '≅',
  TildeTilde: '≈',
  Topf: '𝕋',
  TripleDot: '⃛',
  Tscr: '𝒯',
  Tstrok: 'Ŧ',
  Uacute: 'Ú',
  Uarr: '↟',
  Uarrocir: '⥉',
  Ubrcy: 'Ў',
  Ubreve: 'Ŭ',
  Ucirc: 'Û',
  Ucy: 'У',
  Udblac: 'Ű',
  Ufr: '𝔘',
  Ugrave: 'Ù',
  Umacr: 'Ū',
  UnderBar: '_',
  UnderBrace: '⏟',
  UnderBracket: '⎵',
  UnderParenthesis: '⏝',
  Union: '⋃',
  UnionPlus: '⊎',
  Uogon: 'Ų',
  Uopf: '𝕌',
  UpArrow: '↑',
  UpArrowBar: '⤒',
  UpArrowDownArrow: '⇅',
  UpDownArrow: '↕',
  UpEquilibrium: '⥮',
  UpTee: '⊥',
  UpTeeArrow: '↥',
  Uparrow: '⇑',
  Updownarrow: '⇕',
  UpperLeftArrow: '↖',
  UpperRightArrow: '↗',
  Upsi: 'ϒ',
  Upsilon: 'Υ',
  Uring: 'Ů',
  Uscr: '𝒰',
  Utilde: 'Ũ',
  Uuml: 'Ü',
  VDash: '⊫',
  Vbar: '⫫',
  Vcy: 'В',
  Vdash: '⊩',
  Vdashl: '⫦',
  Vee: '⋁',
  Verbar: '‖',
  Vert: '‖',
  VerticalBar: '∣',
  VerticalLine: '|',
  VerticalSeparator: '❘',
  VerticalTilde: '≀',
  VeryThinSpace: ' ',
  Vfr: '𝔙',
  Vopf: '𝕍',
  Vscr: '𝒱',
  Vvdash: '⊪',
  Wcirc: 'Ŵ',
  Wedge: '⋀',
  Wfr: '𝔚',
  Wopf: '𝕎',
  Wscr: '𝒲',
  Xfr: '𝔛',
  Xi: 'Ξ',
  Xopf: '𝕏',
  Xscr: '𝒳',
  YAcy: 'Я',
  YIcy: 'Ї',
  YUcy: 'Ю',
  Yacute: 'Ý',
  Ycirc: 'Ŷ',
  Ycy: 'Ы',
  Yfr: '𝔜',
  Yopf: '𝕐',
  Yscr: '𝒴',
  Yuml: 'Ÿ',
  ZHcy: 'Ж',
  Zacute: 'Ź',
  Zcaron: 'Ž',
  Zcy: 'З',
  Zdot: 'Ż',
  ZeroWidthSpace: '​',
  Zeta: 'Ζ',
  Zfr: 'ℨ',
  Zopf: 'ℤ',
  Zscr: '𝒵',
  aacute: 'á',
  abreve: 'ă',
  ac: '∾',
  acE: '∾̳',
  acd: '∿',
  acirc: 'â',
  acute: '´',
  acy: 'а',
  aelig: 'æ',
  af: '⁡',
  afr: '𝔞',
  agrave: 'à',
  alefsym: 'ℵ',
  aleph: 'ℵ',
  alpha: 'α',
  amacr: 'ā',
  amalg: '⨿',
  amp: '&',
  and: '∧',
  andand: '⩕',
  andd: '⩜',
  andslope: '⩘',
  andv: '⩚',
  ang: '∠',
  ange: '⦤',
  angle: '∠',
  angmsd: '∡',
  angmsdaa: '⦨',
  angmsdab: '⦩',
  angmsdac: '⦪',
  angmsdad: '⦫',
  angmsdae: '⦬',
  angmsdaf: '⦭',
  angmsdag: '⦮',
  angmsdah: '⦯',
  angrt: '∟',
  angrtvb: '⊾',
  angrtvbd: '⦝',
  angsph: '∢',
  angst: 'Å',
  angzarr: '⍼',
  aogon: 'ą',
  aopf: '𝕒',
  ap: '≈',
  apE: '⩰',
  apacir: '⩯',
  ape: '≊',
  apid: '≋',
  apos: "'",
  approx: '≈',
  approxeq: '≊',
  aring: 'å',
  ascr: '𝒶',
  ast: '*',
  asymp: '≈',
  asympeq: '≍',
  atilde: 'ã',
  auml: 'ä',
  awconint: '∳',
  awint: '⨑',
  bNot: '⫭',
  backcong: '≌',
  backepsilon: '϶',
  backprime: '‵',
  backsim: '∽',
  backsimeq: '⋍',
  barvee: '⊽',
  barwed: '⌅',
  barwedge: '⌅',
  bbrk: '⎵',
  bbrktbrk: '⎶',
  bcong: '≌',
  bcy: 'б',
  bdquo: '„',
  becaus: '∵',
  because: '∵',
  bemptyv: '⦰',
  bepsi: '϶',
  bernou: 'ℬ',
  beta: 'β',
  beth: 'ℶ',
  between: '≬',
  bfr: '𝔟',
  bigcap: '⋂',
  bigcirc: '◯',
  bigcup: '⋃',
  bigodot: '⨀',
  bigoplus: '⨁',
  bigotimes: '⨂',
  bigsqcup: '⨆',
  bigstar: '★',
  bigtriangledown: '▽',
  bigtriangleup: '△',
  biguplus: '⨄',
  bigvee: '⋁',
  bigwedge: '⋀',
  bkarow: '⤍',
  blacklozenge: '⧫',
  blacksquare: '▪',
  blacktriangle: '▴',
  blacktriangledown: '▾',
  blacktriangleleft: '◂',
  blacktriangleright: '▸',
  blank: '␣',
  blk12: '▒',
  blk14: '░',
  blk34: '▓',
  block: '█',
  bne: '=⃥',
  bnequiv: '≡⃥',
  bnot: '⌐',
  bopf: '𝕓',
  bot: '⊥',
  bottom: '⊥',
  bowtie: '⋈',
  boxDL: '╗',
  boxDR: '╔',
  boxDl: '╖',
  boxDr: '╓',
  boxH: '═',
  boxHD: '╦',
  boxHU: '╩',
  boxHd: '╤',
  boxHu: '╧',
  boxUL: '╝',
  boxUR: '╚',
  boxUl: '╜',
  boxUr: '╙',
  boxV: '║',
  boxVH: '╬',
  boxVL: '╣',
  boxVR: '╠',
  boxVh: '╫',
  boxVl: '╢',
  boxVr: '╟',
  boxbox: '⧉',
  boxdL: '╕',
  boxdR: '╒',
  boxdl: '┐',
  boxdr: '┌',
  boxh: '─',
  boxhD: '╥',
  boxhU: '╨',
  boxhd: '┬',
  boxhu: '┴',
  boxminus: '⊟',
  boxplus: '⊞',
  boxtimes: '⊠',
  boxuL: '╛',
  boxuR: '╘',
  boxul: '┘',
  boxur: '└',
  boxv: '│',
  boxvH: '╪',
  boxvL: '╡',
  boxvR: '╞',
  boxvh: '┼',
  boxvl: '┤',
  boxvr: '├',
  bprime: '‵',
  breve: '˘',
  brvbar: '¦',
  bscr: '𝒷',
  bsemi: '⁏',
  bsim: '∽',
  bsime: '⋍',
  bsol: '\\',
  bsolb: '⧅',
  bsolhsub: '⟈',
  bull: '•',
  bullet: '•',
  bump: '≎',
  bumpE: '⪮',
  bumpe: '≏',
  bumpeq: '≏',
  cacute: 'ć',
  cap: '∩',
  capand: '⩄',
  capbrcup: '⩉',
  capcap: '⩋',
  capcup: '⩇',
  capdot: '⩀',
  caps: '∩︀',
  caret: '⁁',
  caron: 'ˇ',
  ccaps: '⩍',
  ccaron: 'č',
  ccedil: 'ç',
  ccirc: 'ĉ',
  ccups: '⩌',
  ccupssm: '⩐',
  cdot: 'ċ',
  cedil: '¸',
  cemptyv: '⦲',
  cent: '¢',
  centerdot: '·',
  cfr: '𝔠',
  chcy: 'ч',
  check: '✓',
  checkmark: '✓',
  chi: 'χ',
  cir: '○',
  cirE: '⧃',
  circ: 'ˆ',
  circeq: '≗',
  circlearrowleft: '↺',
  circlearrowright: '↻',
  circledR: '®',
  circledS: 'Ⓢ',
  circledast: '⊛',
  circledcirc: '⊚',
  circleddash: '⊝',
  cire: '≗',
  cirfnint: '⨐',
  cirmid: '⫯',
  cirscir: '⧂',
  clubs: '♣',
  clubsuit: '♣',
  colon: ':',
  colone: '≔',
  coloneq: '≔',
  comma: ',',
  commat: '@',
  comp: '∁',
  compfn: '∘',
  complement: '∁',
  complexes: 'ℂ',
  cong: '≅',
  congdot: '⩭',
  conint: '∮',
  copf: '𝕔',
  coprod: '∐',
  copy: '©',
  copysr: '℗',
  crarr: '↵',
  cross: '✗',
  cscr: '𝒸',
  csub: '⫏',
  csube: '⫑',
  csup: '⫐',
  csupe: '⫒',
  ctdot: '⋯',
  cudarrl: '⤸',
  cudarrr: '⤵',
  cuepr: '⋞',
  cuesc: '⋟',
  cularr: '↶',
  cularrp: '⤽',
  cup: '∪',
  cupbrcap: '⩈',
  cupcap: '⩆',
  cupcup: '⩊',
  cupdot: '⊍',
  cupor: '⩅',
  cups: '∪︀',
  curarr: '↷',
  curarrm: '⤼',
  curlyeqprec: '⋞',
  curlyeqsucc: '⋟',
  curlyvee: '⋎',
  curlywedge: '⋏',
  curren: '¤',
  curvearrowleft: '↶',
  curvearrowright: '↷',
  cuvee: '⋎',
  cuwed: '⋏',
  cwconint: '∲',
  cwint: '∱',
  cylcty: '⌭',
  dArr: '⇓',
  dHar: '⥥',
  dagger: '†',
  daleth: 'ℸ',
  darr: '↓',
  dash: '‐',
  dashv: '⊣',
  dbkarow: '⤏',
  dblac: '˝',
  dcaron: 'ď',
  dcy: 'д',
  dd: 'ⅆ',
  ddagger: '‡',
  ddarr: '⇊',
  ddotseq: '⩷',
  deg: '°',
  delta: 'δ',
  demptyv: '⦱',
  dfisht: '⥿',
  dfr: '𝔡',
  dharl: '⇃',
  dharr: '⇂',
  diam: '⋄',
  diamond: '⋄',
  diamondsuit: '♦',
  diams: '♦',
  die: '¨',
  digamma: 'ϝ',
  disin: '⋲',
  div: '÷',
  divide: '÷',
  divideontimes: '⋇',
  divonx: '⋇',
  djcy: 'ђ',
  dlcorn: '⌞',
  dlcrop: '⌍',
  dollar: '$',
  dopf: '𝕕',
  dot: '˙',
  doteq: '≐',
  doteqdot: '≑',
  dotminus: '∸',
  dotplus: '∔',
  dotsquare: '⊡',
  doublebarwedge: '⌆',
  downarrow: '↓',
  downdownarrows: '⇊',
  downharpoonleft: '⇃',
  downharpoonright: '⇂',
  drbkarow: '⤐',
  drcorn: '⌟',
  drcrop: '⌌',
  dscr: '𝒹',
  dscy: 'ѕ',
  dsol: '⧶',
  dstrok: 'đ',
  dtdot: '⋱',
  dtri: '▿',
  dtrif: '▾',
  duarr: '⇵',
  duhar: '⥯',
  dwangle: '⦦',
  dzcy: 'џ',
  dzigrarr: '⟿',
  eDDot: '⩷',
  eDot: '≑',
  eacute: 'é',
  easter: '⩮',
  ecaron: 'ě',
  ecir: '≖',
  ecirc: 'ê',
  ecolon: '≕',
  ecy: 'э',
  edot: 'ė',
  ee: 'ⅇ',
  efDot: '≒',
  efr: '𝔢',
  eg: '⪚',
  egrave: 'è',
  egs: '⪖',
  egsdot: '⪘',
  el: '⪙',
  elinters: '⏧',
  ell: 'ℓ',
  els: '⪕',
  elsdot: '⪗',
  emacr: 'ē',
  empty: '∅',
  emptyset: '∅',
  emptyv: '∅',
  emsp13: ' ',
  emsp14: ' ',
  emsp: ' ',
  eng: 'ŋ',
  ensp: ' ',
  eogon: 'ę',
  eopf: '𝕖',
  epar: '⋕',
  eparsl: '⧣',
  eplus: '⩱',
  epsi: 'ε',
  epsilon: 'ε',
  epsiv: 'ϵ',
  eqcirc: '≖',
  eqcolon: '≕',
  eqsim: '≂',
  eqslantgtr: '⪖',
  eqslantless: '⪕',
  equals: '=',
  equest: '≟',
  equiv: '≡',
  equivDD: '⩸',
  eqvparsl: '⧥',
  erDot: '≓',
  erarr: '⥱',
  escr: 'ℯ',
  esdot: '≐',
  esim: '≂',
  eta: 'η',
  eth: 'ð',
  euml: 'ë',
  euro: '€',
  excl: '!',
  exist: '∃',
  expectation: 'ℰ',
  exponentiale: 'ⅇ',
  fallingdotseq: '≒',
  fcy: 'ф',
  female: '♀',
  ffilig: 'ﬃ',
  fflig: 'ﬀ',
  ffllig: 'ﬄ',
  ffr: '𝔣',
  filig: 'ﬁ',
  fjlig: 'fj',
  flat: '♭',
  fllig: 'ﬂ',
  fltns: '▱',
  fnof: 'ƒ',
  fopf: '𝕗',
  forall: '∀',
  fork: '⋔',
  forkv: '⫙',
  fpartint: '⨍',
  frac12: '½',
  frac13: '⅓',
  frac14: '¼',
  frac15: '⅕',
  frac16: '⅙',
  frac18: '⅛',
  frac23: '⅔',
  frac25: '⅖',
  frac34: '¾',
  frac35: '⅗',
  frac38: '⅜',
  frac45: '⅘',
  frac56: '⅚',
  frac58: '⅝',
  frac78: '⅞',
  frasl: '⁄',
  frown: '⌢',
  fscr: '𝒻',
  gE: '≧',
  gEl: '⪌',
  gacute: 'ǵ',
  gamma: 'γ',
  gammad: 'ϝ',
  gap: '⪆',
  gbreve: 'ğ',
  gcirc: 'ĝ',
  gcy: 'г',
  gdot: 'ġ',
  ge: '≥',
  gel: '⋛',
  geq: '≥',
  geqq: '≧',
  geqslant: '⩾',
  ges: '⩾',
  gescc: '⪩',
  gesdot: '⪀',
  gesdoto: '⪂',
  gesdotol: '⪄',
  gesl: '⋛︀',
  gesles: '⪔',
  gfr: '𝔤',
  gg: '≫',
  ggg: '⋙',
  gimel: 'ℷ',
  gjcy: 'ѓ',
  gl: '≷',
  glE: '⪒',
  gla: '⪥',
  glj: '⪤',
  gnE: '≩',
  gnap: '⪊',
  gnapprox: '⪊',
  gne: '⪈',
  gneq: '⪈',
  gneqq: '≩',
  gnsim: '⋧',
  gopf: '𝕘',
  grave: '`',
  gscr: 'ℊ',
  gsim: '≳',
  gsime: '⪎',
  gsiml: '⪐',
  gt: '>',
  gtcc: '⪧',
  gtcir: '⩺',
  gtdot: '⋗',
  gtlPar: '⦕',
  gtquest: '⩼',
  gtrapprox: '⪆',
  gtrarr: '⥸',
  gtrdot: '⋗',
  gtreqless: '⋛',
  gtreqqless: '⪌',
  gtrless: '≷',
  gtrsim: '≳',
  gvertneqq: '≩︀',
  gvnE: '≩︀',
  hArr: '⇔',
  hairsp: ' ',
  half: '½',
  hamilt: 'ℋ',
  hardcy: 'ъ',
  harr: '↔',
  harrcir: '⥈',
  harrw: '↭',
  hbar: 'ℏ',
  hcirc: 'ĥ',
  hearts: '♥',
  heartsuit: '♥',
  hellip: '…',
  hercon: '⊹',
  hfr: '𝔥',
  hksearow: '⤥',
  hkswarow: '⤦',
  hoarr: '⇿',
  homtht: '∻',
  hookleftarrow: '↩',
  hookrightarrow: '↪',
  hopf: '𝕙',
  horbar: '―',
  hscr: '𝒽',
  hslash: 'ℏ',
  hstrok: 'ħ',
  hybull: '⁃',
  hyphen: '‐',
  iacute: 'í',
  ic: '⁣',
  icirc: 'î',
  icy: 'и',
  iecy: 'е',
  iexcl: '¡',
  iff: '⇔',
  ifr: '𝔦',
  igrave: 'ì',
  ii: 'ⅈ',
  iiiint: '⨌',
  iiint: '∭',
  iinfin: '⧜',
  iiota: '℩',
  ijlig: 'ĳ',
  imacr: 'ī',
  image: 'ℑ',
  imagline: 'ℐ',
  imagpart: 'ℑ',
  imath: 'ı',
  imof: '⊷',
  imped: 'Ƶ',
  in: '∈',
  incare: '℅',
  infin: '∞',
  infintie: '⧝',
  inodot: 'ı',
  int: '∫',
  intcal: '⊺',
  integers: 'ℤ',
  intercal: '⊺',
  intlarhk: '⨗',
  intprod: '⨼',
  iocy: 'ё',
  iogon: 'į',
  iopf: '𝕚',
  iota: 'ι',
  iprod: '⨼',
  iquest: '¿',
  iscr: '𝒾',
  isin: '∈',
  isinE: '⋹',
  isindot: '⋵',
  isins: '⋴',
  isinsv: '⋳',
  isinv: '∈',
  it: '⁢',
  itilde: 'ĩ',
  iukcy: 'і',
  iuml: 'ï',
  jcirc: 'ĵ',
  jcy: 'й',
  jfr: '𝔧',
  jmath: 'ȷ',
  jopf: '𝕛',
  jscr: '𝒿',
  jsercy: 'ј',
  jukcy: 'є',
  kappa: 'κ',
  kappav: 'ϰ',
  kcedil: 'ķ',
  kcy: 'к',
  kfr: '𝔨',
  kgreen: 'ĸ',
  khcy: 'х',
  kjcy: 'ќ',
  kopf: '𝕜',
  kscr: '𝓀',
  lAarr: '⇚',
  lArr: '⇐',
  lAtail: '⤛',
  lBarr: '⤎',
  lE: '≦',
  lEg: '⪋',
  lHar: '⥢',
  lacute: 'ĺ',
  laemptyv: '⦴',
  lagran: 'ℒ',
  lambda: 'λ',
  lang: '⟨',
  langd: '⦑',
  langle: '⟨',
  lap: '⪅',
  laquo: '«',
  larr: '←',
  larrb: '⇤',
  larrbfs: '⤟',
  larrfs: '⤝',
  larrhk: '↩',
  larrlp: '↫',
  larrpl: '⤹',
  larrsim: '⥳',
  larrtl: '↢',
  lat: '⪫',
  latail: '⤙',
  late: '⪭',
  lates: '⪭︀',
  lbarr: '⤌',
  lbbrk: '❲',
  lbrace: '{',
  lbrack: '[',
  lbrke: '⦋',
  lbrksld: '⦏',
  lbrkslu: '⦍',
  lcaron: 'ľ',
  lcedil: 'ļ',
  lceil: '⌈',
  lcub: '{',
  lcy: 'л',
  ldca: '⤶',
  ldquo: '“',
  ldquor: '„',
  ldrdhar: '⥧',
  ldrushar: '⥋',
  ldsh: '↲',
  le: '≤',
  leftarrow: '←',
  leftarrowtail: '↢',
  leftharpoondown: '↽',
  leftharpoonup: '↼',
  leftleftarrows: '⇇',
  leftrightarrow: '↔',
  leftrightarrows: '⇆',
  leftrightharpoons: '⇋',
  leftrightsquigarrow: '↭',
  leftthreetimes: '⋋',
  leg: '⋚',
  leq: '≤',
  leqq: '≦',
  leqslant: '⩽',
  les: '⩽',
  lescc: '⪨',
  lesdot: '⩿',
  lesdoto: '⪁',
  lesdotor: '⪃',
  lesg: '⋚︀',
  lesges: '⪓',
  lessapprox: '⪅',
  lessdot: '⋖',
  lesseqgtr: '⋚',
  lesseqqgtr: '⪋',
  lessgtr: '≶',
  lesssim: '≲',
  lfisht: '⥼',
  lfloor: '⌊',
  lfr: '𝔩',
  lg: '≶',
  lgE: '⪑',
  lhard: '↽',
  lharu: '↼',
  lharul: '⥪',
  lhblk: '▄',
  ljcy: 'љ',
  ll: '≪',
  llarr: '⇇',
  llcorner: '⌞',
  llhard: '⥫',
  lltri: '◺',
  lmidot: 'ŀ',
  lmoust: '⎰',
  lmoustache: '⎰',
  lnE: '≨',
  lnap: '⪉',
  lnapprox: '⪉',
  lne: '⪇',
  lneq: '⪇',
  lneqq: '≨',
  lnsim: '⋦',
  loang: '⟬',
  loarr: '⇽',
  lobrk: '⟦',
  longleftarrow: '⟵',
  longleftrightarrow: '⟷',
  longmapsto: '⟼',
  longrightarrow: '⟶',
  looparrowleft: '↫',
  looparrowright: '↬',
  lopar: '⦅',
  lopf: '𝕝',
  loplus: '⨭',
  lotimes: '⨴',
  lowast: '∗',
  lowbar: '_',
  loz: '◊',
  lozenge: '◊',
  lozf: '⧫',
  lpar: '(',
  lparlt: '⦓',
  lrarr: '⇆',
  lrcorner: '⌟',
  lrhar: '⇋',
  lrhard: '⥭',
  lrm: '‎',
  lrtri: '⊿',
  lsaquo: '‹',
  lscr: '𝓁',
  lsh: '↰',
  lsim: '≲',
  lsime: '⪍',
  lsimg: '⪏',
  lsqb: '[',
  lsquo: '‘',
  lsquor: '‚',
  lstrok: 'ł',
  lt: '<',
  ltcc: '⪦',
  ltcir: '⩹',
  ltdot: '⋖',
  lthree: '⋋',
  ltimes: '⋉',
  ltlarr: '⥶',
  ltquest: '⩻',
  ltrPar: '⦖',
  ltri: '◃',
  ltrie: '⊴',
  ltrif: '◂',
  lurdshar: '⥊',
  luruhar: '⥦',
  lvertneqq: '≨︀',
  lvnE: '≨︀',
  mDDot: '∺',
  macr: '¯',
  male: '♂',
  malt: '✠',
  maltese: '✠',
  map: '↦',
  mapsto: '↦',
  mapstodown: '↧',
  mapstoleft: '↤',
  mapstoup: '↥',
  marker: '▮',
  mcomma: '⨩',
  mcy: 'м',
  mdash: '—',
  measuredangle: '∡',
  mfr: '𝔪',
  mho: '℧',
  micro: 'µ',
  mid: '∣',
  midast: '*',
  midcir: '⫰',
  middot: '·',
  minus: '−',
  minusb: '⊟',
  minusd: '∸',
  minusdu: '⨪',
  mlcp: '⫛',
  mldr: '…',
  mnplus: '∓',
  models: '⊧',
  mopf: '𝕞',
  mp: '∓',
  mscr: '𝓂',
  mstpos: '∾',
  mu: 'μ',
  multimap: '⊸',
  mumap: '⊸',
  nGg: '⋙̸',
  nGt: '≫⃒',
  nGtv: '≫̸',
  nLeftarrow: '⇍',
  nLeftrightarrow: '⇎',
  nLl: '⋘̸',
  nLt: '≪⃒',
  nLtv: '≪̸',
  nRightarrow: '⇏',
  nVDash: '⊯',
  nVdash: '⊮',
  nabla: '∇',
  nacute: 'ń',
  nang: '∠⃒',
  nap: '≉',
  napE: '⩰̸',
  napid: '≋̸',
  napos: 'ŉ',
  napprox: '≉',
  natur: '♮',
  natural: '♮',
  naturals: 'ℕ',
  nbsp: ' ',
  nbump: '≎̸',
  nbumpe: '≏̸',
  ncap: '⩃',
  ncaron: 'ň',
  ncedil: 'ņ',
  ncong: '≇',
  ncongdot: '⩭̸',
  ncup: '⩂',
  ncy: 'н',
  ndash: '–',
  ne: '≠',
  neArr: '⇗',
  nearhk: '⤤',
  nearr: '↗',
  nearrow: '↗',
  nedot: '≐̸',
  nequiv: '≢',
  nesear: '⤨',
  nesim: '≂̸',
  nexist: '∄',
  nexists: '∄',
  nfr: '𝔫',
  ngE: '≧̸',
  nge: '≱',
  ngeq: '≱',
  ngeqq: '≧̸',
  ngeqslant: '⩾̸',
  nges: '⩾̸',
  ngsim: '≵',
  ngt: '≯',
  ngtr: '≯',
  nhArr: '⇎',
  nharr: '↮',
  nhpar: '⫲',
  ni: '∋',
  nis: '⋼',
  nisd: '⋺',
  niv: '∋',
  njcy: 'њ',
  nlArr: '⇍',
  nlE: '≦̸',
  nlarr: '↚',
  nldr: '‥',
  nle: '≰',
  nleftarrow: '↚',
  nleftrightarrow: '↮',
  nleq: '≰',
  nleqq: '≦̸',
  nleqslant: '⩽̸',
  nles: '⩽̸',
  nless: '≮',
  nlsim: '≴',
  nlt: '≮',
  nltri: '⋪',
  nltrie: '⋬',
  nmid: '∤',
  nopf: '𝕟',
  not: '¬',
  notin: '∉',
  notinE: '⋹̸',
  notindot: '⋵̸',
  notinva: '∉',
  notinvb: '⋷',
  notinvc: '⋶',
  notni: '∌',
  notniva: '∌',
  notnivb: '⋾',
  notnivc: '⋽',
  npar: '∦',
  nparallel: '∦',
  nparsl: '⫽⃥',
  npart: '∂̸',
  npolint: '⨔',
  npr: '⊀',
  nprcue: '⋠',
  npre: '⪯̸',
  nprec: '⊀',
  npreceq: '⪯̸',
  nrArr: '⇏',
  nrarr: '↛',
  nrarrc: '⤳̸',
  nrarrw: '↝̸',
  nrightarrow: '↛',
  nrtri: '⋫',
  nrtrie: '⋭',
  nsc: '⊁',
  nsccue: '⋡',
  nsce: '⪰̸',
  nscr: '𝓃',
  nshortmid: '∤',
  nshortparallel: '∦',
  nsim: '≁',
  nsime: '≄',
  nsimeq: '≄',
  nsmid: '∤',
  nspar: '∦',
  nsqsube: '⋢',
  nsqsupe: '⋣',
  nsub: '⊄',
  nsubE: '⫅̸',
  nsube: '⊈',
  nsubset: '⊂⃒',
  nsubseteq: '⊈',
  nsubseteqq: '⫅̸',
  nsucc: '⊁',
  nsucceq: '⪰̸',
  nsup: '⊅',
  nsupE: '⫆̸',
  nsupe: '⊉',
  nsupset: '⊃⃒',
  nsupseteq: '⊉',
  nsupseteqq: '⫆̸',
  ntgl: '≹',
  ntilde: 'ñ',
  ntlg: '≸',
  ntriangleleft: '⋪',
  ntrianglelefteq: '⋬',
  ntriangleright: '⋫',
  ntrianglerighteq: '⋭',
  nu: 'ν',
  num: '#',
  numero: '№',
  numsp: ' ',
  nvDash: '⊭',
  nvHarr: '⤄',
  nvap: '≍⃒',
  nvdash: '⊬',
  nvge: '≥⃒',
  nvgt: '>⃒',
  nvinfin: '⧞',
  nvlArr: '⤂',
  nvle: '≤⃒',
  nvlt: '<⃒',
  nvltrie: '⊴⃒',
  nvrArr: '⤃',
  nvrtrie: '⊵⃒',
  nvsim: '∼⃒',
  nwArr: '⇖',
  nwarhk: '⤣',
  nwarr: '↖',
  nwarrow: '↖',
  nwnear: '⤧',
  oS: 'Ⓢ',
  oacute: 'ó',
  oast: '⊛',
  ocir: '⊚',
  ocirc: 'ô',
  ocy: 'о',
  odash: '⊝',
  odblac: 'ő',
  odiv: '⨸',
  odot: '⊙',
  odsold: '⦼',
  oelig: 'œ',
  ofcir: '⦿',
  ofr: '𝔬',
  ogon: '˛',
  ograve: 'ò',
  ogt: '⧁',
  ohbar: '⦵',
  ohm: 'Ω',
  oint: '∮',
  olarr: '↺',
  olcir: '⦾',
  olcross: '⦻',
  oline: '‾',
  olt: '⧀',
  omacr: 'ō',
  omega: 'ω',
  omicron: 'ο',
  omid: '⦶',
  ominus: '⊖',
  oopf: '𝕠',
  opar: '⦷',
  operp: '⦹',
  oplus: '⊕',
  or: '∨',
  orarr: '↻',
  ord: '⩝',
  order: 'ℴ',
  orderof: 'ℴ',
  ordf: 'ª',
  ordm: 'º',
  origof: '⊶',
  oror: '⩖',
  orslope: '⩗',
  orv: '⩛',
  oscr: 'ℴ',
  oslash: 'ø',
  osol: '⊘',
  otilde: 'õ',
  otimes: '⊗',
  otimesas: '⨶',
  ouml: 'ö',
  ovbar: '⌽',
  par: '∥',
  para: '¶',
  parallel: '∥',
  parsim: '⫳',
  parsl: '⫽',
  part: '∂',
  pcy: 'п',
  percnt: '%',
  period: '.',
  permil: '‰',
  perp: '⊥',
  pertenk: '‱',
  pfr: '𝔭',
  phi: 'φ',
  phiv: 'ϕ',
  phmmat: 'ℳ',
  phone: '☎',
  pi: 'π',
  pitchfork: '⋔',
  piv: 'ϖ',
  planck: 'ℏ',
  planckh: 'ℎ',
  plankv: 'ℏ',
  plus: '+',
  plusacir: '⨣',
  plusb: '⊞',
  pluscir: '⨢',
  plusdo: '∔',
  plusdu: '⨥',
  pluse: '⩲',
  plusmn: '±',
  plussim: '⨦',
  plustwo: '⨧',
  pm: '±',
  pointint: '⨕',
  popf: '𝕡',
  pound: '£',
  pr: '≺',
  prE: '⪳',
  prap: '⪷',
  prcue: '≼',
  pre: '⪯',
  prec: '≺',
  precapprox: '⪷',
  preccurlyeq: '≼',
  preceq: '⪯',
  precnapprox: '⪹',
  precneqq: '⪵',
  precnsim: '⋨',
  precsim: '≾',
  prime: '′',
  primes: 'ℙ',
  prnE: '⪵',
  prnap: '⪹',
  prnsim: '⋨',
  prod: '∏',
  profalar: '⌮',
  profline: '⌒',
  profsurf: '⌓',
  prop: '∝',
  propto: '∝',
  prsim: '≾',
  prurel: '⊰',
  pscr: '𝓅',
  psi: 'ψ',
  puncsp: ' ',
  qfr: '𝔮',
  qint: '⨌',
  qopf: '𝕢',
  qprime: '⁗',
  qscr: '𝓆',
  quaternions: 'ℍ',
  quatint: '⨖',
  quest: '?',
  questeq: '≟',
  quot: '"',
  rAarr: '⇛',
  rArr: '⇒',
  rAtail: '⤜',
  rBarr: '⤏',
  rHar: '⥤',
  race: '∽̱',
  racute: 'ŕ',
  radic: '√',
  raemptyv: '⦳',
  rang: '⟩',
  rangd: '⦒',
  range: '⦥',
  rangle: '⟩',
  raquo: '»',
  rarr: '→',
  rarrap: '⥵',
  rarrb: '⇥',
  rarrbfs: '⤠',
  rarrc: '⤳',
  rarrfs: '⤞',
  rarrhk: '↪',
  rarrlp: '↬',
  rarrpl: '⥅',
  rarrsim: '⥴',
  rarrtl: '↣',
  rarrw: '↝',
  ratail: '⤚',
  ratio: '∶',
  rationals: 'ℚ',
  rbarr: '⤍',
  rbbrk: '❳',
  rbrace: '}',
  rbrack: ']',
  rbrke: '⦌',
  rbrksld: '⦎',
  rbrkslu: '⦐',
  rcaron: 'ř',
  rcedil: 'ŗ',
  rceil: '⌉',
  rcub: '}',
  rcy: 'р',
  rdca: '⤷',
  rdldhar: '⥩',
  rdquo: '”',
  rdquor: '”',
  rdsh: '↳',
  real: 'ℜ',
  realine: 'ℛ',
  realpart: 'ℜ',
  reals: 'ℝ',
  rect: '▭',
  reg: '®',
  rfisht: '⥽',
  rfloor: '⌋',
  rfr: '𝔯',
  rhard: '⇁',
  rharu: '⇀',
  rharul: '⥬',
  rho: 'ρ',
  rhov: 'ϱ',
  rightarrow: '→',
  rightarrowtail: '↣',
  rightharpoondown: '⇁',
  rightharpoonup: '⇀',
  rightleftarrows: '⇄',
  rightleftharpoons: '⇌',
  rightrightarrows: '⇉',
  rightsquigarrow: '↝',
  rightthreetimes: '⋌',
  ring: '˚',
  risingdotseq: '≓',
  rlarr: '⇄',
  rlhar: '⇌',
  rlm: '‏',
  rmoust: '⎱',
  rmoustache: '⎱',
  rnmid: '⫮',
  roang: '⟭',
  roarr: '⇾',
  robrk: '⟧',
  ropar: '⦆',
  ropf: '𝕣',
  roplus: '⨮',
  rotimes: '⨵',
  rpar: ')',
  rpargt: '⦔',
  rppolint: '⨒',
  rrarr: '⇉',
  rsaquo: '›',
  rscr: '𝓇',
  rsh: '↱',
  rsqb: ']',
  rsquo: '’',
  rsquor: '’',
  rthree: '⋌',
  rtimes: '⋊',
  rtri: '▹',
  rtrie: '⊵',
  rtrif: '▸',
  rtriltri: '⧎',
  ruluhar: '⥨',
  rx: '℞',
  sacute: 'ś',
  sbquo: '‚',
  sc: '≻',
  scE: '⪴',
  scap: '⪸',
  scaron: 'š',
  sccue: '≽',
  sce: '⪰',
  scedil: 'ş',
  scirc: 'ŝ',
  scnE: '⪶',
  scnap: '⪺',
  scnsim: '⋩',
  scpolint: '⨓',
  scsim: '≿',
  scy: 'с',
  sdot: '⋅',
  sdotb: '⊡',
  sdote: '⩦',
  seArr: '⇘',
  searhk: '⤥',
  searr: '↘',
  searrow: '↘',
  sect: '§',
  semi: ';',
  seswar: '⤩',
  setminus: '∖',
  setmn: '∖',
  sext: '✶',
  sfr: '𝔰',
  sfrown: '⌢',
  sharp: '♯',
  shchcy: 'щ',
  shcy: 'ш',
  shortmid: '∣',
  shortparallel: '∥',
  shy: '­',
  sigma: 'σ',
  sigmaf: 'ς',
  sigmav: 'ς',
  sim: '∼',
  simdot: '⩪',
  sime: '≃',
  simeq: '≃',
  simg: '⪞',
  simgE: '⪠',
  siml: '⪝',
  simlE: '⪟',
  simne: '≆',
  simplus: '⨤',
  simrarr: '⥲',
  slarr: '←',
  smallsetminus: '∖',
  smashp: '⨳',
  smeparsl: '⧤',
  smid: '∣',
  smile: '⌣',
  smt: '⪪',
  smte: '⪬',
  smtes: '⪬︀',
  softcy: 'ь',
  sol: '/',
  solb: '⧄',
  solbar: '⌿',
  sopf: '𝕤',
  spades: '♠',
  spadesuit: '♠',
  spar: '∥',
  sqcap: '⊓',
  sqcaps: '⊓︀',
  sqcup: '⊔',
  sqcups: '⊔︀',
  sqsub: '⊏',
  sqsube: '⊑',
  sqsubset: '⊏',
  sqsubseteq: '⊑',
  sqsup: '⊐',
  sqsupe: '⊒',
  sqsupset: '⊐',
  sqsupseteq: '⊒',
  squ: '□',
  square: '□',
  squarf: '▪',
  squf: '▪',
  srarr: '→',
  sscr: '𝓈',
  ssetmn: '∖',
  ssmile: '⌣',
  sstarf: '⋆',
  star: '☆',
  starf: '★',
  straightepsilon: 'ϵ',
  straightphi: 'ϕ',
  strns: '¯',
  sub: '⊂',
  subE: '⫅',
  subdot: '⪽',
  sube: '⊆',
  subedot: '⫃',
  submult: '⫁',
  subnE: '⫋',
  subne: '⊊',
  subplus: '⪿',
  subrarr: '⥹',
  subset: '⊂',
  subseteq: '⊆',
  subseteqq: '⫅',
  subsetneq: '⊊',
  subsetneqq: '⫋',
  subsim: '⫇',
  subsub: '⫕',
  subsup: '⫓',
  succ: '≻',
  succapprox: '⪸',
  succcurlyeq: '≽',
  succeq: '⪰',
  succnapprox: '⪺',
  succneqq: '⪶',
  succnsim: '⋩',
  succsim: '≿',
  sum: '∑',
  sung: '♪',
  sup1: '¹',
  sup2: '²',
  sup3: '³',
  sup: '⊃',
  supE: '⫆',
  supdot: '⪾',
  supdsub: '⫘',
  supe: '⊇',
  supedot: '⫄',
  suphsol: '⟉',
  suphsub: '⫗',
  suplarr: '⥻',
  supmult: '⫂',
  supnE: '⫌',
  supne: '⊋',
  supplus: '⫀',
  supset: '⊃',
  supseteq: '⊇',
  supseteqq: '⫆',
  supsetneq: '⊋',
  supsetneqq: '⫌',
  supsim: '⫈',
  supsub: '⫔',
  supsup: '⫖',
  swArr: '⇙',
  swarhk: '⤦',
  swarr: '↙',
  swarrow: '↙',
  swnwar: '⤪',
  szlig: 'ß',
  target: '⌖',
  tau: 'τ',
  tbrk: '⎴',
  tcaron: 'ť',
  tcedil: 'ţ',
  tcy: 'т',
  tdot: '⃛',
  telrec: '⌕',
  tfr: '𝔱',
  there4: '∴',
  therefore: '∴',
  theta: 'θ',
  thetasym: 'ϑ',
  thetav: 'ϑ',
  thickapprox: '≈',
  thicksim: '∼',
  thinsp: ' ',
  thkap: '≈',
  thksim: '∼',
  thorn: 'þ',
  tilde: '˜',
  times: '×',
  timesb: '⊠',
  timesbar: '⨱',
  timesd: '⨰',
  tint: '∭',
  toea: '⤨',
  top: '⊤',
  topbot: '⌶',
  topcir: '⫱',
  topf: '𝕥',
  topfork: '⫚',
  tosa: '⤩',
  tprime: '‴',
  trade: '™',
  triangle: '▵',
  triangledown: '▿',
  triangleleft: '◃',
  trianglelefteq: '⊴',
  triangleq: '≜',
  triangleright: '▹',
  trianglerighteq: '⊵',
  tridot: '◬',
  trie: '≜',
  triminus: '⨺',
  triplus: '⨹',
  trisb: '⧍',
  tritime: '⨻',
  trpezium: '⏢',
  tscr: '𝓉',
  tscy: 'ц',
  tshcy: 'ћ',
  tstrok: 'ŧ',
  twixt: '≬',
  twoheadleftarrow: '↞',
  twoheadrightarrow: '↠',
  uArr: '⇑',
  uHar: '⥣',
  uacute: 'ú',
  uarr: '↑',
  ubrcy: 'ў',
  ubreve: 'ŭ',
  ucirc: 'û',
  ucy: 'у',
  udarr: '⇅',
  udblac: 'ű',
  udhar: '⥮',
  ufisht: '⥾',
  ufr: '𝔲',
  ugrave: 'ù',
  uharl: '↿',
  uharr: '↾',
  uhblk: '▀',
  ulcorn: '⌜',
  ulcorner: '⌜',
  ulcrop: '⌏',
  ultri: '◸',
  umacr: 'ū',
  uml: '¨',
  uogon: 'ų',
  uopf: '𝕦',
  uparrow: '↑',
  updownarrow: '↕',
  upharpoonleft: '↿',
  upharpoonright: '↾',
  uplus: '⊎',
  upsi: 'υ',
  upsih: 'ϒ',
  upsilon: 'υ',
  upuparrows: '⇈',
  urcorn: '⌝',
  urcorner: '⌝',
  urcrop: '⌎',
  uring: 'ů',
  urtri: '◹',
  uscr: '𝓊',
  utdot: '⋰',
  utilde: 'ũ',
  utri: '▵',
  utrif: '▴',
  uuarr: '⇈',
  uuml: 'ü',
  uwangle: '⦧',
  vArr: '⇕',
  vBar: '⫨',
  vBarv: '⫩',
  vDash: '⊨',
  vangrt: '⦜',
  varepsilon: 'ϵ',
  varkappa: 'ϰ',
  varnothing: '∅',
  varphi: 'ϕ',
  varpi: 'ϖ',
  varpropto: '∝',
  varr: '↕',
  varrho: 'ϱ',
  varsigma: 'ς',
  varsubsetneq: '⊊︀',
  varsubsetneqq: '⫋︀',
  varsupsetneq: '⊋︀',
  varsupsetneqq: '⫌︀',
  vartheta: 'ϑ',
  vartriangleleft: '⊲',
  vartriangleright: '⊳',
  vcy: 'в',
  vdash: '⊢',
  vee: '∨',
  veebar: '⊻',
  veeeq: '≚',
  vellip: '⋮',
  verbar: '|',
  vert: '|',
  vfr: '𝔳',
  vltri: '⊲',
  vnsub: '⊂⃒',
  vnsup: '⊃⃒',
  vopf: '𝕧',
  vprop: '∝',
  vrtri: '⊳',
  vscr: '𝓋',
  vsubnE: '⫋︀',
  vsubne: '⊊︀',
  vsupnE: '⫌︀',
  vsupne: '⊋︀',
  vzigzag: '⦚',
  wcirc: 'ŵ',
  wedbar: '⩟',
  wedge: '∧',
  wedgeq: '≙',
  weierp: '℘',
  wfr: '𝔴',
  wopf: '𝕨',
  wp: '℘',
  wr: '≀',
  wreath: '≀',
  wscr: '𝓌',
  xcap: '⋂',
  xcirc: '◯',
  xcup: '⋃',
  xdtri: '▽',
  xfr: '𝔵',
  xhArr: '⟺',
  xharr: '⟷',
  xi: 'ξ',
  xlArr: '⟸',
  xlarr: '⟵',
  xmap: '⟼',
  xnis: '⋻',
  xodot: '⨀',
  xopf: '𝕩',
  xoplus: '⨁',
  xotime: '⨂',
  xrArr: '⟹',
  xrarr: '⟶',
  xscr: '𝓍',
  xsqcup: '⨆',
  xuplus: '⨄',
  xutri: '△',
  xvee: '⋁',
  xwedge: '⋀',
  yacute: 'ý',
  yacy: 'я',
  ycirc: 'ŷ',
  ycy: 'ы',
  yen: '¥',
  yfr: '𝔶',
  yicy: 'ї',
  yopf: '𝕪',
  yscr: '𝓎',
  yucy: 'ю',
  yuml: 'ÿ',
  zacute: 'ź',
  zcaron: 'ž',
  zcy: 'з',
  zdot: 'ż',
  zeetrf: 'ℨ',
  zeta: 'ζ',
  zfr: '𝔷',
  zhcy: 'ж',
  zigrarr: '⇝',
  zopf: '𝕫',
  zscr: '𝓏',
  zwj: '‍',
  zwnj: '‌'
}

;// CONCATENATED MODULE: ./node_modules/decode-named-character-reference/index.js


const decode_named_character_reference_own = {}.hasOwnProperty

/**
 * Decode a single character reference (without the `&` or `;`).
 * You probably only need this when you’re building parsers yourself that follow
 * different rules compared to HTML.
 * This is optimized to be tiny in browsers.
 *
 * @param {string} value
 *   `notin` (named), `#123` (deci), `#x123` (hexa).
 * @returns {string|false}
 *   Decoded reference.
 */
function decodeNamedCharacterReference(value) {
  return decode_named_character_reference_own.call(characterEntities, value) ? characterEntities[value] : false
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/character-reference.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterReference(effects, ok, nok) {
  const self = this
  let size = 0
  /** @type {number} */
  let max
  /** @type {(code: Code) => boolean} */
  let test
  return start

  /**
   * Start of character reference.
   *
   * ```markdown
   * > | a&amp;b
   *      ^
   * > | a&#123;b
   *      ^
   * > | a&#x9;b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('characterReference')
    effects.enter('characterReferenceMarker')
    effects.consume(code)
    effects.exit('characterReferenceMarker')
    return open
  }

  /**
   * After `&`, at `#` for numeric references or alphanumeric for named
   * references.
   *
   * ```markdown
   * > | a&amp;b
   *       ^
   * > | a&#123;b
   *       ^
   * > | a&#x9;b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 35) {
      effects.enter('characterReferenceMarkerNumeric')
      effects.consume(code)
      effects.exit('characterReferenceMarkerNumeric')
      return numeric
    }
    effects.enter('characterReferenceValue')
    max = 31
    test = asciiAlphanumeric
    return value(code)
  }

  /**
   * After `#`, at `x` for hexadecimals or digit for decimals.
   *
   * ```markdown
   * > | a&#123;b
   *        ^
   * > | a&#x9;b
   *        ^
   * ```
   *
   * @type {State}
   */
  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter('characterReferenceMarkerHexadecimal')
      effects.consume(code)
      effects.exit('characterReferenceMarkerHexadecimal')
      effects.enter('characterReferenceValue')
      max = 6
      test = asciiHexDigit
      return value
    }
    effects.enter('characterReferenceValue')
    max = 7
    test = asciiDigit
    return value(code)
  }

  /**
   * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
   *
   * The character reference kind defines what and how many characters are
   * allowed.
   *
   * ```markdown
   * > | a&amp;b
   *       ^^^
   * > | a&#123;b
   *        ^^^
   * > | a&#x9;b
   *         ^
   * ```
   *
   * @type {State}
   */
  function value(code) {
    if (code === 59 && size) {
      const token = effects.exit('characterReferenceValue')
      if (
        test === asciiAlphanumeric &&
        !decodeNamedCharacterReference(self.sliceSerialize(token))
      ) {
        return nok(code)
      }

      // To do: `markdown-rs` uses a different name:
      // `CharacterReferenceMarkerSemi`.
      effects.enter('characterReferenceMarker')
      effects.consume(code)
      effects.exit('characterReferenceMarker')
      effects.exit('characterReference')
      return ok
    }
    if (test(code) && size++ < max) {
      effects.consume(code)
      return value
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/character-escape.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCharacterEscape(effects, ok, nok) {
  return start

  /**
   * Start of character escape.
   *
   * ```markdown
   * > | a\*b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('characterEscape')
    effects.enter('escapeMarker')
    effects.consume(code)
    effects.exit('escapeMarker')
    return inside
  }

  /**
   * After `\`, at punctuation.
   *
   * ```markdown
   * > | a\*b
   *       ^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    // ASCII punctuation.
    if (asciiPunctuation(code)) {
      effects.enter('characterEscapeValue')
      effects.consume(code)
      effects.exit('characterEscapeValue')
      effects.exit('characterEscape')
      return ok
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/line-ending.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const lineEnding = {
  name: 'lineEnding',
  tokenize: tokenizeLineEnding
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLineEnding(effects, ok) {
  return start

  /** @type {State} */
  function start(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, ok, 'linePrefix')
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/label-end.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */









/** @type {Construct} */
const labelEnd = {
  name: 'labelEnd',
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
}

/** @type {Construct} */
const resourceConstruct = {
  tokenize: tokenizeResource
}
/** @type {Construct} */
const referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
}
/** @type {Construct} */
const referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
}

/** @type {Resolver} */
function resolveAllLabelEnd(events) {
  let index = -1
  while (++index < events.length) {
    const token = events[index][1]
    if (
      token.type === 'labelImage' ||
      token.type === 'labelLink' ||
      token.type === 'labelEnd'
    ) {
      // Remove the marker.
      events.splice(index + 1, token.type === 'labelImage' ? 4 : 2)
      token.type = 'data'
      index++
    }
  }
  return events
}

/** @type {Resolver} */
function resolveToLabelEnd(events, context) {
  let index = events.length
  let offset = 0
  /** @type {Token} */
  let token
  /** @type {number | undefined} */
  let open
  /** @type {number | undefined} */
  let close
  /** @type {Array<Event>} */
  let media

  // Find an opening.
  while (index--) {
    token = events[index][1]
    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === 'link' ||
        (token.type === 'labelLink' && token._inactive)
      ) {
        break
      }

      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === 'labelLink') {
        token._inactive = true
      }
    } else if (close) {
      if (
        events[index][0] === 'enter' &&
        (token.type === 'labelImage' || token.type === 'labelLink') &&
        !token._balanced
      ) {
        open = index
        if (token.type !== 'labelLink') {
          offset = 2
          break
        }
      }
    } else if (token.type === 'labelEnd') {
      close = index
    }
  }
  const group = {
    type: events[open][1].type === 'labelLink' ? 'link' : 'image',
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  }
  const label = {
    type: 'label',
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end)
  }
  const text = {
    type: 'labelText',
    start: Object.assign({}, events[open + offset + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start)
  }
  media = [
    ['enter', group, context],
    ['enter', label, context]
  ]

  // Opening marker.
  media = push(media, events.slice(open + 1, open + offset + 3))

  // Text open.
  media = push(media, [['enter', text, context]])

  // Always populated by defaults.

  // Between.
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  )

  // Text close, marker close, label close.
  media = push(media, [
    ['exit', text, context],
    events[close - 2],
    events[close - 1],
    ['exit', label, context]
  ])

  // Reference, resource, or so.
  media = push(media, events.slice(close + 1))

  // Media close.
  media = push(media, [['exit', group, context]])
  splice(events, open, events.length, media)
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelEnd(effects, ok, nok) {
  const self = this
  let index = self.events.length
  /** @type {Token} */
  let labelStart
  /** @type {boolean} */
  let defined

  // Find an opening.
  while (index--) {
    if (
      (self.events[index][1].type === 'labelImage' ||
        self.events[index][1].type === 'labelLink') &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1]
      break
    }
  }
  return start

  /**
   * Start of label end.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // If there is not an okay opening.
    if (!labelStart) {
      return nok(code)
    }

    // If the corresponding label (link) start is marked as inactive,
    // it means we’d be wrapping a link, like this:
    //
    // ```markdown
    // > | a [b [c](d) e](f) g.
    //                  ^
    // ```
    //
    // We can’t have that, so it’s just balanced brackets.
    if (labelStart._inactive) {
      return labelEndNok(code)
    }
    defined = self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize({
          start: labelStart.end,
          end: self.now()
        })
      )
    )
    effects.enter('labelEnd')
    effects.enter('labelMarker')
    effects.consume(code)
    effects.exit('labelMarker')
    effects.exit('labelEnd')
    return after
  }

  /**
   * After `]`.
   *
   * ```markdown
   * > | [a](b) c
   *       ^
   * > | [a][b] c
   *       ^
   * > | [a][] b
   *       ^
   * > | [a] b
   *       ^
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
    // an extension.

    // Resource (`[asd](fgh)`)?
    if (code === 40) {
      return effects.attempt(
        resourceConstruct,
        labelEndOk,
        defined ? labelEndOk : labelEndNok
      )(code)
    }

    // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
    if (code === 91) {
      return effects.attempt(
        referenceFullConstruct,
        labelEndOk,
        defined ? referenceNotFull : labelEndNok
      )(code)
    }

    // Shortcut (`[asd]`) reference?
    return defined ? labelEndOk(code) : labelEndNok(code)
  }

  /**
   * After `]`, at `[`, but not at a full reference.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] b
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceNotFull(code) {
    return effects.attempt(
      referenceCollapsedConstruct,
      labelEndOk,
      labelEndNok
    )(code)
  }

  /**
   * Done, we found something.
   *
   * ```markdown
   * > | [a](b) c
   *           ^
   * > | [a][b] c
   *           ^
   * > | [a][] b
   *          ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndOk(code) {
    // Note: `markdown-rs` does a bunch of stuff here.
    return ok(code)
  }

  /**
   * Done, it’s nothing.
   *
   * There was an okay opening, but we didn’t match anything.
   *
   * ```markdown
   * > | [a](b c
   *        ^
   * > | [a][b c
   *        ^
   * > | [a] b
   *        ^
   * ```
   *
   * @type {State}
   */
  function labelEndNok(code) {
    labelStart._balanced = true
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeResource(effects, ok, nok) {
  return resourceStart

  /**
   * At a resource.
   *
   * ```markdown
   * > | [a](b) c
   *        ^
   * ```
   *
   * @type {State}
   */
  function resourceStart(code) {
    effects.enter('resource')
    effects.enter('resourceMarker')
    effects.consume(code)
    effects.exit('resourceMarker')
    return resourceBefore
  }

  /**
   * In resource, after `(`, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceOpen)(code)
      : resourceOpen(code)
  }

  /**
   * In resource, after optional whitespace, at `)` or a destination.
   *
   * ```markdown
   * > | [a](b) c
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceOpen(code) {
    if (code === 41) {
      return resourceEnd(code)
    }
    return factoryDestination(
      effects,
      resourceDestinationAfter,
      resourceDestinationMissing,
      'resourceDestination',
      'resourceDestinationLiteral',
      'resourceDestinationLiteralMarker',
      'resourceDestinationRaw',
      'resourceDestinationString',
      32
    )(code)
  }

  /**
   * In resource, after destination, at optional whitespace.
   *
   * ```markdown
   * > | [a](b) c
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceBetween)(code)
      : resourceEnd(code)
  }

  /**
   * At invalid destination.
   *
   * ```markdown
   * > | [a](<<) b
   *         ^
   * ```
   *
   * @type {State}
   */
  function resourceDestinationMissing(code) {
    return nok(code)
  }

  /**
   * In resource, after destination and whitespace, at `(` or title.
   *
   * ```markdown
   * > | [a](b ) c
   *           ^
   * ```
   *
   * @type {State}
   */
  function resourceBetween(code) {
    if (code === 34 || code === 39 || code === 40) {
      return factoryTitle(
        effects,
        resourceTitleAfter,
        nok,
        'resourceTitle',
        'resourceTitleMarker',
        'resourceTitleString'
      )(code)
    }
    return resourceEnd(code)
  }

  /**
   * In resource, after title, at optional whitespace.
   *
   * ```markdown
   * > | [a](b "c") d
   *              ^
   * ```
   *
   * @type {State}
   */
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, resourceEnd)(code)
      : resourceEnd(code)
  }

  /**
   * In resource, at `)`.
   *
   * ```markdown
   * > | [a](b) d
   *          ^
   * ```
   *
   * @type {State}
   */
  function resourceEnd(code) {
    if (code === 41) {
      effects.enter('resourceMarker')
      effects.consume(code)
      effects.exit('resourceMarker')
      effects.exit('resource')
      return ok
    }
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceFull(effects, ok, nok) {
  const self = this
  return referenceFull

  /**
   * In a reference (full), at the `[`.
   *
   * ```markdown
   * > | [a][b] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFull(code) {
    return factoryLabel.call(
      self,
      effects,
      referenceFullAfter,
      referenceFullMissing,
      'reference',
      'referenceMarker',
      'referenceString'
    )(code)
  }

  /**
   * In a reference (full), after `]`.
   *
   * ```markdown
   * > | [a][b] d
   *          ^
   * ```
   *
   * @type {State}
   */
  function referenceFullAfter(code) {
    return self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    )
      ? ok(code)
      : nok(code)
  }

  /**
   * In reference (full) that was missing.
   *
   * ```markdown
   * > | [a][b d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceFullMissing(code) {
    return nok(code)
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart

  /**
   * In reference (collapsed), at `[`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *        ^
   * ```
   *
   * @type {State}
   */
  function referenceCollapsedStart(code) {
    // We only attempt a collapsed label if there’s a `[`.

    effects.enter('reference')
    effects.enter('referenceMarker')
    effects.consume(code)
    effects.exit('referenceMarker')
    return referenceCollapsedOpen
  }

  /**
   * In reference (collapsed), at `]`.
   *
   * > 👉 **Note**: we only get here if the label is defined.
   *
   * ```markdown
   * > | [a][] d
   *         ^
   * ```
   *
   *  @type {State}
   */
  function referenceCollapsedOpen(code) {
    if (code === 93) {
      effects.enter('referenceMarker')
      effects.consume(code)
      effects.exit('referenceMarker')
      effects.exit('reference')
      return ok
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/label-start-image.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this
  return start

  /**
   * Start of label (image) start.
   *
   * ```markdown
   * > | a ![b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('labelImage')
    effects.enter('labelImageMarker')
    effects.consume(code)
    effects.exit('labelImageMarker')
    return open
  }

  /**
   * After `!`, at `[`.
   *
   * ```markdown
   * > | a ![b] c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 91) {
      effects.enter('labelMarker')
      effects.consume(code)
      effects.exit('labelMarker')
      effects.exit('labelImage')
      return after
    }
    return nok(code)
  }

  /**
   * After `![`.
   *
   * ```markdown
   * > | a ![b] c
   *         ^
   * ```
   *
   * This is needed in because, when GFM footnotes are enabled, images never
   * form when started with a `^`.
   * Instead, links form:
   *
   * ```markdown
   * ![^a](b)
   *
   * ![^a][b]
   *
   * [b]: c
   * ```
   *
   * ```html
   * <p>!<a href=\"b\">^a</a></p>
   * <p>!<a href=\"c\">^a</a></p>
   * ```
   *
   * @type {State}
   */
  function after(code) {
    // To do: use a new field to do this, this is still needed for
    // `micromark-extension-gfm-footnote`, but the `label-start-link`
    // behavior isn’t.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-classify-character/index.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 */


/**
 * Classify whether a code represents whitespace, punctuation, or something
 * else.
 *
 * Used for attention (emphasis, strong), whose sequences can open or close
 * based on the class of surrounding characters.
 *
 * > 👉 **Note**: eof (`null`) is seen as whitespace.
 *
 * @param {Code} code
 *   Code.
 * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
 *   Group.
 */
function classifyCharacter(code) {
  if (
    code === null ||
    markdownLineEndingOrSpace(code) ||
    unicodeWhitespace(code)
  ) {
    return 1
  }
  if (unicodePunctuation(code)) {
    return 2
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/attention.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').Point} Point
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */




/** @type {Construct} */
const attention = {
  name: 'attention',
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
}

/**
 * Take all events and resolve attention to emphasis or strong.
 *
 * @type {Resolver}
 */
function resolveAllAttention(events, context) {
  let index = -1
  /** @type {number} */
  let open
  /** @type {Token} */
  let group
  /** @type {Token} */
  let text
  /** @type {Token} */
  let openingSequence
  /** @type {Token} */
  let closingSequence
  /** @type {number} */
  let use
  /** @type {Array<Event>} */
  let nextEvents
  /** @type {number} */
  let offset

  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === 'attentionSequence' &&
      events[index][1]._close
    ) {
      open = index

      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (
          events[open][0] === 'exit' &&
          events[open][1].type === 'attentionSequence' &&
          events[open][1]._open &&
          // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          ) {
            continue
          }

          // Number of markers to use from the sequence.
          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1
          const start = Object.assign({}, events[open][1].end)
          const end = Object.assign({}, events[index][1].start)
          movePoint(start, -use)
          movePoint(end, use)
          openingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start,
            end: Object.assign({}, events[open][1].end)
          }
          closingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: Object.assign({}, events[index][1].start),
            end
          }
          text = {
            type: use > 1 ? 'strongText' : 'emphasisText',
            start: Object.assign({}, events[open][1].end),
            end: Object.assign({}, events[index][1].start)
          }
          group = {
            type: use > 1 ? 'strong' : 'emphasis',
            start: Object.assign({}, openingSequence.start),
            end: Object.assign({}, closingSequence.end)
          }
          events[open][1].end = Object.assign({}, openingSequence.start)
          events[index][1].start = Object.assign({}, closingSequence.end)
          nextEvents = []

          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [
              ['enter', events[open][1], context],
              ['exit', events[open][1], context]
            ])
          }

          // Opening.
          nextEvents = push(nextEvents, [
            ['enter', group, context],
            ['enter', openingSequence, context],
            ['exit', openingSequence, context],
            ['enter', text, context]
          ])

          // Always populated by defaults.

          // Between.
          nextEvents = push(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context
            )
          )

          // Closing.
          nextEvents = push(nextEvents, [
            ['exit', text, context],
            ['enter', closingSequence, context],
            ['exit', closingSequence, context],
            ['exit', group, context]
          ])

          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2
            nextEvents = push(nextEvents, [
              ['enter', events[index][1], context],
              ['exit', events[index][1], context]
            ])
          } else {
            offset = 0
          }
          splice(events, open - 1, index - open + 3, nextEvents)
          index = open + nextEvents.length - offset - 2
          break
        }
      }
    }
  }

  // Remove remaining sequences.
  index = -1
  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data'
    }
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAttention(effects, ok) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null
  const previous = this.previous
  const before = classifyCharacter(previous)

  /** @type {NonNullable<Code>} */
  let marker
  return start

  /**
   * Before a sequence.
   *
   * ```markdown
   * > | **
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    marker = code
    effects.enter('attentionSequence')
    return inside(code)
  }

  /**
   * In a sequence.
   *
   * ```markdown
   * > | **
   *     ^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === marker) {
      effects.consume(code)
      return inside
    }
    const token = effects.exit('attentionSequence')

    // To do: next major: move this to resolver, just like `markdown-rs`.
    const after = classifyCharacter(code)

    // Always populated by defaults.

    const open =
      !after || (after === 2 && before) || attentionMarkers.includes(code)
    const close =
      !before || (before === 2 && after) || attentionMarkers.includes(previous)
    token._open = Boolean(marker === 42 ? open : open && (before || !close))
    token._close = Boolean(marker === 42 ? close : close && (after || !open))
    return ok(code)
  }
}

/**
 * Move a point a bit.
 *
 * Note: `move` only works inside lines! It’s not possible to move past other
 * chunks (replacement characters, tabs, or line endings).
 *
 * @param {Point} point
 * @param {number} offset
 * @returns {void}
 */
function movePoint(point, offset) {
  point.column += offset
  point.offset += offset
  point._bufferIndex += offset
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/autolink.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const autolink = {
  name: 'autolink',
  tokenize: tokenizeAutolink
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeAutolink(effects, ok, nok) {
  let size = 0
  return start

  /**
   * Start of an autolink.
   *
   * ```markdown
   * > | a<https://example.com>b
   *      ^
   * > | a<user@example.com>b
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('autolink')
    effects.enter('autolinkMarker')
    effects.consume(code)
    effects.exit('autolinkMarker')
    effects.enter('autolinkProtocol')
    return open
  }

  /**
   * After `<`, at protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *       ^
   * > | a<user@example.com>b
   *       ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code)
      return schemeOrEmailAtext
    }
    return emailAtext(code)
  }

  /**
   * At second byte of protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeOrEmailAtext(code) {
    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
      // Count the previous alphabetical from `open` too.
      size = 1
      return schemeInsideOrEmailAtext(code)
    }
    return emailAtext(code)
  }

  /**
   * In ambiguous protocol or atext.
   *
   * ```markdown
   * > | a<https://example.com>b
   *        ^
   * > | a<user@example.com>b
   *        ^
   * ```
   *
   * @type {State}
   */
  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code)
      size = 0
      return urlInside
    }

    // ASCII alphanumeric and `+`, `-`, and `.`.
    if (
      (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) &&
      size++ < 32
    ) {
      effects.consume(code)
      return schemeInsideOrEmailAtext
    }
    size = 0
    return emailAtext(code)
  }

  /**
   * After protocol, in URL.
   *
   * ```markdown
   * > | a<https://example.com>b
   *             ^
   * ```
   *
   * @type {State}
   */
  function urlInside(code) {
    if (code === 62) {
      effects.exit('autolinkProtocol')
      effects.enter('autolinkMarker')
      effects.consume(code)
      effects.exit('autolinkMarker')
      effects.exit('autolink')
      return ok
    }

    // ASCII control, space, or `<`.
    if (code === null || code === 32 || code === 60 || asciiControl(code)) {
      return nok(code)
    }
    effects.consume(code)
    return urlInside
  }

  /**
   * In email atext.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *              ^
   * ```
   *
   * @type {State}
   */
  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code)
      return emailAtSignOrDot
    }
    if (asciiAtext(code)) {
      effects.consume(code)
      return emailAtext
    }
    return nok(code)
  }

  /**
   * In label, after at-sign or dot.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                 ^       ^
   * ```
   *
   * @type {State}
   */
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code)
  }

  /**
   * In label, where `.` and `>` are allowed.
   *
   * ```markdown
   * > | a<user.name@example.com>b
   *                   ^
   * ```
   *
   * @type {State}
   */
  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code)
      size = 0
      return emailAtSignOrDot
    }
    if (code === 62) {
      // Exit, then change the token type.
      effects.exit('autolinkProtocol').type = 'autolinkEmail'
      effects.enter('autolinkMarker')
      effects.consume(code)
      effects.exit('autolinkMarker')
      effects.exit('autolink')
      return ok
    }
    return emailValue(code)
  }

  /**
   * In label, where `.` and `>` are *not* allowed.
   *
   * Though, this is also used in `emailLabel` to parse other values.
   *
   * ```markdown
   * > | a<user.name@ex-ample.com>b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function emailValue(code) {
    // ASCII alphanumeric or `-`.
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      const next = code === 45 ? emailValue : emailLabel
      effects.consume(code)
      return next
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/html-text.js
/**
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const htmlText = {
  name: 'htmlText',
  tokenize: tokenizeHtmlText
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHtmlText(effects, ok, nok) {
  const self = this
  /** @type {NonNullable<Code> | undefined} */
  let marker
  /** @type {number} */
  let index
  /** @type {State} */
  let returnState
  return start

  /**
   * Start of HTML (text).
   *
   * ```markdown
   * > | a <b> c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('htmlText')
    effects.enter('htmlTextData')
    effects.consume(code)
    return open
  }

  /**
   * After `<`, at tag name or other stuff.
   *
   * ```markdown
   * > | a <b> c
   *        ^
   * > | a <!doctype> c
   *        ^
   * > | a <!--b--> c
   *        ^
   * ```
   *
   * @type {State}
   */
  function open(code) {
    if (code === 33) {
      effects.consume(code)
      return declarationOpen
    }
    if (code === 47) {
      effects.consume(code)
      return tagCloseStart
    }
    if (code === 63) {
      effects.consume(code)
      return instruction
    }

    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code)
      return tagOpen
    }
    return nok(code)
  }

  /**
   * After `<!`, at declaration, comment, or CDATA.
   *
   * ```markdown
   * > | a <!doctype> c
   *         ^
   * > | a <!--b--> c
   *         ^
   * > | a <![CDATA[>&<]]> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code)
      return commentOpenInside
    }
    if (code === 91) {
      effects.consume(code)
      index = 0
      return cdataOpenInside
    }
    if (asciiAlpha(code)) {
      effects.consume(code)
      return declaration
    }
    return nok(code)
  }

  /**
   * In a comment, after `<!-`, at another `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code)
      return commentEnd
    }
    return nok(code)
  }

  /**
   * In comment.
   *
   * ```markdown
   * > | a <!--b--> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function comment(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 45) {
      effects.consume(code)
      return commentClose
    }
    if (markdownLineEnding(code)) {
      returnState = comment
      return lineEndingBefore(code)
    }
    effects.consume(code)
    return comment
  }

  /**
   * In comment, after `-`.
   *
   * ```markdown
   * > | a <!--b--> c
   *             ^
   * ```
   *
   * @type {State}
   */
  function commentClose(code) {
    if (code === 45) {
      effects.consume(code)
      return commentEnd
    }
    return comment(code)
  }

  /**
   * In comment, after `--`.
   *
   * ```markdown
   * > | a <!--b--> c
   *              ^
   * ```
   *
   * @type {State}
   */
  function commentEnd(code) {
    return code === 62
      ? end(code)
      : code === 45
      ? commentClose(code)
      : comment(code)
  }

  /**
   * After `<![`, in CDATA, expecting `CDATA[`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *          ^^^^^^
   * ```
   *
   * @type {State}
   */
  function cdataOpenInside(code) {
    const value = 'CDATA['
    if (code === value.charCodeAt(index++)) {
      effects.consume(code)
      return index === value.length ? cdata : cdataOpenInside
    }
    return nok(code)
  }

  /**
   * In CDATA.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                ^^^
   * ```
   *
   * @type {State}
   */
  function cdata(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 93) {
      effects.consume(code)
      return cdataClose
    }
    if (markdownLineEnding(code)) {
      returnState = cdata
      return lineEndingBefore(code)
    }
    effects.consume(code)
    return cdata
  }

  /**
   * In CDATA, after `]`, at another `]`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                    ^
   * ```
   *
   * @type {State}
   */
  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code)
      return cdataEnd
    }
    return cdata(code)
  }

  /**
   * In CDATA, after `]]`, at `>`.
   *
   * ```markdown
   * > | a <![CDATA[>&<]]> b
   *                     ^
   * ```
   *
   * @type {State}
   */
  function cdataEnd(code) {
    if (code === 62) {
      return end(code)
    }
    if (code === 93) {
      effects.consume(code)
      return cdataEnd
    }
    return cdata(code)
  }

  /**
   * In declaration.
   *
   * ```markdown
   * > | a <!b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function declaration(code) {
    if (code === null || code === 62) {
      return end(code)
    }
    if (markdownLineEnding(code)) {
      returnState = declaration
      return lineEndingBefore(code)
    }
    effects.consume(code)
    return declaration
  }

  /**
   * In instruction.
   *
   * ```markdown
   * > | a <?b?> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function instruction(code) {
    if (code === null) {
      return nok(code)
    }
    if (code === 63) {
      effects.consume(code)
      return instructionClose
    }
    if (markdownLineEnding(code)) {
      returnState = instruction
      return lineEndingBefore(code)
    }
    effects.consume(code)
    return instruction
  }

  /**
   * In instruction, after `?`, at `>`.
   *
   * ```markdown
   * > | a <?b?> c
   *           ^
   * ```
   *
   * @type {State}
   */
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code)
  }

  /**
   * After `</`, in closing tag, at tag name.
   *
   * ```markdown
   * > | a </b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagCloseStart(code) {
    // ASCII alphabetical.
    if (asciiAlpha(code)) {
      effects.consume(code)
      return tagClose
    }
    return nok(code)
  }

  /**
   * After `</x`, in a tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagClose(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      return tagClose
    }
    return tagCloseBetween(code)
  }

  /**
   * In closing tag, after tag name.
   *
   * ```markdown
   * > | a </b> c
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return tagCloseBetween
    }
    return end(code)
  }

  /**
   * After `<x`, in opening tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpen(code) {
    // ASCII alphanumerical and `-`.
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      return tagOpen
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    return nok(code)
  }

  /**
   * In opening tag, after tag name.
   *
   * ```markdown
   * > | a <b> c
   *         ^
   * ```
   *
   * @type {State}
   */
  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code)
      return end
    }

    // ASCII alphabetical and `:` and `_`.
    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code)
      return tagOpenAttributeName
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenBetween
    }
    return end(code)
  }

  /**
   * In attribute name.
   *
   * ```markdown
   * > | a <b c> d
   *          ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeName(code) {
    // ASCII alphabetical and `-`, `.`, `:`, and `_`.
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code)
      return tagOpenAttributeName
    }
    return tagOpenAttributeNameAfter(code)
  }

  /**
   * After attribute name, before initializer, the end of the tag, or
   * whitespace.
   *
   * ```markdown
   * > | a <b c> d
   *           ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenAttributeNameAfter
    }
    return tagOpenBetween(code)
  }

  /**
   * Before unquoted, double quoted, or single quoted attribute value, allowing
   * whitespace.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 34 || code === 39) {
      effects.consume(code)
      marker = code
      return tagOpenAttributeValueQuoted
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore
      return lineEndingBefore(code)
    }
    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }
    effects.consume(code)
    return tagOpenAttributeValueUnquoted
  }

  /**
   * In double or single quoted attribute value.
   *
   * ```markdown
   * > | a <b c="d"> e
   *             ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code)
      marker = undefined
      return tagOpenAttributeValueQuotedAfter
    }
    if (code === null) {
      return nok(code)
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted
      return lineEndingBefore(code)
    }
    effects.consume(code)
    return tagOpenAttributeValueQuoted
  }

  /**
   * In unquoted attribute value.
   *
   * ```markdown
   * > | a <b c=d> e
   *            ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 60 ||
      code === 61 ||
      code === 96
    ) {
      return nok(code)
    }
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    effects.consume(code)
    return tagOpenAttributeValueUnquoted
  }

  /**
   * After double or single quoted attribute value, before whitespace or the end
   * of the tag.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }
    return nok(code)
  }

  /**
   * In certain circumstances of a tag where only an `>` is allowed.
   *
   * ```markdown
   * > | a <b c="d"> e
   *               ^
   * ```
   *
   * @type {State}
   */
  function end(code) {
    if (code === 62) {
      effects.consume(code)
      effects.exit('htmlTextData')
      effects.exit('htmlText')
      return ok
    }
    return nok(code)
  }

  /**
   * At eol.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   * > | a <!--a
   *            ^
   *   | b-->
   * ```
   *
   * @type {State}
   */
  function lineEndingBefore(code) {
    effects.exit('htmlTextData')
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return lineEndingAfter
  }

  /**
   * After eol, at optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfter(code) {
    // Always populated by defaults.

    return markdownSpace(code)
      ? factorySpace(
          effects,
          lineEndingAfterPrefix,
          'linePrefix',
          self.parser.constructs.disable.null.includes('codeIndented')
            ? undefined
            : 4
        )(code)
      : lineEndingAfterPrefix(code)
  }

  /**
   * After eol, after optional whitespace.
   *
   * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
   * > empty tokens.
   *
   * ```markdown
   *   | a <!--a
   * > | b-->
   *     ^
   * ```
   *
   * @type {State}
   */
  function lineEndingAfterPrefix(code) {
    effects.enter('htmlTextData')
    return returnState(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/label-start-link.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */



/** @type {Construct} */
const labelStartLink = {
  name: 'labelStartLink',
  tokenize: tokenizeLabelStartLink,
  resolveAll: labelEnd.resolveAll
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeLabelStartLink(effects, ok, nok) {
  const self = this
  return start

  /**
   * Start of label (link) start.
   *
   * ```markdown
   * > | a [b] c
   *       ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('labelLink')
    effects.enter('labelMarker')
    effects.consume(code)
    effects.exit('labelMarker')
    effects.exit('labelLink')
    return after
  }

  /** @type {State} */
  function after(code) {
    // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
    // remove.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/hard-break-escape.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start

  /**
   * Start of a hard break (escape).
   *
   * ```markdown
   * > | a\
   *      ^
   *   | b
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('hardBreakEscape')
    effects.consume(code)
    return after
  }

  /**
   * After `\`, at eol.
   *
   * ```markdown
   * > | a\
   *       ^
   *   | b
   * ```
   *
   *  @type {State}
   */
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit('hardBreakEscape')
      return ok(code)
    }
    return nok(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark-core-commonmark/lib/code-text.js
/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 */


/** @type {Construct} */
const codeText = {
  name: 'codeText',
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous
}

// To do: next major: don’t resolve, like `markdown-rs`.
/** @type {Resolver} */
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4
  let headEnterIndex = 3
  /** @type {number} */
  let index
  /** @type {number | undefined} */
  let enter

  // If we start and end with an EOL or a space.
  if (
    (events[headEnterIndex][1].type === 'lineEnding' ||
      events[headEnterIndex][1].type === 'space') &&
    (events[tailExitIndex][1].type === 'lineEnding' ||
      events[tailExitIndex][1].type === 'space')
  ) {
    index = headEnterIndex

    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === 'codeTextData') {
        // Then we have padding.
        events[headEnterIndex][1].type = 'codeTextPadding'
        events[tailExitIndex][1].type = 'codeTextPadding'
        headEnterIndex += 2
        tailExitIndex -= 2
        break
      }
    }
  }

  // Merge adjacent spaces and data.
  index = headEnterIndex - 1
  tailExitIndex++
  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
        enter = index
      }
    } else if (
      index === tailExitIndex ||
      events[index][1].type === 'lineEnding'
    ) {
      events[enter][1].type = 'codeTextData'
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end
        events.splice(enter + 2, index - enter - 2)
        tailExitIndex -= index - enter - 2
        index = enter + 2
      }
      enter = undefined
    }
  }
  return events
}

/**
 * @this {TokenizeContext}
 * @type {Previous}
 */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== 96 ||
    this.events[this.events.length - 1][1].type === 'characterEscape'
  )
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCodeText(effects, ok, nok) {
  const self = this
  let sizeOpen = 0
  /** @type {number} */
  let size
  /** @type {Token} */
  let token
  return start

  /**
   * Start of code (text).
   *
   * ```markdown
   * > | `a`
   *     ^
   * > | \`a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    effects.enter('codeText')
    effects.enter('codeTextSequence')
    return sequenceOpen(code)
  }

  /**
   * In opening sequence.
   *
   * ```markdown
   * > | `a`
   *     ^
   * ```
   *
   * @type {State}
   */
  function sequenceOpen(code) {
    if (code === 96) {
      effects.consume(code)
      sizeOpen++
      return sequenceOpen
    }
    effects.exit('codeTextSequence')
    return between(code)
  }

  /**
   * Between something and something else.
   *
   * ```markdown
   * > | `a`
   *      ^^
   * ```
   *
   * @type {State}
   */
  function between(code) {
    // EOF.
    if (code === null) {
      return nok(code)
    }

    // To do: next major: don’t do spaces in resolve, but when compiling,
    // like `markdown-rs`.
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === 32) {
      effects.enter('space')
      effects.consume(code)
      effects.exit('space')
      return between
    }

    // Closing fence? Could also be data.
    if (code === 96) {
      token = effects.enter('codeTextSequence')
      size = 0
      return sequenceClose(code)
    }
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return between
    }

    // Data.
    effects.enter('codeTextData')
    return data(code)
  }

  /**
   * In data.
   *
   * ```markdown
   * > | `a`
   *      ^
   * ```
   *
   * @type {State}
   */
  function data(code) {
    if (
      code === null ||
      code === 32 ||
      code === 96 ||
      markdownLineEnding(code)
    ) {
      effects.exit('codeTextData')
      return between(code)
    }
    effects.consume(code)
    return data
  }

  /**
   * In closing sequence.
   *
   * ```markdown
   * > | `a`
   *       ^
   * ```
   *
   * @type {State}
   */
  function sequenceClose(code) {
    // More.
    if (code === 96) {
      effects.consume(code)
      size++
      return sequenceClose
    }

    // Done!
    if (size === sizeOpen) {
      effects.exit('codeTextSequence')
      effects.exit('codeText')
      return ok(code)
    }

    // More or less accents: mark as data.
    token.type = 'codeTextData'
    return data(code)
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/constructs.js
/**
 * @typedef {import('micromark-util-types').Extension} Extension
 */




/** @satisfies {Extension['document']} */
const constructs_document = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote
}

/** @satisfies {Extension['contentInitial']} */
const contentInitial = {
  [91]: definition
}

/** @satisfies {Extension['flowInitial']} */
const flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
}

/** @satisfies {Extension['flow']} */
const constructs_flow = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced
}

/** @satisfies {Extension['string']} */
const constructs_string = {
  [38]: characterReference,
  [92]: characterEscape
}

/** @satisfies {Extension['text']} */
const constructs_text = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
}

/** @satisfies {Extension['insideSpan']} */
const insideSpan = {
  null: [attention, resolver]
}

/** @satisfies {Extension['attentionMarkers']} */
const attentionMarkers = {
  null: [42, 95]
}

/** @satisfies {Extension['disable']} */
const disable = {
  null: []
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/parse.js
/**
 * @typedef {import('micromark-util-types').Create} Create
 * @typedef {import('micromark-util-types').FullNormalizedExtension} FullNormalizedExtension
 * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
 * @typedef {import('micromark-util-types').ParseContext} ParseContext
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 */









/**
 * @param {ParseOptions | null | undefined} [options]
 * @returns {ParseContext}
 */
function parse_parse(options) {
  const settings = options || {}
  const constructs =
    /** @type {FullNormalizedExtension} */
    combineExtensions([constructs_namespaceObject, ...(settings.extensions || [])])

  /** @type {ParseContext} */
  const parser = {
    defined: [],
    lazy: {},
    constructs,
    content: create(content),
    document: create(document_document),
    flow: create(flow),
    string: create(string),
    text: create(text_text)
  }
  return parser

  /**
   * @param {InitialConstruct} initial
   */
  function create(initial) {
    return creator
    /** @type {Create} */
    function creator(from) {
      return createTokenizer(parser, initial, from)
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/preprocess.js
/**
 * @typedef {import('micromark-util-types').Chunk} Chunk
 * @typedef {import('micromark-util-types').Code} Code
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Value} Value
 */

/**
 * @callback Preprocessor
 * @param {Value} value
 * @param {Encoding | null | undefined} [encoding]
 * @param {boolean | null | undefined} [end=false]
 * @returns {Array<Chunk>}
 */

const search = /[\0\t\n\r]/g

/**
 * @returns {Preprocessor}
 */
function preprocess() {
  let column = 1
  let buffer = ''
  /** @type {boolean | undefined} */
  let start = true
  /** @type {boolean | undefined} */
  let atCarriageReturn
  return preprocessor

  /** @type {Preprocessor} */
  function preprocessor(value, encoding, end) {
    /** @type {Array<Chunk>} */
    const chunks = []
    /** @type {RegExpMatchArray | null} */
    let match
    /** @type {number} */
    let next
    /** @type {number} */
    let startPosition
    /** @type {number} */
    let endPosition
    /** @type {Code} */
    let code

    // @ts-expect-error `Buffer` does allow an encoding.
    value = buffer + value.toString(encoding)
    startPosition = 0
    buffer = ''
    if (start) {
      // To do: `markdown-rs` actually parses BOMs (byte order mark).
      if (value.charCodeAt(0) === 65279) {
        startPosition++
      }
      start = undefined
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition
      match = search.exec(value)
      endPosition =
        match && match.index !== undefined ? match.index : value.length
      code = value.charCodeAt(endPosition)
      if (!match) {
        buffer = value.slice(startPosition)
        break
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3)
        atCarriageReturn = undefined
      } else {
        if (atCarriageReturn) {
          chunks.push(-5)
          atCarriageReturn = undefined
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition))
          column += endPosition - startPosition
        }
        switch (code) {
          case 0: {
            chunks.push(65533)
            column++
            break
          }
          case 9: {
            next = Math.ceil(column / 4) * 4
            chunks.push(-2)
            while (column++ < next) chunks.push(-1)
            break
          }
          case 10: {
            chunks.push(-4)
            column = 1
            break
          }
          default: {
            atCarriageReturn = true
            column = 1
          }
        }
      }
      startPosition = endPosition + 1
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5)
      if (buffer) chunks.push(buffer)
      chunks.push(null)
    }
    return chunks
  }
}

;// CONCATENATED MODULE: ./node_modules/micromark/lib/postprocess.js
/**
 * @typedef {import('micromark-util-types').Event} Event
 */



/**
 * @param {Array<Event>} events
 * @returns {Array<Event>}
 */
function postprocess(events) {
  while (!subtokenize(events)) {
    // Empty
  }
  return events
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
 * Turn the number (in string form as either hexa- or plain decimal) coming from
 * a numeric character reference into a character.
 *
 * Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
 * non-characters and control characters safe.
 *
 * @param {string} value
 *   Value to decode.
 * @param {number} base
 *   Numeric base.
 * @returns {string}
 *   Character.
 */
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base)
  if (
    // C0 except for HT, LF, FF, CR, space.
    code < 9 ||
    code === 11 ||
    (code > 13 && code < 32) ||
    // Control character (DEL) of C0, and C1 controls.
    (code > 126 && code < 160) ||
    // Lone high surrogates and low surrogates.
    (code > 55295 && code < 57344) ||
    // Noncharacters.
    (code > 64975 && code < 65008) /* eslint-disable no-bitwise */ ||
    (code & 65535) === 65535 ||
    (code & 65535) === 65534 /* eslint-enable no-bitwise */ ||
    // Out of range
    code > 1114111
  ) {
    return '\uFFFD'
  }
  return String.fromCharCode(code)
}

;// CONCATENATED MODULE: ./node_modules/micromark-util-decode-string/index.js


const characterEscapeOrReference =
  /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi

/**
 * Decode markdown strings (which occur in places such as fenced code info
 * strings, destinations, labels, and titles).
 *
 * The “string” content type allows character escapes and -references.
 * This decodes those.
 *
 * @param {string} value
 *   Value to decode.
 * @returns {string}
 *   Decoded value.
 */
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode)
}

/**
 * @param {string} $0
 * @param {string} $1
 * @param {string} $2
 * @returns {string}
 */
function decode($0, $1, $2) {
  if ($1) {
    // Escape.
    return $1
  }

  // Reference.
  const head = $2.charCodeAt(0)
  if (head === 35) {
    const head = $2.charCodeAt(1)
    const hex = head === 120 || head === 88
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10)
  }
  return decodeNamedCharacterReference($2) || $0
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-from-markdown/lib/index.js
/**
 * @typedef {import('micromark-util-types').Encoding} Encoding
 * @typedef {import('micromark-util-types').Event} Event
 * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Value} Value
 *
 * @typedef {import('unist').Parent} UnistParent
 * @typedef {import('unist').Point} Point
 *
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').Code} Code
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('mdast').ReferenceType} ReferenceType
 * @typedef {import('../index.js').CompileData} CompileData
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, UnistParent>} Parent
 *
 * @typedef {Omit<UnistParent, 'type' | 'children'> & {type: 'fragment', children: Array<PhrasingContent>}} Fragment
 */

/**
 * @callback Transform
 *   Extra transform, to change the AST afterwards.
 * @param {Root} tree
 *   Tree to transform.
 * @returns {Root | undefined | null | void}
 *   New tree or nothing (in which case the current tree is used).
 *
 * @callback Handle
 *   Handle a token.
 * @param {CompileContext} this
 *   Context.
 * @param {Token} token
 *   Current token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {Record<string, Handle>} Handles
 *   Token types mapping to handles
 *
 * @callback OnEnterError
 *   Handle the case where the `right` token is open, but it is closed (by the
 *   `left` token) or because we reached the end of the document.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token | undefined} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @callback OnExitError
 *   Handle the case where the `right` token is open but it is closed by
 *   exiting the `left` token.
 * @param {Omit<CompileContext, 'sliceSerialize'>} this
 *   Context.
 * @param {Token} left
 *   Left token.
 * @param {Token} right
 *   Right token.
 * @returns {void}
 *   Nothing.
 *
 * @typedef {[Token, OnEnterError | undefined]} TokenTuple
 *   Open token on the stack, with an optional error handler for when
 *   that token isn’t closed properly.
 */

/**
 * @typedef Config
 *   Configuration.
 *
 *   We have our defaults, but extensions will add more.
 * @property {Array<string>} canContainEols
 *   Token types where line endings are used.
 * @property {Handles} enter
 *   Opening handles.
 * @property {Handles} exit
 *   Closing handles.
 * @property {Array<Transform>} transforms
 *   Tree transforms.
 *
 * @typedef {Partial<Config>} Extension
 *   Change how markdown tokens from micromark are turned into mdast.
 *
 * @typedef CompileContext
 *   mdast compiler context.
 * @property {Array<Node | Fragment>} stack
 *   Stack of nodes.
 * @property {Array<TokenTuple>} tokenStack
 *   Stack of tokens.
 * @property {<Key extends keyof CompileData>(key: Key) => CompileData[Key]} getData
 *   Get data from the key/value store.
 * @property {<Key extends keyof CompileData>(key: Key, value?: CompileData[Key]) => void} setData
 *   Set data into the key/value store.
 * @property {(this: CompileContext) => void} buffer
 *   Capture some of the output data.
 * @property {(this: CompileContext) => string} resume
 *   Stop capturing and access the output data.
 * @property {<Kind extends Node>(this: CompileContext, node: Kind, token: Token, onError?: OnEnterError) => Kind} enter
 *   Enter a token.
 * @property {(this: CompileContext, token: Token, onError?: OnExitError) => Node} exit
 *   Exit a token.
 * @property {TokenizeContext['sliceSerialize']} sliceSerialize
 *   Get the string value of a token.
 * @property {Config} config
 *   Configuration.
 *
 * @typedef FromMarkdownOptions
 *   Configuration for how to build mdast.
 * @property {Array<Extension | Array<Extension>> | null | undefined} [mdastExtensions]
 *   Extensions for this utility to change how tokens are turned into a tree.
 *
 * @typedef {ParseOptions & FromMarkdownOptions} Options
 *   Configuration.
 */

// To do: micromark: create a registry of tokens?
// To do: next major: don’t return given `Node` from `enter`.
// To do: next major: remove setter/getter.










const lib_own = {}.hasOwnProperty

/**
 * @param value
 *   Markdown to parse.
 * @param encoding
 *   Character encoding for when `value` is `Buffer`.
 * @param options
 *   Configuration.
 * @returns
 *   mdast tree.
 */
const fromMarkdown =
  /**
   * @type {(
   *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
   *   ((value: Value, options?: Options | null | undefined) => Root)
   * )}
   */

  /**
   * @param {Value} value
   * @param {Encoding | Options | null | undefined} [encoding]
   * @param {Options | null | undefined} [options]
   * @returns {Root}
   */
  function (value, encoding, options) {
    if (typeof encoding !== 'string') {
      options = encoding
      encoding = undefined
    }
    return compiler(options)(
      postprocess(
        parse_parse(options).document().write(preprocess()(value, encoding, true))
      )
    )
  }

/**
 * Note this compiler only understand complete buffering, not streaming.
 *
 * @param {Options | null | undefined} [options]
 */
function compiler(options) {
  /** @type {Config} */
  const config = {
    transforms: [],
    canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  }
  configure(config, (options || {}).mdastExtensions || [])

  /** @type {CompileData} */
  const data = {}
  return compile

  /**
   * Turn micromark events into an mdast tree.
   *
   * @param {Array<Event>} events
   *   Events.
   * @returns {Root}
   *   mdast tree.
   */
  function compile(events) {
    /** @type {Root} */
    let tree = {
      type: 'root',
      children: []
    }
    /** @type {Omit<CompileContext, 'sliceSerialize'>} */
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit,
      buffer,
      resume,
      setData,
      getData
    }
    /** @type {Array<number>} */
    const listStack = []
    let index = -1
    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (
        events[index][1].type === 'listOrdered' ||
        events[index][1].type === 'listUnordered'
      ) {
        if (events[index][0] === 'enter') {
          listStack.push(index)
        } else {
          const tail = listStack.pop()
          index = prepareList(events, tail, index)
        }
      }
    }
    index = -1
    while (++index < events.length) {
      const handler = config[events[index][0]]
      if (lib_own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          Object.assign(
            {
              sliceSerialize: events[index][2].sliceSerialize
            },
            context
          ),
          events[index][1]
        )
      }
    }

    // Handle tokens still being open.
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1]
      const handler = tail[1] || defaultOnError
      handler.call(context, undefined, tail[0])
    }

    // Figure out `root` position.
    tree.position = {
      start: lib_point(
        events.length > 0
          ? events[0][1].start
          : {
              line: 1,
              column: 1,
              offset: 0
            }
      ),
      end: lib_point(
        events.length > 0
          ? events[events.length - 2][1].end
          : {
              line: 1,
              column: 1,
              offset: 0
            }
      )
    }

    // Call transforms.
    index = -1
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree
    }
    return tree
  }

  /**
   * @param {Array<Event>} events
   * @param {number} start
   * @param {number} length
   * @returns {number}
   */
  function prepareList(events, start, length) {
    let index = start - 1
    let containerBalance = -1
    let listSpread = false
    /** @type {Token | undefined} */
    let listItem
    /** @type {number | undefined} */
    let lineIndex
    /** @type {number | undefined} */
    let firstBlankLineIndex
    /** @type {boolean | undefined} */
    let atMarker
    while (++index <= length) {
      const event = events[index]
      if (
        event[1].type === 'listUnordered' ||
        event[1].type === 'listOrdered' ||
        event[1].type === 'blockQuote'
      ) {
        if (event[0] === 'enter') {
          containerBalance++
        } else {
          containerBalance--
        }
        atMarker = undefined
      } else if (event[1].type === 'lineEndingBlank') {
        if (event[0] === 'enter') {
          if (
            listItem &&
            !atMarker &&
            !containerBalance &&
            !firstBlankLineIndex
          ) {
            firstBlankLineIndex = index
          }
          atMarker = undefined
        }
      } else if (
        event[1].type === 'linePrefix' ||
        event[1].type === 'listItemValue' ||
        event[1].type === 'listItemMarker' ||
        event[1].type === 'listItemPrefix' ||
        event[1].type === 'listItemPrefixWhitespace'
      ) {
        // Empty.
      } else {
        atMarker = undefined
      }
      if (
        (!containerBalance &&
          event[0] === 'enter' &&
          event[1].type === 'listItemPrefix') ||
        (containerBalance === -1 &&
          event[0] === 'exit' &&
          (event[1].type === 'listUnordered' ||
            event[1].type === 'listOrdered'))
      ) {
        if (listItem) {
          let tailIndex = index
          lineIndex = undefined
          while (tailIndex--) {
            const tailEvent = events[tailIndex]
            if (
              tailEvent[1].type === 'lineEnding' ||
              tailEvent[1].type === 'lineEndingBlank'
            ) {
              if (tailEvent[0] === 'exit') continue
              if (lineIndex) {
                events[lineIndex][1].type = 'lineEndingBlank'
                listSpread = true
              }
              tailEvent[1].type = 'lineEnding'
              lineIndex = tailIndex
            } else if (
              tailEvent[1].type === 'linePrefix' ||
              tailEvent[1].type === 'blockQuotePrefix' ||
              tailEvent[1].type === 'blockQuotePrefixWhitespace' ||
              tailEvent[1].type === 'blockQuoteMarker' ||
              tailEvent[1].type === 'listItemIndent'
            ) {
              // Empty
            } else {
              break
            }
          }
          if (
            firstBlankLineIndex &&
            (!lineIndex || firstBlankLineIndex < lineIndex)
          ) {
            listItem._spread = true
          }

          // Fix position.
          listItem.end = Object.assign(
            {},
            lineIndex ? events[lineIndex][1].start : event[1].end
          )
          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]])
          index++
          length++
        }

        // Create a new list item.
        if (event[1].type === 'listItemPrefix') {
          listItem = {
            type: 'listItem',
            _spread: false,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: undefined
          }
          // @ts-expect-error: `listItem` is most definitely defined, TS...
          events.splice(index, 0, ['enter', listItem, event[2]])
          index++
          length++
          firstBlankLineIndex = undefined
          atMarker = true
        }
      }
    }
    events[start][1]._spread = listSpread
    return length
  }

  /**
   * Set data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @param {CompileData[Key]} [value]
   *   New value.
   * @returns {void}
   *   Nothing.
   */
  function setData(key, value) {
    data[key] = value
  }

  /**
   * Get data.
   *
   * @template {keyof CompileData} Key
   *   Field type.
   * @param {Key} key
   *   Key of field.
   * @returns {CompileData[Key]}
   *   Value.
   */
  function getData(key) {
    return data[key]
  }

  /**
   * Create an opener handle.
   *
   * @param {(token: Token) => Node} create
   *   Create a node.
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function opener(create, and) {
    return open

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function open(token) {
      enter.call(this, create(token), token)
      if (and) and.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   * @returns {void}
   */
  function buffer() {
    this.stack.push({
      type: 'fragment',
      children: []
    })
  }

  /**
   * @template {Node} Kind
   *   Node type.
   * @this {CompileContext}
   *   Context.
   * @param {Kind} node
   *   Node to enter.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnEnterError | undefined} [errorHandler]
   *   Handle the case where this token is open, but it is closed by something else.
   * @returns {Kind}
   *   The given node.
   */
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1]
    // @ts-expect-error: Assume `Node` can exist as a child of `parent`.
    parent.children.push(node)
    this.stack.push(node)
    this.tokenStack.push([token, errorHandler])
    // @ts-expect-error: `end` will be patched later.
    node.position = {
      start: lib_point(token.start)
    }
    return node
  }

  /**
   * Create a closer handle.
   *
   * @param {Handle} [and]
   *   Optional function to also run.
   * @returns {Handle}
   *   Handle.
   */
  function closer(and) {
    return close

    /**
     * @this {CompileContext}
     * @param {Token} token
     * @returns {void}
     */
    function close(token) {
      if (and) and.call(this, token)
      exit.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   *   Context.
   * @param {Token} token
   *   Corresponding token.
   * @param {OnExitError | undefined} [onExitError]
   *   Handle the case where another token is open.
   * @returns {Node}
   *   The closed node.
   */
  function exit(token, onExitError) {
    const node = this.stack.pop()
    const open = this.tokenStack.pop()
    if (!open) {
      throw new Error(
        'Cannot close `' +
          token.type +
          '` (' +
          stringifyPosition({
            start: token.start,
            end: token.end
          }) +
          '): it’s not open'
      )
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0])
      } else {
        const handler = open[1] || defaultOnError
        handler.call(this, token, open[0])
      }
    }
    node.position.end = lib_point(token.end)
    return node
  }

  /**
   * @this {CompileContext}
   * @returns {string}
   */
  function resume() {
    return lib_toString(this.stack.pop())
  }

  //
  // Handlers.
  //

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistordered() {
    setData('expectingFirstListItemValue', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onenterlistitemvalue(token) {
    if (getData('expectingFirstListItemValue')) {
      const ancestor = this.stack[this.stack.length - 2]
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10)
      setData('expectingFirstListItemValue')
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfenceinfo() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.lang = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfencemeta() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.meta = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (getData('flowCodeInside')) return
    this.buffer()
    setData('flowCodeInside', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodefenced() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '')
    setData('flowCodeInside')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcodeindented() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.value = data.replace(/(\r?\n|\r)$/g, '')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitionlabelstring(token) {
    const label = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.label = label
    node.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase()
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiontitlestring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.title = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitdefinitiondestinationstring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.url = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitatxheadingsequence(token) {
    const node = this.stack[this.stack.length - 1]
    if (!node.depth) {
      const depth = this.sliceSerialize(token).length
      node.depth = depth
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadingtext() {
    setData('setextHeadingSlurpLineEnding', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheadinglinesequence(token) {
    const node = this.stack[this.stack.length - 1]
    node.depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitsetextheading() {
    setData('setextHeadingSlurpLineEnding')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterdata(token) {
    const node = this.stack[this.stack.length - 1]
    let tail = node.children[node.children.length - 1]
    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text()
      // @ts-expect-error: we’ll add `end` later.
      tail.position = {
        start: lib_point(token.start)
      }
      // @ts-expect-error: Assume `parent` accepts `text`.
      node.children.push(tail)
    }
    this.stack.push(tail)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitdata(token) {
    const tail = this.stack.pop()
    tail.value += this.sliceSerialize(token)
    tail.position.end = lib_point(token.end)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1]
    // If we’re at a hard break, include the line ending in there.
    if (getData('atHardBreak')) {
      const tail = context.children[context.children.length - 1]
      tail.position.end = lib_point(token.end)
      setData('atHardBreak')
      return
    }
    if (
      !getData('setextHeadingSlurpLineEnding') &&
      config.canContainEols.includes(context.type)
    ) {
      onenterdata.call(this, token)
      onexitdata.call(this, token)
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithardbreak() {
    setData('atHardBreak', true)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmlflow() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexithtmltext() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcodetext() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.value = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlink() {
    const node = this.stack[this.stack.length - 1]
    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.
    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut'
      node.type += 'Reference'
      // @ts-expect-error: mutate.
      node.referenceType = referenceType
      // @ts-expect-error: mutate.
      delete node.url
      delete node.title
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier
      // @ts-expect-error: mutate.
      delete node.label
    }
    setData('referenceType')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitimage() {
    const node = this.stack[this.stack.length - 1]
    // Note: there are also `identifier` and `label` fields on this link node!
    // These are used / cleaned here.
    // To do: clean.
    if (getData('inReference')) {
      /** @type {ReferenceType} */
      const referenceType = getData('referenceType') || 'shortcut'
      node.type += 'Reference'
      // @ts-expect-error: mutate.
      node.referenceType = referenceType
      // @ts-expect-error: mutate.
      delete node.url
      delete node.title
    } else {
      // @ts-expect-error: mutate.
      delete node.identifier
      // @ts-expect-error: mutate.
      delete node.label
    }
    setData('referenceType')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabeltext(token) {
    const string = this.sliceSerialize(token)
    const ancestor = this.stack[this.stack.length - 2]
    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    ancestor.label = decodeString(string)
    // @ts-expect-error: same as above.
    ancestor.identifier = normalizeIdentifier(string).toLowerCase()
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1]
    const value = this.resume()
    const node = this.stack[this.stack.length - 1]
    // Assume a reference.
    setData('inReference', true)
    if (node.type === 'link') {
      /** @type {Array<StaticPhrasingContent>} */
      // @ts-expect-error: Assume static phrasing content.
      const children = fragment.children
      node.children = children
    } else {
      node.alt = value
    }
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcedestinationstring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.url = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresourcetitlestring() {
    const data = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.title = data
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitresource() {
    setData('inReference')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onenterreference() {
    setData('referenceType', 'collapsed')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitreferencestring(token) {
    const label = this.resume()
    const node = this.stack[this.stack.length - 1]
    // @ts-expect-error: stash this on the node, as it might become a reference
    // later.
    node.label = label
    // @ts-expect-error: same as above.
    node.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase()
    setData('referenceType', 'full')
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */

  function onexitcharacterreferencemarker(token) {
    setData('characterReferenceType', token.type)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitcharacterreferencevalue(token) {
    const data = this.sliceSerialize(token)
    const type = getData('characterReferenceType')
    /** @type {string} */
    let value
    if (type) {
      value = decodeNumericCharacterReference(
        data,
        type === 'characterReferenceMarkerNumeric' ? 10 : 16
      )
      setData('characterReferenceType')
    } else {
      const result = decodeNamedCharacterReference(data)
      value = result
    }
    const tail = this.stack.pop()
    tail.value += value
    tail.position.end = lib_point(token.end)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token)
    const node = this.stack[this.stack.length - 1]
    node.url = this.sliceSerialize(token)
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function onexitautolinkemail(token) {
    onexitdata.call(this, token)
    const node = this.stack[this.stack.length - 1]
    node.url = 'mailto:' + this.sliceSerialize(token)
  }

  //
  // Creaters.
  //

  /** @returns {Blockquote} */
  function blockQuote() {
    return {
      type: 'blockquote',
      children: []
    }
  }

  /** @returns {Code} */
  function codeFlow() {
    return {
      type: 'code',
      lang: null,
      meta: null,
      value: ''
    }
  }

  /** @returns {InlineCode} */
  function codeText() {
    return {
      type: 'inlineCode',
      value: ''
    }
  }

  /** @returns {Definition} */
  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    }
  }

  /** @returns {Emphasis} */
  function emphasis() {
    return {
      type: 'emphasis',
      children: []
    }
  }

  /** @returns {Heading} */
  function heading() {
    // @ts-expect-error `depth` will be set later.
    return {
      type: 'heading',
      depth: undefined,
      children: []
    }
  }

  /** @returns {Break} */
  function hardBreak() {
    return {
      type: 'break'
    }
  }

  /** @returns {HTML} */
  function html() {
    return {
      type: 'html',
      value: ''
    }
  }

  /** @returns {Image} */
  function image() {
    return {
      type: 'image',
      title: null,
      url: '',
      alt: null
    }
  }

  /** @returns {Link} */
  function link() {
    return {
      type: 'link',
      title: null,
      url: '',
      children: []
    }
  }

  /**
   * @param {Token} token
   * @returns {List}
   */
  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    }
  }

  /**
   * @param {Token} token
   * @returns {ListItem}
   */
  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    }
  }

  /** @returns {Paragraph} */
  function paragraph() {
    return {
      type: 'paragraph',
      children: []
    }
  }

  /** @returns {Strong} */
  function strong() {
    return {
      type: 'strong',
      children: []
    }
  }

  /** @returns {Text} */
  function text() {
    return {
      type: 'text',
      value: ''
    }
  }

  /** @returns {ThematicBreak} */
  function thematicBreak() {
    return {
      type: 'thematicBreak'
    }
  }
}

/**
 * Copy a point-like value.
 *
 * @param {Point} d
 *   Point-like value.
 * @returns {Point}
 *   unist point.
 */
function lib_point(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset
  }
}

/**
 * @param {Config} combined
 * @param {Array<Extension | Array<Extension>>} extensions
 * @returns {void}
 */
function configure(combined, extensions) {
  let index = -1
  while (++index < extensions.length) {
    const value = extensions[index]
    if (Array.isArray(value)) {
      configure(combined, value)
    } else {
      extension(combined, value)
    }
  }
}

/**
 * @param {Config} combined
 * @param {Extension} extension
 * @returns {void}
 */
function extension(combined, extension) {
  /** @type {keyof Extension} */
  let key
  for (key in extension) {
    if (lib_own.call(extension, key)) {
      if (key === 'canContainEols') {
        const right = extension[key]
        if (right) {
          combined[key].push(...right)
        }
      } else if (key === 'transforms') {
        const right = extension[key]
        if (right) {
          combined[key].push(...right)
        }
      } else if (key === 'enter' || key === 'exit') {
        const right = extension[key]
        if (right) {
          Object.assign(combined[key], right)
        }
      }
    }
  }
}

/** @type {OnEnterError} */
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      'Cannot close `' +
        left.type +
        '` (' +
        stringifyPosition({
          start: left.start,
          end: left.end
        }) +
        '): a different token (`' +
        right.type +
        '`, ' +
        stringifyPosition({
          start: right.start,
          end: right.end
        }) +
        ') is open'
    )
  } else {
    throw new Error(
      'Cannot close document, a token (`' +
        right.type +
        '`, ' +
        stringifyPosition({
          start: right.start,
          end: right.end
        }) +
        ') is still open'
    )
  }
}

;// CONCATENATED MODULE: ./node_modules/remark-parse/lib/index.js
/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-from-markdown').Options} Options
 */



/**
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<[Options?] | void[], string, Root>}
 */
function remarkParse(options) {
  /** @type {import('unified').ParserFunction<Root>} */
  const parser = (doc) => {
    // Assume options.
    const settings = /** @type {Options} */ (this.data('settings'))

    return fromMarkdown(
      doc,
      Object.assign({}, settings, options, {
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: this.data('micromarkExtensions') || [],
        mdastExtensions: this.data('fromMarkdownExtensions') || []
      })
    )
  }

  Object.assign(this, {Parser: parser})
}

;// CONCATENATED MODULE: ./node_modules/zwitch/index.js
/**
 * @callback Handler
 *   Handle a value, with a certain ID field set to a certain value.
 *   The ID field is passed to `zwitch`, and it’s value is this function’s
 *   place on the `handlers` record.
 * @param {...any} parameters
 *   Arbitrary parameters passed to the zwitch.
 *   The first will be an object with a certain ID field set to a certain value.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback UnknownHandler
 *   Handle values that do have a certain ID field, but it’s set to a value
 *   that is not listed in the `handlers` record.
 * @param {unknown} value
 *   An object with a certain ID field set to an unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {any}
 *   Anything!
 */

/**
 * @callback InvalidHandler
 *   Handle values that do not have a certain ID field.
 * @param {unknown} value
 *   Any unknown value.
 * @param {...any} rest
 *   Arbitrary parameters passed to the zwitch.
 * @returns {void|null|undefined|never}
 *   This should crash or return nothing.
 */

/**
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @typedef Options
 *   Configuration (required).
 * @property {Invalid} [invalid]
 *   Handler to use for invalid values.
 * @property {Unknown} [unknown]
 *   Handler to use for unknown values.
 * @property {Handlers} [handlers]
 *   Handlers to use.
 */

const zwitch_own = {}.hasOwnProperty

/**
 * Handle values based on a field.
 *
 * @template {InvalidHandler} [Invalid=InvalidHandler]
 * @template {UnknownHandler} [Unknown=UnknownHandler]
 * @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
 * @param {string} key
 *   Field to switch on.
 * @param {Options<Invalid, Unknown, Handlers>} [options]
 *   Configuration (required).
 * @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
 */
function zwitch(key, options) {
  const settings = options || {}

  /**
   * Handle one value.
   *
   * Based on the bound `key`, a respective handler will be called.
   * If `value` is not an object, or doesn’t have a `key` property, the special
   * “invalid” handler will be called.
   * If `value` has an unknown `key`, the special “unknown” handler will be
   * called.
   *
   * All arguments, and the context object, are passed through to the handler,
   * and it’s result is returned.
   *
   * @this {unknown}
   *   Any context object.
   * @param {unknown} [value]
   *   Any value.
   * @param {...unknown} parameters
   *   Arbitrary parameters passed to the zwitch.
   * @property {Handler} invalid
   *   Handle for values that do not have a certain ID field.
   * @property {Handler} unknown
   *   Handle values that do have a certain ID field, but it’s set to a value
   *   that is not listed in the `handlers` record.
   * @property {Handlers} handlers
   *   Record of handlers.
   * @returns {unknown}
   *   Anything.
   */
  function one(value, ...parameters) {
    /** @type {Handler|undefined} */
    let fn = one.invalid
    const handlers = one.handlers

    if (value && zwitch_own.call(value, key)) {
      // @ts-expect-error Indexable.
      const id = String(value[key])
      // @ts-expect-error Indexable.
      fn = zwitch_own.call(handlers, id) ? handlers[id] : one.unknown
    }

    if (fn) {
      return fn.call(this, value, ...parameters)
    }
  }

  one.handlers = settings.handlers || {}
  one.invalid = settings.invalid
  one.unknown = settings.unknown

  // @ts-expect-error: matches!
  return one
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/configure.js
/**
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').State} State
 */

/**
 * @param {State} base
 * @param {Options} extension
 * @returns {State}
 */
function configure_configure(base, extension) {
  let index = -1
  /** @type {keyof Options} */
  let key

  // First do subextensions.
  if (extension.extensions) {
    while (++index < extension.extensions.length) {
      configure_configure(base, extension.extensions[index])
    }
  }

  for (key in extension) {
    if (key === 'extensions') {
      // Empty.
    } else if (key === 'unsafe' || key === 'join') {
      /* c8 ignore next 2 */
      // @ts-expect-error: hush.
      base[key] = [...(base[key] || []), ...(extension[key] || [])]
    } else if (key === 'handlers') {
      base[key] = Object.assign(base[key], extension[key] || {})
    } else {
      // @ts-expect-error: hush.
      base.options[key] = extension[key]
    }
  }

  return base
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').Map} Map
 */

/**
 * @param {Blockquote} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function blockquote(node, _, state, info) {
  const exit = state.enter('blockquote')
  const tracker = state.createTracker(info)
  tracker.move('> ')
  tracker.shift(2)
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    map
  )
  exit()
  return value
}

/** @type {Map} */
function map(line, _, blank) {
  return '>' + (blank ? '' : ' ') + line
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
 * @typedef {import('../types.js').Unsafe} Unsafe
 * @typedef {import('../types.js').ConstructName} ConstructName
 */

/**
 * @param {Array<ConstructName>} stack
 * @param {Unsafe} pattern
 * @returns {boolean}
 */
function patternInScope(stack, pattern) {
  return (
    listInScope(stack, pattern.inConstruct, true) &&
    !listInScope(stack, pattern.notInConstruct, false)
  )
}

/**
 * @param {Array<ConstructName>} stack
 * @param {Unsafe['inConstruct']} list
 * @param {boolean} none
 * @returns {boolean}
 */
function listInScope(stack, list, none) {
  if (typeof list === 'string') {
    list = [list]
  }

  if (!list || list.length === 0) {
    return none
  }

  let index = -1

  while (++index < list.length) {
    if (stack.includes(list[index])) {
      return true
    }
  }

  return false
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



/**
 * @param {Break} _
 * @param {Parent | undefined} _1
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function hardBreak(_, _1, state, info) {
  let index = -1

  while (++index < state.unsafe.length) {
    // If we can’t put eols in this construct (setext headings, tables), use a
    // space instead.
    if (
      state.unsafe[index].character === '\n' &&
      patternInScope(state.stack, state.unsafe[index])
    ) {
      return /[ \t]/.test(info.before) ? '' : ' '
    }
  }

  return '\\\n'
}

;// CONCATENATED MODULE: ./node_modules/longest-streak/index.js
/**
 * Get the count of the longest repeating streak of `substring` in `value`.
 *
 * @param {string} value
 *   Content to search in.
 * @param {string} substring
 *   Substring to look for, typically one character.
 * @returns {number}
 *   Count of most frequent adjacent `substring`s in `value`.
 */
function longestStreak(value, substring) {
  const source = String(value)
  let index = source.indexOf(substring)
  let expected = index
  let count = 0
  let max = 0

  if (typeof substring !== 'string') {
    throw new TypeError('Expected substring')
  }

  while (index !== -1) {
    if (index === expected) {
      if (++count > max) {
        max = count
      }
    } else {
      count = 1
    }

    expected = index + substring.length
    index = source.indexOf(substring, expected)
  }

  return max
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
 * @typedef {import('mdast').Code} Code
 * @typedef {import('../types.js').State} State
 */

/**
 * @param {Code} node
 * @param {State} state
 * @returns {boolean}
 */
function formatCodeAsIndented(node, state) {
  return Boolean(
    !state.options.fences &&
      node.value &&
      // If there’s no info…
      !node.lang &&
      // And there’s a non-whitespace character…
      /[^ \r\n]/.test(node.value) &&
      // And the value doesn’t start or end in a blank…
      !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value)
  )
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['fence'], null | undefined>}
 */
function checkFence(state) {
  const marker = state.options.fence || '`'

  if (marker !== '`' && marker !== '~') {
    throw new Error(
      'Cannot serialize code with `' +
        marker +
        '` for `options.fence`, expected `` ` `` or `~`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
 * @typedef {import('mdast').Code} Code
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').Map} Map
 */





/**
 * @param {Code} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function code(node, _, state, info) {
  const marker = checkFence(state)
  const raw = node.value || ''
  const suffix = marker === '`' ? 'GraveAccent' : 'Tilde'

  if (formatCodeAsIndented(node, state)) {
    const exit = state.enter('codeIndented')
    const value = state.indentLines(raw, code_map)
    exit()
    return value
  }

  const tracker = state.createTracker(info)
  const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3))
  const exit = state.enter('codeFenced')
  let value = tracker.move(sequence)

  if (node.lang) {
    const subexit = state.enter(`codeFencedLang${suffix}`)
    value += tracker.move(
      state.safe(node.lang, {
        before: value,
        after: ' ',
        encode: ['`'],
        ...tracker.current()
      })
    )
    subexit()
  }

  if (node.lang && node.meta) {
    const subexit = state.enter(`codeFencedMeta${suffix}`)
    value += tracker.move(' ')
    value += tracker.move(
      state.safe(node.meta, {
        before: value,
        after: '\n',
        encode: ['`'],
        ...tracker.current()
      })
    )
    subexit()
  }

  value += tracker.move('\n')

  if (raw) {
    value += tracker.move(raw + '\n')
  }

  value += tracker.move(sequence)
  exit()
  return value
}

/** @type {Map} */
function code_map(line, _, blank) {
  return (blank ? '' : '    ') + line
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['quote'], null | undefined>}
 */
function checkQuote(state) {
  const marker = state.options.quote || '"'

  if (marker !== '"' && marker !== "'") {
    throw new Error(
      'Cannot serialize title with `' +
        marker +
        '` for `options.quote`, expected `"`, or `\'`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



/**
 * @param {Definition} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function definition_definition(node, _, state, info) {
  const quote = checkQuote(state)
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  const exit = state.enter('definition')
  let subexit = state.enter('label')
  const tracker = state.createTracker(info)
  let value = tracker.move('[')
  value += tracker.move(
    state.safe(state.associationId(node), {
      before: value,
      after: ']',
      ...tracker.current()
    })
  )
  value += tracker.move(']: ')

  subexit()

  if (
    // If there’s no url, or…
    !node.url ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral')
    value += tracker.move('<')
    value += tracker.move(
      state.safe(node.url, {before: value, after: '>', ...tracker.current()})
    )
    value += tracker.move('>')
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter('destinationRaw')
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? ' ' : '\n',
        ...tracker.current()
      })
    )
  }

  subexit()

  if (node.title) {
    subexit = state.enter(`title${suffix}`)
    value += tracker.move(' ' + quote)
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    )
    value += tracker.move(quote)
    subexit()
  }

  exit()

  return value
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['emphasis'], null | undefined>}
 */
function checkEmphasis(state) {
  const marker = state.options.emphasis || '*'

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize emphasis with `' +
        marker +
        '` for `options.emphasis`, expected `*`, or `_`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
/**
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



emphasis.peek = emphasisPeek

// To do: there are cases where emphasis cannot “form” depending on the
// previous or next character of sequences.
// There’s no way around that though, except for injecting zero-width stuff.
// Do we need to safeguard against that?
/**
 * @param {Emphasis} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function emphasis(node, _, state, info) {
  const marker = checkEmphasis(state)
  const exit = state.enter('emphasis')
  const tracker = state.createTracker(info)
  let value = tracker.move(marker)
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: marker,
      ...tracker.current()
    })
  )
  value += tracker.move(marker)
  exit()
  return value
}

/**
 * @param {Emphasis} _
 * @param {Parent | undefined} _1
 * @param {State} state
 * @returns {string}
 */
function emphasisPeek(_, _1, state) {
  return state.options.emphasis || '*'
}

;// CONCATENATED MODULE: ./node_modules/unist-util-is/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */

/**
 * @typedef {Record<string, unknown>} Props
 * @typedef {null | undefined | string | Props | TestFunctionAnything | Array<string | Props | TestFunctionAnything>} Test
 *   Check for an arbitrary node, unaware of TypeScript inferral.
 *
 * @callback TestFunctionAnything
 *   Check if a node passes a test, unaware of TypeScript inferral.
 * @param {unknown} this
 *   The given context.
 * @param {Node} node
 *   A node.
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean | void}
 *   Whether this node passes the test.
 */

/**
 * @template {Node} Kind
 *   Node type.
 * @typedef {Kind['type'] | Partial<Kind> | TestFunctionPredicate<Kind> | Array<Kind['type'] | Partial<Kind> | TestFunctionPredicate<Kind>>} PredicateTest
 *   Check for a node that can be inferred by TypeScript.
 */

/**
 * Check if a node passes a certain test.
 *
 * @template {Node} Kind
 *   Node type.
 * @callback TestFunctionPredicate
 *   Complex test function for a node that can be inferred by TypeScript.
 * @param {Node} node
 *   A node.
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {node is Kind}
 *   Whether this node passes the test.
 */

/**
 * @callback AssertAnything
 *   Check that an arbitrary value is a node, unaware of TypeScript inferral.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {boolean}
 *   Whether this is a node and passes a test.
 */

/**
 * Check if a node is a node and passes a certain node test.
 *
 * @template {Node} Kind
 *   Node type.
 * @callback AssertPredicate
 *   Check that an arbitrary value is a specific node, aware of TypeScript.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   The node’s position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   The node’s parent.
 * @returns {node is Kind}
 *   Whether this is a node and passes a test.
 */

/**
 * Check if `node` is a `Node` and whether it passes the given test.
 *
 * @param node
 *   Thing to check, typically `Node`.
 * @param test
 *   A check for a specific node.
 * @param index
 *   The node’s position in its parent.
 * @param parent
 *   The node’s parent.
 * @returns
 *   Whether `node` is a node and passes a test.
 */
const is =
  /**
   * @type {(
   *   (() => false) &
   *   (<Kind extends Node = Node>(node: unknown, test: PredicateTest<Kind>, index: number, parent: Parent, context?: unknown) => node is Kind) &
   *   (<Kind extends Node = Node>(node: unknown, test: PredicateTest<Kind>, index?: null | undefined, parent?: null | undefined, context?: unknown) => node is Kind) &
   *   ((node: unknown, test: Test, index: number, parent: Parent, context?: unknown) => boolean) &
   *   ((node: unknown, test?: Test, index?: null | undefined, parent?: null | undefined, context?: unknown) => boolean)
   * )}
   */
  (
    /**
     * @param {unknown} [node]
     * @param {Test} [test]
     * @param {number | null | undefined} [index]
     * @param {Parent | null | undefined} [parent]
     * @param {unknown} [context]
     * @returns {boolean}
     */
    // eslint-disable-next-line max-params
    function is(node, test, index, parent, context) {
      const check = convert(test)

      if (
        index !== undefined &&
        index !== null &&
        (typeof index !== 'number' ||
          index < 0 ||
          index === Number.POSITIVE_INFINITY)
      ) {
        throw new Error('Expected positive finite index')
      }

      if (
        parent !== undefined &&
        parent !== null &&
        (!is(parent) || !parent.children)
      ) {
        throw new Error('Expected parent node')
      }

      if (
        (parent === undefined || parent === null) !==
        (index === undefined || index === null)
      ) {
        throw new Error('Expected both parent and index')
      }

      // @ts-expect-error Looks like a node.
      return node && node.type && typeof node.type === 'string'
        ? Boolean(check.call(context, node, index, parent))
        : false
    }
  )

/**
 * Generate an assertion from a test.
 *
 * Useful if you’re going to test many nodes, for example when creating a
 * utility where something else passes a compatible test.
 *
 * The created function is a bit faster because it expects valid input only:
 * a `node`, `index`, and `parent`.
 *
 * @param test
 *   *   when nullish, checks if `node` is a `Node`.
 *   *   when `string`, works like passing `(node) => node.type === test`.
 *   *   when `function` checks if function passed the node is true.
 *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *   when `array`, checks if any one of the subtests pass.
 * @returns
 *   An assertion.
 */
const convert =
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * @param {Test} [test]
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return ok
      }

      if (typeof test === 'string') {
        return typeFactory(test)
      }

      if (typeof test === 'object') {
        return Array.isArray(test) ? anyFactory(test) : propsFactory(test)
      }

      if (typeof test === 'function') {
        return castFactory(test)
      }

      throw new Error('Expected function, string, or object as test')
    }
  )

/**
 * @param {Array<string | Props | TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory(tests) {
  /** @type {Array<AssertAnything>} */
  const checks = []
  let index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return castFactory(any)

  /**
   * @this {unknown}
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    let index = -1

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) return true
    }

    return false
  }
}

/**
 * Turn an object into a test for a node with a certain fields.
 *
 * @param {Props} check
 * @returns {AssertAnything}
 */
function propsFactory(check) {
  return castFactory(all)

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  function all(node) {
    /** @type {string} */
    let key

    for (key in check) {
      // @ts-expect-error: hush, it sure works as an index.
      if (node[key] !== check[key]) return false
    }

    return true
  }
}

/**
 * Turn a string into a test for a node with a certain type.
 *
 * @param {string} check
 * @returns {AssertAnything}
 */
function typeFactory(check) {
  return castFactory(type)

  /**
   * @param {Node} node
   */
  function type(node) {
    return node && node.type === check
  }
}

/**
 * Turn a custom test into a test for a node that passes that test.
 *
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {unknown} node
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(node, ...parameters) {
    return Boolean(
      node &&
        typeof node === 'object' &&
        'type' in node &&
        // @ts-expect-error: fine.
        Boolean(check.call(this, node, ...parameters))
    )
  }
}

function ok() {
  return true
}

;// CONCATENATED MODULE: ./node_modules/unist-util-visit-parents/lib/color.js
/**
 * @param {string} d
 * @returns {string}
 */
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}

;// CONCATENATED MODULE: ./node_modules/unist-util-visit-parents/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 */

/**
 * @typedef {boolean | 'skip'} Action
 *   Union of the action types.
 *
 * @typedef {number} Index
 *   Move to the sibling at `index` next (after node itself is completely
 *   traversed).
 *
 *   Useful if mutating the tree, such as removing the node the visitor is
 *   currently on, or any of its previous siblings.
 *   Results less than 0 or greater than or equal to `children.length` stop
 *   traversing the parent.
 *
 * @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
 *   List with one or two values, the first an action, the second an index.
 *
 * @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
 *   Any value that can be returned from a visitor.
 */

/**
 * @template {Node} [Visited=Node]
 *   Visited node type.
 * @template {Parent} [Ancestor=Parent]
 *   Ancestor type.
 * @callback Visitor
 *   Handle a node (matching `test`, if given).
 *
 *   Visitors are free to transform `node`.
 *   They can also transform the parent of node (the last of `ancestors`).
 *
 *   Replacing `node` itself, if `SKIP` is not returned, still causes its
 *   descendants to be walked (which is a bug).
 *
 *   When adding or removing previous siblings of `node` (or next siblings, in
 *   case of reverse), the `Visitor` should return a new `Index` to specify the
 *   sibling to traverse after `node` is traversed.
 *   Adding or removing next siblings of `node` (or previous siblings, in case
 *   of reverse) is handled as expected without needing to return a new `Index`.
 *
 *   Removing the children property of an ancestor still results in them being
 *   traversed.
 * @param {Visited} node
 *   Found node.
 * @param {Array<Ancestor>} ancestors
 *   Ancestors of `node`.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
 *   An `Action` is treated as a tuple of `[Action]`.
 *
 *   Passing a tuple back only makes sense if the `Action` is `SKIP`.
 *   When the `Action` is `EXIT`, that action can be returned.
 *   When the `Action` is `CONTINUE`, `Index` can be returned.
 */

/**
 * @template {Node} [Tree=Node]
 *   Tree type.
 * @template {Test} [Check=string]
 *   Test type.
 * @typedef {Visitor<import('./complex-types.js').Matches<import('./complex-types.js').InclusiveDescendant<Tree>, Check>, Extract<import('./complex-types.js').InclusiveDescendant<Tree>, Parent>>} BuildVisitor
 *   Build a typed `Visitor` function from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parents`.
 */




/**
 * Continue traversing as normal.
 */
const CONTINUE = true

/**
 * Stop traversing immediately.
 */
const EXIT = false

/**
 * Do not traverse this node’s children.
 */
const SKIP = 'skip'

/**
 * Visit nodes, with ancestral information.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @param tree
 *   Tree to traverse.
 * @param test
 *   `unist-util-is`-compatible test
 * @param visitor
 *   Handle each node.
 * @param reverse
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns
 *   Nothing.
 */
const visitParents =
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  (
    /**
     * @param {Node} tree
     * @param {Test} test
     * @param {Visitor<Node>} visitor
     * @param {boolean | null | undefined} [reverse]
     * @returns {void}
     */
    function (tree, test, visitor, reverse) {
      if (typeof test === 'function' && typeof visitor !== 'function') {
        reverse = visitor
        // @ts-expect-error no visitor given, so `visitor` is test.
        visitor = test
        test = null
      }

      const is = convert(test)
      const step = reverse ? -1 : 1

      factory(tree, undefined, [])()

      /**
       * @param {Node} node
       * @param {number | undefined} index
       * @param {Array<Parent>} parents
       */
      function factory(node, index, parents) {
        /** @type {Record<string, unknown>} */
        // @ts-expect-error: hush
        const value = node && typeof node === 'object' ? node : {}

        if (typeof value.type === 'string') {
          const name =
            // `hast`
            typeof value.tagName === 'string'
              ? value.tagName
              : // `xast`
              typeof value.name === 'string'
              ? value.name
              : undefined

          Object.defineProperty(visit, 'name', {
            value:
              'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
          })
        }

        return visit

        function visit() {
          /** @type {ActionTuple} */
          let result = []
          /** @type {ActionTuple} */
          let subresult
          /** @type {number} */
          let offset
          /** @type {Array<Parent>} */
          let grandparents

          if (!test || is(node, index, parents[parents.length - 1] || null)) {
            result = toResult(visitor(node, parents))

            if (result[0] === EXIT) {
              return result
            }
          }

          // @ts-expect-error looks like a parent.
          if (node.children && result[0] !== SKIP) {
            // @ts-expect-error looks like a parent.
            offset = (reverse ? node.children.length : -1) + step
            // @ts-expect-error looks like a parent.
            grandparents = parents.concat(node)

            // @ts-expect-error looks like a parent.
            while (offset > -1 && offset < node.children.length) {
              // @ts-expect-error looks like a parent.
              subresult = factory(node.children[offset], offset, grandparents)()

              if (subresult[0] === EXIT) {
                return subresult
              }

              offset =
                typeof subresult[1] === 'number' ? subresult[1] : offset + step
            }
          }

          return result
        }
      }
    }
  )

/**
 * Turn a return value into a clean result.
 *
 * @param {VisitorResult} value
 *   Valid return values from visitors.
 * @returns {ActionTuple}
 *   Clean result.
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}

;// CONCATENATED MODULE: ./node_modules/unist-util-visit/lib/index.js
/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-is').Test} Test
 * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
 */

/**
 * Check if `Child` can be a child of `Ancestor`.
 *
 * Returns the ancestor when `Child` can be a child of `Ancestor`, or returns
 * `never`.
 *
 * @template {Node} Ancestor
 *   Node type.
 * @template {Node} Child
 *   Node type.
 * @typedef {(
 *   Ancestor extends Parent
 *     ? Child extends Ancestor['children'][number]
 *       ? Ancestor
 *       : never
 *     : never
 * )} ParentsOf
 */

/**
 * @template {Node} [Visited=Node]
 *   Visited node type.
 * @template {Parent} [Ancestor=Parent]
 *   Ancestor type.
 * @callback Visitor
 *   Handle a node (matching `test`, if given).
 *
 *   Visitors are free to transform `node`.
 *   They can also transform `parent`.
 *
 *   Replacing `node` itself, if `SKIP` is not returned, still causes its
 *   descendants to be walked (which is a bug).
 *
 *   When adding or removing previous siblings of `node` (or next siblings, in
 *   case of reverse), the `Visitor` should return a new `Index` to specify the
 *   sibling to traverse after `node` is traversed.
 *   Adding or removing next siblings of `node` (or previous siblings, in case
 *   of reverse) is handled as expected without needing to return a new `Index`.
 *
 *   Removing the children property of `parent` still results in them being
 *   traversed.
 * @param {Visited} node
 *   Found node.
 * @param {Visited extends Node ? number | null : never} index
 *   Index of `node` in `parent`.
 * @param {Ancestor extends Node ? Ancestor | null : never} parent
 *   Parent of `node`.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
 *   An `Action` is treated as a tuple of `[Action]`.
 *
 *   Passing a tuple back only makes sense if the `Action` is `SKIP`.
 *   When the `Action` is `EXIT`, that action can be returned.
 *   When the `Action` is `CONTINUE`, `Index` can be returned.
 */

/**
 * Build a typed `Visitor` function from a node and all possible parents.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} Visited
 *   Node type.
 * @template {Parent} Ancestor
 *   Parent type.
 * @typedef {Visitor<Visited, ParentsOf<Ancestor, Visited>>} BuildVisitorFromMatch
 */

/**
 * Build a typed `Visitor` function from a list of descendants and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} Descendant
 *   Node type.
 * @template {Test} Check
 *   Test type.
 * @typedef {(
 *   BuildVisitorFromMatch<
 *     import('unist-util-visit-parents/complex-types.js').Matches<Descendant, Check>,
 *     Extract<Descendant, Parent>
 *   >
 * )} BuildVisitorFromDescendants
 */

/**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 *
 * @template {Node} [Tree=Node]
 *   Node type.
 * @template {Test} [Check=string]
 *   Test type.
 * @typedef {(
 *   BuildVisitorFromDescendants<
 *     import('unist-util-visit-parents/complex-types.js').InclusiveDescendant<Tree>,
 *     Check
 *   >
 * )} BuildVisitor
 */



/**
 * Visit nodes.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
 *
 * You can choose for which nodes `visitor` is called by passing a `test`.
 * For complex tests, you should test yourself in `visitor`, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * See `Visitor` for more info.
 *
 * @param tree
 *   Tree to traverse.
 * @param test
 *   `unist-util-is`-compatible test
 * @param visitor
 *   Handle each node.
 * @param reverse
 *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
 * @returns
 *   Nothing.
 */
const visit =
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  (
    /**
     * @param {Node} tree
     * @param {Test} test
     * @param {Visitor} visitor
     * @param {boolean | null | undefined} [reverse]
     * @returns {void}
     */
    function (tree, test, visitor, reverse) {
      if (typeof test === 'function' && typeof visitor !== 'function') {
        reverse = visitor
        visitor = test
        test = null
      }

      visitParents(tree, test, overload, reverse)

      /**
       * @param {Node} node
       * @param {Array<Parent>} parents
       */
      function overload(node, parents) {
        const parent = parents[parents.length - 1]
        return visitor(
          node,
          parent ? parent.children.indexOf(node) : null,
          parent
        )
      }
    }
  )



;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../types.js').State} State
 */




/**
 * @param {Heading} node
 * @param {State} state
 * @returns {boolean}
 */
function formatHeadingAsSetext(node, state) {
  let literalWithBreak = false

  // Look for literals with a line break.
  // Note that this also
  visit(node, (node) => {
    if (
      ('value' in node && /\r?\n|\r/.test(node.value)) ||
      node.type === 'break'
    ) {
      literalWithBreak = true
      return EXIT
    }
  })

  return Boolean(
    (!node.depth || node.depth < 3) &&
      lib_toString(node) &&
      (state.options.setext || literalWithBreak)
  )
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



/**
 * @param {Heading} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function heading(node, _, state, info) {
  const rank = Math.max(Math.min(6, node.depth || 1), 1)
  const tracker = state.createTracker(info)

  if (formatHeadingAsSetext(node, state)) {
    const exit = state.enter('headingSetext')
    const subexit = state.enter('phrasing')
    const value = state.containerPhrasing(node, {
      ...tracker.current(),
      before: '\n',
      after: '\n'
    })
    subexit()
    exit()

    return (
      value +
      '\n' +
      (rank === 1 ? '=' : '-').repeat(
        // The whole size…
        value.length -
          // Minus the position of the character after the last EOL (or
          // 0 if there is none)…
          (Math.max(value.lastIndexOf('\r'), value.lastIndexOf('\n')) + 1)
      )
    )
  }

  const sequence = '#'.repeat(rank)
  const exit = state.enter('headingAtx')
  const subexit = state.enter('phrasing')

  // Note: for proper tracking, we should reset the output positions when there
  // is no content returned, because then the space is not output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  tracker.move(sequence + ' ')

  let value = state.containerPhrasing(node, {
    before: '# ',
    after: '\n',
    ...tracker.current()
  })

  if (/^[\t ]/.test(value)) {
    // To do: what effect has the character reference on tracking?
    value =
      '&#x' +
      value.charCodeAt(0).toString(16).toUpperCase() +
      ';' +
      value.slice(1)
  }

  value = value ? sequence + ' ' + value : sequence

  if (state.options.closeAtx) {
    value += ' ' + sequence
  }

  subexit()
  exit()

  return value
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
 * @typedef {import('mdast').HTML} HTML
 */

html.peek = htmlPeek

/**
 * @param {HTML} node
 * @returns {string}
 */
function html(node) {
  return node.value || ''
}

/**
 * @returns {string}
 */
function htmlPeek() {
  return '<'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/image.js
/**
 * @typedef {import('mdast').Image} Image
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



image_image.peek = imagePeek

/**
 * @param {Image} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function image_image(node, _, state, info) {
  const quote = checkQuote(state)
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  const exit = state.enter('image')
  let subexit = state.enter('label')
  const tracker = state.createTracker(info)
  let value = tracker.move('![')
  value += tracker.move(
    state.safe(node.alt, {before: value, after: ']', ...tracker.current()})
  )
  value += tracker.move('](')

  subexit()

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral')
    value += tracker.move('<')
    value += tracker.move(
      state.safe(node.url, {before: value, after: '>', ...tracker.current()})
    )
    value += tracker.move('>')
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter('destinationRaw')
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? ' ' : ')',
        ...tracker.current()
      })
    )
  }

  subexit()

  if (node.title) {
    subexit = state.enter(`title${suffix}`)
    value += tracker.move(' ' + quote)
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    )
    value += tracker.move(quote)
    subexit()
  }

  value += tracker.move(')')
  exit()

  return value
}

/**
 * @returns {string}
 */
function imagePeek() {
  return '!'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
 * @typedef {import('mdast').ImageReference} ImageReference
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */

imageReference.peek = imageReferencePeek

/**
 * @param {ImageReference} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function imageReference(node, _, state, info) {
  const type = node.referenceType
  const exit = state.enter('imageReference')
  let subexit = state.enter('label')
  const tracker = state.createTracker(info)
  let value = tracker.move('![')
  const alt = state.safe(node.alt, {
    before: value,
    after: ']',
    ...tracker.current()
  })
  value += tracker.move(alt + '][')

  subexit()
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = state.stack
  state.stack = []
  subexit = state.enter('reference')
  // Note: for proper tracking, we should reset the output positions when we end
  // up making a `shortcut` reference, because then there is no brace output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  const reference = state.safe(state.associationId(node), {
    before: value,
    after: ']',
    ...tracker.current()
  })
  subexit()
  state.stack = stack
  exit()

  if (type === 'full' || !alt || alt !== reference) {
    value += tracker.move(reference + ']')
  } else if (type === 'shortcut') {
    // Remove the unwanted `[`.
    value = value.slice(0, -1)
  } else {
    value += tracker.move(']')
  }

  return value
}

/**
 * @returns {string}
 */
function imageReferencePeek() {
  return '!'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/pattern-compile.js
/**
 * @typedef {import('../types.js').Unsafe} Unsafe
 */

/**
 * @param {Unsafe} pattern
 * @returns {RegExp}
 */
function patternCompile(pattern) {
  if (!pattern._compiled) {
    const before =
      (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') +
      (pattern.before ? '(?:' + pattern.before + ')' : '')

    pattern._compiled = new RegExp(
      (before ? '(' + before + ')' : '') +
        (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
        pattern.character +
        (pattern.after ? '(?:' + pattern.after + ')' : ''),
      'g'
    )
  }

  return pattern._compiled
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 */



inlineCode.peek = inlineCodePeek

/**
 * @param {InlineCode} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @returns {string}
 */
function inlineCode(node, _, state) {
  let value = node.value || ''
  let sequence = '`'
  let index = -1

  // If there is a single grave accent on its own in the code, use a fence of
  // two.
  // If there are two in a row, use one.
  while (new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)) {
    sequence += '`'
  }

  // If this is not just spaces or eols (tabs don’t count), and either the
  // first or last character are a space, eol, or tick, then pad with spaces.
  if (
    /[^ \r\n]/.test(value) &&
    ((/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value)) || /^`|`$/.test(value))
  ) {
    value = ' ' + value + ' '
  }

  // We have a potential problem: certain characters after eols could result in
  // blocks being seen.
  // For example, if someone injected the string `'\n# b'`, then that would
  // result in an ATX heading.
  // We can’t escape characters in `inlineCode`, but because eols are
  // transformed to spaces when going from markdown to HTML anyway, we can swap
  // them out.
  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index]
    const expression = patternCompile(pattern)
    /** @type {RegExpExecArray | null} */
    let match

    // Only look for `atBreak`s.
    // Btw: note that `atBreak` patterns will always start the regex at LF or
    // CR.
    if (!pattern.atBreak) continue

    while ((match = expression.exec(value))) {
      let position = match.index

      // Support CRLF (patterns only look for one of the characters).
      if (
        value.charCodeAt(position) === 10 /* `\n` */ &&
        value.charCodeAt(position - 1) === 13 /* `\r` */
      ) {
        position--
      }

      value = value.slice(0, position) + ' ' + value.slice(match.index + 1)
    }
  }

  return sequence + value + sequence
}

/**
 * @returns {string}
 */
function inlineCodePeek() {
  return '`'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('../types.js').State} State
 */



/**
 * @param {Link} node
 * @param {State} state
 * @returns {boolean}
 */
function formatLinkAsAutolink(node, state) {
  const raw = lib_toString(node)

  return Boolean(
    !state.options.resourceLink &&
      // If there’s a url…
      node.url &&
      // And there’s a no title…
      !node.title &&
      // And the content of `node` is a single text node…
      node.children &&
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      // And if the url is the same as the content…
      (raw === node.url || 'mailto:' + raw === node.url) &&
      // And that starts w/ a protocol…
      /^[a-z][a-z+.-]+:/i.test(node.url) &&
      // And that doesn’t contain ASCII control codes (character escapes and
      // references don’t work), space, or angle brackets…
      !/[\0- <>\u007F]/.test(node.url)
  )
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/link.js
/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').Exit} Exit
 */




link_link.peek = linkPeek

/**
 * @param {Link} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function link_link(node, _, state, info) {
  const quote = checkQuote(state)
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  const tracker = state.createTracker(info)
  /** @type {Exit} */
  let exit
  /** @type {Exit} */
  let subexit

  if (formatLinkAsAutolink(node, state)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack
    state.stack = []
    exit = state.enter('autolink')
    let value = tracker.move('<')
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: '>',
        ...tracker.current()
      })
    )
    value += tracker.move('>')
    exit()
    state.stack = stack
    return value
  }

  exit = state.enter('link')
  subexit = state.enter('label')
  let value = tracker.move('[')
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: '](',
      ...tracker.current()
    })
  )
  value += tracker.move('](')
  subexit()

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral')
    value += tracker.move('<')
    value += tracker.move(
      state.safe(node.url, {before: value, after: '>', ...tracker.current()})
    )
    value += tracker.move('>')
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter('destinationRaw')
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? ' ' : ')',
        ...tracker.current()
      })
    )
  }

  subexit()

  if (node.title) {
    subexit = state.enter(`title${suffix}`)
    value += tracker.move(' ' + quote)
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    )
    value += tracker.move(quote)
    subexit()
  }

  value += tracker.move(')')

  exit()
  return value
}

/**
 * @param {Link} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @returns {string}
 */
function linkPeek(node, _, state) {
  return formatLinkAsAutolink(node, state) ? '<' : '['
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */

linkReference.peek = linkReferencePeek

/**
 * @param {LinkReference} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function linkReference(node, _, state, info) {
  const type = node.referenceType
  const exit = state.enter('linkReference')
  let subexit = state.enter('label')
  const tracker = state.createTracker(info)
  let value = tracker.move('[')
  const text = state.containerPhrasing(node, {
    before: value,
    after: ']',
    ...tracker.current()
  })
  value += tracker.move(text + '][')

  subexit()
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = state.stack
  state.stack = []
  subexit = state.enter('reference')
  // Note: for proper tracking, we should reset the output positions when we end
  // up making a `shortcut` reference, because then there is no brace output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  const reference = state.safe(state.associationId(node), {
    before: value,
    after: ']',
    ...tracker.current()
  })
  subexit()
  state.stack = stack
  exit()

  if (type === 'full' || !text || text !== reference) {
    value += tracker.move(reference + ']')
  } else if (type === 'shortcut') {
    // Remove the unwanted `[`.
    value = value.slice(0, -1)
  } else {
    value += tracker.move(']')
  }

  return value
}

/**
 * @returns {string}
 */
function linkReferencePeek() {
  return '['
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['bullet'], null | undefined>}
 */
function checkBullet(state) {
  const marker = state.options.bullet || '*'

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bullet`, expected `*`, `+`, or `-`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */



/**
 * @param {State} state
 * @returns {Exclude<Options['bullet'], null | undefined>}
 */
function checkBulletOther(state) {
  const bullet = checkBullet(state)
  const bulletOther = state.options.bulletOther

  if (!bulletOther) {
    return bullet === '*' ? '-' : '*'
  }

  if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        bulletOther +
        '` for `options.bulletOther`, expected `*`, `+`, or `-`'
    )
  }

  if (bulletOther === bullet) {
    throw new Error(
      'Expected `bullet` (`' +
        bullet +
        '`) and `bulletOther` (`' +
        bulletOther +
        '`) to be different'
    )
  }

  return bulletOther
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['bulletOrdered'], null | undefined>}
 */
function checkBulletOrdered(state) {
  const marker = state.options.bulletOrdered || '.'

  if (marker !== '.' && marker !== ')') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bulletOrdered`, expected `.` or `)`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered-other.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */



/**
 * @param {State} state
 * @returns {Exclude<Options['bulletOrdered'], null | undefined>}
 */
function checkBulletOrderedOther(state) {
  const bulletOrdered = checkBulletOrdered(state)
  const bulletOrderedOther = state.options.bulletOrderedOther

  if (!bulletOrderedOther) {
    return bulletOrdered === '.' ? ')' : '.'
  }

  if (bulletOrderedOther !== '.' && bulletOrderedOther !== ')') {
    throw new Error(
      'Cannot serialize items with `' +
        bulletOrderedOther +
        '` for `options.bulletOrderedOther`, expected `*`, `+`, or `-`'
    )
  }

  if (bulletOrderedOther === bulletOrdered) {
    throw new Error(
      'Expected `bulletOrdered` (`' +
        bulletOrdered +
        '`) and `bulletOrderedOther` (`' +
        bulletOrderedOther +
        '`) to be different'
    )
  }

  return bulletOrderedOther
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['rule'], null | undefined>}
 */
function checkRule(state) {
  const marker = state.options.rule || '*'

  if (marker !== '*' && marker !== '-' && marker !== '_') {
    throw new Error(
      'Cannot serialize rules with `' +
        marker +
        '` for `options.rule`, expected `*`, `-`, or `_`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
 * @typedef {import('mdast').List} List
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */







/**
 * @param {List} node
 * @param {Parent | undefined} parent
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function list_list(node, parent, state, info) {
  const exit = state.enter('list')
  const bulletCurrent = state.bulletCurrent
  /** @type {string} */
  let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state)
  /** @type {string} */
  const bulletOther = node.ordered
    ? checkBulletOrderedOther(state)
    : checkBulletOther(state)
  const bulletLastUsed = state.bulletLastUsed
  let useDifferentMarker = false

  if (
    parent &&
    // Explicit `other` set.
    (node.ordered
      ? state.options.bulletOrderedOther
      : state.options.bulletOther) &&
    bulletLastUsed &&
    bullet === bulletLastUsed
  ) {
    useDifferentMarker = true
  }

  if (!node.ordered) {
    const firstListItem = node.children ? node.children[0] : undefined

    // If there’s an empty first list item directly in two list items,
    // we have to use a different bullet:
    //
    // ```markdown
    // * - *
    // ```
    //
    // …because otherwise it would become one big thematic break.
    if (
      // Bullet could be used as a thematic break marker:
      (bullet === '*' || bullet === '-') &&
      // Empty first list item:
      firstListItem &&
      (!firstListItem.children || !firstListItem.children[0]) &&
      // Directly in two other list items:
      state.stack[state.stack.length - 1] === 'list' &&
      state.stack[state.stack.length - 2] === 'listItem' &&
      state.stack[state.stack.length - 3] === 'list' &&
      state.stack[state.stack.length - 4] === 'listItem' &&
      // That are each the first child.
      state.indexStack[state.indexStack.length - 1] === 0 &&
      state.indexStack[state.indexStack.length - 2] === 0 &&
      state.indexStack[state.indexStack.length - 3] === 0
    ) {
      useDifferentMarker = true
    }

    // If there’s a thematic break at the start of the first list item,
    // we have to use a different bullet:
    //
    // ```markdown
    // * ---
    // ```
    //
    // …because otherwise it would become one big thematic break.
    if (checkRule(state) === bullet && firstListItem) {
      let index = -1

      while (++index < node.children.length) {
        const item = node.children[index]

        if (
          item &&
          item.type === 'listItem' &&
          item.children &&
          item.children[0] &&
          item.children[0].type === 'thematicBreak'
        ) {
          useDifferentMarker = true
          break
        }
      }
    }
  }

  if (useDifferentMarker) {
    bullet = bulletOther
  }

  state.bulletCurrent = bullet
  const value = state.containerFlow(node, info)
  state.bulletLastUsed = bullet
  state.bulletCurrent = bulletCurrent
  exit()
  return value
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['listItemIndent'], null | undefined>}
 */
function checkListItemIndent(state) {
  const style = state.options.listItemIndent || 'tab'

  // To do: remove in a major.
  // @ts-expect-error: deprecated.
  if (style === 1 || style === '1') {
    return 'one'
  }

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error(
      'Cannot serialize items with `' +
        style +
        '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
    )
  }

  return style
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('../types.js').Map} Map
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */




/**
 * @param {ListItem} node
 * @param {Parent | undefined} parent
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function listItem(node, parent, state, info) {
  const listItemIndent = checkListItemIndent(state)
  let bullet = state.bulletCurrent || checkBullet(state)

  // Add the marker value for ordered lists.
  if (parent && parent.type === 'list' && parent.ordered) {
    bullet =
      (typeof parent.start === 'number' && parent.start > -1
        ? parent.start
        : 1) +
      (state.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      bullet
  }

  let size = bullet.length + 1

  if (
    listItemIndent === 'tab' ||
    (listItemIndent === 'mixed' &&
      ((parent && parent.type === 'list' && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4
  }

  const tracker = state.createTracker(info)
  tracker.move(bullet + ' '.repeat(size - bullet.length))
  tracker.shift(size)
  const exit = state.enter('listItem')
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    map
  )
  exit()

  return value

  /** @type {Map} */
  function map(line, index, blank) {
    if (index) {
      return (blank ? '' : ' '.repeat(size)) + line
    }

    return (blank ? bullet : bullet + ' '.repeat(size - bullet.length)) + line
  }
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */

/**
 * @param {Paragraph} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function paragraph(node, _, state, info) {
  const exit = state.enter('paragraph')
  const subexit = state.enter('phrasing')
  const value = state.containerPhrasing(node, info)
  subexit()
  exit()
  return value
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-phrasing/lib/index.js
/**
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('unist-util-is').AssertPredicate<PhrasingContent>} AssertPredicatePhrasing
 */



/**
 * Check if the given value is *phrasing content*.
 *
 * @param
 *   Thing to check, typically `Node`.
 * @returns
 *   Whether `value` is phrasing content.
 */
const phrasing = /** @type {AssertPredicatePhrasing} */ (
  convert([
    'break',
    'delete',
    'emphasis',
    'footnote',
    'footnoteReference',
    'image',
    'imageReference',
    'inlineCode',
    'link',
    'linkReference',
    'strong',
    'text'
  ])
)

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



/**
 * @param {Root} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function root(node, _, state, info) {
  // Note: `html` nodes are ambiguous.
  const hasPhrasing = node.children.some((d) => phrasing(d))
  const fn = hasPhrasing ? state.containerPhrasing : state.containerFlow
  // @ts-expect-error: `root`s are supposed to have one type of content
  return fn.call(state, node, info)
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['strong'], null | undefined>}
 */
function checkStrong(state) {
  const marker = state.options.strong || '*'

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize strong with `' +
        marker +
        '` for `options.strong`, expected `*`, or `_`'
    )
  }

  return marker
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/strong.js
/**
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */



strong.peek = strongPeek

// To do: there are cases where emphasis cannot “form” depending on the
// previous or next character of sequences.
// There’s no way around that though, except for injecting zero-width stuff.
// Do we need to safeguard against that?
/**
 * @param {Strong} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function strong(node, _, state, info) {
  const marker = checkStrong(state)
  const exit = state.enter('strong')
  const tracker = state.createTracker(info)
  let value = tracker.move(marker + marker)
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: marker,
      ...tracker.current()
    })
  )
  value += tracker.move(marker + marker)
  exit()
  return value
}

/**
 * @param {Strong} _
 * @param {Parent | undefined} _1
 * @param {State} state
 * @returns {string}
 */
function strongPeek(_, _1, state) {
  return state.options.strong || '*'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Info} Info
 */

/**
 * @param {Text} node
 * @param {Parent | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
function handle_text_text(node, _, state, info) {
  return state.safe(node.value, info)
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').Options} Options
 */

/**
 * @param {State} state
 * @returns {Exclude<Options['ruleRepetition'], null | undefined>}
 */
function checkRuleRepetition(state) {
  const repetition = state.options.ruleRepetition || 3

  if (repetition < 3) {
    throw new Error(
      'Cannot serialize rules with repetition `' +
        repetition +
        '` for `options.ruleRepetition`, expected `3` or more'
    )
  }

  return repetition
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 */




/**
 * @param {ThematicBreak} _
 * @param {Parent | undefined} _1
 * @param {State} state
 * @returns {string}
 */
function thematic_break_thematicBreak(_, _1, state) {
  const value = (
    checkRule(state) + (state.options.ruleSpaces ? ' ' : '')
  ).repeat(checkRuleRepetition(state))

  return state.options.ruleSpaces ? value.slice(0, -1) : value
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/handle/index.js




















/**
 * Default (CommonMark) handlers.
 */
const handle = {
  blockquote: blockquote,
  break: hardBreak,
  code: code,
  definition: definition_definition,
  emphasis: emphasis,
  hardBreak: hardBreak,
  heading: heading,
  html: html,
  image: image_image,
  imageReference: imageReference,
  inlineCode: inlineCode,
  link: link_link,
  linkReference: linkReference,
  list: list_list,
  listItem: listItem,
  paragraph: paragraph,
  root: root,
  strong: strong,
  text: handle_text_text,
  thematicBreak: thematic_break_thematicBreak
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/join.js
/**
 * @typedef {import('./types.js').Join} Join
 */




/** @type {Array<Join>} */
const join = [joinDefaults]

/** @type {Join} */
function joinDefaults(left, right, parent, state) {
  // Indented code after list or another indented code.
  if (
    right.type === 'code' &&
    formatCodeAsIndented(right, state) &&
    (left.type === 'list' ||
      (left.type === right.type && formatCodeAsIndented(left, state)))
  ) {
    return false
  }

  // Two lists with the same marker.
  if (
    left.type === 'list' &&
    left.type === right.type &&
    Boolean(left.ordered) === Boolean(right.ordered) &&
    !(left.ordered
      ? state.options.bulletOrderedOther
      : state.options.bulletOther)
  ) {
    return false
  }

  // Join children of a list or an item.
  // In which case, `parent` has a `spread` field.
  if ('spread' in parent && typeof parent.spread === 'boolean') {
    if (
      left.type === 'paragraph' &&
      // Two paragraphs.
      (left.type === right.type ||
        right.type === 'definition' ||
        // Paragraph followed by a setext heading.
        (right.type === 'heading' && formatHeadingAsSetext(right, state)))
    ) {
      return
    }

    return parent.spread ? 1 : 0
  }
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/unsafe.js
/**
 * @typedef {import('./types.js').Unsafe} Unsafe
 * @typedef {import('./types.js').ConstructName} ConstructName
 */

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain things like attention (emphasis, strong), images, or links.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * @type {Array<ConstructName>}
 */
const fullPhrasingSpans = [
  'autolink',
  'destinationLiteral',
  'destinationRaw',
  'reference',
  'titleQuote',
  'titleApostrophe'
]

/** @type {Array<Unsafe>} */
const unsafe = [
  {character: '\t', after: '[\\r\\n]', inConstruct: 'phrasing'},
  {character: '\t', before: '[\\r\\n]', inConstruct: 'phrasing'},
  {
    character: '\t',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde']
  },
  {
    character: '\r',
    inConstruct: [
      'codeFencedLangGraveAccent',
      'codeFencedLangTilde',
      'codeFencedMetaGraveAccent',
      'codeFencedMetaTilde',
      'destinationLiteral',
      'headingAtx'
    ]
  },
  {
    character: '\n',
    inConstruct: [
      'codeFencedLangGraveAccent',
      'codeFencedLangTilde',
      'codeFencedMetaGraveAccent',
      'codeFencedMetaTilde',
      'destinationLiteral',
      'headingAtx'
    ]
  },
  {character: ' ', after: '[\\r\\n]', inConstruct: 'phrasing'},
  {character: ' ', before: '[\\r\\n]', inConstruct: 'phrasing'},
  {
    character: ' ',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde']
  },
  // An exclamation mark can start an image, if it is followed by a link or
  // a link reference.
  {
    character: '!',
    after: '\\[',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans
  },
  // A quote can break out of a title.
  {character: '"', inConstruct: 'titleQuote'},
  // A number sign could start an ATX heading if it starts a line.
  {atBreak: true, character: '#'},
  {character: '#', inConstruct: 'headingAtx', after: '(?:[\r\n]|$)'},
  // Dollar sign and percentage are not used in markdown.
  // An ampersand could start a character reference.
  {character: '&', after: '[#A-Za-z]', inConstruct: 'phrasing'},
  // An apostrophe can break out of a title.
  {character: "'", inConstruct: 'titleApostrophe'},
  // A left paren could break out of a destination raw.
  {character: '(', inConstruct: 'destinationRaw'},
  // A left paren followed by `]` could make something into a link or image.
  {
    before: '\\]',
    character: '(',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans
  },
  // A right paren could start a list item or break out of a destination
  // raw.
  {atBreak: true, before: '\\d+', character: ')'},
  {character: ')', inConstruct: 'destinationRaw'},
  // An asterisk can start thematic breaks, list items, emphasis, strong.
  {atBreak: true, character: '*', after: '(?:[ \t\r\n*])'},
  {character: '*', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans},
  // A plus sign could start a list item.
  {atBreak: true, character: '+', after: '(?:[ \t\r\n])'},
  // A dash can start thematic breaks, list items, and setext heading
  // underlines.
  {atBreak: true, character: '-', after: '(?:[ \t\r\n-])'},
  // A dot could start a list item.
  {atBreak: true, before: '\\d+', character: '.', after: '(?:[ \t\r\n]|$)'},
  // Slash, colon, and semicolon are not used in markdown for constructs.
  // A less than can start html (flow or text) or an autolink.
  // HTML could start with an exclamation mark (declaration, cdata, comment),
  // slash (closing tag), question mark (instruction), or a letter (tag).
  // An autolink also starts with a letter.
  // Finally, it could break out of a destination literal.
  {atBreak: true, character: '<', after: '[!/?A-Za-z]'},
  {
    character: '<',
    after: '[!/?A-Za-z]',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans
  },
  {character: '<', inConstruct: 'destinationLiteral'},
  // An equals to can start setext heading underlines.
  {atBreak: true, character: '='},
  // A greater than can start block quotes and it can break out of a
  // destination literal.
  {atBreak: true, character: '>'},
  {character: '>', inConstruct: 'destinationLiteral'},
  // Question mark and at sign are not used in markdown for constructs.
  // A left bracket can start definitions, references, labels,
  {atBreak: true, character: '['},
  {character: '[', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans},
  {character: '[', inConstruct: ['label', 'reference']},
  // A backslash can start an escape (when followed by punctuation) or a
  // hard break (when followed by an eol).
  // Note: typical escapes are handled in `safe`!
  {character: '\\', after: '[\\r\\n]', inConstruct: 'phrasing'},
  // A right bracket can exit labels.
  {character: ']', inConstruct: ['label', 'reference']},
  // Caret is not used in markdown for constructs.
  // An underscore can start emphasis, strong, or a thematic break.
  {atBreak: true, character: '_'},
  {character: '_', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans},
  // A grave accent can start code (fenced or text), or it can break out of
  // a grave accent code fence.
  {atBreak: true, character: '`'},
  {
    character: '`',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedMetaGraveAccent']
  },
  {character: '`', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans},
  // Left brace, vertical bar, right brace are not used in markdown for
  // constructs.
  // A tilde can start code (fenced).
  {atBreak: true, character: '~'}
]

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/association.js
/**
 * @typedef {import('../types.js').AssociationId} AssociationId
 */



/**
 * Get an identifier from an association to match it to others.
 *
 * Associations are nodes that match to something else through an ID:
 * <https://github.com/syntax-tree/mdast#association>.
 *
 * The `label` of an association is the string value: character escapes and
 * references work, and casing is intact.
 * The `identifier` is used to match one association to another:
 * controversially, character escapes and references don’t work in this
 * matching: `&copy;` does not match `©`, and `\+` does not match `+`.
 *
 * But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
 * matches `a b`.
 * So, we do prefer the label when figuring out how we’re going to serialize:
 * it has whitespace, casing, and we can ignore most useless character
 * escapes and all character references.
 *
 * @type {AssociationId}
 */
function association(node) {
  if (node.label || !node.identifier) {
    return node.label || ''
  }

  return decodeString(node.identifier)
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js
/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').PhrasingContent} PhrasingContent
 * @typedef {import('../types.js').State} State
 */

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 *
 * @param {Parent & {children: Array<PhrasingContent>}} parent
 *   Parent of flow nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined together.
 */
function containerPhrasing(parent, state, info) {
  const indexStack = state.indexStack
  const children = parent.children || []
  /** @type {Array<string>} */
  const results = []
  let index = -1
  let before = info.before

  indexStack.push(-1)
  let tracker = state.createTracker(info)

  while (++index < children.length) {
    const child = children[index]
    /** @type {string} */
    let after

    indexStack[indexStack.length - 1] = index

    if (index + 1 < children.length) {
      /** @type {Handle} */
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      let handle = state.handle.handlers[children[index + 1].type]
      /** @type {Handle} */
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      if (handle && handle.peek) handle = handle.peek
      after = handle
        ? handle(children[index + 1], parent, state, {
            before: '',
            after: '',
            ...tracker.current()
          }).charAt(0)
        : ''
    } else {
      after = info.after
    }

    // In some cases, html (text) can be found in phrasing right after an eol.
    // When we’d serialize that, in most cases that would be seen as html
    // (flow).
    // As we can’t escape or so to prevent it from happening, we take a somewhat
    // reasonable approach: replace that eol with a space.
    // See: <https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
    if (
      results.length > 0 &&
      (before === '\r' || before === '\n') &&
      child.type === 'html'
    ) {
      results[results.length - 1] = results[results.length - 1].replace(
        /(\r?\n|\r)$/,
        ' '
      )
      before = ' '

      // To do: does this work to reset tracker?
      tracker = state.createTracker(info)
      tracker.move(results.join(''))
    }

    results.push(
      tracker.move(
        state.handle(child, parent, state, {
          ...tracker.current(),
          before,
          after
        })
      )
    )

    before = results[results.length - 1].slice(-1)
  }

  indexStack.pop()

  return results.join('')
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/container-flow.js
/**
 * @typedef {import('../types.js').FlowContent} FlowContent
 * @typedef {import('../types.js').Node} Node
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').TrackFields} TrackFields
 */

/**
 * @param {Parent & {children: Array<FlowContent>}} parent
 *   Parent of flow nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {TrackFields} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined by (blank) lines.
 */
function containerFlow(parent, state, info) {
  const indexStack = state.indexStack
  const children = parent.children || []
  const tracker = state.createTracker(info)
  /** @type {Array<string>} */
  const results = []
  let index = -1

  indexStack.push(-1)

  while (++index < children.length) {
    const child = children[index]

    indexStack[indexStack.length - 1] = index

    results.push(
      tracker.move(
        state.handle(child, parent, state, {
          before: '\n',
          after: '\n',
          ...tracker.current()
        })
      )
    )

    if (child.type !== 'list') {
      state.bulletLastUsed = undefined
    }

    if (index < children.length - 1) {
      results.push(
        tracker.move(between(child, children[index + 1], parent, state))
      )
    }
  }

  indexStack.pop()

  return results.join('')
}

/**
 * @param {Node} left
 * @param {Node} right
 * @param {Parent} parent
 * @param {State} state
 * @returns {string}
 */
function between(left, right, parent, state) {
  let index = state.join.length

  while (index--) {
    const result = state.join[index](left, right, parent, state)

    if (result === true || result === 1) {
      break
    }

    if (typeof result === 'number') {
      return '\n'.repeat(1 + result)
    }

    if (result === false) {
      return '\n\n<!---->\n\n'
    }
  }

  return '\n\n'
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/indent-lines.js
/**
 * @typedef {import('../types.js').IndentLines} IndentLines
 */

const eol = /\r?\n|\r/g

/**
 * @type {IndentLines}
 */
function indentLines(value, map) {
  /** @type {Array<string>} */
  const result = []
  let start = 0
  let line = 0
  /** @type {RegExpExecArray | null} */
  let match

  while ((match = eol.exec(value))) {
    one(value.slice(start, match.index))
    result.push(match[0])
    start = match.index + match[0].length
    line++
  }

  one(value.slice(start))

  return result.join('')

  /**
   * @param {string} value
   */
  function one(value) {
    result.push(map(value, line, !value))
  }
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/safe.js
/**
 * @typedef {import('../types.js').State} State
 * @typedef {import('../types.js').SafeConfig} SafeConfig
 */




/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * * Characters before and after something;
 * * What “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 *
 * @param {State} state
 *   Info passed around about the current state.
 * @param {string | null | undefined} input
 *   Raw value to make safe.
 * @param {SafeConfig} config
 *   Configuration.
 * @returns {string}
 *   Serialized markdown safe for embedding.
 */
function safe(state, input, config) {
  const value = (config.before || '') + (input || '') + (config.after || '')
  /** @type {Array<number>} */
  const positions = []
  /** @type {Array<string>} */
  const result = []
  /** @type {Record<number, {before: boolean, after: boolean}>} */
  const infos = {}
  let index = -1

  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index]

    if (!patternInScope(state.stack, pattern)) {
      continue
    }

    const expression = patternCompile(pattern)
    /** @type {RegExpExecArray | null} */
    let match

    while ((match = expression.exec(value))) {
      const before = 'before' in pattern || Boolean(pattern.atBreak)
      const after = 'after' in pattern
      const position = match.index + (before ? match[1].length : 0)

      if (positions.includes(position)) {
        if (infos[position].before && !before) {
          infos[position].before = false
        }

        if (infos[position].after && !after) {
          infos[position].after = false
        }
      } else {
        positions.push(position)
        infos[position] = {before, after}
      }
    }
  }

  positions.sort(numerical)

  let start = config.before ? config.before.length : 0
  const end = value.length - (config.after ? config.after.length : 0)
  index = -1

  while (++index < positions.length) {
    const position = positions[index]

    // Character before or after matched:
    if (position < start || position >= end) {
      continue
    }

    // If this character is supposed to be escaped because it has a condition on
    // the next character, and the next character is definitly being escaped,
    // then skip this escape.
    if (
      (position + 1 < end &&
        positions[index + 1] === position + 1 &&
        infos[position].after &&
        !infos[position + 1].before &&
        !infos[position + 1].after) ||
      (positions[index - 1] === position - 1 &&
        infos[position].before &&
        !infos[position - 1].before &&
        !infos[position - 1].after)
    ) {
      continue
    }

    if (start !== position) {
      // If we have to use a character reference, an ampersand would be more
      // correct, but as backslashes only care about punctuation, either will
      // do the trick
      result.push(escapeBackslashes(value.slice(start, position), '\\'))
    }

    start = position

    if (
      /[!-/:-@[-`{-~]/.test(value.charAt(position)) &&
      (!config.encode || !config.encode.includes(value.charAt(position)))
    ) {
      // Character escape.
      result.push('\\')
    } else {
      // Character reference.
      result.push(
        '&#x' + value.charCodeAt(position).toString(16).toUpperCase() + ';'
      )
      start++
    }
  }

  result.push(escapeBackslashes(value.slice(start, end), config.after))

  return result.join('')
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function numerical(a, b) {
  return a - b
}

/**
 * @param {string} value
 * @param {string} after
 * @returns {string}
 */
function escapeBackslashes(value, after) {
  const expression = /\\(?=[!-/:-@[-`{-~])/g
  /** @type {Array<number>} */
  const positions = []
  /** @type {Array<string>} */
  const results = []
  const whole = value + after
  let index = -1
  let start = 0
  /** @type {RegExpExecArray | null} */
  let match

  while ((match = expression.exec(whole))) {
    positions.push(match.index)
  }

  while (++index < positions.length) {
    if (start !== positions[index]) {
      results.push(value.slice(start, positions[index]))
    }

    results.push('\\')
    start = positions[index]
  }

  results.push(value.slice(start))

  return results.join('')
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/util/track.js
/**
 * @typedef {import('../types.js').CreateTracker} CreateTracker
 * @typedef {import('../types.js').TrackCurrent} TrackCurrent
 * @typedef {import('../types.js').TrackMove} TrackMove
 * @typedef {import('../types.js').TrackShift} TrackShift
 */

/**
 * Track positional info in the output.
 *
 * @type {CreateTracker}
 */
function track(config) {
  // Defaults are used to prevent crashes when older utilities somehow activate
  // this code.
  /* c8 ignore next 5 */
  const options = config || {}
  const now = options.now || {}
  let lineShift = options.lineShift || 0
  let line = now.line || 1
  let column = now.column || 1

  return {move, current, shift}

  /**
   * Get the current tracked info.
   *
   * @type {TrackCurrent}
   */
  function current() {
    return {now: {line, column}, lineShift}
  }

  /**
   * Define an increased line shift (the typical indent for lines).
   *
   * @type {TrackShift}
   */
  function shift(value) {
    lineShift += value
  }

  /**
   * Move past some generated markdown.
   *
   * @type {TrackMove}
   */
  function move(input) {
    // eslint-disable-next-line unicorn/prefer-default-parameters
    const value = input || ''
    const chunks = value.split(/\r?\n|\r/g)
    const tail = chunks[chunks.length - 1]
    line += chunks.length - 1
    column =
      chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift
    return value
  }
}

;// CONCATENATED MODULE: ./node_modules/mdast-util-to-markdown/lib/index.js
/**
 * @typedef {import('./types.js').Enter} Enter
 * @typedef {import('./types.js').Info} Info
 * @typedef {import('./types.js').Join} Join
 * @typedef {import('./types.js').FlowContent} FlowContent
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').PhrasingContent} PhrasingContent
 * @typedef {import('./types.js').SafeConfig} SafeConfig
 * @typedef {import('./types.js').State} State
 * @typedef {import('./types.js').TrackFields} TrackFields
 */













/**
 * Turn an mdast syntax tree into markdown.
 *
 * @param {Node} tree
 *   Tree to serialize.
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized markdown representing `tree`.
 */
function toMarkdown(tree, options = {}) {
  /** @type {State} */
  const state = {
    enter,
    indentLines: indentLines,
    associationId: association,
    containerPhrasing: containerPhrasingBound,
    containerFlow: containerFlowBound,
    createTracker: track,
    safe: safeBound,
    stack: [],
    unsafe: [],
    join: [],
    // @ts-expect-error: we’ll fill it next.
    handlers: {},
    options: {},
    indexStack: [],
    // @ts-expect-error: we’ll add `handle` later.
    handle: undefined
  }

  configure_configure(state, {unsafe: unsafe, join: join, handlers: handle})
  configure_configure(state, options)

  if (state.options.tightDefinitions) {
    configure_configure(state, {join: [joinDefinition]})
  }

  state.handle = zwitch('type', {
    invalid,
    unknown,
    handlers: state.handlers
  })

  let result = state.handle(tree, undefined, state, {
    before: '\n',
    after: '\n',
    now: {line: 1, column: 1},
    lineShift: 0
  })

  if (
    result &&
    result.charCodeAt(result.length - 1) !== 10 &&
    result.charCodeAt(result.length - 1) !== 13
  ) {
    result += '\n'
  }

  return result

  /** @type {Enter} */
  function enter(name) {
    state.stack.push(name)
    return exit

    function exit() {
      state.stack.pop()
    }
  }
}

/**
 * @param {unknown} value
 * @returns {never}
 */
function invalid(value) {
  throw new Error('Cannot handle value `' + value + '`, expected node')
}

/**
 * @param {unknown} node
 * @returns {never}
 */
function unknown(node) {
  // @ts-expect-error: fine.
  throw new Error('Cannot handle unknown node `' + node.type + '`')
}

/** @type {Join} */
function joinDefinition(left, right) {
  // No blank line between adjacent definitions.
  if (left.type === 'definition' && left.type === right.type) {
    return 0
  }
}

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parent & {children: Array<PhrasingContent>}} parent
 *   Parent of flow nodes.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined together.
 */
function containerPhrasingBound(parent, info) {
  return containerPhrasing(parent, this, info)
}

/**
 * Serialize the children of a parent that contains flow children.
 *
 * These children will typically be joined by blank lines.
 * What they are joined by exactly is defined by `Join` functions.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parent & {children: Array<FlowContent>}} parent
 *   Parent of flow nodes.
 * @param {TrackFields} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined by (blank) lines.
 */
function containerFlowBound(parent, info) {
  return containerFlow(parent, this, info)
}

/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * * Characters before and after something;
 * * What “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} value
 *   Raw value to make safe.
 * @param {SafeConfig} config
 *   Configuration.
 * @returns {string}
 *   Serialized markdown safe for embedding.
 */
function safeBound(value, config) {
  return safe(this, value, config)
}

;// CONCATENATED MODULE: ./node_modules/remark-stringify/lib/index.js
/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownOptions
 * @typedef {Omit<ToMarkdownOptions, 'extensions'>} Options
 */



/**
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<[Options?]|void[], Node, string>}
 */
function remarkStringify(options) {
  /** @type {import('unified').CompilerFunction<Node, string>} */
  const compiler = (tree) => {
    // Assume options.
    const settings = /** @type {Options} */ (this.data('settings'))

    return toMarkdown(
      tree,
      Object.assign({}, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions:
          /** @type {ToMarkdownOptions['extensions']} */ (
            this.data('toMarkdownExtensions')
          ) || []
      })
    )
  }

  Object.assign(this, {Compiler: compiler})
}

;// CONCATENATED MODULE: ./node_modules/remark/index.js




const remark = unified().use(remarkParse).use(remarkStringify).freeze()

;// CONCATENATED MODULE: ./node_modules/strip-markdown/index.js
/**
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Root} Root
 * @typedef {Root|Content} Node
 * @typedef {Node['type']} Type
 *
 * @callback Handler
 * @param {any} node
 * @returns {Node|Node[]|undefined} node
 *
 * @typedef {Partial<Record<Type, Handler>>} Handlers
 *
 * @typedef Options
 *   Configuration.
 * @property {Array.<Type>|undefined} [keep]
 *   List of node types to leave unchanged.
 * @property {Array.<Type|[Type, Handler]>|undefined} [remove]
 *   List of additional node types to remove or replace.
 */

/**
 * Expose modifiers for available node types.
 * Node types not listed here are not changed (but their children are).
 *
 * @type {Handlers}
 */
const defaults = {
  heading: strip_markdown_paragraph,
  text: strip_markdown_text,
  inlineCode: strip_markdown_text,
  image: strip_markdown_image,
  imageReference: strip_markdown_image,
  break: lineBreak,

  blockquote: children,
  list: children,
  listItem: children,
  strong: children,
  emphasis: children,
  delete: children,
  link: children,
  linkReference: children,

  code: empty,
  thematicBreak: empty,
  html: empty,
  table: empty,
  tableCell: empty,
  definition: empty,
  yaml: empty,

  // @ts-expect-error: custom frontmatter node.
  toml: empty,

  footnoteReference: empty,
  footnoteDefinition: empty
}

const strip_markdown_own = {}.hasOwnProperty

/**
 * Plugin to remove markdown formatting.
 *
 * @type {import('unified').Plugin<[Options?] | void[], Root>}
 * @returns {import('unified').Transformer<Root>}
 */
function stripMarkdown(options = {}) {
  const handlers = Object.assign({}, defaults)
  const remove = options.remove || []
  const keep = options.keep || []

  let index = -1

  while (++index < remove.length) {
    const value = remove[index]

    if (Array.isArray(value)) {
      handlers[value[0]] = value[1]
    } else {
      handlers[value] = empty
    }
  }

  /** @type {Handlers} */
  let map = {}

  if (keep.length === 0) {
    map = handlers
  } else {
    /** @type {Type} */
    let key

    for (key in handlers) {
      if (!keep.includes(key)) {
        map[key] = handlers[key]
      }
    }

    index = -1

    // Warn if unknown keys are turned off.
    while (++index < keep.length) {
      key = keep[index]

      if (!strip_markdown_own.call(handlers, key)) {
        throw new Error(
          'Invalid `keep` option: No modifier is defined for node type `' +
            key +
            '`'
        )
      }
    }
  }

  // @ts-expect-error: assume content model (for root) matches.
  return one

  /**
   * @param {Node} node
   * @returns {Node|Node[]|undefined}
   */
  function one(node) {
    /** @type {Type} */
    const type = node.type
    /** @type {Node|Node[]|undefined} */
    let result = node

    if (type in map) {
      const handler = map[type]
      if (handler) result = handler(result)
    }

    result = Array.isArray(result) ? all(result) : result

    if (result && 'children' in result) {
      // @ts-expect-error: assume content models match.
      result.children = all(result.children)
    }

    return result
  }

  /**
   * @param {Node[]} nodes
   * @returns {Node[]}
   */
  function all(nodes) {
    let index = -1
    /** @type {Node[]} */
    const result = []

    while (++index < nodes.length) {
      const value = one(nodes[index])

      if (Array.isArray(value)) {
        result.push(...all(value))
      } else if (value) {
        result.push(value)
      }
    }

    return clean(result)
  }
}

/**
 * Clean nodes: merges literals.
 *
 * @param {Node[]} values
 * @returns {Node[]}
 */
function clean(values) {
  let index = -1
  /** @type {Node[]} */
  const result = []
  /** @type {Node|undefined} */
  let previous

  while (++index < values.length) {
    const value = values[index]

    if (previous && value.type === previous.type && 'value' in value) {
      // @ts-expect-error: we just checked that they’re the same node.
      previous.value += value.value
    } else {
      result.push(value)
      previous = value
    }
  }

  return result
}

/**
 * @type {Handler}
 * @param {import('mdast').Image|import('mdast').ImageReference} node
 */
function strip_markdown_image(node) {
  const title = 'title' in node ? node.title : ''
  const value = node.alt || title || ''
  return value ? {type: 'text', value} : undefined
}

/**
 * @type {Handler}
 * @param {import('mdast').Text} node
 */
function strip_markdown_text(node) {
  return {type: 'text', value: node.value}
}

/**
 * @type {Handler}
 * @param {import('mdast').Paragraph} node
 */
function strip_markdown_paragraph(node) {
  return {type: 'paragraph', children: node.children}
}

/**
 * @type {Handler}
 * @param {Extract<Node, import('unist').Parent>} node
 */
function children(node) {
  return node.children
}

/**
 * @type {Handler}
 */
function lineBreak() {
  return {type: 'text', value: '\n'}
}

/**
 * @type {Handler}
 */
function empty() {
  return undefined
}

// EXTERNAL MODULE: ./node_modules/delay/index.js
var delay = __webpack_require__(86);
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(3994);
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__(2028);
// EXTERNAL MODULE: ./node_modules/puppeteer-extra/dist/index.cjs.js
var index_cjs = __webpack_require__(8683);
// EXTERNAL MODULE: ./node_modules/puppeteer-extra-plugin-recaptcha/dist/index.cjs.js
var dist_index_cjs = __webpack_require__(2290);
// EXTERNAL MODULE: ./node_modules/puppeteer-extra-plugin-stealth/index.js
var puppeteer_extra_plugin_stealth = __webpack_require__(4561);
;// CONCATENATED MODULE: ./node_modules/chatgpt/build/index.js
// src/chatgpt-api.ts




// src/types.ts
var ChatGPTError = class extends Error {
};

// src/chatgpt-conversation.ts
var ChatGPTConversation = class {
  constructor(api, opts = {}) {
    this.conversationId = void 0;
    this.parentMessageId = void 0;
    this.api = api;
    this.conversationId = opts.conversationId;
    this.parentMessageId = opts.parentMessageId;
  }
  async sendMessage(message, opts = {}) {
    const { onConversationResponse, ...rest } = opts;
    return this.api.sendMessage(message, {
      ...rest,
      conversationId: this.conversationId,
      parentMessageId: this.parentMessageId,
      onConversationResponse: (response) => {
        var _a;
        if (response.conversation_id) {
          this.conversationId = response.conversation_id;
        }
        if ((_a = response.message) == null ? void 0 : _a.id) {
          this.parentMessageId = response.message.id;
        }
        if (onConversationResponse) {
          return onConversationResponse(response);
        }
      }
    });
  }
};

// src/fetch.ts
var fetch2 = globalThis.fetch;
if (typeof fetch2 !== "function") {
  throw new Error(
    "Invalid environment: global fetch not defined; `chatgpt` requires Node.js >= 18 at the moment due to Cloudflare protections"
  );
}

// src/fetch-sse.ts


// src/stream-async-iterable.ts
async function* streamAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// src/fetch-sse.ts
async function fetchSSE(url, options) {
  const { onMessage, ...fetchOptions } = options;
  const res = await fetch2(url, fetchOptions);
  if (!res.ok) {
    const msg = `ChatGPTAPI error ${res.status || res.statusText}`;
    const error = new ChatGPTError(msg);
    error.statusCode = res.status;
    error.statusText = res.statusText;
    error.response = res;
    throw error;
  }
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
    }
  });
  if (!res.body.getReader) {
    const body = res.body;
    if (!body.on || !body.read) {
      throw new ChatGPTError('unsupported "fetch" implementation');
    }
    body.on("readable", () => {
      let chunk;
      while (null !== (chunk = body.read())) {
        parser.feed(chunk.toString());
      }
    });
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk);
      parser.feed(str);
    }
  }
}

// src/utils.ts


function markdownToText(markdown) {
  return remark().use(stripMarkdown).processSync(markdown ?? "").toString();
}
async function minimizePage(page) {
  const session = await page.target().createCDPSession();
  const goods = await session.send("Browser.getWindowForTarget");
  const { windowId } = goods;
  await session.send("Browser.setWindowBounds", {
    windowId,
    bounds: { windowState: "minimized" }
  });
}
async function maximizePage(page) {
  const session = await page.target().createCDPSession();
  const goods = await session.send("Browser.getWindowForTarget");
  const { windowId } = goods;
  await session.send("Browser.setWindowBounds", {
    windowId,
    bounds: { windowState: "normal" }
  });
}
function isRelevantRequest(url) {
  let pathname;
  try {
    const parsedUrl = new URL(url);
    pathname = parsedUrl.pathname;
    url = parsedUrl.toString();
  } catch (_) {
    return false;
  }
  if (!url.startsWith("https://chat.openai.com")) {
    return false;
  }
  if (!pathname.startsWith("/backend-api/") && !pathname.startsWith("/api/auth/session")) {
    return false;
  }
  if (pathname.endsWith("backend-api/moderations")) {
    return false;
  }
  return true;
}
async function browserPostEventStream(url, accessToken, body, timeoutMs) {
  var _a, _b, _c, _d;
  globalThis.__name = () => void 0;
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeoutError";
    }
  }
  class AbortError extends Error {
    constructor(message) {
      super();
      this.name = "AbortError";
      this.message = message;
    }
  }
  const BOM = [239, 187, 191];
  let conversationResponse;
  let conversationId = body == null ? void 0 : body.conversation_id;
  let messageId = (_b = (_a = body == null ? void 0 : body.messages) == null ? void 0 : _a[0]) == null ? void 0 : _b.id;
  let response = "";
  try {
    console.log("browserPostEventStream", url, accessToken, body);
    let abortController = null;
    if (timeoutMs) {
      abortController = new AbortController();
    }
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      signal: abortController == null ? void 0 : abortController.signal,
      headers: {
        accept: "text/event-stream",
        "x-openai-assistant-app-id": "",
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json"
      }
    });
    console.log("browserPostEventStream response", res);
    if (!res.ok) {
      return {
        error: {
          message: `ChatGPTAPI error ${res.status || res.statusText}`,
          statusCode: res.status,
          statusText: res.statusText
        },
        response: null,
        conversationId,
        messageId
      };
    }
    const responseP = new Promise(
      async (resolve, reject) => {
        function onMessage(data) {
          var _a2, _b2, _c2, _d2;
          if (data === "[DONE]") {
            return resolve({
              error: null,
              response,
              conversationId,
              messageId,
              conversationResponse
            });
          }
          try {
            const convoResponseEvent = JSON.parse(data);
            conversationResponse = convoResponseEvent;
            if (convoResponseEvent.conversation_id) {
              conversationId = convoResponseEvent.conversation_id;
            }
            if ((_a2 = convoResponseEvent.message) == null ? void 0 : _a2.id) {
              messageId = convoResponseEvent.message.id;
            }
            const partialResponse = (_d2 = (_c2 = (_b2 = convoResponseEvent.message) == null ? void 0 : _b2.content) == null ? void 0 : _c2.parts) == null ? void 0 : _d2[0];
            if (partialResponse) {
              response = partialResponse;
            }
          } catch (err) {
            console.warn("fetchSSE onMessage unexpected error", err);
            reject(err);
          }
        }
        const parser = createParser2((event) => {
          if (event.type === "event") {
            onMessage(event.data);
          }
        });
        for await (const chunk of streamAsyncIterable2(res.body)) {
          const str = new TextDecoder().decode(chunk);
          parser.feed(str);
        }
      }
    );
    if (timeoutMs) {
      if (abortController) {
        ;
        responseP.cancel = () => {
          abortController.abort();
        };
      }
      return await pTimeout2(responseP, {
        milliseconds: timeoutMs,
        message: "ChatGPT timed out waiting for response"
      });
    } else {
      return await responseP;
    }
  } catch (err) {
    const errMessageL = err.toString().toLowerCase();
    if (response && (errMessageL === "error: typeerror: terminated" || errMessageL === "typeerror: terminated")) {
      return {
        error: null,
        response,
        conversationId,
        messageId,
        conversationResponse
      };
    }
    return {
      error: {
        message: err.toString(),
        statusCode: err.statusCode || err.status || ((_c = err.response) == null ? void 0 : _c.statusCode),
        statusText: err.statusText || ((_d = err.response) == null ? void 0 : _d.statusText)
      },
      response: null,
      conversationId,
      messageId,
      conversationResponse
    };
  }
  async function* streamAsyncIterable2(stream) {
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
  function createParser2(onParse) {
    let isFirstChunk;
    let buffer;
    let startingPosition;
    let startingFieldLength;
    let eventId;
    let eventName;
    let data;
    reset();
    return { feed, reset };
    function reset() {
      isFirstChunk = true;
      buffer = "";
      startingPosition = 0;
      startingFieldLength = -1;
      eventId = void 0;
      eventName = void 0;
      data = "";
    }
    function feed(chunk) {
      buffer = buffer ? buffer + chunk : chunk;
      if (isFirstChunk && hasBom(buffer)) {
        buffer = buffer.slice(BOM.length);
      }
      isFirstChunk = false;
      const length = buffer.length;
      let position = 0;
      let discardTrailingNewline = false;
      while (position < length) {
        if (discardTrailingNewline) {
          if (buffer[position] === "\n") {
            ++position;
          }
          discardTrailingNewline = false;
        }
        let lineLength = -1;
        let fieldLength = startingFieldLength;
        let character;
        for (let index = startingPosition; lineLength < 0 && index < length; ++index) {
          character = buffer[index];
          if (character === ":" && fieldLength < 0) {
            fieldLength = index - position;
          } else if (character === "\r") {
            discardTrailingNewline = true;
            lineLength = index - position;
          } else if (character === "\n") {
            lineLength = index - position;
          }
        }
        if (lineLength < 0) {
          startingPosition = length - position;
          startingFieldLength = fieldLength;
          break;
        } else {
          startingPosition = 0;
          startingFieldLength = -1;
        }
        parseEventStreamLine(buffer, position, fieldLength, lineLength);
        position += lineLength + 1;
      }
      if (position === length) {
        buffer = "";
      } else if (position > 0) {
        buffer = buffer.slice(position);
      }
    }
    function parseEventStreamLine(lineBuffer, index, fieldLength, lineLength) {
      if (lineLength === 0) {
        if (data.length > 0) {
          onParse({
            type: "event",
            id: eventId,
            event: eventName || void 0,
            data: data.slice(0, -1)
          });
          data = "";
          eventId = void 0;
        }
        eventName = void 0;
        return;
      }
      const noValue = fieldLength < 0;
      const field = lineBuffer.slice(
        index,
        index + (noValue ? lineLength : fieldLength)
      );
      let step = 0;
      if (noValue) {
        step = lineLength;
      } else if (lineBuffer[index + fieldLength + 1] === " ") {
        step = fieldLength + 2;
      } else {
        step = fieldLength + 1;
      }
      const position = index + step;
      const valueLength = lineLength - step;
      const value = lineBuffer.slice(position, position + valueLength).toString();
      if (field === "data") {
        data += value ? `${value}
` : "\n";
      } else if (field === "event") {
        eventName = value;
      } else if (field === "id" && !value.includes("\0")) {
        eventId = value;
      } else if (field === "retry") {
        const retry = parseInt(value, 10);
        if (!Number.isNaN(retry)) {
          onParse({ type: "reconnect-interval", value: retry });
        }
      }
    }
  }
  function hasBom(buffer) {
    return BOM.every(
      (charCode, index) => buffer.charCodeAt(index) === charCode
    );
  }
  function getDOMException(errorMessage) {
    return globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
  }
  function getAbortedReason(signal) {
    const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
    return reason instanceof Error ? reason : getDOMException(reason);
  }
  function pTimeout2(promise, options) {
    const {
      milliseconds,
      fallback,
      message,
      customTimers = { setTimeout, clearTimeout }
    } = options;
    let timer;
    const cancelablePromise = new Promise((resolve, reject) => {
      if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
        throw new TypeError(
          `Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``
        );
      }
      if (milliseconds === Number.POSITIVE_INFINITY) {
        resolve(promise);
        return;
      }
      if (options.signal) {
        const { signal } = options;
        if (signal.aborted) {
          reject(getAbortedReason(signal));
        }
        signal.addEventListener("abort", () => {
          reject(getAbortedReason(signal));
        });
      }
      timer = customTimers.setTimeout.call(
        void 0,
        () => {
          if (fallback) {
            try {
              resolve(fallback());
            } catch (error) {
              reject(error);
            }
            return;
          }
          const errorMessage = typeof message === "string" ? message : `Promise timed out after ${milliseconds} milliseconds`;
          const timeoutError = message instanceof Error ? message : new TimeoutError(errorMessage);
          if (typeof promise.cancel === "function") {
            ;
            promise.cancel();
          }
          reject(timeoutError);
        },
        milliseconds
      );
      (async () => {
        try {
          resolve(await promise);
        } catch (error) {
          reject(error);
        } finally {
          customTimers.clearTimeout.call(void 0, timer);
        }
      })();
    });
    cancelablePromise.clear = () => {
      customTimers.clearTimeout.call(void 0, timer);
      timer = void 0;
    };
    return cancelablePromise;
  }
}

// src/chatgpt-api.ts
var KEY_ACCESS_TOKEN = "accessToken";
var USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";
var ChatGPTAPI = class {
  constructor(opts) {
    this._user = null;
    const {
      sessionToken,
      clearanceToken,
      markdown = true,
      apiBaseUrl = "https://chat.openai.com/api",
      backendApiBaseUrl = "https://chat.openai.com/backend-api",
      userAgent = USER_AGENT,
      accessTokenTTL = 60 * 6e4,
      accessToken,
      headers,
      debug = false
    } = opts;
    this._sessionToken = sessionToken;
    this._clearanceToken = clearanceToken;
    this._markdown = !!markdown;
    this._debug = !!debug;
    this._apiBaseUrl = apiBaseUrl;
    this._backendApiBaseUrl = backendApiBaseUrl;
    this._userAgent = userAgent;
    this._headers = {
      "user-agent": this._userAgent,
      "x-openai-assistant-app-id": "",
      "accept-language": "en-US,en;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      origin: "https://chat.openai.com",
      referer: "https://chat.openai.com/chat",
      "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      ...headers
    };
    this._accessTokenCache = new dist(accessTokenTTL);
    if (accessToken) {
      this._accessTokenCache.set(KEY_ACCESS_TOKEN, accessToken);
    }
    if (!this._sessionToken) {
      throw new ChatGPTError("ChatGPT invalid session token");
    }
    if (!this._clearanceToken) {
      throw new ChatGPTError("ChatGPT invalid clearance token");
    }
  }
  get user() {
    return this._user;
  }
  get sessionToken() {
    return this._sessionToken;
  }
  get clearanceToken() {
    return this._clearanceToken;
  }
  get userAgent() {
    return this._userAgent;
  }
  async sendMessage(message, opts = {}) {
    const {
      conversationId,
      parentMessageId = v4(),
      messageId = v4(),
      action = "next",
      timeoutMs,
      onProgress,
      onConversationResponse
    } = opts;
    let { abortSignal } = opts;
    let abortController = null;
    if (timeoutMs && !abortSignal) {
      abortController = new AbortController();
      abortSignal = abortController.signal;
    }
    const accessToken = await this.refreshAccessToken();
    const body = {
      action,
      messages: [
        {
          id: messageId,
          role: "user",
          content: {
            content_type: "text",
            parts: [message]
          }
        }
      ],
      model: "text-davinci-002-render",
      parent_message_id: parentMessageId
    };
    if (conversationId) {
      body.conversation_id = conversationId;
    }
    let response = "";
    const responseP = new Promise((resolve, reject) => {
      const url = `${this._backendApiBaseUrl}/conversation`;
      const headers = {
        ...this._headers,
        Authorization: `Bearer ${accessToken}`,
        Accept: "text/event-stream",
        "Content-Type": "application/json",
        Cookie: `cf_clearance=${this._clearanceToken}`
      };
      if (this._debug) {
        console.log("POST", url, { body, headers });
      }
      fetchSSE(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: abortSignal,
        onMessage: (data) => {
          var _a, _b;
          if (data === "[DONE]") {
            return resolve(response);
          }
          try {
            const parsedData = JSON.parse(data);
            if (onConversationResponse) {
              onConversationResponse(parsedData);
            }
            const message2 = parsedData.message;
            if (message2) {
              let text = (_b = (_a = message2 == null ? void 0 : message2.content) == null ? void 0 : _a.parts) == null ? void 0 : _b[0];
              if (text) {
                if (!this._markdown) {
                  text = markdownToText(text);
                }
                response = text;
                if (onProgress) {
                  onProgress(text);
                }
              }
            }
          } catch (err) {
            console.warn("fetchSSE onMessage unexpected error", err);
            reject(err);
          }
        }
      }).catch((err) => {
        const errMessageL = err.toString().toLowerCase();
        if (response && (errMessageL === "error: typeerror: terminated" || errMessageL === "typeerror: terminated")) {
          return resolve(response);
        } else {
          return reject(err);
        }
      });
    });
    if (timeoutMs) {
      if (abortController) {
        ;
        responseP.cancel = () => {
          abortController.abort();
        };
      }
      return pTimeout(responseP, {
        milliseconds: timeoutMs,
        message: "ChatGPT timed out waiting for response"
      });
    } else {
      return responseP;
    }
  }
  async sendModeration(input) {
    const accessToken = await this.refreshAccessToken();
    const url = `${this._backendApiBaseUrl}/moderations`;
    const headers = {
      ...this._headers,
      Authorization: `Bearer ${accessToken}`,
      Accept: "*/*",
      "Content-Type": "application/json",
      Cookie: `cf_clearance=${this._clearanceToken}`
    };
    const body = {
      input,
      model: "text-moderation-playground"
    };
    if (this._debug) {
      console.log("POST", url, headers, body);
    }
    const res = await fetch2(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then((r) => {
      if (!r.ok) {
        const error = new ChatGPTError(`${r.status} ${r.statusText}`);
        error.response = r;
        error.statusCode = r.status;
        error.statusText = r.statusText;
        throw error;
      }
      return r.json();
    });
    return res;
  }
  async getIsAuthenticated() {
    try {
      void await this.refreshAccessToken();
      return true;
    } catch (err) {
      return false;
    }
  }
  async ensureAuth() {
    return await this.refreshAccessToken();
  }
  async refreshAccessToken() {
    const cachedAccessToken = this._accessTokenCache.get(KEY_ACCESS_TOKEN);
    if (cachedAccessToken) {
      return cachedAccessToken;
    }
    let response;
    try {
      const url = `${this._apiBaseUrl}/auth/session`;
      const headers = {
        ...this._headers,
        cookie: `cf_clearance=${this._clearanceToken}; __Secure-next-auth.session-token=${this._sessionToken}`,
        accept: "*/*"
      };
      if (this._debug) {
        console.log("GET", url, headers);
      }
      const res = await fetch2(url, {
        headers
      }).then((r) => {
        response = r;
        if (!r.ok) {
          const error = new ChatGPTError(`${r.status} ${r.statusText}`);
          error.response = r;
          error.statusCode = r.status;
          error.statusText = r.statusText;
          throw error;
        }
        return r.json();
      });
      const accessToken = res == null ? void 0 : res.accessToken;
      if (!accessToken) {
        const error = new ChatGPTError("Unauthorized");
        error.response = response;
        error.statusCode = response == null ? void 0 : response.status;
        error.statusText = response == null ? void 0 : response.statusText;
        throw error;
      }
      const appError = res == null ? void 0 : res.error;
      if (appError) {
        if (appError === "RefreshAccessTokenError") {
          const error = new ChatGPTError("session token may have expired");
          error.response = response;
          error.statusCode = response == null ? void 0 : response.status;
          error.statusText = response == null ? void 0 : response.statusText;
          throw error;
        } else {
          const error = new ChatGPTError(appError);
          error.response = response;
          error.statusCode = response == null ? void 0 : response.status;
          error.statusText = response == null ? void 0 : response.statusText;
          throw error;
        }
      }
      if (res.user) {
        this._user = res.user;
      }
      this._accessTokenCache.set(KEY_ACCESS_TOKEN, accessToken);
      return accessToken;
    } catch (err) {
      if (this._debug) {
        console.error(err);
      }
      const error = new ChatGPTError(
        `ChatGPT failed to refresh auth token. ${err.toString()}`
      );
      error.response = response;
      error.statusCode = response == null ? void 0 : response.status;
      error.statusText = response == null ? void 0 : response.statusText;
      error.originalError = err;
      throw error;
    }
  }
  getConversation(opts = {}) {
    return new ChatGPTConversation(this, opts);
  }
};

// src/chatgpt-api-browser.ts



// src/openai-auth.ts






index_cjs.use(puppeteer_extra_plugin_stealth());
var hasRecaptchaPlugin = false;
async function getOpenAIAuth({
  email,
  password,
  browser,
  page,
  timeoutMs = 2 * 60 * 1e3,
  isGoogleLogin = false,
  captchaToken = process.env.CAPTCHA_TOKEN,
  executablePath
}) {
  var _a, _b;
  const origBrowser = browser;
  const origPage = page;
  try {
    if (!browser) {
      browser = await getBrowser({ captchaToken, executablePath });
    }
    const userAgent = await browser.userAgent();
    if (!page) {
      page = (await browser.pages())[0] || await browser.newPage();
      page.setDefaultTimeout(timeoutMs);
    }
    await page.goto("https://chat.openai.com/auth/login", {
      waitUntil: "networkidle2"
    });
    if (hasRecaptchaPlugin) {
      await page.solveRecaptchas();
    }
    await checkForChatGPTAtCapacity(page);
    if (email && password) {
      await waitForConditionOrAtCapacity(
        page,
        () => page.waitForSelector("#__next .btn-primary", { timeout: timeoutMs })
      );
      await delay(500);
      await Promise.all([
        page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: timeoutMs
        }),
        page.click("#__next .btn-primary")
      ]);
      await checkForChatGPTAtCapacity(page);
      let submitP;
      if (isGoogleLogin) {
        await page.click('button[data-provider="google"]');
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', email, { delay: 10 });
        await Promise.all([
          page.waitForNavigation(),
          await page.keyboard.press("Enter")
        ]);
        await page.waitForSelector('input[type="password"]', { visible: true });
        await page.type('input[type="password"]', password, { delay: 10 });
        submitP = () => page.keyboard.press("Enter");
      } else {
        await page.waitForSelector("#username");
        await page.type("#username", email, { delay: 20 });
        await delay(100);
        if (hasRecaptchaPlugin) {
          const res = await page.solveRecaptchas();
        }
        await page.click('button[type="submit"]');
        await page.waitForSelector("#password", { timeout: timeoutMs });
        await page.type("#password", password, { delay: 10 });
        submitP = () => page.click('button[type="submit"]');
      }
      await Promise.all([
        waitForConditionOrAtCapacity(
          page,
          () => page.waitForNavigation({
            waitUntil: "networkidle2",
            timeout: timeoutMs
          })
        ),
        submitP()
      ]);
    } else {
      await delay(2e3);
      await checkForChatGPTAtCapacity(page);
    }
    const pageCookies = await page.cookies();
    const cookies = pageCookies.reduce(
      (map, cookie) => ({ ...map, [cookie.name]: cookie }),
      {}
    );
    const authInfo = {
      userAgent,
      clearanceToken: (_a = cookies["cf_clearance"]) == null ? void 0 : _a.value,
      sessionToken: (_b = cookies["__Secure-next-auth.session-token"]) == null ? void 0 : _b.value,
      cookies
    };
    return authInfo;
  } catch (err) {
    throw err;
  } finally {
    if (origBrowser) {
      if (page && page !== origPage) {
        await page.close();
      }
    } else if (browser) {
      await browser.close();
    }
    page = null;
    browser = null;
  }
}
async function getBrowser(opts = {}) {
  const {
    captchaToken = process.env.CAPTCHA_TOKEN,
    executablePath = defaultChromeExecutablePath(),
    ...launchOptions
  } = opts;
  if (captchaToken && !hasRecaptchaPlugin) {
    hasRecaptchaPlugin = true;
    index_cjs.use(
      dist_index_cjs({
        provider: {
          id: "2captcha",
          token: captchaToken
        },
        visualFeedback: true
      })
    );
  }
  return index_cjs.launch({
    headless: false,
    args: ["--no-sandbox", "--exclude-switches", "enable-automation"],
    ignoreHTTPSErrors: true,
    executablePath,
    ...launchOptions
  });
}
var defaultChromeExecutablePath = () => {
  switch (external_node_os_.platform()) {
    case "win32":
      return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    default: {
      const chromeExists = external_node_fs_.existsSync("/usr/bin/google-chrome");
      return chromeExists ? "/usr/bin/google-chrome" : "/usr/bin/google-chrome-stable";
    }
  }
};
async function checkForChatGPTAtCapacity(page) {
  let res;
  try {
    res = await page.$x("//div[contains(., 'ChatGPT is at capacity')]");
  } catch (err) {
  }
  if (res == null ? void 0 : res.length) {
    const error = new ChatGPTError("ChatGPT is at capacity");
    error.statusCode = 503;
    throw error;
  }
}
async function waitForConditionOrAtCapacity(page, condition, opts = {}) {
  const { pollingIntervalMs = 500 } = opts;
  return new Promise((resolve, reject) => {
    let resolved = false;
    async function waitForCapacityText() {
      if (resolved) {
        return;
      }
      try {
        await checkForChatGPTAtCapacity(page);
        if (!resolved) {
          setTimeout(waitForCapacityText, pollingIntervalMs);
        }
      } catch (err) {
        if (!resolved) {
          resolved = true;
          return reject(err);
        }
      }
    }
    condition().then(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }).catch((err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });
    setTimeout(waitForCapacityText, pollingIntervalMs);
  });
}

// src/chatgpt-api-browser.ts
var ChatGPTAPIBrowser = class {
  constructor(opts) {
    this._onRequest = (request) => {
      const url = request.url();
      if (!isRelevantRequest(url)) {
        return;
      }
      const method = request.method();
      let body;
      if (method === "POST") {
        body = request.postData();
        try {
          body = JSON.parse(body);
        } catch (_) {
        }
      }
      if (this._debug) {
        console.log("\nrequest", {
          url,
          method,
          headers: request.headers(),
          body
        });
      }
    };
    this._onResponse = async (response) => {
      const request = response.request();
      const url = response.url();
      if (!isRelevantRequest(url)) {
        return;
      }
      const status = response.status();
      let body;
      try {
        body = await response.json();
      } catch (_) {
      }
      if (this._debug) {
        console.log("\nresponse", {
          url,
          ok: response.ok(),
          status,
          statusText: response.statusText(),
          headers: response.headers(),
          body,
          request: {
            method: request.method(),
            headers: request.headers(),
            body: request.postData()
          }
        });
      }
      if (url.endsWith("/conversation")) {
        if (status === 403) {
          await this.handle403Error();
        }
      } else if (url.endsWith("api/auth/session")) {
        if (status === 403) {
          await this.handle403Error();
        } else {
          const session = body;
          if (session == null ? void 0 : session.accessToken) {
            this._accessToken = session.accessToken;
          }
        }
      }
    };
    const {
      email,
      password,
      markdown = true,
      debug = false,
      isGoogleLogin = false,
      minimize = true,
      captchaToken,
      executablePath
    } = opts;
    this._email = email;
    this._password = password;
    this._markdown = !!markdown;
    this._debug = !!debug;
    this._isGoogleLogin = !!isGoogleLogin;
    this._minimize = !!minimize;
    this._captchaToken = captchaToken;
    this._executablePath = executablePath;
  }
  async init() {
    if (this._browser) {
      await this._browser.close();
      this._page = null;
      this._browser = null;
      this._accessToken = null;
    }
    try {
      this._browser = await getBrowser({
        captchaToken: this._captchaToken,
        executablePath: this._executablePath
      });
      this._page = (await this._browser.pages())[0] || await this._browser.newPage();
      await maximizePage(this._page);
      this._page.on("request", this._onRequest.bind(this));
      this._page.on("response", this._onResponse.bind(this));
      await getOpenAIAuth({
        email: this._email,
        password: this._password,
        browser: this._browser,
        page: this._page,
        isGoogleLogin: this._isGoogleLogin
      });
    } catch (err) {
      if (this._browser) {
        await this._browser.close();
      }
      this._browser = null;
      this._page = null;
      throw err;
    }
    const chatUrl = "https://chat.openai.com/chat";
    const url = this._page.url().replace(/\/$/, "");
    if (url !== chatUrl) {
      await this._page.goto(chatUrl, {
        waitUntil: "networkidle2"
      });
    }
    do {
      const modalSelector = '[data-headlessui-state="open"]';
      if (!await this._page.$(modalSelector)) {
        break;
      }
      try {
        await this._page.click(`${modalSelector} button:last-child`);
      } catch (err) {
        break;
      }
      await delay(300);
    } while (true);
    if (!this.getIsAuthenticated()) {
      return false;
    }
    if (this._minimize) {
      await minimizePage(this._page);
    }
    return true;
  }
  async handle403Error() {
    console.log(`ChatGPT "${this._email}" session expired; refreshing...`);
    try {
      await maximizePage(this._page);
      await this._page.reload({
        waitUntil: "networkidle2",
        timeout: 2 * 60 * 1e3
      });
      if (this._minimize) {
        await minimizePage(this._page);
      }
    } catch (err) {
      console.error(
        `ChatGPT "${this._email}" error refreshing session`,
        err.toString()
      );
    }
  }
  async getIsAuthenticated() {
    try {
      const inputBox = await this._getInputBox();
      return !!inputBox;
    } catch (err) {
      return false;
    }
  }
  async sendMessage(message, opts = {}) {
    const {
      conversationId,
      parentMessageId = v4(),
      messageId = v4(),
      action = "next",
      timeoutMs,
      onConversationResponse
    } = opts;
    const inputBox = await this._getInputBox();
    if (!inputBox || !this._accessToken) {
      console.log(`chatgpt re-authenticating ${this._email}`);
      let isAuthenticated = false;
      try {
        isAuthenticated = await this.init();
      } catch (err) {
        console.warn(
          `chatgpt error re-authenticating ${this._email}`,
          err.toString()
        );
      }
      if (!isAuthenticated || !this._accessToken) {
        const error = new ChatGPTError("Not signed in");
        error.statusCode = 401;
        throw error;
      }
    }
    const url = `https://chat.openai.com/backend-api/conversation`;
    const body = {
      action,
      messages: [
        {
          id: messageId,
          role: "user",
          content: {
            content_type: "text",
            parts: [message]
          }
        }
      ],
      model: "text-davinci-002-render",
      parent_message_id: parentMessageId
    };
    if (conversationId) {
      body.conversation_id = conversationId;
    }
    const result = await this._page.evaluate(
      browserPostEventStream,
      url,
      this._accessToken,
      body,
      timeoutMs
    );
    if (result.error) {
      const error = new ChatGPTError(result.error.message);
      error.statusCode = result.error.statusCode;
      error.statusText = result.error.statusText;
      if (error.statusCode === 403) {
        await this.handle403Error();
      }
      throw error;
    }
    if (onConversationResponse) {
      onConversationResponse(result.conversationResponse);
    }
    return result.response;
  }
  async resetThread() {
    try {
      await this._page.click("nav > a:nth-child(1)");
    } catch (err) {
    }
  }
  async close() {
    await this._browser.close();
    this._page = null;
    this._browser = null;
  }
  async _getInputBox() {
    return this._page.$("textarea");
  }
};

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6201:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
Object.defineProperty(exports, "zR", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "Qc", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));
Object.defineProperty(exports, "Pz", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "Gu", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "i8", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));

var _v = _interopRequireDefault(__webpack_require__(1));

var _v2 = _interopRequireDefault(__webpack_require__(6632));

var _v3 = _interopRequireDefault(__webpack_require__(2881));

var _v4 = _interopRequireDefault(__webpack_require__(2307));

var _nil = _interopRequireDefault(__webpack_require__(3518));

var _version = _interopRequireDefault(__webpack_require__(1743));

var _validate = _interopRequireDefault(__webpack_require__(2558));

var _stringify = _interopRequireDefault(__webpack_require__(2201));

var _parse = _interopRequireDefault(__webpack_require__(490));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 1107:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _crypto = _interopRequireDefault(__webpack_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports.default = _default;

/***/ }),

/***/ 1381:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _crypto = _interopRequireDefault(__webpack_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  randomUUID: _crypto.default.randomUUID
};
exports.default = _default;

/***/ }),

/***/ 3518:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;

/***/ }),

/***/ 490:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(2558));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;

/***/ }),

/***/ 1987:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;

/***/ }),

/***/ 548:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = rng;

var _crypto = _interopRequireDefault(__webpack_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 3203:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _crypto = _interopRequireDefault(__webpack_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports.default = _default;

/***/ }),

/***/ 2201:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
exports.unsafeStringify = unsafeStringify;

var _validate = _interopRequireDefault(__webpack_require__(2558));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;

/***/ }),

/***/ 1:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _rng = _interopRequireDefault(__webpack_require__(548));

var _stringify = __webpack_require__(2201);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.unsafeStringify)(b);
}

var _default = v1;
exports.default = _default;

/***/ }),

/***/ 6632:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _v = _interopRequireDefault(__webpack_require__(2829));

var _md = _interopRequireDefault(__webpack_require__(1107));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;

/***/ }),

/***/ 2829:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.URL = exports.DNS = void 0;
exports.default = v35;

var _stringify = __webpack_require__(2201);

var _parse = _interopRequireDefault(__webpack_require__(490));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;

    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.unsafeStringify)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 2881:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _native = _interopRequireDefault(__webpack_require__(1381));

var _rng = _interopRequireDefault(__webpack_require__(548));

var _stringify = __webpack_require__(2201);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }

  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.unsafeStringify)(rnds);
}

var _default = v4;
exports.default = _default;

/***/ }),

/***/ 2307:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _v = _interopRequireDefault(__webpack_require__(2829));

var _sha = _interopRequireDefault(__webpack_require__(3203));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;

/***/ }),

/***/ 2558:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _regex = _interopRequireDefault(__webpack_require__(1987));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;

/***/ }),

/***/ 1743:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(2558));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.slice(14, 15), 16);
}

var _default = version;
exports.default = _default;

/***/ }),

/***/ 639:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Module dependenices
 */

var utils = __webpack_require__(3217);

/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (utils.typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default:
      return utils.clone(val);
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (utils.isObject(obj)) {
    var res = {};
    utils.forOwn(obj, function(obj, key) {
      this[key] = cloneDeep(obj, instanceClone);
    }, res);
    return res;
  } else if (instanceClone) {
    return instanceClone(obj);
  } else {
    return obj;
  }
}

function cloneArrayDeep(arr, instanceClone) {
  var len = arr.length, res = [];
  var i = -1;
  while (++i < len) {
    res[i] = cloneDeep(arr[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;


/***/ }),

/***/ 3217:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Lazily required module dependencies
 */

var utils = __webpack_require__(4698)(require);
var fn = require;

__webpack_require__(7905) = utils;
__webpack_require__(7905)('is-plain-object', 'isObject');
__webpack_require__(7905)('shallow-clone', 'clone');
__webpack_require__(7905)('kind-of', 'typeOf');
__webpack_require__(7281);
__webpack_require__(7905) = fn;

/**
 * Expose `utils`
 */

module.exports = utils;


/***/ }),

/***/ 6323:
/***/ ((module) => {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ 86:
/***/ ((module) => {

"use strict";


// From https://github.com/sindresorhus/random-int/blob/c37741b56f76b9160b0b63dae4e9c64875128146/index.js#L13-L15
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;
	const clear = defaultClear || clearTimeout;

	const signalListener = () => {
		clear(timeoutId);
		rejectFn(createAbortError());
	};

	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

		rejectFn = reject;
		timeoutId = (set || setTimeout)(settle, ms);
	});

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		settle();
	};

	return delayPromise;
};

const createWithTimers = clearAndSet => {
	const delay = createDelay({...clearAndSet, willResolve: true});
	delay.reject = createDelay({...clearAndSet, willResolve: false});
	delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
	return delay;
};

const delay = createWithTimers();
delay.createWithTimers = createWithTimers;

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;


/***/ }),

/***/ 1027:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const mapAgeCleaner = __webpack_require__(6020);
class ExpiryMap {
    constructor(maxAge, data) {
        this.maxAge = maxAge;
        this[Symbol.toStringTag] = 'Map';
        this.data = new Map();
        // Bootstrap the cleanup process which frees up memory when an item expires
        mapAgeCleaner(this.data);
        if (data) { // tslint:disable-line:early-exit
            for (const [key, value] of data) {
                this.set(key, value);
            }
        }
    }
    get size() {
        return this.data.size;
    }
    clear() {
        this.data.clear();
    }
    delete(key) {
        return this.data.delete(key);
    }
    has(key) {
        return this.data.has(key);
    }
    get(key) {
        const value = this.data.get(key);
        if (value) {
            return value.data;
        }
        return;
    }
    set(key, value) {
        this.data.set(key, {
            maxAge: Date.now() + this.maxAge,
            data: value
        });
        return this;
    }
    values() {
        return this.createIterator(item => item[1].data);
    }
    keys() {
        return this.data.keys();
    }
    entries() {
        return this.createIterator(item => [item[0], item[1].data]);
    }
    forEach(callbackfn, thisArg) {
        for (const [key, value] of this.entries()) {
            callbackfn.apply(thisArg, [value, key, this]);
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    *createIterator(projection) {
        for (const item of this.data.entries()) {
            yield projection(item);
        }
    }
}
module.exports = ExpiryMap;


/***/ }),

/***/ 8171:
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 7198:
/***/ ((module) => {

"use strict";
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function forIn(obj, fn, thisArg) {
  for (var key in obj) {
    if (fn.call(thisArg, obj[key], key, obj) === false) {
      break;
    }
  }
};


/***/ }),

/***/ 7281:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



var forIn = __webpack_require__(7198);
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(obj, fn, thisArg) {
  forIn(obj, function(val, key) {
    if (hasOwn.call(obj, key)) {
      return fn.call(thisArg, obj[key], key, obj);
    }
  });
};


/***/ }),

/***/ 5625:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 6961:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isBuffer = __webpack_require__(5625);
var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }

  // buffer
  if (isBuffer(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};


/***/ }),

/***/ 4698:
/***/ ((module) => {

"use strict";


/**
 * Cache results of the first function call to ensure only calling once.
 *
 * ```js
 * var utils = require('lazy-cache')(require);
 * // cache the call to `require('ansi-yellow')`
 * utils('ansi-yellow', 'yellow');
 * // use `ansi-yellow`
 * console.log(utils.yellow('this is yellow'));
 * ```
 *
 * @param  {Function} `fn` Function that will be called only once.
 * @return {Function} Function that can be called to get the cached function
 * @api public
 */

function lazyCache(fn) {
  var cache = {};
  var proxy = function(mod, name) {
    name = name || camelcase(mod);

    // check both boolean and string in case `process.env` cases to string
    if (process.env.UNLAZY === 'true' || process.env.UNLAZY === true || process.env.TRAVIS) {
      cache[name] = fn(mod);
    }

    Object.defineProperty(proxy, name, {
      enumerable: true,
      configurable: true,
      get: getter
    });

    function getter() {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      return (cache[name] = fn(mod));
    }
    return getter;
  };
  return proxy;
}

/**
 * Used to camelcase the name to be stored on the `lazy` object.
 *
 * @param  {String} `str` String containing `_`, `.`, `-` or whitespace that will be camelcased.
 * @return {String} camelcased string.
 */

function camelcase(str) {
  if (str.length === 1) {
    return str.toLowerCase();
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  return str.replace(/[\W_]+(\w|$)/g, function(_, ch) {
    return ch.toUpperCase();
  });
}

/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;


/***/ }),

/***/ 6020:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const pDefer = __webpack_require__(5853);
function mapAgeCleaner(map, property = 'maxAge') {
    let processingKey;
    let processingTimer;
    let processingDeferred;
    const cleanup = async () => {
        if (processingKey !== undefined) {
            // If we are already processing an item, we can safely exit
            return;
        }
        const setupTimer = async (item) => {
            processingDeferred = pDefer();
            const delay = item[1][property] - Date.now();
            if (delay <= 0) {
                // Remove the item immediately if the delay is equal to or below 0
                map.delete(item[0]);
                processingDeferred.resolve();
                return;
            }
            // Keep track of the current processed key
            processingKey = item[0];
            processingTimer = setTimeout(() => {
                // Remove the item when the timeout fires
                map.delete(item[0]);
                if (processingDeferred) {
                    processingDeferred.resolve();
                }
            }, delay);
            // tslint:disable-next-line:strict-type-predicates
            if (typeof processingTimer.unref === 'function') {
                // Don't hold up the process from exiting
                processingTimer.unref();
            }
            return processingDeferred.promise;
        };
        try {
            for (const entry of map) {
                await setupTimer(entry);
            }
        }
        catch (_a) {
            // Do nothing if an error occurs, this means the timer was cleaned up and we should stop processing
        }
        processingKey = undefined;
    };
    const reset = () => {
        processingKey = undefined;
        if (processingTimer !== undefined) {
            clearTimeout(processingTimer);
            processingTimer = undefined;
        }
        if (processingDeferred !== undefined) { // tslint:disable-line:early-exit
            processingDeferred.reject(undefined);
            processingDeferred = undefined;
        }
    };
    const originalSet = map.set.bind(map);
    map.set = (key, value) => {
        if (map.has(key)) {
            // If the key already exist, remove it so we can add it back at the end of the map.
            map.delete(key);
        }
        // Call the original `map.set`
        const result = originalSet(key, value);
        // If we are already processing a key and the key added is the current processed key, stop processing it
        if (processingKey && processingKey === key) {
            reset();
        }
        // Always run the cleanup method in case it wasn't started yet
        cleanup(); // tslint:disable-line:no-floating-promises
        return result;
    };
    cleanup(); // tslint:disable-line:no-floating-promises
    return map;
}
module.exports = mapAgeCleaner;


/***/ }),

/***/ 3993:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



var union = __webpack_require__(8815);
var clone = __webpack_require__(639);
var typeOf = __webpack_require__(6961);

module.exports = function mergeDeep(orig, objects) {
  if (!isObject(orig) && !Array.isArray(orig)) {
    orig = {};
  }

  var target = clone(orig);
  var len = arguments.length;
  var idx = 0;

  while (++idx < len) {
    var val = arguments[idx];

    if (isObject(val) || Array.isArray(val)) {
      merge(target, val);
    }
  }
  return target;
};

function merge(target, obj) {
  for (var key in obj) {
    if (!isValidKey(key) || !hasOwn(obj, key)) {
      continue;
    }

    var oldVal = obj[key];
    var newVal = target[key];

    if (isObject(newVal) && isObject(oldVal)) {
      target[key] = merge(newVal, oldVal);
    } else if (Array.isArray(newVal)) {
      target[key] = union([], newVal, oldVal);
    } else {
      target[key] = clone(oldVal);
    }
  }
  return target;
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isObject(val) {
  return typeOf(val) === 'object' || typeOf(val) === 'function';
}

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

/***/ }),

/***/ 5853:
/***/ ((module) => {

"use strict";

module.exports = () => {
	const ret = {};

	ret.promise = new Promise((resolve, reject) => {
		ret.resolve = resolve;
		ret.reject = reject;
	});

	return ret;
};


/***/ }),

/***/ 2290:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/*!
 * puppeteer-extra-plugin-recaptcha v3.6.7 by berstend
 * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-recaptcha
 * @license MIT
 */


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var puppeteerExtraPlugin = __webpack_require__(8873);
var Debug = _interopDefault(__webpack_require__(8237));

const ContentScriptDefaultOpts = {
    visualFeedback: true,
    debugBinding: undefined
};
const ContentScriptDefaultData = {
    solutions: []
};
/**
 * Content script for Recaptcha handling (runs in browser context)
 * @note External modules are not supported here (due to content script isolation)
 */
class RecaptchaContentScript {
    constructor(opts = ContentScriptDefaultOpts, data = ContentScriptDefaultData) {
        /** Log using debug binding if available */
        this.log = (message, data) => {
            if (this.opts.debugBinding && window.top[this.opts.debugBinding]) {
                window.top[this.opts.debugBinding](message, JSON.stringify(data));
            }
        };
        // Poor mans _.pluck
        this._pick = (props) => (o) => props.reduce((a, e) => (Object.assign(Object.assign({}, a), { [e]: o[e] })), {});
        // make sure the element is visible - this is equivalent to jquery's is(':visible')
        this._isVisible = (elem) => !!(elem.offsetWidth ||
            elem.offsetHeight ||
            (typeof elem.getClientRects === 'function' &&
                elem.getClientRects().length));
        // Workaround for https://github.com/esbuild-kit/tsx/issues/113
        if (typeof globalThis.__name === 'undefined') {
            globalThis.__defProp = Object.defineProperty;
            globalThis.__name = (target, value) => globalThis.__defProp(target, 'name', { value, configurable: true });
        }
        this.opts = opts;
        this.data = data;
        this.frameSources = this._generateFrameSources();
        this.log('Intialized', { url: document.location.href, opts: this.opts });
    }
    /** Check if an element is in the current viewport */
    _isInViewport(elem) {
        const rect = elem.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight ||
                    (document.documentElement.clientHeight &&
                        rect.right <=
                            (window.innerWidth || document.documentElement.clientWidth))));
    }
    // Recaptcha client is a nested, circular object with object keys that seem generated
    // We flatten that object a couple of levels deep for easy access to certain keys we're interested in.
    _flattenObject(item, levels = 2, ignoreHTML = true) {
        const isObject = (x) => x && typeof x === 'object';
        const isHTML = (x) => x && x instanceof HTMLElement;
        let newObj = {};
        for (let i = 0; i < levels; i++) {
            item = Object.keys(newObj).length ? newObj : item;
            Object.keys(item).forEach(key => {
                if (ignoreHTML && isHTML(item[key]))
                    return;
                if (isObject(item[key])) {
                    Object.keys(item[key]).forEach(innerKey => {
                        if (ignoreHTML && isHTML(item[key][innerKey]))
                            return;
                        const keyName = isObject(item[key][innerKey])
                            ? `obj_${key}_${innerKey}`
                            : `${innerKey}`;
                        newObj[keyName] = item[key][innerKey];
                    });
                }
                else {
                    newObj[key] = item[key];
                }
            });
        }
        return newObj;
    }
    // Helper function to return an object based on a well known value
    _getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
    async _waitUntilDocumentReady() {
        return new Promise(function (resolve) {
            if (!document || !window) {
                return resolve(null);
            }
            const loadedAlready = /^loaded|^i|^c/.test(document.readyState);
            if (loadedAlready) {
                return resolve(null);
            }
            function onReady() {
                resolve(null);
                document.removeEventListener('DOMContentLoaded', onReady);
                window.removeEventListener('load', onReady);
            }
            document.addEventListener('DOMContentLoaded', onReady);
            window.addEventListener('load', onReady);
        });
    }
    _paintCaptchaBusy($iframe) {
        try {
            if (this.opts.visualFeedback) {
                $iframe.style.filter = `opacity(60%) hue-rotate(400deg)`; // violet
            }
        }
        catch (error) {
            // noop
        }
        return $iframe;
    }
    _paintCaptchaSolved($iframe) {
        try {
            if (this.opts.visualFeedback) {
                $iframe.style.filter = `opacity(60%) hue-rotate(230deg)`; // green
            }
        }
        catch (error) {
            // noop
        }
        return $iframe;
    }
    _findVisibleIframeNodes() {
        return Array.from(document.querySelectorAll(this.getFrameSelectorForId('anchor', '') // intentionally blank
        ));
    }
    _findVisibleIframeNodeById(id) {
        return document.querySelector(this.getFrameSelectorForId('anchor', id));
    }
    _hideChallengeWindowIfPresent(id = '') {
        let frame = document.querySelector(this.getFrameSelectorForId('bframe', id));
        this.log(' - _hideChallengeWindowIfPresent', { id, hasFrame: !!frame });
        if (!frame) {
            return;
        }
        while (frame &&
            frame.parentElement &&
            frame.parentElement !== document.body) {
            frame = frame.parentElement;
        }
        if (frame) {
            frame.style.visibility = 'hidden';
        }
    }
    // There's so many different possible deployments URLs that we better generate them
    _generateFrameSources() {
        const protos = ['http', 'https'];
        const hosts = [
            'google.com',
            'www.google.com',
            'recaptcha.net',
            'www.recaptcha.net'
        ];
        const origins = protos.flatMap(proto => hosts.map(host => `${proto}://${host}`));
        const paths = {
            anchor: ['/recaptcha/api2/anchor', '/recaptcha/enterprise/anchor'],
            bframe: ['/recaptcha/api2/bframe', '/recaptcha/enterprise/bframe']
        };
        return {
            anchor: origins.flatMap(origin => paths.anchor.map(path => `${origin}${path}`)),
            bframe: origins.flatMap(origin => paths.bframe.map(path => `${origin}${path}`))
        };
    }
    getFrameSelectorForId(type = 'anchor', id = '') {
        const namePrefix = type === 'anchor' ? 'a' : 'c';
        return this.frameSources[type]
            .map(src => `iframe[src^='${src}'][name^="${namePrefix}-${id}"]`)
            .join(',');
    }
    getClients() {
        // Bail out early if there's no indication of recaptchas
        if (!window || !window.__google_recaptcha_client)
            return;
        if (!window.___grecaptcha_cfg || !window.___grecaptcha_cfg.clients) {
            return;
        }
        if (!Object.keys(window.___grecaptcha_cfg.clients).length)
            return;
        return window.___grecaptcha_cfg.clients;
    }
    getVisibleIframesIds() {
        // Find all regular visible recaptcha boxes through their iframes
        const result = this._findVisibleIframeNodes()
            .filter($f => this._isVisible($f))
            .map($f => this._paintCaptchaBusy($f))
            .filter($f => $f && $f.getAttribute('name'))
            .map($f => $f.getAttribute('name') || '') // a-841543e13666
            .map(rawId => rawId.split('-').slice(-1)[0] // a-841543e13666 => 841543e13666
        )
            .filter(id => id);
        this.log('getVisibleIframesIds', result);
        return result;
    }
    // TODO: Obsolete with recent changes
    getInvisibleIframesIds() {
        // Find all invisible recaptcha boxes through their iframes (only the ones with an active challenge window)
        const result = this._findVisibleIframeNodes()
            .filter($f => $f && $f.getAttribute('name'))
            .map($f => $f.getAttribute('name') || '') // a-841543e13666
            .map(rawId => rawId.split('-').slice(-1)[0] // a-841543e13666 => 841543e13666
        )
            .filter(id => id)
            .filter(id => document.querySelectorAll(this.getFrameSelectorForId('bframe', id))
            .length);
        this.log('getInvisibleIframesIds', result);
        return result;
    }
    getIframesIds() {
        // Find all recaptcha boxes through their iframes, check for invisible ones as fallback
        const results = [
            ...this.getVisibleIframesIds(),
            ...this.getInvisibleIframesIds()
        ];
        this.log('getIframesIds', results);
        // Deduplicate results by using the unique id as key
        const dedup = Array.from(new Set(results));
        this.log('getIframesIds - dedup', dedup);
        return dedup;
    }
    isEnterpriseCaptcha(id) {
        if (!id)
            return false;
        // The only way to determine if a captcha is an enterprise one is by looking at their iframes
        const prefix = 'iframe[src*="/recaptcha/"][src*="/enterprise/"]';
        const nameSelectors = [`[name^="a-${id}"]`, `[name^="c-${id}"]`];
        const fullSelector = nameSelectors.map(name => prefix + name).join(',');
        return document.querySelectorAll(fullSelector).length > 0;
    }
    isInvisible(id) {
        if (!id)
            return false;
        const selector = `iframe[src*="/recaptcha/"][src*="/anchor"][name="a-${id}"][src*="&size=invisible"]`;
        return document.querySelectorAll(selector).length > 0;
    }
    /** Whether an active challenge popup is open */
    hasActiveChallengePopup(id) {
        if (!id)
            return false;
        const selector = `iframe[src*="/recaptcha/"][src*="/bframe"][name="c-${id}"]`;
        const elem = document.querySelector(selector);
        if (!elem) {
            return false;
        }
        return this._isInViewport(elem); // note: _isVisible doesn't work here as the outer div is hidden, not the iframe itself
    }
    /** Whether an (invisible) captcha has a challenge bframe - otherwise it's a score based captcha */
    hasChallengeFrame(id) {
        if (!id)
            return false;
        return (document.querySelectorAll(this.getFrameSelectorForId('bframe', id))
            .length > 0);
    }
    isInViewport(id) {
        if (!id)
            return;
        const prefix = 'iframe[src*="recaptcha"]';
        const nameSelectors = [`[name^="a-${id}"]`, `[name^="c-${id}"]`];
        const fullSelector = nameSelectors.map(name => prefix + name).join(',');
        const elem = document.querySelector(fullSelector);
        if (!elem) {
            return false;
        }
        return this._isInViewport(elem);
    }
    getResponseInputById(id) {
        if (!id)
            return;
        const $iframe = this._findVisibleIframeNodeById(id);
        if (!$iframe)
            return;
        const $parentForm = $iframe.closest(`form`);
        if ($parentForm) {
            return $parentForm.querySelector(`[name='g-recaptcha-response']`);
        }
        // Not all reCAPTCHAs are in forms
        // https://github.com/berstend/puppeteer-extra/issues/57
        if (document && document.body) {
            return document.body.querySelector(`[name='g-recaptcha-response']`);
        }
    }
    getClientById(id) {
        if (!id)
            return;
        const clients = this.getClients();
        // Lookup captcha "client" info using extracted id
        let client = Object.values(clients || {})
            .filter(obj => this._getKeyByValue(obj, id))
            .shift(); // returns first entry in array or undefined
        this.log(' - getClientById:client', { id, hasClient: !!client });
        if (!client)
            return;
        try {
            client = this._flattenObject(client);
            client.widgetId = client.id;
            client.id = id;
            this.log(' - getClientById:client:flatten', {
                id,
                hasClient: !!client
            });
        }
        catch (err) {
            this.log(' - getClientById:client ERROR', err.toString());
        }
        return client;
    }
    extractInfoFromClient(client) {
        if (!client)
            return;
        const info = this._pick(['sitekey', 'callback'])(client);
        if (!info.sitekey)
            return;
        info._vendor = 'recaptcha';
        info.id = client.id;
        info.s = client.s; // google site specific
        info.widgetId = client.widgetId;
        info.display = this._pick([
            'size',
            'top',
            'left',
            'width',
            'height',
            'theme'
        ])(client);
        if (client && client.action) {
            info.action = client.action;
        }
        // callbacks can be strings or funtion refs
        if (info.callback && typeof info.callback === 'function') {
            info.callback = info.callback.name || 'anonymous';
        }
        if (document && document.location)
            info.url = document.location.href;
        return info;
    }
    async findRecaptchas() {
        const result = {
            captchas: [],
            error: null
        };
        try {
            await this._waitUntilDocumentReady();
            const clients = this.getClients();
            this.log('findRecaptchas', {
                url: document.location.href,
                hasClients: !!clients
            });
            if (!clients)
                return result;
            result.captchas = this.getIframesIds()
                .map(id => this.getClientById(id))
                .map(client => this.extractInfoFromClient(client))
                .map(info => {
                this.log(' - captchas:info', info);
                if (!info)
                    return;
                const $input = this.getResponseInputById(info.id);
                info.hasResponseElement = !!$input;
                return info;
            })
                .filter(info => !!info && !!info.sitekey)
                .map(info => {
                info.sitekey = info.sitekey.trim();
                info.isEnterprise = this.isEnterpriseCaptcha(info.id);
                info.isInViewport = this.isInViewport(info.id);
                info.isInvisible = this.isInvisible(info.id);
                info._type = 'checkbox';
                if (info.isInvisible) {
                    info._type = 'invisible';
                    info.hasActiveChallengePopup = this.hasActiveChallengePopup(info.id);
                    info.hasChallengeFrame = this.hasChallengeFrame(info.id);
                    if (!info.hasChallengeFrame) {
                        info._type = 'score';
                    }
                }
                return info;
            });
        }
        catch (error) {
            result.error = error;
            return result;
        }
        this.log('findRecaptchas - result', {
            captchaNum: result.captchas.length,
            result
        });
        return result;
    }
    async enterRecaptchaSolutions() {
        const result = {
            solved: [],
            error: null
        };
        try {
            await this._waitUntilDocumentReady();
            const clients = this.getClients();
            this.log('enterRecaptchaSolutions', {
                url: document.location.href,
                hasClients: !!clients,
                solutionNum: this.data.solutions.length
            });
            if (!clients) {
                result.error = 'No recaptchas found';
                return result;
            }
            const solutions = this.data.solutions;
            if (!solutions || !solutions.length) {
                result.error = 'No solutions provided';
                return result;
            }
            result.solved = this.data.solutions.map(solution => {
                const client = this.getClientById(solution.id);
                this.log(' - client', !!client);
                const solved = {
                    _vendor: 'recaptcha',
                    id: client.id,
                    responseElement: false,
                    responseCallback: false
                };
                const $iframe = this._findVisibleIframeNodeById(solved.id);
                this.log(' - $iframe', !!$iframe);
                if (!$iframe) {
                    solved.error = `Iframe not found for id '${solved.id}'`;
                    return solved;
                }
                if (this.hasActiveChallengePopup(solved.id)) {
                    // Hide if present challenge window
                    this._hideChallengeWindowIfPresent(solved.id);
                }
                // Enter solution in response textarea
                const $input = this.getResponseInputById(solved.id);
                this.log(' - $input', !!$input);
                if ($input) {
                    $input.innerHTML = solution.text;
                    solved.responseElement = true;
                }
                // Enter solution in optional callback
                this.log(' - callback', !!client.callback);
                if (client.callback) {
                    try {
                        this.log(' - callback - type', {
                            typeof: typeof client.callback,
                            value: '' + client.callback
                        });
                        if (typeof client.callback === 'function') {
                            client.callback.call(window, solution.text);
                        }
                        else {
                            eval(client.callback).call(window, solution.text); // tslint:disable-line
                            this.log(' - callback - aftereval');
                        }
                        solved.responseCallback = true;
                    }
                    catch (error) {
                        solved.error = error;
                    }
                }
                // Finishing up
                solved.isSolved = solved.responseCallback || solved.responseElement;
                solved.solvedAt = new Date();
                this._paintCaptchaSolved($iframe);
                this.log(' - solved', solved);
                return solved;
            });
        }
        catch (error) {
            result.error = error;
            return result;
        }
        this.log('enterRecaptchaSolutions - finished', result);
        return result;
    }
}
/*
// Example data

{
    "captchas": [{
        "sitekey": "6LdAUwoUAAAAAH44X453L0tUWOvx11XXXXXXXX",
        "id": "lnfy52r0cccc",
        "widgetId": 0,
        "display": {
            "size": null,
            "top": 23,
            "left": 13,
            "width": 28,
            "height": 28,
            "theme": null
        },
        "url": "https://example.com",
        "hasResponseElement": true
    }],
    "error": null
}

{
    "solutions": [{
        "id": "lnfy52r0cccc",
        "provider": "2captcha",
        "providerCaptchaId": "61109548000",
        "text": "03AF6jDqVSOVODT-wLKZ47U0UXz...",
        "requestAt": "2019-02-09T18:30:43.587Z",
        "responseAt": "2019-02-09T18:30:57.937Z"
    }]
    "error": null
}

{
    "solved": [{
        "id": "lnfy52r0cccc",
        "responseElement": true,
        "responseCallback": false,
        "isSolved": true,
        "solvedAt": {}
    }]
    "error": null
}
*/

const ContentScriptDefaultOpts$1 = {
    visualFeedback: true
};
const ContentScriptDefaultData$1 = {
    solutions: []
};
/**
 * Content script for Hcaptcha handling (runs in browser context)
 * @note External modules are not supported here (due to content script isolation)
 */
class HcaptchaContentScript {
    constructor(opts = ContentScriptDefaultOpts$1, data = ContentScriptDefaultData$1) {
        this.baseUrls = [
            'assets.hcaptcha.com/captcha/v1/',
            'newassets.hcaptcha.com/captcha/v1/',
        ];
        // Workaround for https://github.com/esbuild-kit/tsx/issues/113
        if (typeof globalThis.__name === 'undefined') {
            globalThis.__defProp = Object.defineProperty;
            globalThis.__name = (target, value) => globalThis.__defProp(target, 'name', { value, configurable: true });
        }
        this.opts = opts;
        this.data = data;
    }
    async _waitUntilDocumentReady() {
        return new Promise(function (resolve) {
            if (!document || !window)
                return resolve(null);
            const loadedAlready = /^loaded|^i|^c/.test(document.readyState);
            if (loadedAlready)
                return resolve(null);
            function onReady() {
                resolve(null);
                document.removeEventListener('DOMContentLoaded', onReady);
                window.removeEventListener('load', onReady);
            }
            document.addEventListener('DOMContentLoaded', onReady);
            window.addEventListener('load', onReady);
        });
    }
    _paintCaptchaBusy($iframe) {
        try {
            if (this.opts.visualFeedback) {
                $iframe.style.filter = `opacity(60%) hue-rotate(400deg)`; // violet
            }
        }
        catch (error) {
            // noop
        }
        return $iframe;
    }
    /** Regular checkboxes */
    _findRegularCheckboxes() {
        const nodeList = document.querySelectorAll(this.baseUrls.map(url => `iframe[src*='${url}'][data-hcaptcha-widget-id]:not([src*='invisible'])`).join(','));
        return Array.from(nodeList);
    }
    /** Find active challenges from invisible hcaptchas */
    _findActiveChallenges() {
        const nodeList = document.querySelectorAll(this.baseUrls.map(url => `div[style*='visible'] iframe[src*='${url}'][src*='hcaptcha.html']`).join(','));
        return Array.from(nodeList);
    }
    _extractInfoFromIframes(iframes) {
        return iframes
            .map(el => el.src.replace('.html#', '.html?'))
            .map(url => {
            const { searchParams } = new URL(url);
            const result = {
                _vendor: 'hcaptcha',
                url: document.location.href,
                id: searchParams.get('id'),
                sitekey: searchParams.get('sitekey'),
                display: {
                    size: searchParams.get('size') || 'normal'
                }
            };
            return result;
        });
    }
    async findRecaptchas() {
        const result = {
            captchas: [],
            error: null
        };
        try {
            await this._waitUntilDocumentReady();
            const iframes = [
                ...this._findRegularCheckboxes(),
                ...this._findActiveChallenges()
            ];
            if (!iframes.length) {
                return result;
            }
            result.captchas = this._extractInfoFromIframes(iframes);
            iframes.forEach(el => {
                this._paintCaptchaBusy(el);
            });
        }
        catch (error) {
            result.error = error;
            return result;
        }
        return result;
    }
    async enterRecaptchaSolutions() {
        const result = {
            solved: [],
            error: null
        };
        try {
            await this._waitUntilDocumentReady();
            const solutions = this.data.solutions;
            if (!solutions || !solutions.length) {
                result.error = 'No solutions provided';
                return result;
            }
            result.solved = solutions
                .filter(solution => solution._vendor === 'hcaptcha')
                .filter(solution => solution.hasSolution === true)
                .map(solution => {
                window.postMessage(JSON.stringify({
                    id: solution.id,
                    label: 'challenge-closed',
                    source: 'hcaptcha',
                    contents: {
                        event: 'challenge-passed',
                        expiration: 120,
                        response: solution.text
                    }
                }), '*');
                return {
                    _vendor: solution._vendor,
                    id: solution.id,
                    isSolved: true,
                    solvedAt: new Date()
                };
            });
        }
        catch (error) {
            result.error = error;
            return result;
        }
        return result;
    }
}

// https://github.com/bochkarev-artem/2captcha/blob/master/index.js
// TODO: Create our own API wrapper
var https = __webpack_require__(7211);
var url = __webpack_require__(8835);
var querystring = __webpack_require__(1191);
var apiKey;
var apiInUrl = 'https://2captcha.com/in.php';
var apiResUrl = 'https://2captcha.com/res.php';
var SOFT_ID = '2589';
var defaultOptions = {
    pollingInterval: 2000,
    retries: 3
};
function pollCaptcha(captchaId, options, invalid, callback) {
    invalid = invalid.bind({ options: options, captchaId: captchaId });
    var intervalId = setInterval(function () {
        var httpsRequestOptions = url.parse(apiResUrl +
            '?action=get&soft_id=' +
            SOFT_ID +
            '&key=' +
            apiKey +
            '&id=' +
            captchaId);
        var request = https.request(httpsRequestOptions, function (response) {
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function () {
                if (body === 'CAPCHA_NOT_READY') {
                    return;
                }
                clearInterval(intervalId);
                var result = body.split('|');
                if (result[0] !== 'OK') {
                    callback(result[0]); //error
                }
                else {
                    callback(null, {
                        id: captchaId,
                        text: result[1]
                    }, invalid);
                }
                callback = function () { }; // prevent the callback from being called more than once, if multiple https requests are open at the same time.
            });
        });
        request.on('error', function (e) {
            request.destroy();
            callback(e);
        });
        request.end();
    }, options.pollingInterval || defaultOptions.pollingInterval);
}
const setApiKey = function (key) {
    apiKey = key;
};
const decodeReCaptcha = function (captchaMethod, captcha, pageUrl, extraData, options, callback) {
    if (!callback) {
        callback = options;
        options = defaultOptions;
    }
    var httpsRequestOptions = url.parse(apiInUrl);
    httpsRequestOptions.method = 'POST';
    var postData = Object.assign({ method: captchaMethod, key: apiKey, soft_id: SOFT_ID, 
        // googlekey: captcha,
        pageurl: pageUrl }, extraData);
    if (captchaMethod === 'userrecaptcha') {
        postData.googlekey = captcha;
    }
    if (captchaMethod === 'hcaptcha') {
        postData.sitekey = captcha;
    }
    postData = querystring.stringify(postData);
    var request = https.request(httpsRequestOptions, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            var result = body.split('|');
            if (result[0] !== 'OK') {
                return callback(result[0]);
            }
            pollCaptcha(result[1], options, function (error) {
                var callbackToInitialCallback = callback;
                report(this.captchaId);
                if (error) {
                    return callbackToInitialCallback('CAPTCHA_FAILED');
                }
                if (!this.options.retries) {
                    this.options.retries = defaultOptions.retries;
                }
                if (this.options.retries > 1) {
                    this.options.retries = this.options.retries - 1;
                    decodeReCaptcha(captchaMethod, captcha, pageUrl, extraData, this.options, callback);
                }
                else {
                    callbackToInitialCallback('CAPTCHA_FAILED_TOO_MANY_TIMES');
                }
            }, callback);
        });
    });
    request.on('error', function (e) {
        request.destroy();
        callback(e);
    });
    request.write(postData);
    request.end();
};
const report = function (captchaId) {
    var reportUrl = apiResUrl +
        '?action=reportbad&soft_id=' +
        SOFT_ID +
        '&key=' +
        apiKey +
        '&id=' +
        captchaId;
    var options = url.parse(reportUrl);
    var request = https.request(options, function (response) {
        // var body = ''
        // response.on('data', function(chunk) {
        //   body += chunk
        // })
        // response.on('end', function() {})
    });
    request.end();
};

const PROVIDER_ID = '2captcha';
const debug = Debug(`puppeteer-extra-plugin:recaptcha:${PROVIDER_ID}`);
const secondsBetweenDates = (before, after) => (after.getTime() - before.getTime()) / 1000;
const providerOptsDefaults = {
    useEnterpriseFlag: false,
    useActionValue: true
};
async function decodeRecaptchaAsync(token, vendor, sitekey, url, extraData, opts = { pollingInterval: 2000 }) {
    return new Promise(resolve => {
        const cb = (err, result, invalid) => resolve({ err, result, invalid });
        try {
            setApiKey(token);
            let method = 'userrecaptcha';
            if (vendor === 'hcaptcha') {
                method = 'hcaptcha';
            }
            decodeReCaptcha(method, sitekey, url, extraData, opts, cb);
        }
        catch (error) {
            return resolve({ err: error });
        }
    });
}
async function getSolutions(captchas = [], token = '', opts = {}) {
    opts = Object.assign(Object.assign({}, providerOptsDefaults), opts);
    const solutions = await Promise.all(captchas.map(c => getSolution(c, token, opts)));
    return { solutions, error: solutions.find(s => !!s.error) };
}
async function getSolution(captcha, token, opts) {
    const solution = {
        _vendor: captcha._vendor,
        provider: PROVIDER_ID
    };
    try {
        if (!captcha || !captcha.sitekey || !captcha.url || !captcha.id) {
            throw new Error('Missing data in captcha');
        }
        solution.id = captcha.id;
        solution.requestAt = new Date();
        debug('Requesting solution..', solution);
        const extraData = {};
        if (captcha.s) {
            extraData['data-s'] = captcha.s; // google site specific property
        }
        if (opts.useActionValue && captcha.action) {
            extraData['action'] = captcha.action; // Optional v3/enterprise action
        }
        if (opts.useEnterpriseFlag && captcha.isEnterprise) {
            extraData['enterprise'] = 1;
        }
        if (process.env['2CAPTCHA_PROXY_TYPE'] && process.env['2CAPTCHA_PROXY_ADDRESS']) {
            extraData['proxytype'] = process.env['2CAPTCHA_PROXY_TYPE'].toUpperCase();
            extraData['proxy'] = process.env['2CAPTCHA_PROXY_ADDRESS'];
        }
        const { err, result, invalid } = await decodeRecaptchaAsync(token, captcha._vendor, captcha.sitekey, captcha.url, extraData);
        debug('Got response', { err, result, invalid });
        if (err)
            throw new Error(`${PROVIDER_ID} error: ${err}`);
        if (!result || !result.text || !result.id) {
            throw new Error(`${PROVIDER_ID} error: Missing response data: ${result}`);
        }
        solution.providerCaptchaId = result.id;
        solution.text = result.text;
        solution.responseAt = new Date();
        solution.hasSolution = !!solution.text;
        solution.duration = secondsBetweenDates(solution.requestAt, solution.responseAt);
    }
    catch (error) {
        debug('Error', error);
        solution.error = error.toString();
    }
    return solution;
}

const BuiltinSolutionProviders = [
    {
        id: PROVIDER_ID,
        fn: getSolutions
    }
];
/**
 * A puppeteer-extra plugin to automatically detect and solve reCAPTCHAs.
 * @noInheritDoc
 */
class PuppeteerExtraPluginRecaptcha extends puppeteerExtraPlugin.PuppeteerExtraPlugin {
    constructor(opts) {
        super(opts);
        /** An optional global window object we use for contentscript debug logging */
        this.debugBindingName = '___pepr_cs';
        this.debug('Initialized', this.opts);
        this.contentScriptDebug = this.debug.extend('cs');
    }
    get name() {
        return 'recaptcha';
    }
    get defaults() {
        return {
            visualFeedback: true,
            throwOnError: false,
            solveInViewportOnly: false,
            solveScoreBased: false,
            solveInactiveChallenges: false
        };
    }
    get opts() {
        return super.opts;
    }
    get contentScriptOpts() {
        const { visualFeedback } = this.opts;
        return {
            visualFeedback,
            debugBinding: this.contentScriptDebug.enabled
                ? this.debugBindingName
                : undefined
        };
    }
    _generateContentScript(vendor, fn, data) {
        this.debug('_generateContentScript', vendor, fn, data);
        let scriptSource = RecaptchaContentScript.toString();
        let scriptName = 'RecaptchaContentScript';
        if (vendor === 'hcaptcha') {
            scriptSource = HcaptchaContentScript.toString();
            scriptName = 'HcaptchaContentScript';
        }
        // Some bundlers transform classes to anonymous classes that are assigned to
        // vars (e.g. esbuild). In such cases, `unexpected token '{'` errors are thrown
        // once the script is executed. Let's bring class name back to script in such
        // cases!
        scriptSource = scriptSource.replace(/class \{/, `class ${scriptName} {`);
        return `(async() => {
      const DATA = ${JSON.stringify(data || null)}
      const OPTS = ${JSON.stringify(this.contentScriptOpts)}

      ${scriptSource}
      const script = new ${scriptName}(OPTS, DATA)
      return script.${fn}()
    })()`;
    }
    /** Based on the user defined options we may want to filter out certain captchas (inactive, etc) */
    _filterRecaptchas(recaptchas = []) {
        const results = recaptchas.map((c) => {
            if (c._type === 'invisible' &&
                !c.hasActiveChallengePopup &&
                !this.opts.solveInactiveChallenges) {
                c.filtered = true;
                c.filteredReason = 'solveInactiveChallenges';
            }
            if (c._type === 'score' && !this.opts.solveScoreBased) {
                c.filtered = true;
                c.filteredReason = 'solveScoreBased';
            }
            if (c._type === 'checkbox' &&
                !c.isInViewport &&
                this.opts.solveInViewportOnly) {
                c.filtered = true;
                c.filteredReason = 'solveInViewportOnly';
            }
            if (c.filtered) {
                this.debug('Filtered out captcha based on provided options', {
                    id: c.id,
                    reason: c.filteredReason,
                    captcha: c
                });
            }
            return c;
        });
        return {
            captchas: results.filter(c => !c.filtered),
            filtered: results.filter(c => c.filtered)
        };
    }
    async findRecaptchas(page) {
        this.debug('findRecaptchas');
        // As this might be called very early while recaptcha is still loading
        // we add some extra waiting logic for developer convenience.
        const hasRecaptchaScriptTag = await page.$(`script[src*="/recaptcha/api.js"], script[src*="/recaptcha/enterprise.js"]`);
        this.debug('hasRecaptchaScriptTag', !!hasRecaptchaScriptTag);
        if (hasRecaptchaScriptTag) {
            this.debug('waitForRecaptchaClient - start', new Date());
            await page
                .waitForFunction(`
        (function() {
          return Object.keys((window.___grecaptcha_cfg || {}).clients || {}).length
        })()
      `, { polling: 200, timeout: 10 * 1000 })
                .catch(this.debug);
            this.debug('waitForRecaptchaClient - end', new Date()); // used as timer
        }
        const hasHcaptchaScriptTag = await page.$(`script[src*="hcaptcha.com/1/api.js"]`);
        this.debug('hasHcaptchaScriptTag', !!hasHcaptchaScriptTag);
        if (hasHcaptchaScriptTag) {
            this.debug('wait:hasHcaptchaScriptTag - start', new Date());
            await page.waitForFunction(`
        (function() {
          return window.hcaptcha
        })()
      `, { polling: 200, timeout: 10 * 1000 });
            this.debug('wait:hasHcaptchaScriptTag - end', new Date()); // used as timer
        }
        const onDebugBindingCalled = (message, data) => {
            this.contentScriptDebug(message, data);
        };
        if (this.contentScriptDebug.enabled) {
            if ('exposeFunction' in page) {
                await page.exposeFunction(this.debugBindingName, onDebugBindingCalled);
            }
        }
        // Even without a recaptcha script tag we're trying, just in case.
        const resultRecaptcha = (await page.evaluate(this._generateContentScript('recaptcha', 'findRecaptchas')));
        const resultHcaptcha = (await page.evaluate(this._generateContentScript('hcaptcha', 'findRecaptchas')));
        const filterResults = this._filterRecaptchas(resultRecaptcha.captchas);
        this.debug(`Filter results: ${filterResults.filtered.length} of ${filterResults.captchas.length} captchas filtered from results.`);
        const response = {
            captchas: [...filterResults.captchas, ...resultHcaptcha.captchas],
            filtered: filterResults.filtered,
            error: resultRecaptcha.error || resultHcaptcha.error
        };
        this.debug('findRecaptchas', response);
        if (this.opts.throwOnError && response.error) {
            throw new Error(response.error);
        }
        return response;
    }
    async getRecaptchaSolutions(captchas, provider) {
        this.debug('getRecaptchaSolutions', { captchaNum: captchas.length });
        provider = provider || this.opts.provider;
        if (!provider ||
            (!provider.token && !provider.fn) ||
            (provider.token && provider.token === 'XXXXXXX' && !provider.fn)) {
            throw new Error('Please provide a solution provider to the plugin.');
        }
        let fn = provider.fn;
        if (!fn) {
            const builtinProvider = BuiltinSolutionProviders.find(p => p.id === (provider || {}).id);
            if (!builtinProvider || !builtinProvider.fn) {
                throw new Error(`Cannot find builtin provider with id '${provider.id}'.`);
            }
            fn = builtinProvider.fn;
        }
        const response = await fn.call(this, captchas, provider.token, provider.opts || {});
        response.error =
            response.error ||
                response.solutions.find((s) => !!s.error);
        this.debug('getRecaptchaSolutions', response);
        if (response && response.error) {
            console.warn('PuppeteerExtraPluginRecaptcha: An error occured during "getRecaptchaSolutions":', response.error);
        }
        if (this.opts.throwOnError && response.error) {
            throw new Error(response.error);
        }
        return response;
    }
    async enterRecaptchaSolutions(page, solutions) {
        this.debug('enterRecaptchaSolutions', { solutions });
        const hasRecaptcha = !!solutions.find(s => s._vendor === 'recaptcha');
        const solvedRecaptcha = hasRecaptcha
            ? (await page.evaluate(this._generateContentScript('recaptcha', 'enterRecaptchaSolutions', {
                solutions
            })))
            : { solved: [] };
        const hasHcaptcha = !!solutions.find(s => s._vendor === 'hcaptcha');
        const solvedHcaptcha = hasHcaptcha
            ? (await page.evaluate(this._generateContentScript('hcaptcha', 'enterRecaptchaSolutions', {
                solutions
            })))
            : { solved: [] };
        const response = {
            solved: [...solvedRecaptcha.solved, ...solvedHcaptcha.solved],
            error: solvedRecaptcha.error || solvedHcaptcha.error
        };
        response.error = response.error || response.solved.find(s => !!s.error);
        this.debug('enterRecaptchaSolutions', response);
        if (this.opts.throwOnError && response.error) {
            throw new Error(response.error);
        }
        return response;
    }
    async solveRecaptchas(page) {
        this.debug('solveRecaptchas');
        const response = {
            captchas: [],
            filtered: [],
            solutions: [],
            solved: [],
            error: null
        };
        try {
            // If `this.opts.throwOnError` is set any of the
            // following will throw and abort execution.
            const { captchas, filtered, error: captchasError } = await this.findRecaptchas(page);
            response.captchas = captchas;
            response.filtered = filtered;
            if (captchas.length) {
                const { solutions, error: solutionsError } = await this.getRecaptchaSolutions(response.captchas);
                response.solutions = solutions;
                const { solved, error: solvedError } = await this.enterRecaptchaSolutions(page, response.solutions);
                response.solved = solved;
                response.error = captchasError || solutionsError || solvedError;
            }
        }
        catch (error) {
            response.error = error.toString();
        }
        this.debug('solveRecaptchas', response);
        if (this.opts.throwOnError && response.error) {
            throw new Error(response.error);
        }
        return response;
    }
    _addCustomMethods(prop) {
        prop.findRecaptchas = async () => this.findRecaptchas(prop);
        prop.getRecaptchaSolutions = async (captchas, provider) => this.getRecaptchaSolutions(captchas, provider);
        prop.enterRecaptchaSolutions = async (solutions) => this.enterRecaptchaSolutions(prop, solutions);
        // Add convenience methods that wraps all others
        prop.solveRecaptchas = async () => this.solveRecaptchas(prop);
    }
    async onPageCreated(page) {
        this.debug('onPageCreated', page.url());
        // Make sure we can run our content script
        await page.setBypassCSP(true);
        // Add custom page methods
        this._addCustomMethods(page);
        // Add custom methods to potential frames as well
        page.on('frameattached', frame => {
            if (!frame)
                return;
            this._addCustomMethods(frame);
        });
    }
    /** Add additions to already existing pages and frames */
    async onBrowser(browser) {
        const pages = await browser.pages();
        for (const page of pages) {
            this._addCustomMethods(page);
            for (const frame of page.mainFrame().childFrames()) {
                this._addCustomMethods(frame);
            }
        }
    }
}
/** Default export, PuppeteerExtraPluginRecaptcha  */
const defaultExport = (options) => {
    return new PuppeteerExtraPluginRecaptcha(options || {});
};

exports.BuiltinSolutionProviders = BuiltinSolutionProviders;
exports.PuppeteerExtraPluginRecaptcha = PuppeteerExtraPluginRecaptcha;
exports.default = defaultExport;


  module.exports = exports.default || {}
  Object.entries(exports).forEach(([key, value]) => { module.exports[key] = value })
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 4561:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { PuppeteerExtraPlugin } = __webpack_require__(8873)

/**
 * Stealth mode: Applies various techniques to make detection of headless puppeteer harder. 💯
 *
 * ### Purpose
 * There are a couple of ways the use of puppeteer can easily be detected by a target website.
 * The addition of `HeadlessChrome` to the user-agent being only the most obvious one.
 *
 * The goal of this plugin is to be the definite companion to puppeteer to avoid
 * detection, applying new techniques as they surface.
 *
 * As this cat & mouse game is in it's infancy and fast-paced the plugin
 * is kept as flexibile as possible, to support quick testing and iterations.
 *
 * ### Modularity
 * This plugin uses `puppeteer-extra`'s dependency system to only require
 * code mods for evasions that have been enabled, to keep things modular and efficient.
 *
 * The `stealth` plugin is a convenience wrapper that requires multiple [evasion techniques](./evasions/)
 * automatically and comes with defaults. You could also bypass the main module and require
 * specific evasion plugins yourself, if you whish to do so (as they're standalone `puppeteer-extra` plugins):
 *
 * ```es6
 * // bypass main module and require a specific stealth plugin directly:
 * puppeteer.use(require('puppeteer-extra-plugin-stealth/evasions/console.debug')())
 * ```
 *
 * ### Contributing
 * PRs are welcome, if you want to add a new evasion technique I suggest you
 * look at the [template](./evasions/_template) to kickstart things.
 *
 * ### Kudos
 * Thanks to [Evan Sangaline](https://intoli.com/blog/not-possible-to-block-chrome-headless/) and [Paul Irish](https://github.com/paulirish/headless-cat-n-mouse) for kickstarting the discussion!
 *
 * ---
 *
 * @todo
 * - white-/blacklist with url globs (make this a generic plugin method?)
 * - dynamic whitelist based on function evaluation
 *
 * @example
 * const puppeteer = require('puppeteer-extra')
 * // Enable stealth plugin with all evasions
 * puppeteer.use(require('puppeteer-extra-plugin-stealth')())
 *
 *
 * ;(async () => {
 *   // Launch the browser in headless mode and set up a page.
 *   const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })
 *   const page = await browser.newPage()
 *
 *   // Navigate to the page that will perform the tests.
 *   const testUrl = 'https://intoli.com/blog/' +
 *     'not-possible-to-block-chrome-headless/chrome-headless-test.html'
 *   await page.goto(testUrl)
 *
 *   // Save a screenshot of the results.
 *   const screenshotPath = '/tmp/headless-test-result.png'
 *   await page.screenshot({path: screenshotPath})
 *   console.log('have a look at the screenshot:', screenshotPath)
 *
 *   await browser.close()
 * })()
 *
 * @param {Object} [opts] - Options
 * @param {Set<string>} [opts.enabledEvasions] - Specify which evasions to use (by default all)
 *
 */
class StealthPlugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'stealth'
  }

  get defaults() {
    const availableEvasions = new Set([
      'chrome.app',
      'chrome.csi',
      'chrome.loadTimes',
      'chrome.runtime',
      'defaultArgs',
      'iframe.contentWindow',
      'media.codecs',
      'navigator.hardwareConcurrency',
      'navigator.languages',
      'navigator.permissions',
      'navigator.plugins',
      'navigator.webdriver',
      'sourceurl',
      'user-agent-override',
      'webgl.vendor',
      'window.outerdimensions'
    ])
    return {
      availableEvasions,
      // Enable all available evasions by default
      enabledEvasions: new Set([...availableEvasions])
    }
  }

  /**
   * Requires evasion techniques dynamically based on configuration.
   *
   * @private
   */
  get dependencies() {
    return new Set(
      [...this.opts.enabledEvasions].map(e => `${this.name}/evasions/${e}`)
    )
  }

  /**
   * Get all available evasions.
   *
   * Please look into the [evasions directory](./evasions/) for an up to date list.
   *
   * @type {Set<string>} - A Set of all available evasions.
   *
   * @example
   * const pluginStealth = require('puppeteer-extra-plugin-stealth')()
   * console.log(pluginStealth.availableEvasions) // => Set { 'user-agent', 'console.debug' }
   * puppeteer.use(pluginStealth)
   */
  get availableEvasions() {
    return this.defaults.availableEvasions
  }

  /**
   * Get all enabled evasions.
   *
   * Enabled evasions can be configured either through `opts` or by modifying this property.
   *
   * @type {Set<string>} - A Set of all enabled evasions.
   *
   * @example
   * // Remove specific evasion from enabled ones dynamically
   * const pluginStealth = require('puppeteer-extra-plugin-stealth')()
   * pluginStealth.enabledEvasions.delete('console.debug')
   * puppeteer.use(pluginStealth)
   */
  get enabledEvasions() {
    return this.opts.enabledEvasions
  }

  /**
   * @private
   */
  set enabledEvasions(evasions) {
    this.opts.enabledEvasions = evasions
  }

  async onBrowser(browser) {
    if (browser && browser.setMaxListeners) {
      // Increase event emitter listeners to prevent MaxListenersExceededWarning
      browser.setMaxListeners(30)
    }
  }
}

/**
 * Default export, PuppeteerExtraStealthPlugin
 *
 * @param {Object} [opts] - Options
 * @param {Set<string>} [opts.enabledEvasions] - Specify which evasions to use (by default all)
 */
const defaultExport = opts => new StealthPlugin(opts)
module.exports = defaultExport

// const moduleExport = defaultExport
// moduleExport.StealthPlugin = StealthPlugin
// module.exports = moduleExport


/***/ }),

/***/ 8873:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * puppeteer-extra-plugin v3.2.2 by berstend
 * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin
 * @license MIT
 */


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var debug = _interopDefault(__webpack_require__(8237));

/** @private */
const merge = __webpack_require__(3993);
/**
 * Base class for `puppeteer-extra` plugins.
 *
 * Provides convenience methods to avoid boilerplate.
 *
 * All common `puppeteer` browser events will be bound to
 * the plugin instance, if a respectively named class member is found.
 *
 * Please refer to the [puppeteer API documentation](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) as well.
 *
 * @example
 * // hello-world-plugin.js
 * const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')
 *
 * class Plugin extends PuppeteerExtraPlugin {
 *   constructor (opts = { }) { super(opts) }
 *
 *   get name () { return 'hello-world' }
 *
 *   async onPageCreated (page) {
 *     this.debug('page created', page.url())
 *     const ua = await page.browser().userAgent()
 *     this.debug('user agent', ua)
 *   }
 * }
 *
 * module.exports = function (pluginConfig) { return new Plugin(pluginConfig) }
 *
 *
 * // foo.js
 * const puppeteer = require('puppeteer-extra')
 * puppeteer.use(require('./hello-world-plugin')())
 *
 * ;(async () => {
 *   const browser = await puppeteer.launch({headless: false})
 *   const page = await browser.newPage()
 *   await page.goto('http://example.com', {waitUntil: 'domcontentloaded'})
 *   await browser.close()
 * })()
 *
 */
class PuppeteerExtraPlugin {
    constructor(opts) {
        this._debugBase = debug(`puppeteer-extra-plugin:base:${this.name}`);
        this._childClassMembers = [];
        this._opts = merge(this.defaults, opts || {});
        this._debugBase('Initialized.');
    }
    /**
     * Plugin name (required).
     *
     * Convention:
     * - Package: `puppeteer-extra-plugin-anonymize-ua`
     * - Name: `anonymize-ua`
     *
     * @example
     * get name () { return 'anonymize-ua' }
     */
    get name() {
        throw new Error('Plugin must override "name"');
    }
    /**
     * Plugin defaults (optional).
     *
     * If defined will be ([deep-](https://github.com/jonschlinkert/merge-deep))merged with the (optional) user supplied options (supplied during plugin instantiation).
     *
     * The result of merging defaults with user supplied options can be accessed through `this.opts`.
     *
     * @see [[opts]]
     *
     * @example
     * get defaults () {
     *   return {
     *     stripHeadless: true,
     *     makeWindows: true,
     *     customFn: null
     *   }
     * }
     *
     * // Users can overwrite plugin defaults during instantiation:
     * puppeteer.use(require('puppeteer-extra-plugin-foobar')({ makeWindows: false }))
     */
    get defaults() {
        return {};
    }
    /**
     * Plugin requirements (optional).
     *
     * Signal certain plugin requirements to the base class and the user.
     *
     * Currently supported:
     * - `launch`
     *   - If the plugin only supports locally created browser instances (no `puppeteer.connect()`),
     *     will output a warning to the user.
     * - `headful`
     *   - If the plugin doesn't work in `headless: true` mode,
     *     will output a warning to the user.
     * - `dataFromPlugins`
     *   - In case the plugin requires data from other plugins.
     *     will enable usage of `this.getDataFromPlugins()`.
     * - `runLast`
     *   - In case the plugin prefers to run after the others.
     *     Useful when the plugin needs data from others.
     *
     * @example
     * get requirements () {
     *   return new Set(['runLast', 'dataFromPlugins'])
     * }
     */
    get requirements() {
        return new Set([]);
    }
    /**
     * Plugin dependencies (optional).
     *
     * Missing plugins will be required() by puppeteer-extra.
     *
     * @example
     * get dependencies () {
     *   return new Set(['user-preferences'])
     * }
     * // Will ensure the 'puppeteer-extra-plugin-user-preferences' plugin is loaded.
     */
    get dependencies() {
        return new Set([]);
    }
    /**
     * Plugin data (optional).
     *
     * Plugins can expose data (an array of objects), which in turn can be consumed by other plugins,
     * that list the `dataFromPlugins` requirement (by using `this.getDataFromPlugins()`).
     *
     * Convention: `[ {name: 'Any name', value: 'Any value'} ]`
     *
     * @see [[getDataFromPlugins]]
     *
     * @example
     * // plugin1.js
     * get data () {
     *   return [
     *     {
     *       name: 'userPreferences',
     *       value: { foo: 'bar' }
     *     },
     *     {
     *       name: 'userPreferences',
     *       value: { hello: 'world' }
     *     }
     *   ]
     *
     * // plugin2.js
     * get requirements () { return new Set(['dataFromPlugins']) }
     *
     * async beforeLaunch () {
     *   const prefs = this.getDataFromPlugins('userPreferences').map(d => d.value)
     *   this.debug(prefs) // => [ { foo: 'bar' }, { hello: 'world' } ]
     * }
     */
    get data() {
        return [];
    }
    /**
     * Access the plugin options (usually the `defaults` merged with user defined options)
     *
     * To skip the auto-merging of defaults with user supplied opts don't define a `defaults`
     * property and set the `this._opts` Object in your plugin constructor directly.
     *
     * @see [[defaults]]
     *
     * @example
     * get defaults () { return { foo: "bar" } }
     *
     * async onPageCreated (page) {
     *   this.debug(this.opts.foo) // => bar
     * }
     */
    get opts() {
        return this._opts;
    }
    /**
     *  Convenience debug logger based on the [debug] module.
     *  Will automatically namespace the logging output to the plugin package name.
     *  [debug]: https://www.npmjs.com/package/debug
     *
     *  ```bash
     *  # toggle output using environment variables
     *  DEBUG=puppeteer-extra-plugin:<plugin_name> node foo.js
     *  # to debug all the things:
     *  DEBUG=puppeteer-extra,puppeteer-extra-plugin:* node foo.js
     *  ```
     *
     * @example
     * this.debug('hello world')
     * // will output e.g. 'puppeteer-extra-plugin:anonymize-ua hello world'
     */
    get debug() {
        return debug(`puppeteer-extra-plugin:${this.name}`);
    }
    /**
     * Before a new browser instance is created/launched.
     *
     * Can be used to modify the puppeteer launch options by modifying or returning them.
     *
     * Plugins using this method will be called in sequence to each
     * be able to update the launch options.
     *
     * @example
     * async beforeLaunch (options) {
     *   if (this.opts.flashPluginPath) {
     *     options.args.push(`--ppapi-flash-path=${this.opts.flashPluginPath}`)
     *   }
     * }
     *
     * @param options - Puppeteer launch options
     */
    async beforeLaunch(options) {
        // noop
    }
    /**
     * After the browser has launched.
     *
     * Note: Don't assume that there will only be a single browser instance during the lifecycle of a plugin.
     * It's possible that `pupeeteer.launch` will be  called multiple times and more than one browser created.
     * In order to make the plugins as stateless as possible don't store a reference to the browser instance
     * in the plugin but rather consider alternatives.
     *
     * E.g. when using `onPageCreated` you can get a browser reference by using `page.browser()`.
     *
     * Alternatively you could expose a class method that takes a browser instance as a parameter to work with:
     *
     * ```es6
     * const fancyPlugin = require('puppeteer-extra-plugin-fancy')()
     * puppeteer.use(fancyPlugin)
     * const browser = await puppeteer.launch()
     * await fancyPlugin.killBrowser(browser)
     * ```
     *
     * @param  browser - The `puppeteer` browser instance.
     * @param  opts.options - Puppeteer launch options used.
     *
     * @example
     * async afterLaunch (browser, opts) {
     *   this.debug('browser has been launched', opts.options)
     * }
     */
    async afterLaunch(browser, opts = { options: {} }) {
        // noop
    }
    /**
     * Before connecting to an existing browser instance.
     *
     * Can be used to modify the puppeteer connect options by modifying or returning them.
     *
     * Plugins using this method will be called in sequence to each
     * be able to update the launch options.
     *
     * @param  {Object} options - Puppeteer connect options
     * @return {Object=}
     */
    async beforeConnect(options) {
        // noop
    }
    /**
     * After connecting to an existing browser instance.
     *
     * > Note: Don't assume that there will only be a single browser instance during the lifecycle of a plugin.
     *
     * @param browser - The `puppeteer` browser instance.
     * @param  {Object} opts
     * @param  {Object} opts.options - Puppeteer connect options used.
     *
     */
    async afterConnect(browser, opts = {}) {
        // noop
    }
    /**
     * Called when a browser instance is available.
     *
     * This applies to both `puppeteer.launch()` and `puppeteer.connect()`.
     *
     * Convenience method created for plugins that need access to a browser instance
     * and don't mind if it has been created through `launch` or `connect`.
     *
     * > Note: Don't assume that there will only be a single browser instance during the lifecycle of a plugin.
     *
     * @param browser - The `puppeteer` browser instance.
     */
    async onBrowser(browser, opts) {
        // noop
    }
    /**
     * Called when a target is created, for example when a new page is opened by window.open or browser.newPage.
     *
     * > Note: This includes target creations in incognito browser contexts.
     *
     * > Note: This includes browser instances created through `.launch()` as well as `.connect()`.
     *
     * @param  {Puppeteer.Target} target
     */
    async onTargetCreated(target) {
        // noop
    }
    /**
     * Same as `onTargetCreated` but prefiltered to only contain Pages, for convenience.
     *
     * > Note: This includes page creations in incognito browser contexts.
     *
     * > Note: This includes browser instances created through `.launch()` as well as `.connect()`.
     *
     * @param  {Puppeteer.Target} target
     *
     * @example
     * async onPageCreated (page) {
     *   let ua = await page.browser().userAgent()
     *   if (this.opts.stripHeadless) {
     *     ua = ua.replace('HeadlessChrome/', 'Chrome/')
     *   }
     *   this.debug('new ua', ua)
     *   await page.setUserAgent(ua)
     * }
     */
    async onPageCreated(page) {
        // noop
    }
    /**
     * Called when the url of a target changes.
     *
     * > Note: This includes target changes in incognito browser contexts.
     *
     * > Note: This includes browser instances created through `.launch()` as well as `.connect()`.
     *
     * @param  {Puppeteer.Target} target
     */
    async onTargetChanged(target) {
        // noop
    }
    /**
     * Called when a target is destroyed, for example when a page is closed.
     *
     * > Note: This includes target destructions in incognito browser contexts.
     *
     * > Note: This includes browser instances created through `.launch()` as well as `.connect()`.
     *
     * @param  {Puppeteer.Target} target
     */
    async onTargetDestroyed(target) {
        // noop
    }
    /**
     * Called when Puppeteer gets disconnected from the Chromium instance.
     *
     * This might happen because of one of the following:
     * - Chromium is closed or crashed
     * - The `browser.disconnect` method was called
     */
    async onDisconnected() {
        // noop
    }
    /**
     * **Deprecated:** Since puppeteer v1.6.0 `onDisconnected` has been improved
     * and should be used instead of `onClose`.
     *
     * In puppeteer < v1.6.0 `onDisconnected` was not catching all exit scenarios.
     * In order for plugins to clean up properly (e.g. deleting temporary files)
     * the `onClose` method had been introduced.
     *
     * > Note: Might be called multiple times on exit.
     *
     * > Note: This only includes browser instances created through `.launch()`.
     */
    async onClose() {
        // noop
    }
    /**
     * After the plugin has been registered in `puppeteer-extra`.
     *
     * Normally right after `puppeteer.use(plugin)` is called
     */
    async onPluginRegistered() {
        // noop
    }
    /**
     * Helper method to retrieve `data` objects from other plugins.
     *
     * A plugin needs to state the `dataFromPlugins` requirement
     * in order to use this method. Will be mapped to `puppeteer.getPluginData`.
     *
     * @param name - Filter data by `name` property
     *
     * @see [data]
     * @see [requirements]
     */
    getDataFromPlugins(name) {
        return [];
    }
    /**
     * Will match plugin dependencies against all currently registered plugins.
     * Is being called by `puppeteer-extra` and used to require missing dependencies.
     *
     * @param  {Array<Object>} plugins
     * @return {Set} - list of missing plugin names
     *
     * @private
     */
    _getMissingDependencies(plugins) {
        const pluginNames = new Set(plugins.map((p) => p.name));
        const missing = new Set(Array.from(this.dependencies.values()).filter(x => !pluginNames.has(x)));
        return missing;
    }
    /**
     * Conditionally bind browser/process events to class members.
     * The idea is to reduce event binding boilerplate in plugins.
     *
     * For efficiency we make sure the plugin is using the respective event
     * by checking the child class members before registering the listener.
     *
     * @param  {<Puppeteer.Browser>} browser
     * @param  {Object} opts - Options
     * @param  {string} opts.context - Puppeteer context (launch/connect)
     * @param  {Object} [opts.options] - Puppeteer launch or connect options
     * @param  {Array<string>} [opts.defaultArgs] - The default flags that Chromium will be launched with
     *
     * @private
     */
    async _bindBrowserEvents(browser, opts = {}) {
        if (this._hasChildClassMember('onTargetCreated') ||
            this._hasChildClassMember('onPageCreated')) {
            browser.on('targetcreated', this._onTargetCreated.bind(this));
        }
        if (this._hasChildClassMember('onTargetChanged') && this.onTargetChanged) {
            browser.on('targetchanged', this.onTargetChanged.bind(this));
        }
        if (this._hasChildClassMember('onTargetDestroyed') &&
            this.onTargetDestroyed) {
            browser.on('targetdestroyed', this.onTargetDestroyed.bind(this));
        }
        if (this._hasChildClassMember('onDisconnected') && this.onDisconnected) {
            browser.on('disconnected', this.onDisconnected.bind(this));
        }
        if (opts.context === 'launch' && this._hasChildClassMember('onClose')) {
            // The disconnect event has been improved since puppeteer v1.6.0
            // onClose is being kept mostly for legacy reasons
            if (this.onClose) {
                process.on('exit', this.onClose.bind(this));
                browser.on('disconnected', this.onClose.bind(this));
                if (opts.options.handleSIGINT !== false) {
                    process.on('SIGINT', this.onClose.bind(this));
                }
                if (opts.options.handleSIGTERM !== false) {
                    process.on('SIGTERM', this.onClose.bind(this));
                }
                if (opts.options.handleSIGHUP !== false) {
                    process.on('SIGHUP', this.onClose.bind(this));
                }
            }
        }
        if (opts.context === 'launch' && this.afterLaunch) {
            await this.afterLaunch(browser, opts);
        }
        if (opts.context === 'connect' && this.afterConnect) {
            await this.afterConnect(browser, opts);
        }
        if (this.onBrowser)
            await this.onBrowser(browser, opts);
    }
    /**
     * @private
     */
    async _onTargetCreated(target) {
        if (this.onTargetCreated)
            await this.onTargetCreated(target);
        // Pre filter pages for plugin developers convenience
        if (target.type() === 'page') {
            try {
                const page = await target.page();
                if (!page) {
                    return;
                }
                const validPage = 'isClosed' in page && !page.isClosed();
                if (this.onPageCreated && validPage) {
                    await this.onPageCreated(page);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    /**
     * @private
     */
    _register(prototype) {
        this._registerChildClassMembers(prototype);
        if (this.onPluginRegistered)
            this.onPluginRegistered();
    }
    /**
     * @private
     */
    _registerChildClassMembers(prototype) {
        this._childClassMembers = Object.getOwnPropertyNames(prototype);
    }
    /**
     * @private
     */
    _hasChildClassMember(name) {
        return !!this._childClassMembers.includes(name);
    }
    /**
     * @private
     */
    get _isPuppeteerExtraPlugin() {
        return true;
    }
}

exports.PuppeteerExtraPlugin = PuppeteerExtraPlugin;
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 8683:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/*!
 * puppeteer-extra v3.3.5 by berstend
 * https://github.com/berstend/puppeteer-extra
 * @license MIT
 */


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Debug = _interopDefault(__webpack_require__(8237));
var merge = _interopDefault(__webpack_require__(6323));

const debug = Debug('puppeteer-extra');
/**
 * Modular plugin framework to teach `puppeteer` new tricks.
 *
 * This module acts as a drop-in replacement for `puppeteer`.
 *
 * Allows PuppeteerExtraPlugin's to register themselves and
 * to extend puppeteer with additional functionality.
 *
 * @class PuppeteerExtra
 * @implements {VanillaPuppeteer}
 *
 * @example
 * const puppeteer = require('puppeteer-extra')
 * puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
 * puppeteer.use(require('puppeteer-extra-plugin-font-size')({defaultFontSize: 18}))
 *
 * ;(async () => {
 *   const browser = await puppeteer.launch({headless: false})
 *   const page = await browser.newPage()
 *   await page.goto('http://example.com', {waitUntil: 'domcontentloaded'})
 *   await browser.close()
 * })()
 */
class PuppeteerExtra {
    constructor(_pptr, _requireError) {
        this._pptr = _pptr;
        this._requireError = _requireError;
        this._plugins = [];
    }
    /**
     * The **main interface** to register `puppeteer-extra` plugins.
     *
     * @example
     * puppeteer.use(plugin1).use(plugin2)
     *
     * @see [PuppeteerExtraPlugin]
     *
     * @return The same `PuppeteerExtra` instance (for optional chaining)
     */
    use(plugin) {
        if (typeof plugin !== 'object' || !plugin._isPuppeteerExtraPlugin) {
            console.error(`Warning: Plugin is not derived from PuppeteerExtraPlugin, ignoring.`, plugin);
            return this;
        }
        if (!plugin.name) {
            console.error(`Warning: Plugin with no name registering, ignoring.`, plugin);
            return this;
        }
        if (plugin.requirements.has('dataFromPlugins')) {
            plugin.getDataFromPlugins = this.getPluginData.bind(this);
        }
        plugin._register(Object.getPrototypeOf(plugin));
        this._plugins.push(plugin);
        debug('plugin registered', plugin.name);
        return this;
    }
    /**
     * To stay backwards compatible with puppeteer's (and our) default export after adding `addExtra`
     * we need to defer the check if we have a puppeteer instance to work with.
     * Otherwise we would throw even if the user intends to use their non-standard puppeteer implementation.
     *
     * @private
     */
    get pptr() {
        if (this._pptr) {
            return this._pptr;
        }
        // Whoopsie
        console.warn(`
    Puppeteer is missing. :-)

    Note: puppeteer is a peer dependency of puppeteer-extra,
    which means you can install your own preferred version.

    - To get the latest stable version run: 'yarn add puppeteer' or 'npm i puppeteer'

    Alternatively:
    - To get puppeteer without the bundled Chromium browser install 'puppeteer-core'
    `);
        throw this._requireError || new Error('No puppeteer instance provided.');
    }
    /**
     * The method launches a browser instance with given arguments. The browser will be closed when the parent node.js process is closed.
     *
     * Augments the original `puppeteer.launch` method with plugin lifecycle methods.
     *
     * All registered plugins that have a `beforeLaunch` method will be called
     * in sequence to potentially update the `options` Object before launching the browser.
     *
     * @example
     * const browser = await puppeteer.launch({
     *   headless: false,
     *   defaultViewport: null
     * })
     *
     * @param options - See [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).
     */
    async launch(options) {
        // Ensure there are certain properties (e.g. the `options.args` array)
        const defaultLaunchOptions = { args: [] };
        options = merge(defaultLaunchOptions, options || {});
        this.resolvePluginDependencies();
        this.orderPlugins();
        // Give plugins the chance to modify the options before launch
        options = await this.callPluginsWithValue('beforeLaunch', options);
        const opts = {
            context: 'launch',
            options,
            defaultArgs: this.defaultArgs
        };
        // Let's check requirements after plugin had the chance to modify the options
        this.checkPluginRequirements(opts);
        const browser = await this.pptr.launch(options);
        this._patchPageCreationMethods(browser);
        await this.callPlugins('_bindBrowserEvents', browser, opts);
        return browser;
    }
    /**
     * Attach Puppeteer to an existing Chromium instance.
     *
     * Augments the original `puppeteer.connect` method with plugin lifecycle methods.
     *
     * All registered plugins that have a `beforeConnect` method will be called
     * in sequence to potentially update the `options` Object before launching the browser.
     *
     * @param options - See [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions).
     */
    async connect(options) {
        this.resolvePluginDependencies();
        this.orderPlugins();
        // Give plugins the chance to modify the options before connect
        options = await this.callPluginsWithValue('beforeConnect', options);
        const opts = { context: 'connect', options };
        // Let's check requirements after plugin had the chance to modify the options
        this.checkPluginRequirements(opts);
        const browser = await this.pptr.connect(options);
        this._patchPageCreationMethods(browser);
        await this.callPlugins('_bindBrowserEvents', browser, opts);
        return browser;
    }
    /**
     * The default flags that Chromium will be launched with.
     *
     * @param options - See [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerdefaultargsoptions).
     */
    defaultArgs(options) {
        return this.pptr.defaultArgs(options);
    }
    /** Path where Puppeteer expects to find bundled Chromium. */
    executablePath() {
        return this.pptr.executablePath();
    }
    /**
     * This methods attaches Puppeteer to an existing Chromium instance.
     *
     * @param options - See [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteercreatebrowserfetcheroptions).
     */
    createBrowserFetcher(options) {
        return this.pptr.createBrowserFetcher(options);
    }
    /**
     * Patch page creation methods (both regular and incognito contexts).
     *
     * Unfortunately it's possible that the `targetcreated` events are not triggered
     * early enough for listeners (e.g. plugins using `onPageCreated`) to be able to
     * modify the page instance (e.g. user-agent) before the browser request occurs.
     *
     * This only affects the first request of a newly created page target.
     *
     * As a workaround I've noticed that navigating to `about:blank` (again),
     * right after a page has been created reliably fixes this issue and adds
     * no noticable delay or side-effects.
     *
     * This problem is not specific to `puppeteer-extra` but default Puppeteer behaviour.
     *
     * Note: This patch only fixes explicitly created pages, implicitly created ones
     * (e.g. through `window.open`) are still subject to this issue. I didn't find a
     * reliable mitigation for implicitly created pages yet.
     *
     * Puppeteer issues:
     * https://github.com/GoogleChrome/puppeteer/issues/2669
     * https://github.com/puppeteer/puppeteer/issues/3667
     * https://github.com/GoogleChrome/puppeteer/issues/386#issuecomment-343059315
     * https://github.com/GoogleChrome/puppeteer/issues/1378#issue-273733905
     *
     * @private
     */
    _patchPageCreationMethods(browser) {
        if (!browser._createPageInContext) {
            debug('warning: _patchPageCreationMethods failed (no browser._createPageInContext)');
            return;
        }
        browser._createPageInContext = (function (originalMethod, context) {
            return async function () {
                const page = await originalMethod.apply(context, arguments);
                await page.goto('about:blank');
                return page;
            };
        })(browser._createPageInContext, browser);
    }
    /**
     * Get a list of all registered plugins.
     *
     * @member {Array<PuppeteerExtraPlugin>}
     */
    get plugins() {
        return this._plugins;
    }
    /**
     * Get the names of all registered plugins.
     *
     * @member {Array<string>}
     * @private
     */
    get pluginNames() {
        return this._plugins.map(p => p.name);
    }
    /**
     * Collects the exposed `data` property of all registered plugins.
     * Will be reduced/flattened to a single array.
     *
     * Can be accessed by plugins that listed the `dataFromPlugins` requirement.
     *
     * Implemented mainly for plugins that need data from other plugins (e.g. `user-preferences`).
     *
     * @see [PuppeteerExtraPlugin]/data
     * @param name - Filter data by optional plugin name
     *
     * @private
     */
    getPluginData(name) {
        const data = this._plugins
            .map(p => (Array.isArray(p.data) ? p.data : [p.data]))
            .reduce((acc, arr) => [...acc, ...arr], []);
        return name ? data.filter((d) => d.name === name) : data;
    }
    /**
     * Get all plugins that feature a given property/class method.
     *
     * @private
     */
    getPluginsByProp(prop) {
        return this._plugins.filter(plugin => prop in plugin);
    }
    /**
     * Lightweight plugin dependency management to require plugins and code mods on demand.
     *
     * This uses the `dependencies` stanza (a `Set`) exposed by `puppeteer-extra` plugins.
     *
     * @todo Allow objects as depdencies that contains opts for the requested plugin.
     *
     * @private
     */
    resolvePluginDependencies() {
        // Request missing dependencies from all plugins and flatten to a single Set
        const missingPlugins = this._plugins
            .map(p => p._getMissingDependencies(this._plugins))
            .reduce((combined, list) => {
            return new Set([...combined, ...list]);
        }, new Set());
        if (!missingPlugins.size) {
            debug('no dependencies are missing');
            return;
        }
        debug('dependencies missing', missingPlugins);
        // Loop through all dependencies declared missing by plugins
        for (let name of [...missingPlugins]) {
            // Check if the dependency hasn't been registered as plugin already.
            // This might happen when multiple plugins have nested dependencies.
            if (this.pluginNames.includes(name)) {
                debug(`ignoring dependency '${name}', which has been required already.`);
                continue;
            }
            // We follow a plugin naming convention, but let's rather enforce it <3
            name = name.startsWith('puppeteer-extra-plugin')
                ? name
                : `puppeteer-extra-plugin-${name}`;
            // In case a module sub resource is requested print out the main package name
            // e.g. puppeteer-extra-plugin-stealth/evasions/console.debug => puppeteer-extra-plugin-stealth
            const packageName = name.split('/')[0];
            let dep = null;
            try {
                // Try to require and instantiate the stated dependency
                dep = require(name)();
                // Register it with `puppeteer-extra` as plugin
                this.use(dep);
            }
            catch (err) {
                console.warn(`
          A plugin listed '${name}' as dependency,
          which is currently missing. Please install it:

          yarn add ${packageName}

          Note: You don't need to require the plugin yourself,
          unless you want to modify it's default settings.
          `);
                throw err;
            }
            // Handle nested dependencies :D
            if (dep.dependencies.size) {
                this.resolvePluginDependencies();
            }
        }
    }
    /**
     * Order plugins that have expressed a special placement requirement.
     *
     * This is useful/necessary for e.g. plugins that depend on the data from other plugins.
     *
     * @todo Support more than 'runLast'.
     * @todo If there are multiple plugins defining 'runLast', sort them depending on who depends on whom. :D
     *
     * @private
     */
    orderPlugins() {
        debug('orderPlugins:before', this.pluginNames);
        const runLast = this._plugins
            .filter(p => p.requirements.has('runLast'))
            .map(p => p.name);
        for (const name of runLast) {
            const index = this._plugins.findIndex(p => p.name === name);
            this._plugins.push(this._plugins.splice(index, 1)[0]);
        }
        debug('orderPlugins:after', this.pluginNames);
    }
    /**
     * Lightweight plugin requirement checking.
     *
     * The main intent is to notify the user when a plugin won't work as expected.
     *
     * @todo This could be improved, e.g. be evaluated by the plugin base class.
     *
     * @private
     */
    checkPluginRequirements(opts = {}) {
        for (const plugin of this._plugins) {
            for (const requirement of plugin.requirements) {
                if (opts.context === 'launch' &&
                    requirement === 'headful' &&
                    opts.options.headless) {
                    console.warn(`Warning: Plugin '${plugin.name}' is not supported in headless mode.`);
                }
                if (opts.context === 'connect' && requirement === 'launch') {
                    console.warn(`Warning: Plugin '${plugin.name}' doesn't support puppeteer.connect().`);
                }
            }
        }
    }
    /**
     * Call plugins sequentially with the same values.
     * Plugins that expose the supplied property will be called.
     *
     * @param prop - The plugin property to call
     * @param values - Any number of values
     * @private
     */
    async callPlugins(prop, ...values) {
        for (const plugin of this.getPluginsByProp(prop)) {
            await plugin[prop].apply(plugin, values);
        }
    }
    /**
     * Call plugins sequentially and pass on a value (waterfall style).
     * Plugins that expose the supplied property will be called.
     *
     * The plugins can either modify the value or return an updated one.
     * Will return the latest, updated value which ran through all plugins.
     *
     * @param prop - The plugin property to call
     * @param value - Any value
     * @return The new updated value
     * @private
     */
    async callPluginsWithValue(prop, value) {
        for (const plugin of this.getPluginsByProp(prop)) {
            const newValue = await plugin[prop](value);
            if (newValue) {
                value = newValue;
            }
        }
        return value;
    }
}
/**
 * The **default export** will behave exactly the same as the regular puppeteer
 * (just with extra plugin functionality) and can be used as a drop-in replacement.
 *
 * Behind the scenes it will try to require either `puppeteer`
 * or [`puppeteer-core`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteer-vs-puppeteer-core)
 * from the installed dependencies.
 *
 * @example
 * // javascript import
 * const puppeteer = require('puppeteer-extra')
 *
 * // typescript/es6 module import
 * import puppeteer from 'puppeteer-extra'
 *
 * // Add plugins
 * puppeteer.use(...)
 */
const defaultExport = (() => {
    return new PuppeteerExtra(...requireVanillaPuppeteer());
})();
/**
 * An **alternative way** to use `puppeteer-extra`: Augments the provided puppeteer with extra plugin functionality.
 *
 * This is useful in case you need multiple puppeteer instances with different plugins or to add plugins to a non-standard puppeteer package.
 *
 * @example
 * // js import
 * const { addExtra } = require('puppeteer-extra')
 *
 * // ts/es6 import
 * import { addExtra } from 'puppeteer-extra'
 *
 * // Patch e.g. puppeteer-firefox and add plugins
 * const puppeteer = addExtra(require('puppeteer-firefox'))
 * puppeteer.use(...)
 *
 * @param puppeteer Any puppeteer API-compatible puppeteer implementation or version.
 * @return A fresh PuppeteerExtra instance using the provided puppeteer
 */
const addExtra = (puppeteer) => new PuppeteerExtra(puppeteer);
/**
 * Attempt to require puppeteer or puppeteer-core from dependencies.
 * To stay backwards compatible with the existing default export we have to do some gymnastics here.
 *
 * @return Either a Puppeteer instance or an Error, which we'll throw later if need be.
 * @private
 */
function requireVanillaPuppeteer() {
    try {
        return [__webpack_require__(1873), undefined];
    }
    catch (_) {
        // noop
    }
    try {
        return [__webpack_require__(7508), undefined];
    }
    catch (err) {
        return [undefined, err];
    }
}

exports.PuppeteerExtra = PuppeteerExtra;
exports.addExtra = addExtra;
exports.default = defaultExport;


  module.exports = exports.default || {}
  Object.entries(exports).forEach(([key, value]) => { module.exports[key] = value })
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 8810:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 2157:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 1873:
/***/ ((module) => {

module.exports = eval("require")("puppeteer");


/***/ }),

/***/ 7508:
/***/ ((module) => {

module.exports = eval("require")("puppeteer-core");


/***/ })

};
;
//# sourceMappingURL=679.index.js.map