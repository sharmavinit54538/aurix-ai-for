import { o as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { o as require_react } from "../@ai-sdk/react+[...].mjs";
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.production.js
/**
* @license React
* use-sync-external-store-with-selector.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_with_selector_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = React.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
	exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
		var instRef = useRef(null);
		if (null === instRef.current) {
			var inst = {
				hasValue: !1,
				value: null
			};
			instRef.current = inst;
		} else inst = instRef.current;
		instRef = useMemo(function() {
			function memoizedSelector(nextSnapshot) {
				if (!hasMemo) {
					hasMemo = !0;
					memoizedSnapshot = nextSnapshot;
					nextSnapshot = selector(nextSnapshot);
					if (void 0 !== isEqual && inst.hasValue) {
						var currentSelection = inst.value;
						if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
					}
					return memoizedSelection = nextSnapshot;
				}
				currentSelection = memoizedSelection;
				if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
				var nextSelection = selector(nextSnapshot);
				if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
				memoizedSnapshot = nextSnapshot;
				return memoizedSelection = nextSelection;
			}
			var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
			return [function() {
				return memoizedSelector(getSnapshot());
			}, null === maybeGetServerSnapshot ? void 0 : function() {
				return memoizedSelector(maybeGetServerSnapshot());
			}];
		}, [
			getSnapshot,
			getServerSnapshot,
			selector,
			isEqual
		]);
		var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
		useEffect(function() {
			inst.hasValue = !0;
			inst.value = value;
		}, [value]);
		useDebugValue(value);
		return value;
	};
}));
//#endregion
//#region node_modules/use-sync-external-store/with-selector.js
var require_with_selector = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_with_selector_production();
}));
//#endregion
//#region node_modules/react-redux/dist/react-redux.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_with_selector = require_with_selector();
function defaultNoopBatch(callback) {
	callback();
}
function createListenerCollection() {
	let first = null;
	let last = null;
	return {
		clear() {
			first = null;
			last = null;
		},
		notify() {
			defaultNoopBatch(() => {
				let listener = first;
				while (listener) {
					listener.callback();
					listener = listener.next;
				}
			});
		},
		get() {
			const listeners = [];
			let listener = first;
			while (listener) {
				listeners.push(listener);
				listener = listener.next;
			}
			return listeners;
		},
		subscribe(callback) {
			let isSubscribed = true;
			const listener = last = {
				callback,
				next: null,
				prev: last
			};
			if (listener.prev) listener.prev.next = listener;
			else first = listener;
			return function unsubscribe() {
				if (!isSubscribed || first === null) return;
				isSubscribed = false;
				if (listener.next) listener.next.prev = listener.prev;
				else last = listener.prev;
				if (listener.prev) listener.prev.next = listener.next;
				else first = listener.next;
			};
		}
	};
}
var nullListeners = {
	notify() {},
	get: () => []
};
function createSubscription(store, parentSub) {
	let unsubscribe;
	let listeners = nullListeners;
	let subscriptionsAmount = 0;
	let selfSubscribed = false;
	function addNestedSub(listener) {
		trySubscribe();
		const cleanupListener = listeners.subscribe(listener);
		let removed = false;
		return () => {
			if (!removed) {
				removed = true;
				cleanupListener();
				tryUnsubscribe();
			}
		};
	}
	function notifyNestedSubs() {
		listeners.notify();
	}
	function handleChangeWrapper() {
		if (subscription.onStateChange) subscription.onStateChange();
	}
	function isSubscribed() {
		return selfSubscribed;
	}
	function trySubscribe() {
		subscriptionsAmount++;
		if (!unsubscribe) {
			unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
			listeners = createListenerCollection();
		}
	}
	function tryUnsubscribe() {
		subscriptionsAmount--;
		if (unsubscribe && subscriptionsAmount === 0) {
			unsubscribe();
			unsubscribe = void 0;
			listeners.clear();
			listeners = nullListeners;
		}
	}
	function trySubscribeSelf() {
		if (!selfSubscribed) {
			selfSubscribed = true;
			trySubscribe();
		}
	}
	function tryUnsubscribeSelf() {
		if (selfSubscribed) {
			selfSubscribed = false;
			tryUnsubscribe();
		}
	}
	const subscription = {
		addNestedSub,
		notifyNestedSubs,
		handleChangeWrapper,
		isSubscribed,
		trySubscribe: trySubscribeSelf,
		tryUnsubscribe: tryUnsubscribeSelf,
		getListeners: () => listeners
	};
	return subscription;
}
var canUseDOM$1 = () => !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var isDOM$1 = /* @__PURE__ */ canUseDOM$1();
var isRunningInReactNative$1 = () => typeof navigator !== "undefined" && navigator.product === "ReactNative";
var isReactNative$1 = /* @__PURE__ */ isRunningInReactNative$1();
var getUseIsomorphicLayoutEffect$1 = () => isDOM$1 || isReactNative$1 ? import_react.useLayoutEffect : import_react.useEffect;
var useIsomorphicLayoutEffect$1 = /* @__PURE__ */ getUseIsomorphicLayoutEffect$1();
function is$1(x, y) {
	if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y;
	else return x !== x && y !== y;
}
function shallowEqual(objA, objB) {
	if (is$1(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	if (keysA.length !== keysB.length) return false;
	for (let i = 0; i < keysA.length; i++) if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) return false;
	return true;
}
var ContextKey = /* @__PURE__ */ Symbol.for(`react-redux-context`);
var gT = typeof globalThis !== "undefined" ? globalThis : {};
function getContext() {
	if (!import_react.createContext) return {};
	const contextMap = gT[ContextKey] ??= /* @__PURE__ */ new Map();
	let realContext = contextMap.get(import_react.createContext);
	if (!realContext) {
		realContext = import_react.createContext(null);
		contextMap.set(import_react.createContext, realContext);
	}
	return realContext;
}
var ReactReduxContext = /* @__PURE__ */ getContext();
function Provider(providerProps) {
	const { children, context, serverState, store } = providerProps;
	const contextValue = import_react.useMemo(() => {
		return {
			store,
			subscription: createSubscription(store),
			getServerState: serverState ? () => serverState : void 0
		};
	}, [store, serverState]);
	const previousState = import_react.useMemo(() => store.getState(), [store]);
	useIsomorphicLayoutEffect$1(() => {
		const { subscription } = contextValue;
		subscription.onStateChange = subscription.notifyNestedSubs;
		subscription.trySubscribe();
		if (previousState !== store.getState()) subscription.notifyNestedSubs();
		return () => {
			subscription.tryUnsubscribe();
			subscription.onStateChange = void 0;
		};
	}, [contextValue, previousState]);
	const Context = context || ReactReduxContext;
	return /* @__PURE__ */ import_react.createElement(Context.Provider, { value: contextValue }, children);
}
var Provider_default = Provider;
function createReduxContextHook(context = ReactReduxContext) {
	return function useReduxContext2() {
		return import_react.useContext(context);
	};
}
var useReduxContext = /* @__PURE__ */ createReduxContextHook();
function createStoreHook(context = ReactReduxContext) {
	const useReduxContext2 = context === ReactReduxContext ? useReduxContext : createReduxContextHook(context);
	const useStore2 = () => {
		const { store } = useReduxContext2();
		return store;
	};
	Object.assign(useStore2, { withTypes: () => useStore2 });
	return useStore2;
}
var useStore = /* @__PURE__ */ createStoreHook();
function createDispatchHook(context = ReactReduxContext) {
	const useStore2 = context === ReactReduxContext ? useStore : createStoreHook(context);
	const useDispatch2 = () => {
		return useStore2().dispatch;
	};
	Object.assign(useDispatch2, { withTypes: () => useDispatch2 });
	return useDispatch2;
}
var useDispatch = /* @__PURE__ */ createDispatchHook();
var refEquality = (a, b) => a === b;
function createSelectorHook(context = ReactReduxContext) {
	const useReduxContext2 = context === ReactReduxContext ? useReduxContext : createReduxContextHook(context);
	const useSelector2 = (selector, equalityFnOrOptions = {}) => {
		const { equalityFn = refEquality } = typeof equalityFnOrOptions === "function" ? { equalityFn: equalityFnOrOptions } : equalityFnOrOptions;
		const { store, subscription, getServerState } = useReduxContext2();
		import_react.useRef(true);
		const wrappedSelector = import_react.useCallback({ [selector.name](state) {
			return selector(state);
		} }[selector.name], [selector]);
		const selectedState = (0, import_with_selector.useSyncExternalStoreWithSelector)(subscription.addNestedSub, store.getState, getServerState || store.getState, wrappedSelector, equalityFn);
		import_react.useDebugValue(selectedState);
		return selectedState;
	};
	Object.assign(useSelector2, { withTypes: () => useSelector2 });
	return useSelector2;
}
var useSelector = /* @__PURE__ */ createSelectorHook();
var batch = defaultNoopBatch;
//#endregion
//#region node_modules/redux/dist/redux.mjs
function formatProdErrorMessage$1(code) {
	return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}
var symbol_observable_default = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
var actionTypes_default = {
	INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
	REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
	PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
};
function isPlainObject$1(obj) {
	if (typeof obj !== "object" || obj === null) return false;
	let proto = obj;
	while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
	return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}
function createStore(reducer, preloadedState, enhancer) {
	if (typeof reducer !== "function") throw new Error(formatProdErrorMessage$1(2));
	if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") throw new Error(formatProdErrorMessage$1(0));
	if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
		enhancer = preloadedState;
		preloadedState = void 0;
	}
	if (typeof enhancer !== "undefined") {
		if (typeof enhancer !== "function") throw new Error(formatProdErrorMessage$1(1));
		return enhancer(createStore)(reducer, preloadedState);
	}
	let currentReducer = reducer;
	let currentState = preloadedState;
	let currentListeners = /* @__PURE__ */ new Map();
	let nextListeners = currentListeners;
	let listenerIdCounter = 0;
	let isDispatching = false;
	function ensureCanMutateNextListeners() {
		if (nextListeners === currentListeners) {
			nextListeners = /* @__PURE__ */ new Map();
			currentListeners.forEach((listener, key) => {
				nextListeners.set(key, listener);
			});
		}
	}
	function getState() {
		if (isDispatching) throw new Error(formatProdErrorMessage$1(3));
		return currentState;
	}
	function subscribe(listener) {
		if (typeof listener !== "function") throw new Error(formatProdErrorMessage$1(4));
		if (isDispatching) throw new Error(formatProdErrorMessage$1(5));
		let isSubscribed = true;
		ensureCanMutateNextListeners();
		const listenerId = listenerIdCounter++;
		nextListeners.set(listenerId, listener);
		return function unsubscribe() {
			if (!isSubscribed) return;
			if (isDispatching) throw new Error(formatProdErrorMessage$1(6));
			isSubscribed = false;
			ensureCanMutateNextListeners();
			nextListeners.delete(listenerId);
			currentListeners = null;
		};
	}
	function dispatch(action) {
		if (!isPlainObject$1(action)) throw new Error(formatProdErrorMessage$1(7));
		if (typeof action.type === "undefined") throw new Error(formatProdErrorMessage$1(8));
		if (typeof action.type !== "string") throw new Error(formatProdErrorMessage$1(17));
		if (isDispatching) throw new Error(formatProdErrorMessage$1(9));
		try {
			isDispatching = true;
			currentState = currentReducer(currentState, action);
		} finally {
			isDispatching = false;
		}
		(currentListeners = nextListeners).forEach((listener) => {
			listener();
		});
		return action;
	}
	function replaceReducer(nextReducer) {
		if (typeof nextReducer !== "function") throw new Error(formatProdErrorMessage$1(10));
		currentReducer = nextReducer;
		dispatch({ type: actionTypes_default.REPLACE });
	}
	function observable() {
		const outerSubscribe = subscribe;
		return {
			/**
			* The minimal observable subscription method.
			* @param observer Any object that can be used as an observer.
			* The observer object should have a `next` method.
			* @returns An object with an `unsubscribe` method that can
			* be used to unsubscribe the observable from the store, and prevent further
			* emission of values from the observable.
			*/
			subscribe(observer) {
				if (typeof observer !== "object" || observer === null) throw new Error(formatProdErrorMessage$1(11));
				function observeState() {
					const observerAsObserver = observer;
					if (observerAsObserver.next) observerAsObserver.next(getState());
				}
				observeState();
				return { unsubscribe: outerSubscribe(observeState) };
			},
			[symbol_observable_default]() {
				return this;
			}
		};
	}
	dispatch({ type: actionTypes_default.INIT });
	return {
		dispatch,
		subscribe,
		getState,
		replaceReducer,
		[symbol_observable_default]: observable
	};
}
function assertReducerShape(reducers) {
	Object.keys(reducers).forEach((key) => {
		const reducer = reducers[key];
		if (typeof reducer(void 0, { type: actionTypes_default.INIT }) === "undefined") throw new Error(formatProdErrorMessage$1(12));
		if (typeof reducer(void 0, { type: actionTypes_default.PROBE_UNKNOWN_ACTION() }) === "undefined") throw new Error(formatProdErrorMessage$1(13));
	});
}
function combineReducers(reducers) {
	const reducerKeys = Object.keys(reducers);
	const finalReducers = {};
	for (let i = 0; i < reducerKeys.length; i++) {
		const key = reducerKeys[i];
		if (typeof reducers[key] === "function") finalReducers[key] = reducers[key];
	}
	const finalReducerKeys = Object.keys(finalReducers);
	let shapeAssertionError;
	try {
		assertReducerShape(finalReducers);
	} catch (e) {
		shapeAssertionError = e;
	}
	return function combination(state = {}, action) {
		if (shapeAssertionError) throw shapeAssertionError;
		let hasChanged = false;
		const nextState = {};
		for (let i = 0; i < finalReducerKeys.length; i++) {
			const key = finalReducerKeys[i];
			const reducer = finalReducers[key];
			const previousStateForKey = state[key];
			const nextStateForKey = reducer(previousStateForKey, action);
			if (typeof nextStateForKey === "undefined") {
				action && action.type;
				throw new Error(formatProdErrorMessage$1(14));
			}
			nextState[key] = nextStateForKey;
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
		}
		hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
		return hasChanged ? nextState : state;
	};
}
function compose(...funcs) {
	if (funcs.length === 0) return (arg) => arg;
	if (funcs.length === 1) return funcs[0];
	return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
function applyMiddleware(...middlewares) {
	return (createStore2) => (reducer, preloadedState) => {
		const store = createStore2(reducer, preloadedState);
		let dispatch = () => {
			throw new Error(formatProdErrorMessage$1(15));
		};
		const middlewareAPI = {
			getState: store.getState,
			dispatch: (action, ...args) => dispatch(action, ...args)
		};
		dispatch = compose(...middlewares.map((middleware) => middleware(middlewareAPI)))(store.dispatch);
		return {
			...store,
			dispatch
		};
	};
}
function isAction(action) {
	return isPlainObject$1(action) && "type" in action && typeof action.type === "string";
}
//#endregion
//#region node_modules/immer/dist/immer.mjs
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
	throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`);
}
var O = Object;
var getPrototypeOf = O.getPrototypeOf;
var CONSTRUCTOR = "constructor";
var PROTOTYPE = "prototype";
var CONFIGURABLE = "configurable";
var ENUMERABLE = "enumerable";
var WRITABLE = "writable";
var VALUE = "value";
var isDraft = (value) => !!value && !!value[DRAFT_STATE];
function isDraftable(value) {
	if (!value) return false;
	return isPlainObject(value) || isArray(value) || !!value[DRAFTABLE] || !!value[CONSTRUCTOR]?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = O[PROTOTYPE][CONSTRUCTOR].toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
	if (!value || !isObjectish(value)) return false;
	const proto = getPrototypeOf(value);
	if (proto === null || proto === O[PROTOTYPE]) return true;
	const Ctor = O.hasOwnProperty.call(proto, CONSTRUCTOR) && proto[CONSTRUCTOR];
	if (Ctor === Object) return true;
	if (!isFunction$1(Ctor)) return false;
	let ctorString = cachedCtorStrings.get(Ctor);
	if (ctorString === void 0) {
		ctorString = Function.toString.call(Ctor);
		cachedCtorStrings.set(Ctor, ctorString);
	}
	return ctorString === objectCtorString;
}
function original(value) {
	if (!isDraft(value)) die(15, value);
	return value[DRAFT_STATE].base_;
}
function each(obj, iter, strict = true) {
	if (getArchtype(obj) === 0) (strict ? Reflect.ownKeys(obj) : O.keys(obj)).forEach((key) => {
		iter(key, obj[key], obj);
	});
	else obj.forEach((entry, index) => iter(index, entry, obj));
}
function getArchtype(thing) {
	const state = thing[DRAFT_STATE];
	return state ? state.type_ : isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
var has = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.has(prop) : O[PROTOTYPE].hasOwnProperty.call(thing, prop);
var get = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.get(prop) : thing[prop];
var set = (thing, propOrOldValue, value, type = getArchtype(thing)) => {
	if (type === 2) thing.set(propOrOldValue, value);
	else if (type === 3) thing.add(value);
	else thing[propOrOldValue] = value;
};
function is(x, y) {
	if (x === y) return x !== 0 || 1 / x === 1 / y;
	else return x !== x && y !== y;
}
var isArray = Array.isArray;
var isMap = (target) => target instanceof Map;
var isSet = (target) => target instanceof Set;
var isObjectish = (target) => typeof target === "object";
var isFunction$1 = (target) => typeof target === "function";
var isBoolean$1 = (target) => typeof target === "boolean";
function isArrayIndex(value) {
	const n = +value;
	return Number.isInteger(n) && String(n) === value;
}
var getProxyDraft = (value) => {
	if (!isObjectish(value)) return null;
	return value?.[DRAFT_STATE];
};
var latest = (state) => state.copy_ || state.base_;
var getFinalValue = (state) => state.modified_ ? state.copy_ : state.base_;
function shallowCopy(base, strict) {
	if (isMap(base)) return new Map(base);
	if (isSet(base)) return new Set(base);
	if (isArray(base)) return Array[PROTOTYPE].slice.call(base);
	const isPlain = isPlainObject(base);
	if (strict === true || strict === "class_only" && !isPlain) {
		const descriptors = O.getOwnPropertyDescriptors(base);
		delete descriptors[DRAFT_STATE];
		let keys = Reflect.ownKeys(descriptors);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const desc = descriptors[key];
			if (desc[WRITABLE] === false) {
				desc[WRITABLE] = true;
				desc[CONFIGURABLE] = true;
			}
			if (desc.get || desc.set) descriptors[key] = {
				[CONFIGURABLE]: true,
				[WRITABLE]: true,
				[ENUMERABLE]: desc[ENUMERABLE],
				[VALUE]: base[key]
			};
		}
		return O.create(getPrototypeOf(base), descriptors);
	} else {
		const proto = getPrototypeOf(base);
		if (proto !== null && isPlain) return { ...base };
		const obj = O.create(proto);
		return O.assign(obj, base);
	}
}
function freeze(obj, deep = false) {
	if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
	if (getArchtype(obj) > 1) O.defineProperties(obj, {
		set: dontMutateMethodOverride,
		add: dontMutateMethodOverride,
		clear: dontMutateMethodOverride,
		delete: dontMutateMethodOverride
	});
	O.freeze(obj);
	if (deep) each(obj, (_key, value) => {
		freeze(value, true);
	}, false);
	return obj;
}
function dontMutateFrozenCollections() {
	die(2);
}
var dontMutateMethodOverride = { [VALUE]: dontMutateFrozenCollections };
function isFrozen(obj) {
	if (obj === null || !isObjectish(obj)) return true;
	return O.isFrozen(obj);
}
var PluginMapSet = "MapSet";
var PluginPatches = "Patches";
var PluginArrayMethods = "ArrayMethods";
var plugins = {};
function getPlugin(pluginKey) {
	const plugin = plugins[pluginKey];
	if (!plugin) die(0, pluginKey);
	return plugin;
}
var isPluginLoaded = (pluginKey) => !!plugins[pluginKey];
function loadPlugin(pluginKey, implementation) {
	if (!plugins[pluginKey]) plugins[pluginKey] = implementation;
}
var currentScope;
var getCurrentScope = () => currentScope;
var createScope = (parent_, immer_) => ({
	drafts_: [],
	parent_,
	immer_,
	canAutoFreeze_: true,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: isPluginLoaded(PluginMapSet) ? getPlugin(PluginMapSet) : void 0,
	arrayMethodsPlugin_: isPluginLoaded(PluginArrayMethods) ? getPlugin(PluginArrayMethods) : void 0
});
function usePatchesInScope(scope, patchListener) {
	if (patchListener) {
		scope.patchPlugin_ = getPlugin(PluginPatches);
		scope.patches_ = [];
		scope.inversePatches_ = [];
		scope.patchListener_ = patchListener;
	}
}
function revokeScope(scope) {
	leaveScope(scope);
	scope.drafts_.forEach(revokeDraft);
	scope.drafts_ = null;
}
function leaveScope(scope) {
	if (scope === currentScope) currentScope = scope.parent_;
}
var enterScope = (immer2) => currentScope = createScope(currentScope, immer2);
function revokeDraft(draft) {
	const state = draft[DRAFT_STATE];
	if (state.type_ === 0 || state.type_ === 1) state.revoke_();
	else state.revoked_ = true;
}
function processResult(result, scope) {
	scope.unfinalizedDrafts_ = scope.drafts_.length;
	const baseDraft = scope.drafts_[0];
	if (result !== void 0 && result !== baseDraft) {
		if (baseDraft[DRAFT_STATE].modified_) {
			revokeScope(scope);
			die(4);
		}
		if (isDraftable(result)) result = finalize(scope, result);
		const { patchPlugin_ } = scope;
		if (patchPlugin_) patchPlugin_.generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope);
	} else result = finalize(scope, baseDraft);
	maybeFreeze(scope, result, true);
	revokeScope(scope);
	if (scope.patches_) scope.patchListener_(scope.patches_, scope.inversePatches_);
	return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value) {
	if (isFrozen(value)) return value;
	const state = value[DRAFT_STATE];
	if (!state) return handleValue(value, rootScope.handledSet_, rootScope);
	if (!isSameScope(state, rootScope)) return value;
	if (!state.modified_) return state.base_;
	if (!state.finalized_) {
		const { callbacks_ } = state;
		if (callbacks_) while (callbacks_.length > 0) callbacks_.pop()(rootScope);
		generatePatchesAndFinalize(state, rootScope);
	}
	return state.copy_;
}
function maybeFreeze(scope, value, deep = false) {
	if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) freeze(value, deep);
}
function markStateFinalized(state) {
	state.finalized_ = true;
	state.scope_.unfinalizedDrafts_--;
}
var isSameScope = (state, rootScope) => state.scope_ === rootScope;
var EMPTY_LOCATIONS_RESULT = [];
function updateDraftInParent(parent, draftValue, finalizedValue, originalKey) {
	const parentCopy = latest(parent);
	const parentType = parent.type_;
	if (originalKey !== void 0) {
		if (get(parentCopy, originalKey, parentType) === draftValue) {
			set(parentCopy, originalKey, finalizedValue, parentType);
			return;
		}
	}
	if (!parent.draftLocations_) {
		const draftLocations = parent.draftLocations_ = /* @__PURE__ */ new Map();
		each(parentCopy, (key, value) => {
			if (isDraft(value)) {
				const keys = draftLocations.get(value) || [];
				keys.push(key);
				draftLocations.set(value, keys);
			}
		});
	}
	const locations = parent.draftLocations_.get(draftValue) ?? EMPTY_LOCATIONS_RESULT;
	for (const location of locations) set(parentCopy, location, finalizedValue, parentType);
}
function registerChildFinalizationCallback(parent, child, key) {
	parent.callbacks_.push(function childCleanup(rootScope) {
		const state = child;
		if (!state || !isSameScope(state, rootScope)) return;
		rootScope.mapSetPlugin_?.fixSetContents(state);
		const finalizedValue = getFinalValue(state);
		updateDraftInParent(parent, state.draft_ ?? state, finalizedValue, key);
		generatePatchesAndFinalize(state, rootScope);
	});
}
function generatePatchesAndFinalize(state, rootScope) {
	if (state.modified_ && !state.finalized_ && (state.type_ === 3 || state.type_ === 1 && state.allIndicesReassigned_ || (state.assigned_?.size ?? 0) > 0)) {
		const { patchPlugin_ } = rootScope;
		if (patchPlugin_) {
			const basePath = patchPlugin_.getPath(state);
			if (basePath) patchPlugin_.generatePatches_(state, basePath, rootScope);
		}
		markStateFinalized(state);
	}
}
function handleCrossReference(target, key, value) {
	const { scope_ } = target;
	if (isDraft(value)) {
		const state = value[DRAFT_STATE];
		if (isSameScope(state, scope_)) state.callbacks_.push(function crossReferenceCleanup() {
			prepareCopy(target);
			updateDraftInParent(target, value, getFinalValue(state), key);
		});
	} else if (isDraftable(value)) target.callbacks_.push(function nestedDraftCleanup() {
		const targetCopy = latest(target);
		if (target.type_ === 3) {
			if (targetCopy.has(value)) handleValue(value, scope_.handledSet_, scope_);
		} else if (get(targetCopy, key, target.type_) === value) {
			if (scope_.drafts_.length > 1 && (target.assigned_.get(key) ?? false) === true && target.copy_) handleValue(get(target.copy_, key, target.type_), scope_.handledSet_, scope_);
		}
	});
}
function handleValue(target, handledSet, rootScope) {
	if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) return target;
	if (isDraft(target) || handledSet.has(target) || !isDraftable(target) || isFrozen(target)) return target;
	handledSet.add(target);
	each(target, (key, value) => {
		if (isDraft(value)) {
			const state = value[DRAFT_STATE];
			if (isSameScope(state, rootScope)) {
				set(target, key, getFinalValue(state), target.type_);
				markStateFinalized(state);
			}
		} else if (isDraftable(value)) handleValue(value, handledSet, rootScope);
	});
	return target;
}
function createProxyProxy(base, parent) {
	const baseIsArray = isArray(base);
	const state = {
		type_: baseIsArray ? 1 : 0,
		scope_: parent ? parent.scope_ : getCurrentScope(),
		modified_: false,
		finalized_: false,
		assigned_: void 0,
		parent_: parent,
		base_: base,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: false,
		callbacks_: void 0
	};
	let target = state;
	let traps = objectTraps;
	if (baseIsArray) {
		target = [state];
		traps = arrayTraps;
	}
	const { revoke, proxy } = Proxy.revocable(target, traps);
	state.draft_ = proxy;
	state.revoke_ = revoke;
	return [proxy, state];
}
var objectTraps = {
	get(state, prop) {
		if (prop === DRAFT_STATE) return state;
		if (prop === "constructor" || prop === "__proto__") {
			const value2 = latest(state)[prop];
			return new Proxy(value2 || {}, {
				get: (target, key) => {
					if (key === "__proto__" || key === "prototype") return Object.freeze(/* @__PURE__ */ Object.create(null));
					return Reflect.get(target, key);
				},
				set: () => {
					return true;
				},
				apply: (target, thisArg, args) => {
					return Reflect.apply(target, thisArg, args);
				}
			});
		}
		let arrayPlugin = state.scope_.arrayMethodsPlugin_;
		const isArrayWithStringProp = state.type_ === 1 && typeof prop === "string";
		if (isArrayWithStringProp) {
			if (arrayPlugin?.isArrayOperationMethod(prop)) return arrayPlugin.createMethodInterceptor(state, prop);
		}
		const source = latest(state);
		if (!has(source, prop, state.type_)) return readPropFromProto(state, source, prop);
		const value = source[prop];
		if (state.finalized_ || !isDraftable(value)) return value;
		if (isArrayWithStringProp && state.operationMethod && arrayPlugin?.isMutatingArrayMethod(state.operationMethod) && isArrayIndex(prop)) return value;
		if (value === peek(state.base_, prop)) {
			prepareCopy(state);
			const childKey = state.type_ === 1 ? +prop : prop;
			const childDraft = createProxy(state.scope_, value, state, childKey);
			return state.copy_[childKey] = childDraft;
		}
		return value;
	},
	has(state, prop) {
		if (prop === "constructor" || prop === "__proto__" || prop === "prototype") return false;
		return prop in latest(state);
	},
	ownKeys(state) {
		return Reflect.ownKeys(latest(state));
	},
	set(state, prop, value) {
		if (prop === "constructor" || prop === "__proto__" || prop === "prototype") return true;
		const desc = getDescriptorFromProto(latest(state), prop);
		if (desc?.set) {
			desc.set.call(state.draft_, value);
			return true;
		}
		if (!state.modified_) {
			const current2 = peek(latest(state), prop);
			const currentState = current2?.[DRAFT_STATE];
			if (currentState && currentState.base_ === value) {
				state.copy_[prop] = value;
				state.assigned_.set(prop, false);
				return true;
			}
			if (is(value, current2) && (value !== void 0 || has(state.base_, prop, state.type_))) return true;
			prepareCopy(state);
			markChanged(state);
		}
		if (state.copy_[prop] === value && (value !== void 0 || has(state.copy_, prop, state.type_)) || Number.isNaN(value) && Number.isNaN(state.copy_[prop])) return true;
		state.copy_[prop] = value;
		state.assigned_.set(prop, true);
		handleCrossReference(state, prop, value);
		return true;
	},
	deleteProperty(state, prop) {
		prepareCopy(state);
		if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
			state.assigned_.set(prop, false);
			markChanged(state);
		} else state.assigned_.delete(prop);
		if (state.copy_) delete state.copy_[prop];
		return true;
	},
	getOwnPropertyDescriptor(state, prop) {
		const owner = latest(state);
		const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
		if (!desc) return desc;
		return {
			[WRITABLE]: true,
			[CONFIGURABLE]: state.type_ !== 1 || prop !== "length",
			[ENUMERABLE]: desc[ENUMERABLE],
			[VALUE]: owner[prop]
		};
	},
	defineProperty() {
		die(11);
	},
	getPrototypeOf(state) {
		return getPrototypeOf(state.base_);
	},
	setPrototypeOf() {
		die(12);
	}
};
var arrayTraps = {};
for (let key in objectTraps) {
	let fn = objectTraps[key];
	arrayTraps[key] = function() {
		const args = arguments;
		args[0] = args[0][0];
		return fn.apply(this, args);
	};
}
arrayTraps.deleteProperty = function(state, prop) {
	return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
	return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
	const state = draft[DRAFT_STATE];
	return (state ? latest(state) : draft)[prop];
}
function readPropFromProto(state, source, prop) {
	const desc = getDescriptorFromProto(source, prop);
	return desc ? VALUE in desc ? desc[VALUE] : desc.get?.call(state.draft_) : void 0;
}
function getDescriptorFromProto(source, prop) {
	if (!(prop in source)) return void 0;
	let proto = getPrototypeOf(source);
	while (proto) {
		const desc = Object.getOwnPropertyDescriptor(proto, prop);
		if (desc) return desc;
		proto = getPrototypeOf(proto);
	}
}
function markChanged(state) {
	if (!state.modified_) {
		state.modified_ = true;
		if (state.parent_) markChanged(state.parent_);
	}
}
function prepareCopy(state) {
	if (!state.copy_) {
		state.assigned_ = /* @__PURE__ */ new Map();
		state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
	}
}
var Immer2 = class {
	constructor(config) {
		this.autoFreeze_ = true;
		this.useStrictShallowCopy_ = false;
		this.useStrictIteration_ = false;
		/**
		* The `produce` function takes a value and a "recipe function" (whose
		* return value often depends on the base state). The recipe function is
		* free to mutate its first argument however it wants. All mutations are
		* only ever applied to a __copy__ of the base state.
		*
		* Pass only a function to create a "curried producer" which relieves you
		* from passing the recipe function every time.
		*
		* Only plain objects and arrays are made mutable. All other objects are
		* considered uncopyable.
		*
		* Note: This function is __bound__ to its `Immer` instance.
		*
		* @param {any} base - the initial state
		* @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
		* @param {Function} patchListener - optional function that will be called with all the patches produced here
		* @returns {any} a new state, or the initial state if nothing was modified
		*/
		this.produce = (base, recipe, patchListener) => {
			if (isFunction$1(base) && !isFunction$1(recipe)) {
				const defaultBase = recipe;
				recipe = base;
				const self = this;
				return function curriedProduce(base2 = defaultBase, ...args) {
					return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
				};
			}
			if (!isFunction$1(recipe)) die(6);
			if (patchListener !== void 0 && !isFunction$1(patchListener)) die(7);
			let result;
			if (isDraftable(base)) {
				const scope = enterScope(this);
				const proxy = createProxy(scope, base, void 0);
				let hasError = true;
				try {
					result = recipe(proxy);
					hasError = false;
				} finally {
					if (hasError) revokeScope(scope);
					else leaveScope(scope);
				}
				usePatchesInScope(scope, patchListener);
				return processResult(result, scope);
			} else if (!base || !isObjectish(base)) {
				result = recipe(base);
				if (result === void 0) result = base;
				if (result === NOTHING) result = void 0;
				if (this.autoFreeze_) freeze(result, true);
				if (patchListener) {
					const p = [];
					const ip = [];
					getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
						patches_: p,
						inversePatches_: ip
					});
					patchListener(p, ip);
				}
				return result;
			} else die(1, base);
		};
		this.produceWithPatches = (base, recipe) => {
			if (isFunction$1(base)) return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
			let patches, inversePatches;
			return [
				this.produce(base, recipe, (p, ip) => {
					patches = p;
					inversePatches = ip;
				}),
				patches,
				inversePatches
			];
		};
		if (isBoolean$1(config?.autoFreeze)) this.setAutoFreeze(config.autoFreeze);
		if (isBoolean$1(config?.useStrictShallowCopy)) this.setUseStrictShallowCopy(config.useStrictShallowCopy);
		if (isBoolean$1(config?.useStrictIteration)) this.setUseStrictIteration(config.useStrictIteration);
	}
	createDraft(base) {
		if (!isDraftable(base)) die(8);
		if (isDraft(base)) base = current(base);
		const scope = enterScope(this);
		const proxy = createProxy(scope, base, void 0);
		proxy[DRAFT_STATE].isManual_ = true;
		leaveScope(scope);
		return proxy;
	}
	finishDraft(draft, patchListener) {
		const state = draft && draft[DRAFT_STATE];
		if (!state || !state.isManual_) die(9);
		const { scope_: scope } = state;
		usePatchesInScope(scope, patchListener);
		return processResult(void 0, scope);
	}
	/**
	* Pass true to automatically freeze all copies created by Immer.
	*
	* By default, auto-freezing is enabled.
	*/
	setAutoFreeze(value) {
		this.autoFreeze_ = value;
	}
	/**
	* Pass true to enable strict shallow copy.
	*
	* By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
	*/
	setUseStrictShallowCopy(value) {
		this.useStrictShallowCopy_ = value;
	}
	/**
	* Pass false to use faster iteration that skips non-enumerable properties
	* but still handles symbols for compatibility.
	*
	* By default, strict iteration is enabled (includes all own properties).
	*/
	setUseStrictIteration(value) {
		this.useStrictIteration_ = value;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(base, patches) {
		let i;
		for (i = patches.length - 1; i >= 0; i--) {
			const patch = patches[i];
			if (patch.path.length === 0 && patch.op === "replace") {
				base = patch.value;
				break;
			}
		}
		if (i > -1) patches = patches.slice(i + 1);
		const applyPatchesImpl = getPlugin(PluginPatches).applyPatches_;
		if (isDraft(base)) return applyPatchesImpl(base, patches);
		return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
	}
};
function createProxy(rootScope, value, parent, key) {
	const [draft, state] = isMap(value) ? getPlugin(PluginMapSet).proxyMap_(value, parent) : isSet(value) ? getPlugin(PluginMapSet).proxySet_(value, parent) : createProxyProxy(value, parent);
	(parent?.scope_ ?? getCurrentScope()).drafts_.push(draft);
	state.callbacks_ = parent?.callbacks_ ?? [];
	state.key_ = key;
	if (parent && key !== void 0) registerChildFinalizationCallback(parent, state, key);
	else state.callbacks_.push(function rootDraftCleanup(rootScope2) {
		rootScope2.mapSetPlugin_?.fixSetContents(state);
		const { patchPlugin_ } = rootScope2;
		if (state.modified_ && patchPlugin_) patchPlugin_.generatePatches_(state, [], rootScope2);
	});
	return draft;
}
function current(value) {
	if (!isDraft(value)) die(10, value);
	return currentImpl(value);
}
function currentImpl(value) {
	if (!isDraftable(value) || isFrozen(value)) return value;
	const state = value[DRAFT_STATE];
	let copy;
	let strict = true;
	if (state) {
		if (!state.modified_) return state.base_;
		state.finalized_ = true;
		copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
		strict = state.scope_.immer_.shouldUseStrictIteration();
	} else copy = shallowCopy(value, true);
	each(copy, (key, childValue) => {
		set(copy, key, currentImpl(childValue));
	}, strict);
	if (state) state.finalized_ = false;
	return copy;
}
function enablePatches() {
	const errorOffset = 16;
	function getPath(state, path = []) {
		if (state.key_ !== void 0) {
			const parentCopy = state.parent_.copy_ ?? state.parent_.base_;
			const proxyDraft = getProxyDraft(get(parentCopy, state.key_));
			const valueAtKey = get(parentCopy, state.key_);
			if (valueAtKey === void 0) return null;
			if (valueAtKey !== state.draft_ && valueAtKey !== state.base_ && valueAtKey !== state.copy_) return null;
			if (proxyDraft != null && proxyDraft.base_ !== state.base_) return null;
			const isSet2 = state.parent_.type_ === 3;
			let key;
			if (isSet2) {
				const setParent = state.parent_;
				key = Array.from(setParent.drafts_.keys()).indexOf(state.key_);
			} else key = state.key_;
			if (!(isSet2 && parentCopy.size > key || has(parentCopy, key))) return null;
			path.push(key);
		}
		if (state.parent_) return getPath(state.parent_, path);
		path.reverse();
		try {
			resolvePath(state.copy_, path);
		} catch (e) {
			return null;
		}
		return path;
	}
	function resolvePath(base, path) {
		let current2 = base;
		for (let i = 0; i < path.length - 1; i++) {
			const key = path[i];
			current2 = get(current2, key);
			if (!isObjectish(current2) || current2 === null) throw new Error(`Cannot resolve path at '${path.join("/")}'`);
		}
		return current2;
	}
	const REPLACE = "replace";
	const ADD = "add";
	const REMOVE = "remove";
	function generatePatches_(state, basePath, scope) {
		if (state.scope_.processedForPatches_.has(state)) return;
		state.scope_.processedForPatches_.add(state);
		const { patches_, inversePatches_ } = scope;
		switch (state.type_) {
			case 0:
			case 2: return generatePatchesFromAssigned(state, basePath, patches_, inversePatches_);
			case 1: return generateArrayPatches(state, basePath, patches_, inversePatches_);
			case 3: return generateSetPatches(state, basePath, patches_, inversePatches_);
		}
	}
	function generateArrayPatches(state, basePath, patches, inversePatches) {
		let { base_, assigned_ } = state;
		let copy_ = state.copy_;
		if (copy_.length < base_.length) {
			[base_, copy_] = [copy_, base_];
			[patches, inversePatches] = [inversePatches, patches];
		}
		const allReassigned = state.allIndicesReassigned_ === true;
		for (let i = 0; i < base_.length; i++) {
			const copiedItem = copy_[i];
			const baseItem = base_[i];
			if ((allReassigned || assigned_?.get(i.toString())) && copiedItem !== baseItem) {
				const childState = copiedItem?.[DRAFT_STATE];
				if (childState && childState.modified_) continue;
				const path = basePath.concat([i]);
				patches.push({
					op: REPLACE,
					path,
					value: clonePatchValueIfNeeded(copiedItem)
				});
				inversePatches.push({
					op: REPLACE,
					path,
					value: clonePatchValueIfNeeded(baseItem)
				});
			}
		}
		for (let i = base_.length; i < copy_.length; i++) {
			const path = basePath.concat([i]);
			patches.push({
				op: ADD,
				path,
				value: clonePatchValueIfNeeded(copy_[i])
			});
		}
		for (let i = copy_.length - 1; base_.length <= i; --i) {
			const path = basePath.concat([i]);
			inversePatches.push({
				op: REMOVE,
				path
			});
		}
	}
	function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
		const { base_, copy_, type_ } = state;
		each(state.assigned_, (key, assignedValue) => {
			const origValue = get(base_, key, type_);
			const value = get(copy_, key, type_);
			const op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
			if (origValue === value && op === REPLACE) return;
			const path = basePath.concat(key);
			patches.push(op === REMOVE ? {
				op,
				path
			} : {
				op,
				path,
				value: clonePatchValueIfNeeded(value)
			});
			inversePatches.push(op === ADD ? {
				op: REMOVE,
				path
			} : op === REMOVE ? {
				op: ADD,
				path,
				value: clonePatchValueIfNeeded(origValue)
			} : {
				op: REPLACE,
				path,
				value: clonePatchValueIfNeeded(origValue)
			});
		});
	}
	function generateSetPatches(state, basePath, patches, inversePatches) {
		let { base_, copy_ } = state;
		let i = 0;
		base_.forEach((value) => {
			if (!copy_.has(value)) {
				const path = basePath.concat([i]);
				patches.push({
					op: REMOVE,
					path,
					value
				});
				inversePatches.unshift({
					op: ADD,
					path,
					value
				});
			}
			i++;
		});
		i = 0;
		copy_.forEach((value) => {
			if (!base_.has(value)) {
				const path = basePath.concat([i]);
				patches.push({
					op: ADD,
					path,
					value
				});
				inversePatches.unshift({
					op: REMOVE,
					path,
					value
				});
			}
			i++;
		});
	}
	function generateReplacementPatches_(baseValue, replacement, scope) {
		const { patches_, inversePatches_ } = scope;
		patches_.push({
			op: REPLACE,
			path: [],
			value: replacement === NOTHING ? void 0 : replacement
		});
		inversePatches_.push({
			op: REPLACE,
			path: [],
			value: baseValue
		});
	}
	function applyPatches_(draft, patches) {
		patches.forEach((patch) => {
			const { path, op } = patch;
			let base = draft;
			for (let i = 0; i < path.length - 1; i++) {
				const parentType = getArchtype(base);
				let p = path[i];
				if (typeof p !== "string" && typeof p !== "number") p = "" + p;
				if ((parentType === 0 || parentType === 1) && (p === "__proto__" || p === CONSTRUCTOR)) die(19);
				if (isFunction$1(base) && p === PROTOTYPE) die(19);
				base = get(base, p);
				if (!isObjectish(base)) die(18, path.join("/"));
			}
			const type = getArchtype(base);
			const value = deepClonePatchValue(patch.value);
			const key = path[path.length - 1];
			switch (op) {
				case REPLACE: switch (type) {
					case 2: return base.set(key, value);
					case 3: die(errorOffset);
					default: return base[key] = value;
				}
				case ADD: switch (type) {
					case 1: return key === "-" ? base.push(value) : base.splice(key, 0, value);
					case 2: return base.set(key, value);
					case 3: return base.add(value);
					default: return base[key] = value;
				}
				case REMOVE: switch (type) {
					case 1: return base.splice(key, 1);
					case 2: return base.delete(key);
					case 3: return base.delete(patch.value);
					default: return delete base[key];
				}
				default: die(17, op);
			}
		});
		return draft;
	}
	function deepClonePatchValue(obj) {
		if (!isDraftable(obj)) return obj;
		if (isArray(obj)) return obj.map(deepClonePatchValue);
		if (isMap(obj)) return new Map(Array.from(obj.entries()).map(([k, v]) => [k, deepClonePatchValue(v)]));
		if (isSet(obj)) return new Set(Array.from(obj).map(deepClonePatchValue));
		const cloned = Object.create(getPrototypeOf(obj));
		for (const key in obj) cloned[key] = deepClonePatchValue(obj[key]);
		if (has(obj, DRAFTABLE)) cloned[DRAFTABLE] = obj[DRAFTABLE];
		return cloned;
	}
	function clonePatchValueIfNeeded(obj) {
		if (isDraft(obj)) return deepClonePatchValue(obj);
		else return obj;
	}
	loadPlugin(PluginPatches, {
		applyPatches_,
		generatePatches_,
		generateReplacementPatches_,
		getPath
	});
}
var immer = new Immer2();
var produce = immer.produce;
var produceWithPatches = /* @__PURE__ */ immer.produceWithPatches.bind(immer);
var applyPatches = /* @__PURE__ */ immer.applyPatches.bind(immer);
//#endregion
//#region node_modules/reselect/dist/reselect.mjs
function assertIsFunction(func, errorMessage = `expected a function, instead received ${typeof func}`) {
	if (typeof func !== "function") throw new TypeError(errorMessage);
}
function assertIsArrayOfFunctions(array, errorMessage = `expected all items to be functions, instead received the following types: `) {
	if (!array.every((item) => typeof item === "function")) {
		const itemTypes = array.map((item) => typeof item === "function" ? `function ${item.name || "unnamed"}()` : typeof item).join(", ");
		throw new TypeError(`${errorMessage}[${itemTypes}]`);
	}
}
var ensureIsArray = (item) => {
	return Array.isArray(item) ? item : [item];
};
function getDependencies(createSelectorArgs) {
	const dependencies = Array.isArray(createSelectorArgs[0]) ? createSelectorArgs[0] : createSelectorArgs;
	assertIsArrayOfFunctions(dependencies, `createSelector expects all input-selectors to be functions, but received the following types: `);
	return dependencies;
}
function collectInputSelectorResults(dependencies, inputSelectorArgs) {
	const inputSelectorResults = [];
	const { length } = dependencies;
	for (let i = 0; i < length; i++) inputSelectorResults.push(dependencies[i].apply(null, inputSelectorArgs));
	return inputSelectorResults;
}
var StrongRef = class {
	constructor(value) {
		this.value = value;
	}
	deref() {
		return this.value;
	}
};
var getWeakRef = () => typeof WeakRef === "undefined" ? StrongRef : WeakRef;
var Ref = /* @__PURE__ */ getWeakRef();
var UNTERMINATED = 0;
var TERMINATED = 1;
function createCacheNode() {
	return {
		s: UNTERMINATED,
		v: void 0,
		o: null,
		p: null
	};
}
function maybeDeref(r) {
	if (r instanceof Ref) return r.deref();
	return r;
}
function weakMapMemoize(func, options = {}) {
	let fnNode = createCacheNode();
	const { resultEqualityCheck } = options;
	let lastResult;
	let resultsCount = 0;
	function memoized() {
		let cacheNode = fnNode;
		const { length } = arguments;
		for (let i = 0, l = length; i < l; i++) {
			const arg = arguments[i];
			if (typeof arg === "function" || typeof arg === "object" && arg !== null) {
				let objectCache = cacheNode.o;
				if (objectCache === null) cacheNode.o = objectCache = /* @__PURE__ */ new WeakMap();
				const objectNode = objectCache.get(arg);
				if (objectNode === void 0) {
					cacheNode = createCacheNode();
					objectCache.set(arg, cacheNode);
				} else cacheNode = objectNode;
			} else {
				let primitiveCache = cacheNode.p;
				if (primitiveCache === null) cacheNode.p = primitiveCache = /* @__PURE__ */ new Map();
				const primitiveNode = primitiveCache.get(arg);
				if (primitiveNode === void 0) {
					cacheNode = createCacheNode();
					primitiveCache.set(arg, cacheNode);
				} else cacheNode = primitiveNode;
			}
		}
		const terminatedNode = cacheNode;
		let result;
		if (cacheNode.s === TERMINATED) result = cacheNode.v;
		else {
			result = func.apply(null, arguments);
			resultsCount++;
			if (resultEqualityCheck) {
				const lastResultValue = maybeDeref(lastResult);
				if (lastResultValue != null && resultEqualityCheck(lastResultValue, result)) {
					result = lastResultValue;
					resultsCount !== 0 && resultsCount--;
				}
				lastResult = typeof result === "object" && result !== null || typeof result === "function" ? /* @__PURE__ */ new Ref(result) : result;
			}
		}
		terminatedNode.s = TERMINATED;
		terminatedNode.v = result;
		return result;
	}
	memoized.clearCache = () => {
		fnNode = createCacheNode();
		memoized.resetResultsCount();
	};
	memoized.resultsCount = () => resultsCount;
	memoized.resetResultsCount = () => {
		resultsCount = 0;
	};
	return memoized;
}
function createSelectorCreator(memoizeOrOptions, ...memoizeOptionsFromArgs) {
	const createSelectorCreatorOptions = typeof memoizeOrOptions === "function" ? {
		memoize: memoizeOrOptions,
		memoizeOptions: memoizeOptionsFromArgs
	} : memoizeOrOptions;
	const createSelector2 = (...createSelectorArgs) => {
		let recomputations = 0;
		let dependencyRecomputations = 0;
		let lastResult;
		let directlyPassedOptions = {};
		let resultFunc = createSelectorArgs.pop();
		if (typeof resultFunc === "object") {
			directlyPassedOptions = resultFunc;
			resultFunc = createSelectorArgs.pop();
		}
		assertIsFunction(resultFunc, `createSelector expects an output function after the inputs, but received: [${typeof resultFunc}]`);
		const { memoize, memoizeOptions = [], argsMemoize = weakMapMemoize, argsMemoizeOptions = [] } = {
			...createSelectorCreatorOptions,
			...directlyPassedOptions
		};
		const finalMemoizeOptions = ensureIsArray(memoizeOptions);
		const finalArgsMemoizeOptions = ensureIsArray(argsMemoizeOptions);
		const dependencies = getDependencies(createSelectorArgs);
		const memoizedResultFunc = memoize(function recomputationWrapper() {
			recomputations++;
			return resultFunc.apply(null, arguments);
		}, ...finalMemoizeOptions);
		const selector = argsMemoize(function dependenciesChecker() {
			dependencyRecomputations++;
			const inputSelectorResults = collectInputSelectorResults(dependencies, arguments);
			lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
			return lastResult;
		}, ...finalArgsMemoizeOptions);
		return Object.assign(selector, {
			resultFunc,
			memoizedResultFunc,
			dependencies,
			dependencyRecomputations: () => dependencyRecomputations,
			resetDependencyRecomputations: () => {
				dependencyRecomputations = 0;
			},
			lastResult: () => lastResult,
			recomputations: () => recomputations,
			resetRecomputations: () => {
				recomputations = 0;
			},
			memoize,
			argsMemoize
		});
	};
	Object.assign(createSelector2, { withTypes: () => createSelector2 });
	return createSelector2;
}
var createSelector = /* @__PURE__ */ createSelectorCreator(weakMapMemoize);
//#endregion
//#region node_modules/redux-thunk/dist/redux-thunk.mjs
function createThunkMiddleware(extraArgument) {
	const middleware = ({ dispatch, getState }) => (next) => (action) => {
		if (typeof action === "function") return action(dispatch, getState, extraArgument);
		return next(action);
	};
	return middleware;
}
var thunk = createThunkMiddleware();
var withExtraArgument = createThunkMiddleware;
//#endregion
//#region node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs
var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
	if (arguments.length === 0) return void 0;
	if (typeof arguments[0] === "object") return compose;
	return compose.apply(null, arguments);
};
typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__;
var hasMatchFunction = (v) => {
	return v && typeof v.match === "function";
};
function createAction(type, prepareAction) {
	function actionCreator(...args) {
		if (prepareAction) {
			let prepared = prepareAction(...args);
			if (!prepared) throw new Error(formatProdErrorMessage(0));
			return {
				type,
				payload: prepared.payload,
				..."meta" in prepared && { meta: prepared.meta },
				..."error" in prepared && { error: prepared.error }
			};
		}
		return {
			type,
			payload: args[0]
		};
	}
	actionCreator.toString = () => `${type}`;
	actionCreator.type = type;
	actionCreator.match = (action) => isAction(action) && action.type === type;
	return actionCreator;
}
var Tuple = class _Tuple extends Array {
	constructor(...items) {
		super(...items);
		Object.setPrototypeOf(this, _Tuple.prototype);
	}
	static get [Symbol.species]() {
		return _Tuple;
	}
	concat(...arr) {
		return super.concat.apply(this, arr);
	}
	prepend(...arr) {
		if (arr.length === 1 && Array.isArray(arr[0])) return new _Tuple(...arr[0].concat(this));
		return new _Tuple(...arr.concat(this));
	}
};
function freezeDraftable(val) {
	return isDraftable(val) ? produce(val, () => {}) : val;
}
function getOrInsertComputed$1(map, key, compute) {
	if (map.has(key)) return map.get(key);
	return map.set(key, compute(key)).get(key);
}
function isBoolean(x) {
	return typeof x === "boolean";
}
var buildGetDefaultMiddleware = () => function getDefaultMiddleware(options) {
	const { thunk: thunk$1 = true, immutableCheck = true, serializableCheck = true, actionCreatorCheck = true } = options ?? {};
	let middlewareArray = new Tuple();
	if (thunk$1) if (isBoolean(thunk$1)) middlewareArray.push(thunk);
	else middlewareArray.push(withExtraArgument(thunk$1.extraArgument));
	return middlewareArray;
};
var SHOULD_AUTOBATCH = "RTK_autoBatch";
var prepareAutoBatched = () => (payload) => ({
	payload,
	meta: { [SHOULD_AUTOBATCH]: true }
});
var createQueueWithTimer = (timeout) => {
	return (notify) => {
		setTimeout(notify, timeout);
	};
};
var createRafWithFallbackTimer = (raf, timeout) => {
	return (notify) => {
		let called = false;
		const callback = () => {
			if (called) return;
			called = true;
			cancelAnimationFrame(rafId);
			clearTimeout(timerId);
			notify();
		};
		const rafId = raf(callback);
		const timerId = setTimeout(callback, timeout);
	};
};
var autoBatchEnhancer = (options = { type: "raf" }) => (next) => (...args) => {
	const store = next(...args);
	let notifying = true;
	let shouldNotifyAtEndOfTick = false;
	let notificationQueued = false;
	const listeners = /* @__PURE__ */ new Set();
	const queueCallback = options.type === "tick" ? queueMicrotask : options.type === "raf" ? typeof window !== "undefined" && window.requestAnimationFrame ? createRafWithFallbackTimer(window.requestAnimationFrame, 100) : createQueueWithTimer(10) : options.type === "callback" ? options.queueNotification : createQueueWithTimer(options.timeout);
	const notifyListeners = () => {
		notificationQueued = false;
		if (shouldNotifyAtEndOfTick) {
			shouldNotifyAtEndOfTick = false;
			listeners.forEach((l) => l());
		}
	};
	return Object.assign({}, store, {
		subscribe(listener2) {
			const wrappedListener = () => notifying && listener2();
			const unsubscribe = store.subscribe(wrappedListener);
			listeners.add(listener2);
			return () => {
				unsubscribe();
				listeners.delete(listener2);
			};
		},
		dispatch(action) {
			try {
				notifying = !action?.meta?.[SHOULD_AUTOBATCH];
				shouldNotifyAtEndOfTick = !notifying;
				if (shouldNotifyAtEndOfTick) {
					if (!notificationQueued) {
						notificationQueued = true;
						queueCallback(notifyListeners);
					}
				}
				return store.dispatch(action);
			} finally {
				notifying = true;
			}
		}
	});
};
var buildGetDefaultEnhancers = (middlewareEnhancer) => function getDefaultEnhancers(options) {
	const { autoBatch = true } = options ?? {};
	let enhancerArray = new Tuple(middlewareEnhancer);
	if (autoBatch) enhancerArray.push(autoBatchEnhancer(typeof autoBatch === "object" ? autoBatch : void 0));
	return enhancerArray;
};
function configureStore(options) {
	const getDefaultMiddleware = buildGetDefaultMiddleware();
	const { reducer = void 0, middleware, devTools = true, duplicateMiddlewareCheck = true, preloadedState = void 0, enhancers = void 0 } = options || {};
	let rootReducer;
	if (typeof reducer === "function") rootReducer = reducer;
	else if (isPlainObject$1(reducer)) rootReducer = combineReducers(reducer);
	else throw new Error(formatProdErrorMessage(1));
	let finalMiddleware;
	if (typeof middleware === "function") finalMiddleware = middleware(getDefaultMiddleware);
	else finalMiddleware = getDefaultMiddleware();
	let finalCompose = compose;
	if (devTools) finalCompose = composeWithDevTools({
		trace: false,
		...typeof devTools === "object" && devTools
	});
	const getDefaultEnhancers = buildGetDefaultEnhancers(applyMiddleware(...finalMiddleware));
	let storeEnhancers = typeof enhancers === "function" ? enhancers(getDefaultEnhancers) : getDefaultEnhancers();
	const composedEnhancer = finalCompose(...storeEnhancers);
	return createStore(rootReducer, preloadedState, composedEnhancer);
}
function executeReducerBuilderCallback(builderCallback) {
	const actionsMap = {};
	const actionMatchers = [];
	let defaultCaseReducer;
	const builder = {
		addCase(typeOrActionCreator, reducer) {
			const type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
			if (!type) throw new Error(formatProdErrorMessage(28));
			if (type in actionsMap) throw new Error(formatProdErrorMessage(29));
			actionsMap[type] = reducer;
			return builder;
		},
		addAsyncThunk(asyncThunk, reducers) {
			if (reducers.pending) actionsMap[asyncThunk.pending.type] = reducers.pending;
			if (reducers.rejected) actionsMap[asyncThunk.rejected.type] = reducers.rejected;
			if (reducers.fulfilled) actionsMap[asyncThunk.fulfilled.type] = reducers.fulfilled;
			if (reducers.settled) actionMatchers.push({
				matcher: asyncThunk.settled,
				reducer: reducers.settled
			});
			return builder;
		},
		addMatcher(matcher, reducer) {
			actionMatchers.push({
				matcher,
				reducer
			});
			return builder;
		},
		addDefaultCase(reducer) {
			defaultCaseReducer = reducer;
			return builder;
		}
	};
	builderCallback(builder);
	return [
		actionsMap,
		actionMatchers,
		defaultCaseReducer
	];
}
function isStateFunction(x) {
	return typeof x === "function";
}
function createReducer(initialState, mapOrBuilderCallback) {
	let [actionsMap, finalActionMatchers, finalDefaultCaseReducer] = executeReducerBuilderCallback(mapOrBuilderCallback);
	let getInitialState;
	if (isStateFunction(initialState)) getInitialState = () => freezeDraftable(initialState());
	else {
		const frozenInitialState = freezeDraftable(initialState);
		getInitialState = () => frozenInitialState;
	}
	function reducer(state = getInitialState(), action) {
		let caseReducers = [actionsMap[action.type], ...finalActionMatchers.filter(({ matcher }) => matcher(action)).map(({ reducer: reducer2 }) => reducer2)];
		if (caseReducers.filter((cr) => !!cr).length === 0) caseReducers = [finalDefaultCaseReducer];
		return caseReducers.reduce((previousState, caseReducer) => {
			if (caseReducer) if (isDraft(previousState)) {
				const result = caseReducer(previousState, action);
				if (result === void 0) return previousState;
				return result;
			} else if (!isDraftable(previousState)) {
				const result = caseReducer(previousState, action);
				if (result === void 0) {
					if (previousState === null) return previousState;
					throw Error("A case reducer on a non-draftable value must not return undefined");
				}
				return result;
			} else return produce(previousState, (draft) => {
				return caseReducer(draft, action);
			});
			return previousState;
		}, state);
	}
	reducer.getInitialState = getInitialState;
	return reducer;
}
var matches = (matcher, action) => {
	if (hasMatchFunction(matcher)) return matcher.match(action);
	else return matcher(action);
};
function isAnyOf(...matchers) {
	return (action) => {
		return matchers.some((matcher) => matches(matcher, action));
	};
}
function isAllOf(...matchers) {
	return (action) => {
		return matchers.every((matcher) => matches(matcher, action));
	};
}
function hasExpectedRequestMetadata(action, validStatus) {
	if (!action || !action.meta) return false;
	const hasValidRequestId = typeof action.meta.requestId === "string";
	const hasValidRequestStatus = validStatus.indexOf(action.meta.requestStatus) > -1;
	return hasValidRequestId && hasValidRequestStatus;
}
function isAsyncThunkArray(a) {
	return typeof a[0] === "function" && "pending" in a[0] && "fulfilled" in a[0] && "rejected" in a[0];
}
function isPending(...asyncThunks) {
	if (asyncThunks.length === 0) return (action) => hasExpectedRequestMetadata(action, ["pending"]);
	if (!isAsyncThunkArray(asyncThunks)) return isPending()(asyncThunks[0]);
	return isAnyOf(...asyncThunks.map((asyncThunk) => asyncThunk.pending));
}
function isRejected(...asyncThunks) {
	if (asyncThunks.length === 0) return (action) => hasExpectedRequestMetadata(action, ["rejected"]);
	if (!isAsyncThunkArray(asyncThunks)) return isRejected()(asyncThunks[0]);
	return isAnyOf(...asyncThunks.map((asyncThunk) => asyncThunk.rejected));
}
function isRejectedWithValue(...asyncThunks) {
	const hasFlag = (action) => {
		return action && action.meta && action.meta.rejectedWithValue;
	};
	if (asyncThunks.length === 0) return isAllOf(isRejected(...asyncThunks), hasFlag);
	if (!isAsyncThunkArray(asyncThunks)) return isRejectedWithValue()(asyncThunks[0]);
	return isAllOf(isRejected(...asyncThunks), hasFlag);
}
function isFulfilled(...asyncThunks) {
	if (asyncThunks.length === 0) return (action) => hasExpectedRequestMetadata(action, ["fulfilled"]);
	if (!isAsyncThunkArray(asyncThunks)) return isFulfilled()(asyncThunks[0]);
	return isAnyOf(...asyncThunks.map((asyncThunk) => asyncThunk.fulfilled));
}
function isAsyncThunkAction(...asyncThunks) {
	if (asyncThunks.length === 0) return (action) => hasExpectedRequestMetadata(action, [
		"pending",
		"fulfilled",
		"rejected"
	]);
	if (!isAsyncThunkArray(asyncThunks)) return isAsyncThunkAction()(asyncThunks[0]);
	return isAnyOf(...asyncThunks.flatMap((asyncThunk) => [
		asyncThunk.pending,
		asyncThunk.rejected,
		asyncThunk.fulfilled
	]));
}
var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
var nanoid = (size = 21) => {
	let id = "";
	let i = size;
	while (i--) id += urlAlphabet[Math.random() * 64 | 0];
	return id;
};
var commonProperties = [
	"name",
	"message",
	"stack",
	"code"
];
var RejectWithValue = class {
	constructor(payload, meta) {
		this.payload = payload;
		this.meta = meta;
	}
	payload;
	meta;
	_type;
};
var FulfillWithMeta = class {
	constructor(payload, meta) {
		this.payload = payload;
		this.meta = meta;
	}
	payload;
	meta;
	_type;
};
var miniSerializeError = (value) => {
	if (typeof value === "object" && value !== null) {
		const simpleError = {};
		for (const property of commonProperties) if (typeof value[property] === "string") simpleError[property] = value[property];
		return simpleError;
	}
	return { message: String(value) };
};
var externalAbortMessage = "External signal was aborted";
var createAsyncThunk = /* @__PURE__ */ (() => {
	function createAsyncThunk2(typePrefix, payloadCreator, options) {
		const fulfilled = createAction(typePrefix + "/fulfilled", (payload, requestId, arg, meta) => ({
			payload,
			meta: {
				...meta || {},
				arg,
				requestId,
				requestStatus: "fulfilled"
			}
		}));
		const pending = createAction(typePrefix + "/pending", (requestId, arg, meta) => ({
			payload: void 0,
			meta: {
				...meta || {},
				arg,
				requestId,
				requestStatus: "pending"
			}
		}));
		const rejected = createAction(typePrefix + "/rejected", (error, requestId, arg, payload, meta) => ({
			payload,
			error: (options && options.serializeError || miniSerializeError)(error || "Rejected"),
			meta: {
				...meta || {},
				arg,
				requestId,
				rejectedWithValue: !!payload,
				requestStatus: "rejected",
				aborted: error?.name === "AbortError",
				condition: error?.name === "ConditionError"
			}
		}));
		function actionCreator(arg, { signal } = {}) {
			return (dispatch, getState, extra) => {
				const requestId = options?.idGenerator ? options.idGenerator(arg) : nanoid();
				const abortController = new AbortController();
				let abortHandler;
				let abortReason;
				function abort(reason) {
					abortReason = reason;
					abortController.abort();
				}
				if (signal) if (signal.aborted) abort(externalAbortMessage);
				else signal.addEventListener("abort", () => abort(externalAbortMessage), { once: true });
				const promise = (async function() {
					let finalAction;
					try {
						let conditionResult = options?.condition?.(arg, {
							getState,
							extra
						});
						if (isThenable(conditionResult)) conditionResult = await conditionResult;
						if (conditionResult === false || abortController.signal.aborted) throw {
							name: "ConditionError",
							message: "Aborted due to condition callback returning false."
						};
						const abortedPromise = new Promise((_, reject) => {
							abortHandler = () => {
								reject({
									name: "AbortError",
									message: abortReason || "Aborted"
								});
							};
							abortController.signal.addEventListener("abort", abortHandler, { once: true });
						});
						dispatch(pending(requestId, arg, options?.getPendingMeta?.({
							requestId,
							arg
						}, {
							getState,
							extra
						})));
						finalAction = await Promise.race([abortedPromise, Promise.resolve(payloadCreator(arg, {
							dispatch,
							getState,
							extra,
							requestId,
							signal: abortController.signal,
							abort,
							rejectWithValue: ((value, meta) => {
								return new RejectWithValue(value, meta);
							}),
							fulfillWithValue: ((value, meta) => {
								return new FulfillWithMeta(value, meta);
							})
						})).then((result) => {
							if (result instanceof RejectWithValue) throw result;
							if (result instanceof FulfillWithMeta) return fulfilled(result.payload, requestId, arg, result.meta);
							return fulfilled(result, requestId, arg);
						})]);
					} catch (err) {
						finalAction = err instanceof RejectWithValue ? rejected(null, requestId, arg, err.payload, err.meta) : rejected(err, requestId, arg);
					} finally {
						if (abortHandler) abortController.signal.removeEventListener("abort", abortHandler);
					}
					if (!(options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition)) dispatch(finalAction);
					return finalAction;
				})();
				return Object.assign(promise, {
					abort,
					requestId,
					arg,
					unwrap() {
						return promise.then(unwrapResult);
					}
				});
			};
		}
		return Object.assign(actionCreator, {
			pending,
			rejected,
			fulfilled,
			settled: isAnyOf(rejected, fulfilled),
			typePrefix
		});
	}
	createAsyncThunk2.withTypes = () => createAsyncThunk2;
	return createAsyncThunk2;
})();
function unwrapResult(action) {
	if (action.meta && action.meta.rejectedWithValue) throw action.payload;
	if (action.error) throw action.error;
	return action.payload;
}
function isThenable(value) {
	return value !== null && typeof value === "object" && typeof value.then === "function";
}
var asyncThunkSymbol = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function getType(slice, actionKey) {
	return `${slice}/${actionKey}`;
}
function buildCreateSlice({ creators } = {}) {
	const cAT = creators?.asyncThunk?.[asyncThunkSymbol];
	return function createSlice2(options) {
		const { name, reducerPath = name } = options;
		if (!name) throw new Error(formatProdErrorMessage(11));
		const reducers = (typeof options.reducers === "function" ? options.reducers(buildReducerCreators()) : options.reducers) || {};
		const reducerNames = Object.keys(reducers);
		const context = {
			sliceCaseReducersByName: {},
			sliceCaseReducersByType: {},
			actionCreators: {},
			sliceMatchers: []
		};
		const contextMethods = {
			addCase(typeOrActionCreator, reducer2) {
				const type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type;
				if (!type) throw new Error(formatProdErrorMessage(12));
				if (type in context.sliceCaseReducersByType) throw new Error(formatProdErrorMessage(13));
				context.sliceCaseReducersByType[type] = reducer2;
				return contextMethods;
			},
			addMatcher(matcher, reducer2) {
				context.sliceMatchers.push({
					matcher,
					reducer: reducer2
				});
				return contextMethods;
			},
			exposeAction(name2, actionCreator) {
				context.actionCreators[name2] = actionCreator;
				return contextMethods;
			},
			exposeCaseReducer(name2, reducer2) {
				context.sliceCaseReducersByName[name2] = reducer2;
				return contextMethods;
			}
		};
		reducerNames.forEach((reducerName) => {
			const reducerDefinition = reducers[reducerName];
			const reducerDetails = {
				reducerName,
				type: getType(name, reducerName),
				createNotation: typeof options.reducers === "function"
			};
			if (isAsyncThunkSliceReducerDefinition(reducerDefinition)) handleThunkCaseReducerDefinition(reducerDetails, reducerDefinition, contextMethods, cAT);
			else handleNormalReducerDefinition(reducerDetails, reducerDefinition, contextMethods);
		});
		function buildReducer() {
			const [extraReducers = {}, actionMatchers = [], defaultCaseReducer = void 0] = typeof options.extraReducers === "function" ? executeReducerBuilderCallback(options.extraReducers) : [options.extraReducers];
			const finalCaseReducers = {
				...extraReducers,
				...context.sliceCaseReducersByType
			};
			return createReducer(options.initialState, (builder) => {
				for (let key in finalCaseReducers) builder.addCase(key, finalCaseReducers[key]);
				for (let sM of context.sliceMatchers) builder.addMatcher(sM.matcher, sM.reducer);
				for (let m of actionMatchers) builder.addMatcher(m.matcher, m.reducer);
				if (defaultCaseReducer) builder.addDefaultCase(defaultCaseReducer);
			});
		}
		const selectSelf = (state) => state;
		const injectedSelectorCache = /* @__PURE__ */ new Map();
		const injectedStateCache = /* @__PURE__ */ new WeakMap();
		let _reducer;
		function reducer(state, action) {
			if (!_reducer) _reducer = buildReducer();
			return _reducer(state, action);
		}
		function getInitialState() {
			if (!_reducer) _reducer = buildReducer();
			return _reducer.getInitialState();
		}
		function makeSelectorProps(reducerPath2, injected = false) {
			function selectSlice(state) {
				let sliceState = state[reducerPath2];
				if (typeof sliceState === "undefined") {
					if (injected) sliceState = getOrInsertComputed$1(injectedStateCache, selectSlice, getInitialState);
				}
				return sliceState;
			}
			function getSelectors(selectState = selectSelf) {
				return getOrInsertComputed$1(getOrInsertComputed$1(injectedSelectorCache, injected, () => /* @__PURE__ */ new WeakMap()), selectState, () => {
					const map = {};
					for (const [name2, selector] of Object.entries(options.selectors ?? {})) map[name2] = wrapSelector(selector, selectState, () => getOrInsertComputed$1(injectedStateCache, selectState, getInitialState), injected);
					return map;
				});
			}
			return {
				reducerPath: reducerPath2,
				getSelectors,
				get selectors() {
					return getSelectors(selectSlice);
				},
				selectSlice
			};
		}
		const slice = {
			name,
			reducer,
			actions: context.actionCreators,
			caseReducers: context.sliceCaseReducersByName,
			getInitialState,
			...makeSelectorProps(reducerPath),
			injectInto(injectable, { reducerPath: pathOpt, ...config } = {}) {
				const newReducerPath = pathOpt ?? reducerPath;
				injectable.inject({
					reducerPath: newReducerPath,
					reducer
				}, config);
				return {
					...slice,
					...makeSelectorProps(newReducerPath, true)
				};
			}
		};
		return slice;
	};
}
function wrapSelector(selector, selectState, getInitialState, injected) {
	function wrapper(rootState, ...args) {
		let sliceState = selectState(rootState);
		if (typeof sliceState === "undefined") {
			if (injected) sliceState = getInitialState();
		}
		return selector(sliceState, ...args);
	}
	wrapper.unwrapped = selector;
	return wrapper;
}
var createSlice = /* @__PURE__ */ buildCreateSlice();
function buildReducerCreators() {
	function asyncThunk(payloadCreator, config) {
		return {
			_reducerDefinitionType: "asyncThunk",
			payloadCreator,
			...config
		};
	}
	asyncThunk.withTypes = () => asyncThunk;
	return {
		reducer(caseReducer) {
			return Object.assign({ [caseReducer.name](...args) {
				return caseReducer(...args);
			} }[caseReducer.name], { _reducerDefinitionType: "reducer" });
		},
		preparedReducer(prepare, reducer) {
			return {
				_reducerDefinitionType: "reducerWithPrepare",
				prepare,
				reducer
			};
		},
		asyncThunk
	};
}
function handleNormalReducerDefinition({ type, reducerName, createNotation }, maybeReducerWithPrepare, context) {
	let caseReducer;
	let prepareCallback;
	if ("reducer" in maybeReducerWithPrepare) {
		if (createNotation && !isCaseReducerWithPrepareDefinition(maybeReducerWithPrepare)) throw new Error(formatProdErrorMessage(17));
		caseReducer = maybeReducerWithPrepare.reducer;
		prepareCallback = maybeReducerWithPrepare.prepare;
	} else caseReducer = maybeReducerWithPrepare;
	context.addCase(type, caseReducer).exposeCaseReducer(reducerName, caseReducer).exposeAction(reducerName, prepareCallback ? createAction(type, prepareCallback) : createAction(type));
}
function isAsyncThunkSliceReducerDefinition(reducerDefinition) {
	return reducerDefinition._reducerDefinitionType === "asyncThunk";
}
function isCaseReducerWithPrepareDefinition(reducerDefinition) {
	return reducerDefinition._reducerDefinitionType === "reducerWithPrepare";
}
function handleThunkCaseReducerDefinition({ type, reducerName }, reducerDefinition, context, cAT) {
	if (!cAT) throw new Error(formatProdErrorMessage(18));
	const { payloadCreator, fulfilled, pending, rejected, settled, options } = reducerDefinition;
	const thunk = cAT(type, payloadCreator, options);
	context.exposeAction(reducerName, thunk);
	if (fulfilled) context.addCase(thunk.fulfilled, fulfilled);
	if (pending) context.addCase(thunk.pending, pending);
	if (rejected) context.addCase(thunk.rejected, rejected);
	if (settled) context.addMatcher(thunk.settled, settled);
	context.exposeCaseReducer(reducerName, {
		fulfilled: fulfilled || noop,
		pending: pending || noop,
		rejected: rejected || noop,
		settled: settled || noop
	});
}
function noop() {}
var listener = "listener";
var completed = "completed";
var cancelled = "cancelled";
`${cancelled}`;
`${completed}`;
`${listener}${cancelled}`;
`${listener}${completed}`;
var { assign } = Object;
var alm = "listenerMiddleware";
var addListener = /* @__PURE__ */ assign(/* @__PURE__ */ createAction(`${alm}/add`), { withTypes: () => addListener });
`${alm}`;
var removeListener = /* @__PURE__ */ assign(/* @__PURE__ */ createAction(`${alm}/remove`), { withTypes: () => removeListener });
function formatProdErrorMessage(code) {
	return `Minified Redux Toolkit error #${code}; visit https://redux-toolkit.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}
//#endregion
//#region node_modules/@standard-schema/utils/dist/index.js
var SchemaError = class extends Error {
	/**
	* The schema issues.
	*/
	issues;
	/**
	* Creates a schema error with useful information.
	*
	* @param issues The schema issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "SchemaError";
		this.issues = issues;
	}
};
//#endregion
//#region node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs
var QueryStatus = /* @__PURE__ */ ((QueryStatus7) => {
	QueryStatus7["uninitialized"] = "uninitialized";
	QueryStatus7["pending"] = "pending";
	QueryStatus7["fulfilled"] = "fulfilled";
	QueryStatus7["rejected"] = "rejected";
	return QueryStatus7;
})(QueryStatus || {});
var STATUS_UNINITIALIZED = "uninitialized";
var STATUS_PENDING = "pending";
var STATUS_FULFILLED = "fulfilled";
var STATUS_REJECTED = "rejected";
function getRequestStatusFlags(status) {
	return {
		status,
		isUninitialized: status === STATUS_UNINITIALIZED,
		isLoading: status === STATUS_PENDING,
		isSuccess: status === STATUS_FULFILLED,
		isError: status === STATUS_REJECTED
	};
}
var isPlainObject2 = isPlainObject$1;
function copyWithStructuralSharing(oldObj, newObj) {
	if (oldObj === newObj || !(isPlainObject2(oldObj) && isPlainObject2(newObj) || Array.isArray(oldObj) && Array.isArray(newObj))) return newObj;
	const newKeys = Object.keys(newObj);
	const oldKeys = Object.keys(oldObj);
	let isSameObject = newKeys.length === oldKeys.length;
	const mergeObj = Array.isArray(newObj) ? [] : {};
	for (const key of newKeys) {
		mergeObj[key] = copyWithStructuralSharing(oldObj[key], newObj[key]);
		if (isSameObject) isSameObject = oldObj[key] === mergeObj[key];
	}
	return isSameObject ? oldObj : mergeObj;
}
function filterMap(array, predicate, mapper) {
	return array.reduce((acc, item, i) => {
		if (predicate(item, i)) acc.push(mapper(item, i));
		return acc;
	}, []).flat();
}
function isAbsoluteUrl(url) {
	return new RegExp(`(^|:)//`).test(url);
}
function isDocumentVisible() {
	if (typeof document === "undefined") return true;
	return document.visibilityState !== "hidden";
}
function isNotNullish(v) {
	return v != null;
}
function filterNullishValues(map) {
	return [...map?.values() ?? []].filter(isNotNullish);
}
function isOnline() {
	return typeof navigator === "undefined" ? true : navigator.onLine === void 0 ? true : navigator.onLine;
}
var withoutTrailingSlash = (url) => url.replace(/\/$/, "");
var withoutLeadingSlash = (url) => url.replace(/^\//, "");
function joinUrls(base, url) {
	if (!base) return url;
	if (!url) return base;
	if (isAbsoluteUrl(url)) return url;
	const delimiter = base.endsWith("/") || !url.startsWith("?") ? "/" : "";
	base = withoutTrailingSlash(base);
	url = withoutLeadingSlash(url);
	return `${base}${delimiter}${url}`;
}
function getOrInsertComputed(map, key, compute) {
	if (map.has(key)) return map.get(key);
	return map.set(key, compute(key)).get(key);
}
var createNewMap = () => /* @__PURE__ */ new Map();
var timeoutSignal = (milliseconds) => {
	const abortController = new AbortController();
	setTimeout(() => {
		const message = "signal timed out";
		const name = "TimeoutError";
		abortController.abort(typeof DOMException !== "undefined" ? new DOMException(message, name) : Object.assign(/* @__PURE__ */ new Error(message), { name }));
	}, milliseconds);
	return abortController.signal;
};
var anySignal = (...signals) => {
	for (const signal of signals) if (signal.aborted) return AbortSignal.abort(signal.reason);
	const abortController = new AbortController();
	for (const signal of signals) signal.addEventListener("abort", () => abortController.abort(signal.reason), {
		signal: abortController.signal,
		once: true
	});
	return abortController.signal;
};
var defaultFetchFn = (...args) => fetch(...args);
var defaultValidateStatus = (response) => response.status >= 200 && response.status <= 299;
var defaultIsJsonContentType = (headers) => /ion\/(vnd\.api\+)?json/.test(headers.get("content-type") || "");
function stripUndefined(obj) {
	if (!isPlainObject$1(obj)) return obj;
	const copy = { ...obj };
	for (const [k, v] of Object.entries(copy)) if (v === void 0) delete copy[k];
	return copy;
}
var isJsonifiable = (body) => typeof body === "object" && (isPlainObject$1(body) || Array.isArray(body) || typeof body.toJSON === "function");
function fetchBaseQuery({ baseUrl, prepareHeaders = (x) => x, fetchFn = defaultFetchFn, paramsSerializer, isJsonContentType = defaultIsJsonContentType, jsonContentType = "application/json", jsonReplacer, timeout: defaultTimeout, responseHandler: globalResponseHandler, validateStatus: globalValidateStatus, ...baseFetchOptions } = {}) {
	if (typeof fetch === "undefined" && fetchFn === defaultFetchFn) console.warn("Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments.");
	return async (arg, api, extraOptions) => {
		const { getState, extra, endpoint, forced, type } = api;
		let meta;
		let { url, headers = new Headers(baseFetchOptions.headers), params = void 0, responseHandler = globalResponseHandler ?? "json", validateStatus = globalValidateStatus ?? defaultValidateStatus, timeout = defaultTimeout, ...rest } = typeof arg == "string" ? { url: arg } : arg;
		let config = {
			...baseFetchOptions,
			signal: timeout ? anySignal(api.signal, timeoutSignal(timeout)) : api.signal,
			...rest
		};
		headers = new Headers(stripUndefined(headers));
		config.headers = await prepareHeaders(headers, {
			getState,
			arg,
			extra,
			endpoint,
			forced,
			type,
			extraOptions
		}) || headers;
		const bodyIsJsonifiable = isJsonifiable(config.body);
		if (config.body != null && !bodyIsJsonifiable && typeof config.body !== "string") config.headers.delete("content-type");
		if (!config.headers.has("content-type") && bodyIsJsonifiable) config.headers.set("content-type", jsonContentType);
		if (bodyIsJsonifiable && isJsonContentType(config.headers)) config.body = JSON.stringify(config.body, jsonReplacer);
		if (!config.headers.has("accept")) {
			if (responseHandler === "json") config.headers.set("accept", "application/json");
			else if (responseHandler === "text") config.headers.set("accept", "text/plain, text/html, */*");
		}
		if (params) {
			const divider = ~url.indexOf("?") ? "&" : "?";
			const query = paramsSerializer ? paramsSerializer(params) : new URLSearchParams(stripUndefined(params));
			url += divider + query;
		}
		url = joinUrls(baseUrl, url);
		const request = new Request(url, config);
		meta = { request: new Request(url, config) };
		let response;
		try {
			response = await fetchFn(request);
		} catch (e) {
			return {
				error: {
					status: (e instanceof Error || typeof DOMException !== "undefined" && e instanceof DOMException) && e.name === "TimeoutError" ? "TIMEOUT_ERROR" : "FETCH_ERROR",
					error: String(e)
				},
				meta
			};
		}
		const responseClone = response.clone();
		meta.response = responseClone;
		let resultData;
		let responseText = "";
		try {
			let handleResponseError;
			await Promise.all([handleResponse(response, responseHandler).then((r) => resultData = r, (e) => handleResponseError = e), responseClone.text().then((r) => responseText = r, () => {})]);
			if (handleResponseError) throw handleResponseError;
		} catch (e) {
			return {
				error: {
					status: "PARSING_ERROR",
					originalStatus: response.status,
					data: responseText,
					error: String(e)
				},
				meta
			};
		}
		return validateStatus(response, resultData) ? {
			data: resultData,
			meta
		} : {
			error: {
				status: response.status,
				data: resultData
			},
			meta
		};
	};
	async function handleResponse(response, responseHandler) {
		if (typeof responseHandler === "function") return responseHandler(response);
		if (responseHandler === "content-type") responseHandler = isJsonContentType(response.headers) ? "json" : "text";
		if (responseHandler === "json") {
			const text = await response.text();
			return text.length ? JSON.parse(text) : null;
		}
		return response.text();
	}
}
var HandledError = class {
	constructor(value, meta = void 0) {
		this.value = value;
		this.meta = meta;
	}
	value;
	meta;
};
var INTERNAL_PREFIX = "__rtkq/";
var ONLINE = "online";
var OFFLINE = "offline";
var FOCUSED = "focused";
var onFocus = /* @__PURE__ */ createAction(`${INTERNAL_PREFIX}${FOCUSED}`);
var onFocusLost = /* @__PURE__ */ createAction(`${INTERNAL_PREFIX}un${FOCUSED}`);
var onOnline = /* @__PURE__ */ createAction(`${INTERNAL_PREFIX}${ONLINE}`);
var onOffline = /* @__PURE__ */ createAction(`${INTERNAL_PREFIX}${OFFLINE}`);
var ENDPOINT_QUERY$1 = "query";
var ENDPOINT_MUTATION$1 = "mutation";
var ENDPOINT_INFINITEQUERY$1 = "infinitequery";
function isQueryDefinition$1(e) {
	return e.type === ENDPOINT_QUERY$1;
}
function isMutationDefinition$1(e) {
	return e.type === ENDPOINT_MUTATION$1;
}
function isInfiniteQueryDefinition$1(e) {
	return e.type === ENDPOINT_INFINITEQUERY$1;
}
function isAnyQueryDefinition(e) {
	return isQueryDefinition$1(e) || isInfiniteQueryDefinition$1(e);
}
function calculateProvidedBy(description, result, error, queryArg, meta, assertTagTypes) {
	const finalDescription = isFunction(description) ? description(result, error, queryArg, meta) : description;
	if (finalDescription) return filterMap(finalDescription, isNotNullish, (tag) => assertTagTypes(expandTagDescription(tag)));
	return [];
}
function isFunction(t) {
	return typeof t === "function";
}
function expandTagDescription(description) {
	return typeof description === "string" ? { type: description } : description;
}
function asSafePromise(promise, fallback) {
	return promise.catch(fallback);
}
var getEndpointDefinition = (context, endpointName) => context.endpointDefinitions[endpointName];
var forceQueryFnSymbol = /* @__PURE__ */ Symbol("forceQueryFn");
var isUpsertQuery = (arg) => typeof arg[forceQueryFnSymbol] === "function";
function buildInitiate({ serializeQueryArgs, queryThunk, infiniteQueryThunk, mutationThunk, api, context, getInternalState }) {
	const getRunningQueries = (dispatch) => getInternalState(dispatch)?.runningQueries;
	const getRunningMutations = (dispatch) => getInternalState(dispatch)?.runningMutations;
	const { unsubscribeQueryResult, removeMutationResult, updateSubscriptionOptions } = api.internalActions;
	return {
		buildInitiateQuery,
		buildInitiateInfiniteQuery,
		buildInitiateMutation,
		getRunningQueryThunk,
		getRunningMutationThunk,
		getRunningQueriesThunk,
		getRunningMutationsThunk
	};
	function getRunningQueryThunk(endpointName, queryArgs) {
		return (dispatch) => {
			const queryCacheKey = serializeQueryArgs({
				queryArgs,
				endpointDefinition: getEndpointDefinition(context, endpointName),
				endpointName
			});
			return getRunningQueries(dispatch)?.get(queryCacheKey);
		};
	}
	function getRunningMutationThunk(_endpointName, fixedCacheKeyOrRequestId) {
		return (dispatch) => {
			return getRunningMutations(dispatch)?.get(fixedCacheKeyOrRequestId);
		};
	}
	function getRunningQueriesThunk() {
		return (dispatch) => filterNullishValues(getRunningQueries(dispatch));
	}
	function getRunningMutationsThunk() {
		return (dispatch) => filterNullishValues(getRunningMutations(dispatch));
	}
	function buildInitiateAnyQuery(endpointName, endpointDefinition) {
		const queryAction = (arg, { subscribe = true, forceRefetch, subscriptionOptions, [forceQueryFnSymbol]: forceQueryFn, ...rest } = {}) => (dispatch, getState) => {
			const queryCacheKey = serializeQueryArgs({
				queryArgs: arg,
				endpointDefinition,
				endpointName
			});
			let thunk;
			const commonThunkArgs = {
				...rest,
				type: ENDPOINT_QUERY$1,
				subscribe,
				forceRefetch,
				subscriptionOptions,
				endpointName,
				originalArgs: arg,
				queryCacheKey,
				[forceQueryFnSymbol]: forceQueryFn
			};
			if (isQueryDefinition$1(endpointDefinition)) thunk = queryThunk(commonThunkArgs);
			else {
				const { direction, initialPageParam, refetchCachedPages } = rest;
				thunk = infiniteQueryThunk({
					...commonThunkArgs,
					direction,
					initialPageParam,
					refetchCachedPages
				});
			}
			const selector = api.endpoints[endpointName].select(arg);
			const thunkResult = dispatch(thunk);
			const stateAfter = selector(getState());
			const { requestId, abort } = thunkResult;
			const skippedSynchronously = stateAfter.requestId !== requestId;
			const runningQuery = getRunningQueries(dispatch)?.get(queryCacheKey);
			const selectFromState = () => selector(getState());
			const statePromise = Object.assign(forceQueryFn ? thunkResult.then(selectFromState) : skippedSynchronously && !runningQuery ? Promise.resolve(stateAfter) : Promise.all([runningQuery, thunkResult]).then(selectFromState), {
				arg,
				requestId,
				subscriptionOptions,
				queryCacheKey,
				abort,
				async unwrap() {
					const result = await statePromise;
					if (result.isError) throw result.error;
					return result.data;
				},
				refetch: (options) => dispatch(queryAction(arg, {
					subscribe: false,
					forceRefetch: true,
					...options
				})),
				unsubscribe() {
					if (subscribe) dispatch(unsubscribeQueryResult({
						queryCacheKey,
						requestId
					}));
				},
				updateSubscriptionOptions(options) {
					statePromise.subscriptionOptions = options;
					dispatch(updateSubscriptionOptions({
						endpointName,
						requestId,
						queryCacheKey,
						options
					}));
				}
			});
			if (!runningQuery && !skippedSynchronously && !forceQueryFn) {
				const runningQueries = getRunningQueries(dispatch);
				runningQueries.set(queryCacheKey, statePromise);
				statePromise.then(() => {
					runningQueries.delete(queryCacheKey);
				});
			}
			return statePromise;
		};
		return queryAction;
	}
	function buildInitiateQuery(endpointName, endpointDefinition) {
		return buildInitiateAnyQuery(endpointName, endpointDefinition);
	}
	function buildInitiateInfiniteQuery(endpointName, endpointDefinition) {
		return buildInitiateAnyQuery(endpointName, endpointDefinition);
	}
	function buildInitiateMutation(endpointName) {
		return (arg, { track = true, fixedCacheKey } = {}) => (dispatch, getState) => {
			const thunkResult = dispatch(mutationThunk({
				type: "mutation",
				endpointName,
				originalArgs: arg,
				track,
				fixedCacheKey
			}));
			const { requestId, abort, unwrap } = thunkResult;
			const returnValuePromise = asSafePromise(thunkResult.unwrap().then((data) => ({ data })), (error) => ({ error }));
			const reset = () => {
				dispatch(removeMutationResult({
					requestId,
					fixedCacheKey
				}));
			};
			const ret = Object.assign(returnValuePromise, {
				arg: thunkResult.arg,
				requestId,
				abort,
				unwrap,
				reset
			});
			const runningMutations = getRunningMutations(dispatch);
			runningMutations.set(requestId, ret);
			ret.then(() => {
				runningMutations.delete(requestId);
			});
			if (fixedCacheKey) {
				runningMutations.set(fixedCacheKey, ret);
				ret.then(() => {
					if (runningMutations.get(fixedCacheKey) === ret) runningMutations.delete(fixedCacheKey);
				});
			}
			return ret;
		};
	}
}
var NamedSchemaError = class extends SchemaError {
	constructor(issues, value, schemaName, _bqMeta) {
		super(issues);
		this.value = value;
		this.schemaName = schemaName;
		this._bqMeta = _bqMeta;
	}
	value;
	schemaName;
	_bqMeta;
};
var shouldSkip = (skipSchemaValidation, schemaName) => Array.isArray(skipSchemaValidation) ? skipSchemaValidation.includes(schemaName) : !!skipSchemaValidation;
async function parseWithSchema(schema, data, schemaName, bqMeta) {
	const result = await schema["~standard"].validate(data);
	if (result.issues) throw new NamedSchemaError(result.issues, data, schemaName, bqMeta);
	return result.value;
}
function defaultTransformResponse(baseQueryReturnValue) {
	return baseQueryReturnValue;
}
var addShouldAutoBatch = (arg = {}) => {
	return {
		...arg,
		[SHOULD_AUTOBATCH]: true
	};
};
function buildThunks({ reducerPath, baseQuery, context: { endpointDefinitions }, serializeQueryArgs, api, assertTagType, selectors, onSchemaFailure, catchSchemaFailure: globalCatchSchemaFailure, skipSchemaValidation: globalSkipSchemaValidation }) {
	const patchQueryData = (endpointName, arg, patches, updateProvided) => (dispatch, getState) => {
		const endpointDefinition = endpointDefinitions[endpointName];
		const queryCacheKey = serializeQueryArgs({
			queryArgs: arg,
			endpointDefinition,
			endpointName
		});
		dispatch(api.internalActions.queryResultPatched({
			queryCacheKey,
			patches
		}));
		if (!updateProvided) return;
		const newValue = api.endpoints[endpointName].select(arg)(getState());
		const providedTags = calculateProvidedBy(endpointDefinition.providesTags, newValue.data, void 0, arg, {}, assertTagType);
		dispatch(api.internalActions.updateProvidedBy([{
			queryCacheKey,
			providedTags
		}]));
	};
	function addToStart(items, item, max = 0) {
		const newItems = [item, ...items];
		return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
	}
	function addToEnd(items, item, max = 0) {
		const newItems = [...items, item];
		return max && newItems.length > max ? newItems.slice(1) : newItems;
	}
	const updateQueryData = (endpointName, arg, updateRecipe, updateProvided = true) => (dispatch, getState) => {
		const currentState = api.endpoints[endpointName].select(arg)(getState());
		const ret = {
			patches: [],
			inversePatches: [],
			undo: () => dispatch(api.util.patchQueryData(endpointName, arg, ret.inversePatches, updateProvided))
		};
		if (currentState.status === STATUS_UNINITIALIZED) return ret;
		let newValue;
		if ("data" in currentState) if (isDraftable(currentState.data)) {
			const [value, patches, inversePatches] = produceWithPatches(currentState.data, updateRecipe);
			ret.patches.push(...patches);
			ret.inversePatches.push(...inversePatches);
			newValue = value;
		} else {
			newValue = updateRecipe(currentState.data);
			ret.patches.push({
				op: "replace",
				path: [],
				value: newValue
			});
			ret.inversePatches.push({
				op: "replace",
				path: [],
				value: currentState.data
			});
		}
		if (ret.patches.length === 0) return ret;
		dispatch(api.util.patchQueryData(endpointName, arg, ret.patches, updateProvided));
		return ret;
	};
	const upsertQueryData = (endpointName, arg, value) => (dispatch) => {
		return dispatch(api.endpoints[endpointName].initiate(arg, {
			subscribe: false,
			forceRefetch: true,
			[forceQueryFnSymbol]: () => ({ data: value })
		}));
	};
	const getTransformCallbackForEndpoint = (endpointDefinition, transformFieldName) => {
		return endpointDefinition.query && endpointDefinition[transformFieldName] ? endpointDefinition[transformFieldName] : defaultTransformResponse;
	};
	const executeEndpoint = async (arg, { signal, abort, rejectWithValue, fulfillWithValue, dispatch, getState, extra }) => {
		const endpointDefinition = endpointDefinitions[arg.endpointName];
		const { metaSchema, skipSchemaValidation = globalSkipSchemaValidation } = endpointDefinition;
		const isQuery = arg.type === ENDPOINT_QUERY$1;
		try {
			let transformResponse = defaultTransformResponse;
			const baseQueryApi = {
				signal,
				abort,
				dispatch,
				getState,
				extra,
				endpoint: arg.endpointName,
				type: arg.type,
				forced: isQuery ? isForcedQuery(arg, getState()) : void 0,
				queryCacheKey: isQuery ? arg.queryCacheKey : void 0
			};
			const forceQueryFn = isQuery ? arg[forceQueryFnSymbol] : void 0;
			let finalQueryReturnValue;
			const fetchPage = async (data, param, maxPages, previous) => {
				if (param == null && data.pages.length) return Promise.resolve({ data });
				const pageResponse = await executeRequest({
					queryArg: arg.originalArgs,
					pageParam: param
				});
				const addTo = previous ? addToStart : addToEnd;
				return {
					data: {
						pages: addTo(data.pages, pageResponse.data, maxPages),
						pageParams: addTo(data.pageParams, param, maxPages)
					},
					meta: pageResponse.meta
				};
			};
			async function executeRequest(finalQueryArg) {
				let result;
				const { extraOptions, argSchema, rawResponseSchema, responseSchema } = endpointDefinition;
				if (argSchema && !shouldSkip(skipSchemaValidation, "arg")) finalQueryArg = await parseWithSchema(argSchema, finalQueryArg, "argSchema", {});
				if (forceQueryFn) result = forceQueryFn();
				else if (endpointDefinition.query) {
					transformResponse = getTransformCallbackForEndpoint(endpointDefinition, "transformResponse");
					result = await baseQuery(endpointDefinition.query(finalQueryArg), baseQueryApi, extraOptions);
				} else result = await endpointDefinition.queryFn(finalQueryArg, baseQueryApi, extraOptions, (arg2) => baseQuery(arg2, baseQueryApi, extraOptions));
				if (result.error) throw new HandledError(result.error, result.meta);
				let { data } = result;
				if (rawResponseSchema && !shouldSkip(skipSchemaValidation, "rawResponse")) data = await parseWithSchema(rawResponseSchema, result.data, "rawResponseSchema", result.meta);
				let transformedResponse = await transformResponse(data, result.meta, finalQueryArg);
				if (responseSchema && !shouldSkip(skipSchemaValidation, "response")) transformedResponse = await parseWithSchema(responseSchema, transformedResponse, "responseSchema", result.meta);
				return {
					...result,
					data: transformedResponse
				};
			}
			if (isQuery && "infiniteQueryOptions" in endpointDefinition) {
				const { infiniteQueryOptions } = endpointDefinition;
				const { maxPages = Infinity } = infiniteQueryOptions;
				const refetchCachedPages = arg.refetchCachedPages ?? infiniteQueryOptions.refetchCachedPages ?? true;
				let result;
				const blankData = {
					pages: [],
					pageParams: []
				};
				const cachedData = selectors.selectQueryEntry(getState(), arg.queryCacheKey)?.data;
				const existingData = isForcedQuery(arg, getState()) && !arg.direction || !cachedData ? blankData : cachedData;
				if ("direction" in arg && arg.direction && existingData.pages.length) {
					const previous = arg.direction === "backward";
					result = await fetchPage(existingData, (previous ? getPreviousPageParam : getNextPageParam)(infiniteQueryOptions, existingData, arg.originalArgs), maxPages, previous);
				} else {
					const { initialPageParam = infiniteQueryOptions.initialPageParam } = arg;
					const cachedPageParams = cachedData?.pageParams ?? [];
					const firstPageParam = cachedPageParams[0] ?? initialPageParam;
					const totalPages = cachedPageParams.length;
					result = await fetchPage(existingData, firstPageParam, maxPages);
					if (forceQueryFn) result = { data: result.data.pages[0] };
					if (refetchCachedPages) for (let i = 1; i < totalPages; i++) {
						const param = getNextPageParam(infiniteQueryOptions, result.data, arg.originalArgs);
						result = await fetchPage(result.data, param, maxPages);
					}
				}
				finalQueryReturnValue = result;
			} else finalQueryReturnValue = await executeRequest(arg.originalArgs);
			if (metaSchema && !shouldSkip(skipSchemaValidation, "meta") && finalQueryReturnValue.meta) finalQueryReturnValue.meta = await parseWithSchema(metaSchema, finalQueryReturnValue.meta, "metaSchema", finalQueryReturnValue.meta);
			return fulfillWithValue(finalQueryReturnValue.data, addShouldAutoBatch({
				fulfilledTimeStamp: Date.now(),
				baseQueryMeta: finalQueryReturnValue.meta
			}));
		} catch (error) {
			let caughtError = error;
			if (caughtError instanceof HandledError) {
				let transformErrorResponse = getTransformCallbackForEndpoint(endpointDefinition, "transformErrorResponse");
				const { rawErrorResponseSchema, errorResponseSchema } = endpointDefinition;
				let { value, meta } = caughtError;
				try {
					if (rawErrorResponseSchema && !shouldSkip(skipSchemaValidation, "rawErrorResponse")) value = await parseWithSchema(rawErrorResponseSchema, value, "rawErrorResponseSchema", meta);
					if (metaSchema && !shouldSkip(skipSchemaValidation, "meta")) meta = await parseWithSchema(metaSchema, meta, "metaSchema", meta);
					let transformedErrorResponse = await transformErrorResponse(value, meta, arg.originalArgs);
					if (errorResponseSchema && !shouldSkip(skipSchemaValidation, "errorResponse")) transformedErrorResponse = await parseWithSchema(errorResponseSchema, transformedErrorResponse, "errorResponseSchema", meta);
					return rejectWithValue(transformedErrorResponse, addShouldAutoBatch({ baseQueryMeta: meta }));
				} catch (e) {
					caughtError = e;
				}
			}
			try {
				if (caughtError instanceof NamedSchemaError) {
					const info = {
						endpoint: arg.endpointName,
						arg: arg.originalArgs,
						type: arg.type,
						queryCacheKey: isQuery ? arg.queryCacheKey : void 0
					};
					endpointDefinition.onSchemaFailure?.(caughtError, info);
					onSchemaFailure?.(caughtError, info);
					const { catchSchemaFailure = globalCatchSchemaFailure } = endpointDefinition;
					if (catchSchemaFailure) return rejectWithValue(catchSchemaFailure(caughtError, info), addShouldAutoBatch({ baseQueryMeta: caughtError._bqMeta }));
				}
			} catch (e) {
				caughtError = e;
			}
			console.error(caughtError);
			throw caughtError;
		}
	};
	function isForcedQuery(arg, state) {
		const requestState = selectors.selectQueryEntry(state, arg.queryCacheKey);
		const baseFetchOnMountOrArgChange = selectors.selectConfig(state).refetchOnMountOrArgChange;
		const fulfilledVal = requestState?.fulfilledTimeStamp;
		const refetchVal = arg.forceRefetch ?? (arg.subscribe && baseFetchOnMountOrArgChange);
		if (refetchVal) return refetchVal === true || (Number(/* @__PURE__ */ new Date()) - Number(fulfilledVal)) / 1e3 >= refetchVal;
		return false;
	}
	const createQueryThunk = () => {
		return createAsyncThunk(`${reducerPath}/executeQuery`, executeEndpoint, {
			getPendingMeta({ arg }) {
				const endpointDefinition = endpointDefinitions[arg.endpointName];
				return addShouldAutoBatch({
					startedTimeStamp: Date.now(),
					...isInfiniteQueryDefinition$1(endpointDefinition) ? { direction: arg.direction } : {}
				});
			},
			condition(queryThunkArg, { getState }) {
				const state = getState();
				const requestState = selectors.selectQueryEntry(state, queryThunkArg.queryCacheKey);
				const fulfilledVal = requestState?.fulfilledTimeStamp;
				const currentArg = queryThunkArg.originalArgs;
				const previousArg = requestState?.originalArgs;
				const endpointDefinition = endpointDefinitions[queryThunkArg.endpointName];
				const direction = queryThunkArg.direction;
				if (isUpsertQuery(queryThunkArg)) return true;
				if (requestState?.status === "pending") return false;
				if (isForcedQuery(queryThunkArg, state)) return true;
				if (isQueryDefinition$1(endpointDefinition) && endpointDefinition?.forceRefetch?.({
					currentArg,
					previousArg,
					endpointState: requestState,
					state
				})) return true;
				if (fulfilledVal && !direction) return false;
				return true;
			},
			dispatchConditionRejection: true
		});
	};
	const queryThunk = createQueryThunk();
	const infiniteQueryThunk = createQueryThunk();
	const mutationThunk = createAsyncThunk(`${reducerPath}/executeMutation`, executeEndpoint, { getPendingMeta() {
		return addShouldAutoBatch({ startedTimeStamp: Date.now() });
	} });
	const hasTheForce = (options) => "force" in options;
	const hasMaxAge = (options) => "ifOlderThan" in options;
	const prefetch = (endpointName, arg, options = {}) => (dispatch, getState) => {
		const force = hasTheForce(options) && options.force;
		const maxAge = hasMaxAge(options) && options.ifOlderThan;
		const queryAction = (force2 = true) => {
			const options2 = {
				forceRefetch: force2,
				subscribe: false
			};
			return api.endpoints[endpointName].initiate(arg, options2);
		};
		const latestStateValue = api.endpoints[endpointName].select(arg)(getState());
		if (force) dispatch(queryAction());
		else if (maxAge) {
			const lastFulfilledTs = latestStateValue?.fulfilledTimeStamp;
			if (!lastFulfilledTs) {
				dispatch(queryAction());
				return;
			}
			if ((Number(/* @__PURE__ */ new Date()) - Number(new Date(lastFulfilledTs))) / 1e3 >= maxAge) dispatch(queryAction());
		} else dispatch(queryAction(false));
	};
	function matchesEndpoint(endpointName) {
		return (action) => action?.meta?.arg?.endpointName === endpointName;
	}
	function buildMatchThunkActions(thunk, endpointName) {
		return {
			matchPending: isAllOf(isPending(thunk), matchesEndpoint(endpointName)),
			matchFulfilled: isAllOf(isFulfilled(thunk), matchesEndpoint(endpointName)),
			matchRejected: isAllOf(isRejected(thunk), matchesEndpoint(endpointName))
		};
	}
	return {
		queryThunk,
		mutationThunk,
		infiniteQueryThunk,
		prefetch,
		updateQueryData,
		upsertQueryData,
		patchQueryData,
		buildMatchThunkActions
	};
}
function getNextPageParam(options, { pages, pageParams }, queryArg) {
	const lastIndex = pages.length - 1;
	return options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams, queryArg);
}
function getPreviousPageParam(options, { pages, pageParams }, queryArg) {
	return options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams, queryArg);
}
function calculateProvidedByThunk(action, type, endpointDefinitions, assertTagType) {
	return calculateProvidedBy(endpointDefinitions[action.meta.arg.endpointName][type], isFulfilled(action) ? action.payload : void 0, isRejectedWithValue(action) ? action.payload : void 0, action.meta.arg.originalArgs, "baseQueryMeta" in action.meta ? action.meta.baseQueryMeta : void 0, assertTagType);
}
function getCurrent(value) {
	return isDraft(value) ? current(value) : value;
}
function updateQuerySubstateIfExists(state, queryCacheKey, update) {
	const substate = state[queryCacheKey];
	if (substate) update(substate);
}
function getMutationCacheKey(id) {
	return ("arg" in id ? id.arg.fixedCacheKey : id.fixedCacheKey) ?? id.requestId;
}
function updateMutationSubstateIfExists(state, id, update) {
	const substate = state[getMutationCacheKey(id)];
	if (substate) update(substate);
}
var initialState = {};
function buildSlice({ reducerPath, queryThunk, mutationThunk, serializeQueryArgs, context: { endpointDefinitions: definitions, apiUid, extractRehydrationInfo, hasRehydrationInfo }, assertTagType, config }) {
	const resetApiState = createAction(`${reducerPath}/resetApiState`);
	function writePendingCacheEntry(draft, arg, upserting, meta) {
		draft[arg.queryCacheKey] ??= {
			status: STATUS_UNINITIALIZED,
			endpointName: arg.endpointName
		};
		updateQuerySubstateIfExists(draft, arg.queryCacheKey, (substate) => {
			substate.status = STATUS_PENDING;
			substate.requestId = upserting && substate.requestId ? substate.requestId : meta.requestId;
			if (arg.originalArgs !== void 0) substate.originalArgs = arg.originalArgs;
			substate.startedTimeStamp = meta.startedTimeStamp;
			const endpointDefinition = definitions[meta.arg.endpointName];
			if (isInfiniteQueryDefinition$1(endpointDefinition) && "direction" in arg) substate.direction = arg.direction;
		});
	}
	function writeFulfilledCacheEntry(draft, meta, payload, upserting) {
		updateQuerySubstateIfExists(draft, meta.arg.queryCacheKey, (substate) => {
			if (substate.requestId !== meta.requestId && !upserting) return;
			const { merge } = definitions[meta.arg.endpointName];
			substate.status = STATUS_FULFILLED;
			if (merge) if (substate.data !== void 0) {
				const { fulfilledTimeStamp, arg, baseQueryMeta, requestId } = meta;
				substate.data = produce(substate.data, (draftSubstateData) => {
					return merge(draftSubstateData, payload, {
						arg: arg.originalArgs,
						baseQueryMeta,
						fulfilledTimeStamp,
						requestId
					});
				});
			} else substate.data = payload;
			else substate.data = definitions[meta.arg.endpointName].structuralSharing ?? true ? copyWithStructuralSharing(isDraft(substate.data) ? original(substate.data) : substate.data, payload) : payload;
			delete substate.error;
			substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
		});
	}
	const querySlice = createSlice({
		name: `${reducerPath}/queries`,
		initialState,
		reducers: {
			removeQueryResult: {
				reducer(draft, { payload: { queryCacheKey } }) {
					delete draft[queryCacheKey];
				},
				prepare: prepareAutoBatched()
			},
			cacheEntriesUpserted: {
				reducer(draft, action) {
					for (const entry of action.payload) {
						const { queryDescription: arg, value } = entry;
						writePendingCacheEntry(draft, arg, true, {
							arg,
							requestId: action.meta.requestId,
							startedTimeStamp: action.meta.timestamp
						});
						writeFulfilledCacheEntry(draft, {
							arg,
							requestId: action.meta.requestId,
							fulfilledTimeStamp: action.meta.timestamp,
							baseQueryMeta: {}
						}, value, true);
					}
				},
				prepare: (payload) => {
					return {
						payload: payload.map((entry) => {
							const { endpointName, arg, value } = entry;
							const endpointDefinition = definitions[endpointName];
							return {
								queryDescription: {
									type: ENDPOINT_QUERY$1,
									endpointName,
									originalArgs: entry.arg,
									queryCacheKey: serializeQueryArgs({
										queryArgs: arg,
										endpointDefinition,
										endpointName
									})
								},
								value
							};
						}),
						meta: {
							[SHOULD_AUTOBATCH]: true,
							requestId: nanoid(),
							timestamp: Date.now()
						}
					};
				}
			},
			queryResultPatched: {
				reducer(draft, { payload: { queryCacheKey, patches } }) {
					updateQuerySubstateIfExists(draft, queryCacheKey, (substate) => {
						substate.data = applyPatches(substate.data, patches.concat());
					});
				},
				prepare: prepareAutoBatched()
			}
		},
		extraReducers(builder) {
			builder.addCase(queryThunk.pending, (draft, { meta, meta: { arg } }) => {
				writePendingCacheEntry(draft, arg, isUpsertQuery(arg), meta);
			}).addCase(queryThunk.fulfilled, (draft, { meta, payload }) => {
				writeFulfilledCacheEntry(draft, meta, payload, isUpsertQuery(meta.arg));
			}).addCase(queryThunk.rejected, (draft, { meta: { condition, arg, requestId }, error, payload }) => {
				updateQuerySubstateIfExists(draft, arg.queryCacheKey, (substate) => {
					if (condition) {} else {
						if (substate.requestId !== requestId) return;
						substate.status = STATUS_REJECTED;
						substate.error = payload ?? error;
					}
				});
			}).addMatcher(hasRehydrationInfo, (draft, action) => {
				const { queries } = extractRehydrationInfo(action);
				for (const [key, entry] of Object.entries(queries)) if (entry?.status === STATUS_FULFILLED || entry?.status === STATUS_REJECTED) draft[key] = entry;
			});
		}
	});
	const mutationSlice = createSlice({
		name: `${reducerPath}/mutations`,
		initialState,
		reducers: { removeMutationResult: {
			reducer(draft, { payload }) {
				const cacheKey = getMutationCacheKey(payload);
				if (cacheKey in draft) delete draft[cacheKey];
			},
			prepare: prepareAutoBatched()
		} },
		extraReducers(builder) {
			builder.addCase(mutationThunk.pending, (draft, { meta, meta: { requestId, arg, startedTimeStamp } }) => {
				if (!arg.track) return;
				draft[getMutationCacheKey(meta)] = {
					requestId,
					status: STATUS_PENDING,
					endpointName: arg.endpointName,
					startedTimeStamp
				};
			}).addCase(mutationThunk.fulfilled, (draft, { payload, meta }) => {
				if (!meta.arg.track) return;
				updateMutationSubstateIfExists(draft, meta, (substate) => {
					if (substate.requestId !== meta.requestId) return;
					substate.status = STATUS_FULFILLED;
					substate.data = payload;
					substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
				});
			}).addCase(mutationThunk.rejected, (draft, { payload, error, meta }) => {
				if (!meta.arg.track) return;
				updateMutationSubstateIfExists(draft, meta, (substate) => {
					if (substate.requestId !== meta.requestId) return;
					substate.status = STATUS_REJECTED;
					substate.error = payload ?? error;
				});
			}).addMatcher(hasRehydrationInfo, (draft, action) => {
				const { mutations } = extractRehydrationInfo(action);
				for (const [key, entry] of Object.entries(mutations)) if ((entry?.status === STATUS_FULFILLED || entry?.status === STATUS_REJECTED) && key !== entry?.requestId) draft[key] = entry;
			});
		}
	});
	const invalidationSlice = createSlice({
		name: `${reducerPath}/invalidation`,
		initialState: {
			tags: {},
			keys: {}
		},
		reducers: { updateProvidedBy: {
			reducer(draft, action) {
				for (const { queryCacheKey, providedTags } of action.payload) {
					removeCacheKeyFromTags(draft, queryCacheKey);
					for (const { type, id } of providedTags) {
						const subscribedQueries = (draft.tags[type] ??= {})[id || "__internal_without_id"] ??= [];
						if (!subscribedQueries.includes(queryCacheKey)) subscribedQueries.push(queryCacheKey);
					}
					draft.keys[queryCacheKey] = providedTags;
				}
			},
			prepare: prepareAutoBatched()
		} },
		extraReducers(builder) {
			builder.addCase(querySlice.actions.removeQueryResult, (draft, { payload: { queryCacheKey } }) => {
				removeCacheKeyFromTags(draft, queryCacheKey);
			}).addMatcher(hasRehydrationInfo, (draft, action) => {
				const { provided } = extractRehydrationInfo(action);
				for (const [type, incomingTags] of Object.entries(provided.tags ?? {})) for (const [id, cacheKeys] of Object.entries(incomingTags)) {
					const subscribedQueries = (draft.tags[type] ??= {})[id || "__internal_without_id"] ??= [];
					for (const queryCacheKey of cacheKeys) {
						if (!subscribedQueries.includes(queryCacheKey)) subscribedQueries.push(queryCacheKey);
						draft.keys[queryCacheKey] = provided.keys[queryCacheKey];
					}
				}
			}).addMatcher(isAnyOf(isFulfilled(queryThunk), isRejectedWithValue(queryThunk)), (draft, action) => {
				writeProvidedTagsForQueries(draft, [action]);
			}).addMatcher(querySlice.actions.cacheEntriesUpserted.match, (draft, action) => {
				writeProvidedTagsForQueries(draft, action.payload.map(({ queryDescription, value }) => {
					return {
						type: "UNKNOWN",
						payload: value,
						meta: {
							requestStatus: "fulfilled",
							requestId: "UNKNOWN",
							arg: queryDescription
						}
					};
				}));
			});
		}
	});
	function removeCacheKeyFromTags(draft, queryCacheKey) {
		const existingTags = getCurrent(draft.keys[queryCacheKey] ?? []);
		for (const tag of existingTags) {
			const tagType = tag.type;
			const tagId = tag.id ?? "__internal_without_id";
			const tagSubscriptions = draft.tags[tagType]?.[tagId];
			if (tagSubscriptions) draft.tags[tagType][tagId] = getCurrent(tagSubscriptions).filter((qc) => qc !== queryCacheKey);
		}
		delete draft.keys[queryCacheKey];
	}
	function writeProvidedTagsForQueries(draft, actions3) {
		const providedByEntries = actions3.map((action) => {
			const providedTags = calculateProvidedByThunk(action, "providesTags", definitions, assertTagType);
			const { queryCacheKey } = action.meta.arg;
			return {
				queryCacheKey,
				providedTags
			};
		});
		invalidationSlice.caseReducers.updateProvidedBy(draft, invalidationSlice.actions.updateProvidedBy(providedByEntries));
	}
	const subscriptionSlice = createSlice({
		name: `${reducerPath}/subscriptions`,
		initialState,
		reducers: {
			updateSubscriptionOptions(d, a) {},
			unsubscribeQueryResult(d, a) {},
			internal_getRTKQSubscriptions() {}
		}
	});
	const internalSubscriptionsSlice = createSlice({
		name: `${reducerPath}/internalSubscriptions`,
		initialState,
		reducers: { subscriptionsUpdated: {
			reducer(state, action) {
				return applyPatches(state, action.payload);
			},
			prepare: prepareAutoBatched()
		} }
	});
	const configSlice = createSlice({
		name: `${reducerPath}/config`,
		initialState: {
			online: isOnline(),
			focused: isDocumentVisible(),
			middlewareRegistered: false,
			...config
		},
		reducers: { middlewareRegistered(state, { payload }) {
			state.middlewareRegistered = state.middlewareRegistered === "conflict" || apiUid !== payload ? "conflict" : true;
		} },
		extraReducers: (builder) => {
			builder.addCase(onOnline, (state) => {
				state.online = true;
			}).addCase(onOffline, (state) => {
				state.online = false;
			}).addCase(onFocus, (state) => {
				state.focused = true;
			}).addCase(onFocusLost, (state) => {
				state.focused = false;
			}).addMatcher(hasRehydrationInfo, (draft) => ({ ...draft }));
		}
	});
	const combinedReducer = combineReducers({
		queries: querySlice.reducer,
		mutations: mutationSlice.reducer,
		provided: invalidationSlice.reducer,
		subscriptions: internalSubscriptionsSlice.reducer,
		config: configSlice.reducer
	});
	const reducer = (state, action) => combinedReducer(resetApiState.match(action) ? void 0 : state, action);
	return {
		reducer,
		actions: {
			...configSlice.actions,
			...querySlice.actions,
			...subscriptionSlice.actions,
			...internalSubscriptionsSlice.actions,
			...mutationSlice.actions,
			...invalidationSlice.actions,
			resetApiState
		}
	};
}
var skipToken = /* @__PURE__ */ Symbol.for("RTKQ/skipToken");
var initialSubState = { status: STATUS_UNINITIALIZED };
var defaultQuerySubState = /* @__PURE__ */ produce(initialSubState, () => {});
var defaultMutationSubState = /* @__PURE__ */ produce(initialSubState, () => {});
function buildSelectors({ serializeQueryArgs, reducerPath, createSelector: createSelector2 }) {
	const selectSkippedQuery = (state) => defaultQuerySubState;
	const selectSkippedMutation = (state) => defaultMutationSubState;
	return {
		buildQuerySelector,
		buildInfiniteQuerySelector,
		buildMutationSelector,
		selectInvalidatedBy,
		selectCachedArgsForQuery,
		selectApiState,
		selectQueries,
		selectMutations,
		selectQueryEntry,
		selectConfig
	};
	function withRequestFlags(substate) {
		return {
			...substate,
			...getRequestStatusFlags(substate.status)
		};
	}
	function selectApiState(rootState) {
		return rootState[reducerPath];
	}
	function selectQueries(rootState) {
		return selectApiState(rootState)?.queries;
	}
	function selectQueryEntry(rootState, cacheKey) {
		return selectQueries(rootState)?.[cacheKey];
	}
	function selectMutations(rootState) {
		return selectApiState(rootState)?.mutations;
	}
	function selectConfig(rootState) {
		return selectApiState(rootState)?.config;
	}
	function buildAnyQuerySelector(endpointName, endpointDefinition, combiner) {
		return (queryArgs) => {
			if (queryArgs === skipToken) return createSelector2(selectSkippedQuery, combiner);
			const serializedArgs = serializeQueryArgs({
				queryArgs,
				endpointDefinition,
				endpointName
			});
			const selectQuerySubstate = (state) => selectQueryEntry(state, serializedArgs) ?? defaultQuerySubState;
			return createSelector2(selectQuerySubstate, combiner);
		};
	}
	function buildQuerySelector(endpointName, endpointDefinition) {
		return buildAnyQuerySelector(endpointName, endpointDefinition, withRequestFlags);
	}
	function buildInfiniteQuerySelector(endpointName, endpointDefinition) {
		const { infiniteQueryOptions } = endpointDefinition;
		function withInfiniteQueryResultFlags(substate) {
			const stateWithRequestFlags = {
				...substate,
				...getRequestStatusFlags(substate.status)
			};
			const { isLoading, isError, direction } = stateWithRequestFlags;
			const isForward = direction === "forward";
			const isBackward = direction === "backward";
			return {
				...stateWithRequestFlags,
				hasNextPage: getHasNextPage(infiniteQueryOptions, stateWithRequestFlags.data, stateWithRequestFlags.originalArgs),
				hasPreviousPage: getHasPreviousPage(infiniteQueryOptions, stateWithRequestFlags.data, stateWithRequestFlags.originalArgs),
				isFetchingNextPage: isLoading && isForward,
				isFetchingPreviousPage: isLoading && isBackward,
				isFetchNextPageError: isError && isForward,
				isFetchPreviousPageError: isError && isBackward
			};
		}
		return buildAnyQuerySelector(endpointName, endpointDefinition, withInfiniteQueryResultFlags);
	}
	function buildMutationSelector() {
		return ((id) => {
			let mutationId;
			if (typeof id === "object") mutationId = getMutationCacheKey(id) ?? skipToken;
			else mutationId = id;
			const selectMutationSubstate = (state) => selectApiState(state)?.mutations?.[mutationId] ?? defaultMutationSubState;
			return createSelector2(mutationId === skipToken ? selectSkippedMutation : selectMutationSubstate, withRequestFlags);
		});
	}
	function selectInvalidatedBy(state, tags) {
		const apiState = state[reducerPath];
		const toInvalidate = /* @__PURE__ */ new Set();
		const finalTags = filterMap(tags, isNotNullish, expandTagDescription);
		for (const tag of finalTags) {
			const provided = apiState.provided.tags[tag.type];
			if (!provided) continue;
			let invalidateSubscriptions = (tag.id !== void 0 ? provided[tag.id] : Object.values(provided).flat()) ?? [];
			for (const invalidate of invalidateSubscriptions) toInvalidate.add(invalidate);
		}
		return Array.from(toInvalidate.values()).flatMap((queryCacheKey) => {
			const querySubState = apiState.queries[queryCacheKey];
			return querySubState ? {
				queryCacheKey,
				endpointName: querySubState.endpointName,
				originalArgs: querySubState.originalArgs
			} : [];
		});
	}
	function selectCachedArgsForQuery(state, queryName) {
		return filterMap(Object.values(selectQueries(state)), (entry) => entry?.endpointName === queryName && entry.status !== STATUS_UNINITIALIZED, (entry) => entry.originalArgs);
	}
	function getHasNextPage(options, data, queryArg) {
		if (!data) return false;
		return getNextPageParam(options, data, queryArg) != null;
	}
	function getHasPreviousPage(options, data, queryArg) {
		if (!data || !options.getPreviousPageParam) return false;
		return getPreviousPageParam(options, data, queryArg) != null;
	}
}
var cache = WeakMap ? /* @__PURE__ */ new WeakMap() : void 0;
var defaultSerializeQueryArgs = ({ endpointName, queryArgs }) => {
	let serialized = "";
	const cached = cache?.get(queryArgs);
	if (typeof cached === "string") serialized = cached;
	else {
		const stringified = JSON.stringify(queryArgs, (key, value) => {
			value = typeof value === "bigint" ? { $bigint: value.toString() } : value;
			value = isPlainObject$1(value) ? Object.keys(value).sort().reduce((acc, key2) => {
				acc[key2] = value[key2];
				return acc;
			}, {}) : value;
			return value;
		});
		if (isPlainObject$1(queryArgs)) cache?.set(queryArgs, stringified);
		serialized = stringified;
	}
	return `${endpointName}(${serialized})`;
};
function buildCreateApi(...modules) {
	return function baseCreateApi(options) {
		const extractRehydrationInfo = weakMapMemoize((action) => options.extractRehydrationInfo?.(action, { reducerPath: options.reducerPath ?? "api" }));
		const optionsWithDefaults = {
			reducerPath: "api",
			keepUnusedDataFor: 60,
			refetchOnMountOrArgChange: false,
			refetchOnFocus: false,
			refetchOnReconnect: false,
			invalidationBehavior: "delayed",
			...options,
			extractRehydrationInfo,
			serializeQueryArgs(queryArgsApi) {
				let finalSerializeQueryArgs = defaultSerializeQueryArgs;
				if ("serializeQueryArgs" in queryArgsApi.endpointDefinition) {
					const endpointSQA = queryArgsApi.endpointDefinition.serializeQueryArgs;
					finalSerializeQueryArgs = (queryArgsApi2) => {
						const initialResult = endpointSQA(queryArgsApi2);
						if (typeof initialResult === "string") return initialResult;
						else return defaultSerializeQueryArgs({
							...queryArgsApi2,
							queryArgs: initialResult
						});
					};
				} else if (options.serializeQueryArgs) finalSerializeQueryArgs = options.serializeQueryArgs;
				return finalSerializeQueryArgs(queryArgsApi);
			},
			tagTypes: [...options.tagTypes || []]
		};
		const context = {
			endpointDefinitions: {},
			batch(fn) {
				fn();
			},
			apiUid: nanoid(),
			extractRehydrationInfo,
			hasRehydrationInfo: weakMapMemoize((action) => extractRehydrationInfo(action) != null)
		};
		const api = {
			injectEndpoints,
			enhanceEndpoints({ addTagTypes, endpoints }) {
				if (addTagTypes) {
					for (const eT of addTagTypes) if (!optionsWithDefaults.tagTypes.includes(eT)) optionsWithDefaults.tagTypes.push(eT);
				}
				if (endpoints) for (const [endpointName, partialDefinition] of Object.entries(endpoints)) if (typeof partialDefinition === "function") partialDefinition(getEndpointDefinition(context, endpointName));
				else Object.assign(getEndpointDefinition(context, endpointName) || {}, partialDefinition);
				return api;
			}
		};
		const initializedModules = modules.map((m) => m.init(api, optionsWithDefaults, context));
		function injectEndpoints(inject) {
			const evaluatedEndpoints = inject.endpoints({
				query: (x) => ({
					...x,
					type: ENDPOINT_QUERY$1
				}),
				mutation: (x) => ({
					...x,
					type: ENDPOINT_MUTATION$1
				}),
				infiniteQuery: (x) => ({
					...x,
					type: ENDPOINT_INFINITEQUERY$1
				})
			});
			for (const [endpointName, definition] of Object.entries(evaluatedEndpoints)) {
				if (inject.overrideExisting !== true && endpointName in context.endpointDefinitions) {
					if (inject.overrideExisting === "throw") throw new Error(formatProdErrorMessage(39));
					continue;
				}
				context.endpointDefinitions[endpointName] = definition;
				for (const m of initializedModules) m.injectEndpoint(endpointName, definition);
			}
			return api;
		}
		return api.injectEndpoints({ endpoints: options.endpoints });
	};
}
function safeAssign$1(target, ...args) {
	return Object.assign(target, ...args);
}
var buildBatchedActionsHandler = ({ api, queryThunk, internalState, mwApi }) => {
	const subscriptionsPrefix = `${api.reducerPath}/subscriptions`;
	let previousSubscriptions = null;
	let updateSyncTimer = null;
	const { updateSubscriptionOptions, unsubscribeQueryResult } = api.internalActions;
	const actuallyMutateSubscriptions = (currentSubscriptions, action) => {
		if (updateSubscriptionOptions.match(action)) {
			const { queryCacheKey, requestId, options } = action.payload;
			const sub = currentSubscriptions.get(queryCacheKey);
			if (sub?.has(requestId)) sub.set(requestId, options);
			return true;
		}
		if (unsubscribeQueryResult.match(action)) {
			const { queryCacheKey, requestId } = action.payload;
			const sub = currentSubscriptions.get(queryCacheKey);
			if (sub) sub.delete(requestId);
			return true;
		}
		if (api.internalActions.removeQueryResult.match(action)) {
			currentSubscriptions.delete(action.payload.queryCacheKey);
			return true;
		}
		if (queryThunk.pending.match(action)) {
			const { meta: { arg, requestId } } = action;
			const substate = getOrInsertComputed(currentSubscriptions, arg.queryCacheKey, createNewMap);
			if (arg.subscribe) substate.set(requestId, arg.subscriptionOptions ?? substate.get(requestId) ?? {});
			return true;
		}
		let mutated = false;
		if (queryThunk.rejected.match(action)) {
			const { meta: { condition, arg, requestId } } = action;
			if (condition && arg.subscribe) {
				const substate = getOrInsertComputed(currentSubscriptions, arg.queryCacheKey, createNewMap);
				substate.set(requestId, arg.subscriptionOptions ?? substate.get(requestId) ?? {});
				mutated = true;
			}
		}
		return mutated;
	};
	const getSubscriptions = () => internalState.currentSubscriptions;
	const getSubscriptionCount = (queryCacheKey) => {
		return getSubscriptions().get(queryCacheKey)?.size ?? 0;
	};
	const isRequestSubscribed = (queryCacheKey, requestId) => {
		return !!getSubscriptions()?.get(queryCacheKey)?.get(requestId);
	};
	const subscriptionSelectors = {
		getSubscriptions,
		getSubscriptionCount,
		isRequestSubscribed
	};
	function serializeSubscriptions(currentSubscriptions) {
		return JSON.parse(JSON.stringify(Object.fromEntries([...currentSubscriptions].map(([k, v]) => [k, Object.fromEntries(v)]))));
	}
	return (action, mwApi2) => {
		if (!previousSubscriptions) previousSubscriptions = serializeSubscriptions(internalState.currentSubscriptions);
		if (api.util.resetApiState.match(action)) {
			previousSubscriptions = {};
			internalState.currentSubscriptions.clear();
			updateSyncTimer = null;
			return [true, false];
		}
		if (api.internalActions.internal_getRTKQSubscriptions.match(action)) return [false, subscriptionSelectors];
		const didMutate = actuallyMutateSubscriptions(internalState.currentSubscriptions, action);
		let actionShouldContinue = true;
		if (didMutate) {
			if (!updateSyncTimer) updateSyncTimer = setTimeout(() => {
				const newSubscriptions = serializeSubscriptions(internalState.currentSubscriptions);
				const [, patches] = produceWithPatches(previousSubscriptions, () => newSubscriptions);
				mwApi2.next(api.internalActions.subscriptionsUpdated(patches));
				previousSubscriptions = newSubscriptions;
				updateSyncTimer = null;
			}, 500);
			const isSubscriptionSliceAction = typeof action.type == "string" && !!action.type.startsWith(subscriptionsPrefix);
			const isAdditionalSubscriptionAction = queryThunk.rejected.match(action) && action.meta.condition && !!action.meta.arg.subscribe;
			actionShouldContinue = !isSubscriptionSliceAction && !isAdditionalSubscriptionAction;
		}
		return [actionShouldContinue, false];
	};
};
var THIRTY_TWO_BIT_MAX_TIMER_SECONDS = 2147483647 / 1e3 - 1;
var buildCacheCollectionHandler = ({ reducerPath, api, queryThunk, context, internalState, selectors: { selectQueryEntry, selectConfig }, getRunningQueryThunk, mwApi }) => {
	const { removeQueryResult, unsubscribeQueryResult, cacheEntriesUpserted } = api.internalActions;
	const canTriggerUnsubscribe = isAnyOf(unsubscribeQueryResult.match, queryThunk.fulfilled, queryThunk.rejected, cacheEntriesUpserted.match);
	function anySubscriptionsRemainingForKey(queryCacheKey) {
		const subscriptions = internalState.currentSubscriptions.get(queryCacheKey);
		if (!subscriptions) return false;
		return subscriptions.size > 0;
	}
	const currentRemovalTimeouts = {};
	function abortAllPromises(promiseMap) {
		for (const promise of promiseMap.values()) promise?.abort?.();
	}
	const handler = (action, mwApi2) => {
		const config = selectConfig(mwApi2.getState());
		if (canTriggerUnsubscribe(action)) {
			let queryCacheKeys;
			if (cacheEntriesUpserted.match(action)) queryCacheKeys = action.payload.map((entry) => entry.queryDescription.queryCacheKey);
			else {
				const { queryCacheKey } = unsubscribeQueryResult.match(action) ? action.payload : action.meta.arg;
				queryCacheKeys = [queryCacheKey];
			}
			handleUnsubscribeMany(queryCacheKeys, mwApi2, config);
		}
		if (api.util.resetApiState.match(action)) {
			for (const [key, timeout] of Object.entries(currentRemovalTimeouts)) {
				if (timeout) clearTimeout(timeout);
				delete currentRemovalTimeouts[key];
			}
			abortAllPromises(internalState.runningQueries);
			abortAllPromises(internalState.runningMutations);
		}
		if (context.hasRehydrationInfo(action)) {
			const { queries } = context.extractRehydrationInfo(action);
			handleUnsubscribeMany(Object.keys(queries), mwApi2, config);
		}
	};
	function handleUnsubscribeMany(cacheKeys, api2, config) {
		const state = api2.getState();
		for (const queryCacheKey of cacheKeys) {
			const entry = selectQueryEntry(state, queryCacheKey);
			if (entry?.endpointName) handleUnsubscribe(queryCacheKey, entry.endpointName, api2, config);
		}
	}
	function handleUnsubscribe(queryCacheKey, endpointName, api2, config) {
		const keepUnusedDataFor = getEndpointDefinition(context, endpointName)?.keepUnusedDataFor ?? config.keepUnusedDataFor;
		if (keepUnusedDataFor === Infinity) return;
		const finalKeepUnusedDataFor = Math.max(0, Math.min(keepUnusedDataFor, THIRTY_TWO_BIT_MAX_TIMER_SECONDS));
		if (!anySubscriptionsRemainingForKey(queryCacheKey)) {
			const currentTimeout = currentRemovalTimeouts[queryCacheKey];
			if (currentTimeout) clearTimeout(currentTimeout);
			currentRemovalTimeouts[queryCacheKey] = setTimeout(() => {
				if (!anySubscriptionsRemainingForKey(queryCacheKey)) {
					const entry = selectQueryEntry(api2.getState(), queryCacheKey);
					if (entry?.endpointName) api2.dispatch(getRunningQueryThunk(entry.endpointName, entry.originalArgs))?.abort();
					api2.dispatch(removeQueryResult({ queryCacheKey }));
				}
				delete currentRemovalTimeouts[queryCacheKey];
			}, finalKeepUnusedDataFor * 1e3);
		}
	}
	return handler;
};
var neverResolvedError = /* @__PURE__ */ new Error("Promise never resolved before cacheEntryRemoved.");
var buildCacheLifecycleHandler = ({ api, reducerPath, context, queryThunk, mutationThunk, internalState, selectors: { selectQueryEntry, selectApiState } }) => {
	const isQueryThunk = isAsyncThunkAction(queryThunk);
	const isMutationThunk = isAsyncThunkAction(mutationThunk);
	const isFulfilledThunk = isFulfilled(queryThunk, mutationThunk);
	const lifecycleMap = {};
	const { removeQueryResult, removeMutationResult, cacheEntriesUpserted } = api.internalActions;
	function resolveLifecycleEntry(cacheKey, data, meta) {
		const lifecycle = lifecycleMap[cacheKey];
		if (lifecycle?.valueResolved) {
			lifecycle.valueResolved({
				data,
				meta
			});
			delete lifecycle.valueResolved;
		}
	}
	function removeLifecycleEntry(cacheKey) {
		const lifecycle = lifecycleMap[cacheKey];
		if (lifecycle) {
			delete lifecycleMap[cacheKey];
			lifecycle.cacheEntryRemoved();
		}
	}
	function getActionMetaFields(action) {
		const { arg, requestId } = action.meta;
		const { endpointName, originalArgs } = arg;
		return [
			endpointName,
			originalArgs,
			requestId
		];
	}
	const handler = (action, mwApi, stateBefore) => {
		const cacheKey = getCacheKey(action);
		function checkForNewCacheKey(endpointName, cacheKey2, requestId, originalArgs) {
			const oldEntry = selectQueryEntry(stateBefore, cacheKey2);
			const newEntry = selectQueryEntry(mwApi.getState(), cacheKey2);
			if (!oldEntry && newEntry) handleNewKey(endpointName, originalArgs, cacheKey2, mwApi, requestId);
		}
		if (queryThunk.pending.match(action)) {
			const [endpointName, originalArgs, requestId] = getActionMetaFields(action);
			checkForNewCacheKey(endpointName, cacheKey, requestId, originalArgs);
		} else if (cacheEntriesUpserted.match(action)) for (const { queryDescription, value } of action.payload) {
			const { endpointName, originalArgs, queryCacheKey } = queryDescription;
			checkForNewCacheKey(endpointName, queryCacheKey, action.meta.requestId, originalArgs);
			resolveLifecycleEntry(queryCacheKey, value, {});
		}
		else if (mutationThunk.pending.match(action)) {
			if (mwApi.getState()[reducerPath].mutations[cacheKey]) {
				const [endpointName, originalArgs, requestId] = getActionMetaFields(action);
				handleNewKey(endpointName, originalArgs, cacheKey, mwApi, requestId);
			}
		} else if (isFulfilledThunk(action)) resolveLifecycleEntry(cacheKey, action.payload, action.meta.baseQueryMeta);
		else if (removeQueryResult.match(action) || removeMutationResult.match(action)) removeLifecycleEntry(cacheKey);
		else if (api.util.resetApiState.match(action)) for (const cacheKey2 of Object.keys(lifecycleMap)) removeLifecycleEntry(cacheKey2);
	};
	function getCacheKey(action) {
		if (isQueryThunk(action)) return action.meta.arg.queryCacheKey;
		if (isMutationThunk(action)) return action.meta.arg.fixedCacheKey ?? action.meta.requestId;
		if (removeQueryResult.match(action)) return action.payload.queryCacheKey;
		if (removeMutationResult.match(action)) return getMutationCacheKey(action.payload);
		return "";
	}
	function handleNewKey(endpointName, originalArgs, queryCacheKey, mwApi, requestId) {
		const endpointDefinition = getEndpointDefinition(context, endpointName);
		const onCacheEntryAdded = endpointDefinition?.onCacheEntryAdded;
		if (!onCacheEntryAdded) return;
		const lifecycle = {};
		const cacheEntryRemoved = new Promise((resolve) => {
			lifecycle.cacheEntryRemoved = resolve;
		});
		const cacheDataLoaded = Promise.race([new Promise((resolve) => {
			lifecycle.valueResolved = resolve;
		}), cacheEntryRemoved.then(() => {
			throw neverResolvedError;
		})]);
		cacheDataLoaded.catch(() => {});
		lifecycleMap[queryCacheKey] = lifecycle;
		const selector = api.endpoints[endpointName].select(isAnyQueryDefinition(endpointDefinition) ? originalArgs : queryCacheKey);
		const extra = mwApi.dispatch((_, __, extra2) => extra2);
		const runningHandler = onCacheEntryAdded(originalArgs, {
			...mwApi,
			getCacheEntry: () => selector(mwApi.getState()),
			requestId,
			extra,
			updateCachedData: isAnyQueryDefinition(endpointDefinition) ? (updateRecipe) => mwApi.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe)) : void 0,
			cacheDataLoaded,
			cacheEntryRemoved
		});
		Promise.resolve(runningHandler).catch((e) => {
			if (e === neverResolvedError) return;
			throw e;
		});
	}
	return handler;
};
var buildDevCheckHandler = ({ api, context: { apiUid }, reducerPath }) => {
	return (action, mwApi) => {
		if (api.util.resetApiState.match(action)) mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
	};
};
var buildInvalidationByTagsHandler = ({ reducerPath, context, context: { endpointDefinitions }, mutationThunk, queryThunk, api, assertTagType, refetchQuery, internalState }) => {
	const { removeQueryResult } = api.internalActions;
	const isThunkActionWithTags = isAnyOf(isFulfilled(mutationThunk), isRejectedWithValue(mutationThunk));
	const isQueryEnd = isAnyOf(isFulfilled(queryThunk, mutationThunk), isRejected(queryThunk, mutationThunk));
	let pendingTagInvalidations = [];
	let pendingRequestCount = 0;
	const handler = (action, mwApi) => {
		if (queryThunk.pending.match(action) || mutationThunk.pending.match(action)) pendingRequestCount++;
		if (isQueryEnd(action)) pendingRequestCount = Math.max(0, pendingRequestCount - 1);
		if (isThunkActionWithTags(action)) invalidateTags(calculateProvidedByThunk(action, "invalidatesTags", endpointDefinitions, assertTagType), mwApi);
		else if (isQueryEnd(action)) invalidateTags([], mwApi);
		else if (api.util.invalidateTags.match(action)) invalidateTags(calculateProvidedBy(action.payload, void 0, void 0, void 0, void 0, assertTagType), mwApi);
	};
	function hasPendingRequests() {
		return pendingRequestCount > 0;
	}
	function invalidateTags(newTags, mwApi) {
		const rootState = mwApi.getState();
		const state = rootState[reducerPath];
		pendingTagInvalidations.push(...newTags);
		if (state.config.invalidationBehavior === "delayed" && hasPendingRequests()) return;
		const tags = pendingTagInvalidations;
		pendingTagInvalidations = [];
		if (tags.length === 0) return;
		const toInvalidate = api.util.selectInvalidatedBy(rootState, tags);
		context.batch(() => {
			const valuesArray = Array.from(toInvalidate.values());
			for (const { queryCacheKey } of valuesArray) {
				const querySubState = state.queries[queryCacheKey];
				const subscriptionSubState = getOrInsertComputed(internalState.currentSubscriptions, queryCacheKey, createNewMap);
				if (querySubState) {
					if (subscriptionSubState.size === 0) mwApi.dispatch(removeQueryResult({ queryCacheKey }));
					else if (querySubState.status !== STATUS_UNINITIALIZED) mwApi.dispatch(refetchQuery(querySubState));
				}
			}
		});
	}
	return handler;
};
var buildPollingHandler = ({ reducerPath, queryThunk, api, refetchQuery, internalState }) => {
	const { currentPolls, currentSubscriptions } = internalState;
	const pendingPollingUpdates = /* @__PURE__ */ new Set();
	let pollingUpdateTimer = null;
	const handler = (action, mwApi) => {
		if (api.internalActions.updateSubscriptionOptions.match(action) || api.internalActions.unsubscribeQueryResult.match(action)) schedulePollingUpdate(action.payload.queryCacheKey, mwApi);
		if (queryThunk.pending.match(action) || queryThunk.rejected.match(action) && action.meta.condition) schedulePollingUpdate(action.meta.arg.queryCacheKey, mwApi);
		if (queryThunk.fulfilled.match(action) || queryThunk.rejected.match(action) && !action.meta.condition) startNextPoll(action.meta.arg, mwApi);
		if (api.util.resetApiState.match(action)) {
			clearPolls();
			if (pollingUpdateTimer) {
				clearTimeout(pollingUpdateTimer);
				pollingUpdateTimer = null;
			}
			pendingPollingUpdates.clear();
		}
	};
	function schedulePollingUpdate(queryCacheKey, api2) {
		pendingPollingUpdates.add(queryCacheKey);
		if (!pollingUpdateTimer) pollingUpdateTimer = setTimeout(() => {
			for (const key of pendingPollingUpdates) updatePollingInterval({ queryCacheKey: key }, api2);
			pendingPollingUpdates.clear();
			pollingUpdateTimer = null;
		}, 0);
	}
	function startNextPoll({ queryCacheKey }, api2) {
		const state = api2.getState()[reducerPath];
		const querySubState = state.queries[queryCacheKey];
		const subscriptions = currentSubscriptions.get(queryCacheKey);
		if (!querySubState || querySubState.status === STATUS_UNINITIALIZED) return;
		const { lowestPollingInterval, skipPollingIfUnfocused } = findLowestPollingInterval(subscriptions);
		if (!Number.isFinite(lowestPollingInterval)) return;
		const currentPoll = currentPolls.get(queryCacheKey);
		if (currentPoll?.timeout) {
			clearTimeout(currentPoll.timeout);
			currentPoll.timeout = void 0;
		}
		const nextPollTimestamp = Date.now() + lowestPollingInterval;
		currentPolls.set(queryCacheKey, {
			nextPollTimestamp,
			pollingInterval: lowestPollingInterval,
			timeout: setTimeout(() => {
				if (state.config.focused || !skipPollingIfUnfocused) api2.dispatch(refetchQuery(querySubState));
				startNextPoll({ queryCacheKey }, api2);
			}, lowestPollingInterval)
		});
	}
	function updatePollingInterval({ queryCacheKey }, api2) {
		const querySubState = api2.getState()[reducerPath].queries[queryCacheKey];
		const subscriptions = currentSubscriptions.get(queryCacheKey);
		if (!querySubState || querySubState.status === STATUS_UNINITIALIZED) return;
		const { lowestPollingInterval } = findLowestPollingInterval(subscriptions);
		if (!Number.isFinite(lowestPollingInterval)) {
			cleanupPollForKey(queryCacheKey);
			return;
		}
		const currentPoll = currentPolls.get(queryCacheKey);
		const nextPollTimestamp = Date.now() + lowestPollingInterval;
		if (!currentPoll || nextPollTimestamp < currentPoll.nextPollTimestamp) startNextPoll({ queryCacheKey }, api2);
	}
	function cleanupPollForKey(key) {
		const existingPoll = currentPolls.get(key);
		if (existingPoll?.timeout) clearTimeout(existingPoll.timeout);
		currentPolls.delete(key);
	}
	function clearPolls() {
		for (const key of currentPolls.keys()) cleanupPollForKey(key);
	}
	function findLowestPollingInterval(subscribers = /* @__PURE__ */ new Map()) {
		let skipPollingIfUnfocused = false;
		let lowestPollingInterval = Number.POSITIVE_INFINITY;
		for (const entry of subscribers.values()) if (!!entry.pollingInterval) {
			lowestPollingInterval = Math.min(entry.pollingInterval, lowestPollingInterval);
			skipPollingIfUnfocused = entry.skipPollingIfUnfocused || skipPollingIfUnfocused;
		}
		return {
			lowestPollingInterval,
			skipPollingIfUnfocused
		};
	}
	return handler;
};
var buildQueryLifecycleHandler = ({ api, context, queryThunk, mutationThunk }) => {
	const isPendingThunk = isPending(queryThunk, mutationThunk);
	const isRejectedThunk = isRejected(queryThunk, mutationThunk);
	const isFulfilledThunk = isFulfilled(queryThunk, mutationThunk);
	const lifecycleMap = {};
	const handler = (action, mwApi) => {
		if (isPendingThunk(action)) {
			const { requestId, arg: { endpointName, originalArgs } } = action.meta;
			const endpointDefinition = getEndpointDefinition(context, endpointName);
			const onQueryStarted = endpointDefinition?.onQueryStarted;
			if (onQueryStarted) {
				const lifecycle = {};
				const queryFulfilled = new Promise((resolve, reject) => {
					lifecycle.resolve = resolve;
					lifecycle.reject = reject;
				});
				queryFulfilled.catch(() => {});
				lifecycleMap[requestId] = lifecycle;
				const selector = api.endpoints[endpointName].select(isAnyQueryDefinition(endpointDefinition) ? originalArgs : requestId);
				const extra = mwApi.dispatch((_, __, extra2) => extra2);
				onQueryStarted(originalArgs, {
					...mwApi,
					getCacheEntry: () => selector(mwApi.getState()),
					requestId,
					extra,
					updateCachedData: isAnyQueryDefinition(endpointDefinition) ? (updateRecipe) => mwApi.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe)) : void 0,
					queryFulfilled
				});
			}
		} else if (isFulfilledThunk(action)) {
			const { requestId, baseQueryMeta } = action.meta;
			lifecycleMap[requestId]?.resolve({
				data: action.payload,
				meta: baseQueryMeta
			});
			delete lifecycleMap[requestId];
		} else if (isRejectedThunk(action)) {
			const { requestId, rejectedWithValue, baseQueryMeta } = action.meta;
			lifecycleMap[requestId]?.reject({
				error: action.payload ?? action.error,
				isUnhandledError: !rejectedWithValue,
				meta: baseQueryMeta
			});
			delete lifecycleMap[requestId];
		}
	};
	return handler;
};
var buildWindowEventHandler = ({ reducerPath, context, api, refetchQuery, internalState }) => {
	const { removeQueryResult } = api.internalActions;
	const handler = (action, mwApi) => {
		if (onFocus.match(action)) refetchValidQueries(mwApi, "refetchOnFocus");
		if (onOnline.match(action)) refetchValidQueries(mwApi, "refetchOnReconnect");
	};
	function refetchValidQueries(api2, type) {
		const state = api2.getState()[reducerPath];
		const queries = state.queries;
		const subscriptions = internalState.currentSubscriptions;
		context.batch(() => {
			for (const queryCacheKey of subscriptions.keys()) {
				const querySubState = queries[queryCacheKey];
				const subscriptionSubState = subscriptions.get(queryCacheKey);
				if (!subscriptionSubState || !querySubState) continue;
				const values = [...subscriptionSubState.values()];
				if (values.some((sub) => sub[type] === true) || values.every((sub) => sub[type] === void 0) && state.config[type]) {
					if (subscriptionSubState.size === 0) api2.dispatch(removeQueryResult({ queryCacheKey }));
					else if (querySubState.status !== STATUS_UNINITIALIZED) api2.dispatch(refetchQuery(querySubState));
				}
			}
		});
	}
	return handler;
};
function buildMiddleware(input) {
	const { reducerPath, queryThunk, api, context, getInternalState } = input;
	const { apiUid } = context;
	const actions2 = { invalidateTags: createAction(`${reducerPath}/invalidateTags`) };
	const isThisApiSliceAction = (action) => action.type.startsWith(`${reducerPath}/`);
	const handlerBuilders = [
		buildDevCheckHandler,
		buildCacheCollectionHandler,
		buildInvalidationByTagsHandler,
		buildPollingHandler,
		buildCacheLifecycleHandler,
		buildQueryLifecycleHandler
	];
	const middleware = (mwApi) => {
		let initialized2 = false;
		const internalState = getInternalState(mwApi.dispatch);
		const builderArgs = {
			...input,
			internalState,
			refetchQuery,
			isThisApiSliceAction,
			mwApi
		};
		const handlers = handlerBuilders.map((build) => build(builderArgs));
		const batchedActionsHandler = buildBatchedActionsHandler(builderArgs);
		const windowEventsHandler = buildWindowEventHandler(builderArgs);
		return (next) => {
			return (action) => {
				if (!isAction(action)) return next(action);
				if (!initialized2) {
					initialized2 = true;
					mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
				}
				const mwApiWithNext = {
					...mwApi,
					next
				};
				const stateBefore = mwApi.getState();
				const [actionShouldContinue, internalProbeResult] = batchedActionsHandler(action, mwApiWithNext, stateBefore);
				let res;
				if (actionShouldContinue) res = next(action);
				else res = internalProbeResult;
				if (!!mwApi.getState()[reducerPath]) {
					windowEventsHandler(action, mwApiWithNext, stateBefore);
					if (isThisApiSliceAction(action) || context.hasRehydrationInfo(action)) for (const handler of handlers) handler(action, mwApiWithNext, stateBefore);
				}
				return res;
			};
		};
	};
	return {
		middleware,
		actions: actions2
	};
	function refetchQuery(querySubState) {
		return input.api.endpoints[querySubState.endpointName].initiate(querySubState.originalArgs, {
			subscribe: false,
			forceRefetch: true
		});
	}
}
var coreModuleName = /* @__PURE__ */ Symbol();
var coreModule = ({ createSelector: createSelector2 = createSelector } = {}) => ({
	name: coreModuleName,
	init(api, { baseQuery, tagTypes, reducerPath, serializeQueryArgs, keepUnusedDataFor, refetchOnMountOrArgChange, refetchOnFocus, refetchOnReconnect, invalidationBehavior, onSchemaFailure, catchSchemaFailure, skipSchemaValidation }, context) {
		enablePatches();
		const assertTagType = (tag) => {
			return tag;
		};
		Object.assign(api, {
			reducerPath,
			endpoints: {},
			internalActions: {
				onOnline,
				onOffline,
				onFocus,
				onFocusLost
			},
			util: {}
		});
		const selectors = buildSelectors({
			serializeQueryArgs,
			reducerPath,
			createSelector: createSelector2
		});
		const { selectInvalidatedBy, selectCachedArgsForQuery, buildQuerySelector, buildInfiniteQuerySelector, buildMutationSelector } = selectors;
		safeAssign$1(api.util, {
			selectInvalidatedBy,
			selectCachedArgsForQuery
		});
		const { queryThunk, infiniteQueryThunk, mutationThunk, patchQueryData, updateQueryData, upsertQueryData, prefetch, buildMatchThunkActions } = buildThunks({
			baseQuery,
			reducerPath,
			context,
			api,
			serializeQueryArgs,
			assertTagType,
			selectors,
			onSchemaFailure,
			catchSchemaFailure,
			skipSchemaValidation
		});
		const { reducer, actions: sliceActions } = buildSlice({
			context,
			queryThunk,
			infiniteQueryThunk,
			mutationThunk,
			serializeQueryArgs,
			reducerPath,
			assertTagType,
			config: {
				refetchOnFocus,
				refetchOnReconnect,
				refetchOnMountOrArgChange,
				keepUnusedDataFor,
				reducerPath,
				invalidationBehavior
			}
		});
		safeAssign$1(api.util, {
			patchQueryData,
			updateQueryData,
			upsertQueryData,
			prefetch,
			resetApiState: sliceActions.resetApiState,
			upsertQueryEntries: sliceActions.cacheEntriesUpserted
		});
		safeAssign$1(api.internalActions, sliceActions);
		const internalStateMap = /* @__PURE__ */ new WeakMap();
		const getInternalState = (dispatch) => {
			return getOrInsertComputed(internalStateMap, dispatch, () => ({
				currentSubscriptions: /* @__PURE__ */ new Map(),
				currentPolls: /* @__PURE__ */ new Map(),
				runningQueries: /* @__PURE__ */ new Map(),
				runningMutations: /* @__PURE__ */ new Map()
			}));
		};
		const { buildInitiateQuery, buildInitiateInfiniteQuery, buildInitiateMutation, getRunningMutationThunk, getRunningMutationsThunk, getRunningQueriesThunk, getRunningQueryThunk } = buildInitiate({
			queryThunk,
			mutationThunk,
			infiniteQueryThunk,
			api,
			serializeQueryArgs,
			context,
			getInternalState
		});
		safeAssign$1(api.util, {
			getRunningMutationThunk,
			getRunningMutationsThunk,
			getRunningQueryThunk,
			getRunningQueriesThunk
		});
		const { middleware, actions: middlewareActions } = buildMiddleware({
			reducerPath,
			context,
			queryThunk,
			mutationThunk,
			infiniteQueryThunk,
			api,
			assertTagType,
			selectors,
			getRunningQueryThunk,
			getInternalState
		});
		safeAssign$1(api.util, middlewareActions);
		safeAssign$1(api, {
			reducer,
			middleware
		});
		return {
			name: coreModuleName,
			injectEndpoint(endpointName, definition) {
				const anyApi = api;
				const endpoint = anyApi.endpoints[endpointName] ??= {};
				if (isQueryDefinition$1(definition)) safeAssign$1(endpoint, {
					name: endpointName,
					select: buildQuerySelector(endpointName, definition),
					initiate: buildInitiateQuery(endpointName, definition)
				}, buildMatchThunkActions(queryThunk, endpointName));
				if (isMutationDefinition$1(definition)) safeAssign$1(endpoint, {
					name: endpointName,
					select: buildMutationSelector(),
					initiate: buildInitiateMutation(endpointName)
				}, buildMatchThunkActions(mutationThunk, endpointName));
				if (isInfiniteQueryDefinition$1(definition)) safeAssign$1(endpoint, {
					name: endpointName,
					select: buildInfiniteQuerySelector(endpointName, definition),
					initiate: buildInitiateInfiniteQuery(endpointName, definition)
				}, buildMatchThunkActions(queryThunk, endpointName));
			}
		};
	}
});
coreModule();
//#endregion
//#region node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs
function capitalize(str) {
	return str.replace(str[0], str[0].toUpperCase());
}
var ENDPOINT_QUERY = "query";
var ENDPOINT_MUTATION = "mutation";
var ENDPOINT_INFINITEQUERY = "infinitequery";
function isQueryDefinition(e) {
	return e.type === ENDPOINT_QUERY;
}
function isMutationDefinition(e) {
	return e.type === ENDPOINT_MUTATION;
}
function isInfiniteQueryDefinition(e) {
	return e.type === ENDPOINT_INFINITEQUERY;
}
function safeAssign(target, ...args) {
	return Object.assign(target, ...args);
}
var UNINITIALIZED_VALUE = /* @__PURE__ */ Symbol();
function useStableQueryArgs(queryArgs) {
	const cache = (0, import_react.useRef)(queryArgs);
	const copy = (0, import_react.useMemo)(() => copyWithStructuralSharing(cache.current, queryArgs), [queryArgs]);
	(0, import_react.useEffect)(() => {
		if (cache.current !== copy) cache.current = copy;
	}, [copy]);
	return copy;
}
function useShallowStableValue(value) {
	const cache = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		if (!shallowEqual(cache.current, value)) cache.current = value;
	}, [value]);
	return shallowEqual(cache.current, value) ? cache.current : value;
}
var canUseDOM = () => !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var isDOM = /* @__PURE__ */ canUseDOM();
var isRunningInReactNative = () => typeof navigator !== "undefined" && navigator.product === "ReactNative";
var isReactNative = /* @__PURE__ */ isRunningInReactNative();
var getUseIsomorphicLayoutEffect = () => isDOM || isReactNative ? import_react.useLayoutEffect : import_react.useEffect;
var useIsomorphicLayoutEffect = /* @__PURE__ */ getUseIsomorphicLayoutEffect();
var noPendingQueryStateSelector = (selected) => {
	if (selected.isUninitialized) return {
		...selected,
		isUninitialized: false,
		isFetching: true,
		isLoading: selected.data !== void 0 ? false : true,
		status: QueryStatus.pending
	};
	return selected;
};
function pick(obj, ...keys) {
	const ret = {};
	keys.forEach((key) => {
		ret[key] = obj[key];
	});
	return ret;
}
var COMMON_HOOK_DEBUG_FIELDS = [
	"data",
	"status",
	"isLoading",
	"isSuccess",
	"isError",
	"error"
];
function buildHooks({ api, moduleOptions: { batch, hooks: { useDispatch, useSelector, useStore }, unstable__sideEffectsInRender, createSelector }, serializeQueryArgs, context }) {
	const usePossiblyImmediateEffect = unstable__sideEffectsInRender ? (cb) => cb() : import_react.useEffect;
	const unsubscribePromiseRef = (ref) => ref.current?.unsubscribe?.();
	const endpointDefinitions = context.endpointDefinitions;
	return {
		buildQueryHooks,
		buildInfiniteQueryHooks,
		buildMutationHook,
		usePrefetch
	};
	function queryStatePreSelector(currentState, lastResult, queryArgs) {
		if (lastResult?.endpointName && currentState.isUninitialized) {
			const { endpointName } = lastResult;
			const endpointDefinition = endpointDefinitions[endpointName];
			if (queryArgs !== skipToken && serializeQueryArgs({
				queryArgs: lastResult.originalArgs,
				endpointDefinition,
				endpointName
			}) === serializeQueryArgs({
				queryArgs,
				endpointDefinition,
				endpointName
			})) lastResult = void 0;
		}
		let data = currentState.isSuccess ? currentState.data : lastResult?.data;
		if (data === void 0) data = currentState.data;
		const hasData = data !== void 0;
		const isFetching = currentState.isLoading;
		const isLoading = (!lastResult || lastResult.isLoading || lastResult.isUninitialized) && !hasData && isFetching;
		const isSuccess = currentState.isSuccess || hasData && (isFetching && !lastResult?.isError || currentState.isUninitialized);
		return {
			...currentState,
			data,
			currentData: currentState.data,
			isFetching,
			isLoading,
			isSuccess
		};
	}
	function infiniteQueryStatePreSelector(currentState, lastResult, queryArgs) {
		if (lastResult?.endpointName && currentState.isUninitialized) {
			const { endpointName } = lastResult;
			const endpointDefinition = endpointDefinitions[endpointName];
			if (queryArgs !== skipToken && serializeQueryArgs({
				queryArgs: lastResult.originalArgs,
				endpointDefinition,
				endpointName
			}) === serializeQueryArgs({
				queryArgs,
				endpointDefinition,
				endpointName
			})) lastResult = void 0;
		}
		let data = currentState.isSuccess ? currentState.data : lastResult?.data;
		if (data === void 0) data = currentState.data;
		const hasData = data !== void 0;
		const isFetching = currentState.isLoading;
		const isLoading = (!lastResult || lastResult.isLoading || lastResult.isUninitialized) && !hasData && isFetching;
		const isSuccess = currentState.isSuccess || hasData && (isFetching && !lastResult?.isError || currentState.isUninitialized);
		return {
			...currentState,
			data,
			currentData: currentState.data,
			isFetching,
			isLoading,
			isSuccess
		};
	}
	function usePrefetch(endpointName, defaultOptions) {
		const dispatch = useDispatch();
		const stableDefaultOptions = useShallowStableValue(defaultOptions);
		return (0, import_react.useCallback)((arg, options) => dispatch(api.util.prefetch(endpointName, arg, {
			...stableDefaultOptions,
			...options
		})), [
			endpointName,
			dispatch,
			stableDefaultOptions
		]);
	}
	function useQuerySubscriptionCommonImpl(endpointName, arg, { refetchOnReconnect, refetchOnFocus, refetchOnMountOrArgChange, skip = false, pollingInterval = 0, skipPollingIfUnfocused = false, ...rest } = {}) {
		const { initiate } = api.endpoints[endpointName];
		const dispatch = useDispatch();
		const subscriptionSelectorsRef = (0, import_react.useRef)(void 0);
		if (!subscriptionSelectorsRef.current) subscriptionSelectorsRef.current = dispatch(api.internalActions.internal_getRTKQSubscriptions());
		const stableArg = useStableQueryArgs(skip ? skipToken : arg);
		const stableSubscriptionOptions = useShallowStableValue({
			refetchOnReconnect,
			refetchOnFocus,
			pollingInterval,
			skipPollingIfUnfocused
		});
		const initialPageParam = rest.initialPageParam;
		const stableInitialPageParam = useShallowStableValue(initialPageParam);
		const refetchCachedPages = rest.refetchCachedPages;
		const stableRefetchCachedPages = useShallowStableValue(refetchCachedPages);
		const promiseRef = (0, import_react.useRef)(void 0);
		let { queryCacheKey, requestId } = promiseRef.current || {};
		let currentRenderHasSubscription = false;
		if (queryCacheKey && requestId) currentRenderHasSubscription = subscriptionSelectorsRef.current.isRequestSubscribed(queryCacheKey, requestId);
		const subscriptionRemoved = !currentRenderHasSubscription && promiseRef.current !== void 0;
		usePossiblyImmediateEffect(() => {
			if (subscriptionRemoved) promiseRef.current = void 0;
		}, [subscriptionRemoved]);
		usePossiblyImmediateEffect(() => {
			const lastPromise = promiseRef.current;
			if (stableArg === skipToken) {
				lastPromise?.unsubscribe();
				promiseRef.current = void 0;
				return;
			}
			const lastSubscriptionOptions = promiseRef.current?.subscriptionOptions;
			if (!lastPromise || lastPromise.arg !== stableArg) {
				lastPromise?.unsubscribe();
				promiseRef.current = dispatch(initiate(stableArg, {
					subscriptionOptions: stableSubscriptionOptions,
					forceRefetch: refetchOnMountOrArgChange,
					...isInfiniteQueryDefinition(endpointDefinitions[endpointName]) ? {
						initialPageParam: stableInitialPageParam,
						refetchCachedPages: stableRefetchCachedPages
					} : {}
				}));
			} else if (stableSubscriptionOptions !== lastSubscriptionOptions) lastPromise.updateSubscriptionOptions(stableSubscriptionOptions);
		}, [
			dispatch,
			initiate,
			refetchOnMountOrArgChange,
			stableArg,
			stableSubscriptionOptions,
			subscriptionRemoved,
			stableInitialPageParam,
			stableRefetchCachedPages,
			endpointName
		]);
		return [
			promiseRef,
			dispatch,
			initiate,
			stableSubscriptionOptions
		];
	}
	function buildUseQueryState(endpointName, preSelector) {
		const useQueryState = (arg, { skip = false, selectFromResult } = {}) => {
			const { select } = api.endpoints[endpointName];
			const stableArg = useStableQueryArgs(skip ? skipToken : arg);
			const lastValue = (0, import_react.useRef)(void 0);
			const selectDefaultResult = (0, import_react.useMemo)(() => createSelector([
				select(stableArg),
				(_, lastResult) => lastResult,
				(_) => stableArg
			], preSelector, { memoizeOptions: { resultEqualityCheck: shallowEqual } }), [select, stableArg]);
			const querySelector = (0, import_react.useMemo)(() => selectFromResult ? createSelector([selectDefaultResult], selectFromResult, { devModeChecks: { identityFunctionCheck: "never" } }) : selectDefaultResult, [selectDefaultResult, selectFromResult]);
			const currentState = useSelector((state) => querySelector(state, lastValue.current), shallowEqual);
			const newLastValue = selectDefaultResult(useStore().getState(), lastValue.current);
			useIsomorphicLayoutEffect(() => {
				lastValue.current = newLastValue;
			}, [newLastValue]);
			return currentState;
		};
		return useQueryState;
	}
	function usePromiseRefUnsubscribeOnUnmount(promiseRef) {
		(0, import_react.useEffect)(() => {
			return () => {
				unsubscribePromiseRef(promiseRef);
				promiseRef.current = void 0;
			};
		}, [promiseRef]);
	}
	function refetchOrErrorIfUnmounted(promiseRef) {
		if (!promiseRef.current) throw new Error(formatProdErrorMessage(38));
		return promiseRef.current.refetch();
	}
	function buildQueryHooks(endpointName) {
		const useQuerySubscription = (arg, options = {}) => {
			const [promiseRef] = useQuerySubscriptionCommonImpl(endpointName, arg, options);
			usePromiseRefUnsubscribeOnUnmount(promiseRef);
			return (0, import_react.useMemo)(() => ({ 
			/**
			* A method to manually refetch data for the query
			*/
refetch: () => refetchOrErrorIfUnmounted(promiseRef) }), [promiseRef]);
		};
		const useLazyQuerySubscription = ({ refetchOnReconnect, refetchOnFocus, pollingInterval = 0, skipPollingIfUnfocused = false } = {}) => {
			const { initiate } = api.endpoints[endpointName];
			const dispatch = useDispatch();
			const [arg, setArg] = (0, import_react.useState)(UNINITIALIZED_VALUE);
			const promiseRef = (0, import_react.useRef)(void 0);
			const stableSubscriptionOptions = useShallowStableValue({
				refetchOnReconnect,
				refetchOnFocus,
				pollingInterval,
				skipPollingIfUnfocused
			});
			usePossiblyImmediateEffect(() => {
				if (stableSubscriptionOptions !== promiseRef.current?.subscriptionOptions) promiseRef.current?.updateSubscriptionOptions(stableSubscriptionOptions);
			}, [stableSubscriptionOptions]);
			const subscriptionOptionsRef = (0, import_react.useRef)(stableSubscriptionOptions);
			usePossiblyImmediateEffect(() => {
				subscriptionOptionsRef.current = stableSubscriptionOptions;
			}, [stableSubscriptionOptions]);
			const trigger = (0, import_react.useCallback)(function(arg2, preferCacheValue = false) {
				let promise;
				batch(() => {
					unsubscribePromiseRef(promiseRef);
					promiseRef.current = promise = dispatch(initiate(arg2, {
						subscriptionOptions: subscriptionOptionsRef.current,
						forceRefetch: !preferCacheValue
					}));
					setArg(arg2);
				});
				return promise;
			}, [dispatch, initiate]);
			const reset = (0, import_react.useCallback)(() => {
				if (promiseRef.current?.queryCacheKey) dispatch(api.internalActions.removeQueryResult({ queryCacheKey: promiseRef.current?.queryCacheKey }));
			}, [dispatch]);
			(0, import_react.useEffect)(() => {
				return () => {
					unsubscribePromiseRef(promiseRef);
				};
			}, []);
			(0, import_react.useEffect)(() => {
				if (arg !== UNINITIALIZED_VALUE && !promiseRef.current) trigger(arg, true);
			}, [arg, trigger]);
			return (0, import_react.useMemo)(() => [
				trigger,
				arg,
				{ reset }
			], [
				trigger,
				arg,
				reset
			]);
		};
		const useQueryState = buildUseQueryState(endpointName, queryStatePreSelector);
		return {
			useQueryState,
			useQuerySubscription,
			useLazyQuerySubscription,
			useLazyQuery(options) {
				const [trigger, arg, { reset }] = useLazyQuerySubscription(options);
				const queryStateResults = useQueryState(arg, {
					...options,
					skip: arg === UNINITIALIZED_VALUE
				});
				const info = (0, import_react.useMemo)(() => ({ lastArg: arg }), [arg]);
				return (0, import_react.useMemo)(() => [
					trigger,
					{
						...queryStateResults,
						reset
					},
					info
				], [
					trigger,
					queryStateResults,
					reset,
					info
				]);
			},
			useQuery(arg, options) {
				const querySubscriptionResults = useQuerySubscription(arg, options);
				const queryStateResults = useQueryState(arg, {
					selectFromResult: arg === skipToken || options?.skip ? void 0 : noPendingQueryStateSelector,
					...options
				});
				(0, import_react.useDebugValue)(pick(queryStateResults, ...COMMON_HOOK_DEBUG_FIELDS));
				return (0, import_react.useMemo)(() => ({
					...queryStateResults,
					...querySubscriptionResults
				}), [queryStateResults, querySubscriptionResults]);
			}
		};
	}
	function buildInfiniteQueryHooks(endpointName) {
		const useInfiniteQuerySubscription = (arg, options = {}) => {
			const [promiseRef, dispatch, initiate, stableSubscriptionOptions] = useQuerySubscriptionCommonImpl(endpointName, arg, options);
			const subscriptionOptionsRef = (0, import_react.useRef)(stableSubscriptionOptions);
			usePossiblyImmediateEffect(() => {
				subscriptionOptionsRef.current = stableSubscriptionOptions;
			}, [stableSubscriptionOptions]);
			const hookRefetchCachedPages = options.refetchCachedPages;
			const stableHookRefetchCachedPages = useShallowStableValue(hookRefetchCachedPages);
			const trigger = (0, import_react.useCallback)(function(arg2, direction) {
				let promise;
				batch(() => {
					unsubscribePromiseRef(promiseRef);
					promiseRef.current = promise = dispatch(initiate(arg2, {
						subscriptionOptions: subscriptionOptionsRef.current,
						direction
					}));
				});
				return promise;
			}, [
				promiseRef,
				dispatch,
				initiate
			]);
			usePromiseRefUnsubscribeOnUnmount(promiseRef);
			const stableArg = useStableQueryArgs(options.skip ? skipToken : arg);
			const refetch = (0, import_react.useCallback)((options2) => {
				if (!promiseRef.current) throw new Error(formatProdErrorMessage(38));
				const mergedOptions = { refetchCachedPages: options2?.refetchCachedPages ?? stableHookRefetchCachedPages };
				return promiseRef.current.refetch(mergedOptions);
			}, [promiseRef, stableHookRefetchCachedPages]);
			return (0, import_react.useMemo)(() => {
				const fetchNextPage = () => {
					return trigger(stableArg, "forward");
				};
				const fetchPreviousPage = () => {
					return trigger(stableArg, "backward");
				};
				return {
					trigger,
					/**
					* A method to manually refetch data for the query
					*/
					refetch,
					fetchNextPage,
					fetchPreviousPage
				};
			}, [
				refetch,
				trigger,
				stableArg
			]);
		};
		const useInfiniteQueryState = buildUseQueryState(endpointName, infiniteQueryStatePreSelector);
		return {
			useInfiniteQueryState,
			useInfiniteQuerySubscription,
			useInfiniteQuery(arg, options) {
				const { refetch, fetchNextPage, fetchPreviousPage } = useInfiniteQuerySubscription(arg, options);
				const queryStateResults = useInfiniteQueryState(arg, {
					selectFromResult: arg === skipToken || options?.skip ? void 0 : noPendingQueryStateSelector,
					...options
				});
				(0, import_react.useDebugValue)(pick(queryStateResults, ...COMMON_HOOK_DEBUG_FIELDS, "hasNextPage", "hasPreviousPage"));
				return (0, import_react.useMemo)(() => ({
					...queryStateResults,
					fetchNextPage,
					fetchPreviousPage,
					refetch
				}), [
					queryStateResults,
					fetchNextPage,
					fetchPreviousPage,
					refetch
				]);
			}
		};
	}
	function buildMutationHook(name) {
		return ({ selectFromResult, fixedCacheKey } = {}) => {
			const { select, initiate } = api.endpoints[name];
			const dispatch = useDispatch();
			const [promise, setPromise] = (0, import_react.useState)();
			(0, import_react.useEffect)(() => () => {
				if (!promise?.arg.fixedCacheKey) promise?.reset();
			}, [promise]);
			const triggerMutation = (0, import_react.useCallback)(function(arg) {
				const promise2 = dispatch(initiate(arg, { fixedCacheKey }));
				setPromise(promise2);
				return promise2;
			}, [
				dispatch,
				initiate,
				fixedCacheKey
			]);
			const { requestId } = promise || {};
			const selectDefaultResult = (0, import_react.useMemo)(() => select({
				fixedCacheKey,
				requestId: promise?.requestId
			}), [
				fixedCacheKey,
				promise,
				select
			]);
			const currentState = useSelector((0, import_react.useMemo)(() => selectFromResult ? createSelector([selectDefaultResult], selectFromResult) : selectDefaultResult, [selectFromResult, selectDefaultResult]), shallowEqual);
			const originalArgs = fixedCacheKey == null ? promise?.arg.originalArgs : void 0;
			const reset = (0, import_react.useCallback)(() => {
				batch(() => {
					if (promise) setPromise(void 0);
					if (fixedCacheKey) dispatch(api.internalActions.removeMutationResult({
						requestId,
						fixedCacheKey
					}));
				});
			}, [
				dispatch,
				fixedCacheKey,
				promise,
				requestId
			]);
			(0, import_react.useDebugValue)(pick(currentState, ...COMMON_HOOK_DEBUG_FIELDS, "endpointName"));
			const finalState = (0, import_react.useMemo)(() => ({
				...currentState,
				originalArgs,
				reset
			}), [
				currentState,
				originalArgs,
				reset
			]);
			return (0, import_react.useMemo)(() => [triggerMutation, finalState], [triggerMutation, finalState]);
		};
	}
}
var reactHooksModuleName = /* @__PURE__ */ Symbol();
var reactHooksModule = ({ batch: batch$1 = batch, hooks = {
	useDispatch,
	useSelector,
	useStore
}, createSelector: createSelector$1 = createSelector, unstable__sideEffectsInRender = false, ...rest } = {}) => {
	return {
		name: reactHooksModuleName,
		init(api, { serializeQueryArgs }, context) {
			const anyApi = api;
			const { buildQueryHooks, buildInfiniteQueryHooks, buildMutationHook, usePrefetch } = buildHooks({
				api,
				moduleOptions: {
					batch: batch$1,
					hooks,
					unstable__sideEffectsInRender,
					createSelector: createSelector$1
				},
				serializeQueryArgs,
				context
			});
			safeAssign(anyApi, { usePrefetch });
			safeAssign(context, { batch: batch$1 });
			return { injectEndpoint(endpointName, definition) {
				if (isQueryDefinition(definition)) {
					const { useQuery, useLazyQuery, useLazyQuerySubscription, useQueryState, useQuerySubscription } = buildQueryHooks(endpointName);
					safeAssign(anyApi.endpoints[endpointName], {
						useQuery,
						useLazyQuery,
						useLazyQuerySubscription,
						useQueryState,
						useQuerySubscription
					});
					api[`use${capitalize(endpointName)}Query`] = useQuery;
					api[`useLazy${capitalize(endpointName)}Query`] = useLazyQuery;
				}
				if (isMutationDefinition(definition)) {
					const useMutation = buildMutationHook(endpointName);
					safeAssign(anyApi.endpoints[endpointName], { useMutation });
					api[`use${capitalize(endpointName)}Mutation`] = useMutation;
				} else if (isInfiniteQueryDefinition(definition)) {
					const { useInfiniteQuery, useInfiniteQuerySubscription, useInfiniteQueryState } = buildInfiniteQueryHooks(endpointName);
					safeAssign(anyApi.endpoints[endpointName], {
						useInfiniteQuery,
						useInfiniteQuerySubscription,
						useInfiniteQueryState
					});
					api[`use${capitalize(endpointName)}InfiniteQuery`] = useInfiniteQuery;
				}
			} };
		}
	};
};
var createApi = /* @__PURE__ */ buildCreateApi(coreModule(), reactHooksModule());
//#endregion
export { createSlice as a, Provider_default as c, createAsyncThunk as i, useDispatch as l, fetchBaseQuery as n, isRejectedWithValue as o, configureStore as r, createSelector as s, createApi as t, useSelector as u };
