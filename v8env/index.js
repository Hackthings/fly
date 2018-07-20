// import dispatcherInit from './fly/dispatcher'
import bridgeInit from './bridge'

import { fireFetchEvent, addEventListener, dispatchEvent, FetchEvent } from "./events"
import { ReadableStream, WritableStream, TransformStream } from './streams'

import { console } from './console'
import flyInit from './fly'

import { URL, URLSearchParams } from 'universal-url-lite'//'whatwg-url'
import Headers from './headers'

import { TextEncoder, TextDecoder } from './text-encoding'
import { fetch } from './fetch'
import Body from './ts/body_mixin.ts'
import Blob from './ts/blob.ts'
import FormData from './ts/form_data.ts'
import { crypto } from './ts/crypto.ts'
import { Response } from './response'
import { Request } from './request'
import cache from './cache'
import { setTimeout, setImmediate, clearTimeout, setInterval, clearInterval } from './timers'
import { btoa, atob } from "./ts/base64"

import { Document, Element } from './document'

import { MiddlewareChain } from './middleware'

global.middleware = {}
global.window = global

global.bootstrapBridge = function bootstrapBridge(ivm, dispatch) {
	delete global.bootstrapBridge
	bridgeInit(ivm, dispatch)
}

global.bootstrap = function bootstrap() {
	// Cleanup, early!
	delete global.bootstrap

	// Sets up `Error.prepareStacktrace`, for source map support
	require('./error')

	global.fly = flyInit()

	global.console = console

	global._fly = {}
	Object.assign(global._fly, {
		setTimeout, clearTimeout, setImmediate, setInterval, clearInterval,
		ReadableStream, WritableStream, TransformStream,
		TextEncoder, TextDecoder,
		Headers, Request, Response, fetch, Body,
		Blob, FormData, URL, URLSearchParams,
		cache, crypto, TimeoutError,
		btoa, atob, // Base64
		MiddlewareChain // ugh
	})
	Object.assign(global, global._fly)

	// Events
	global.fireFetchEvent = fireFetchEvent
	global.addEventListener = addEventListener
	global.dispatchEvent = dispatchEvent

	global.FetchEvent = FetchEvent

	// DOM
	global.Document = Document
	global.Element = Element

	global.getHeapStatistics = function getHeapStatistics() {
		return new Promise((resolve, reject) => {
			bridge.dispatch("getHeapStatistics", function getHeapStatisticsPromise(err, heap) {
				if (err) {
					reject(err)
					return
				}
				resolve(heap)
			})
		})
	}
}

class TimeoutError extends Error { }