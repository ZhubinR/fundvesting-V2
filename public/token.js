var readAsync,
  readBinary,
  Module = void 0 !== Module ? Module : {},
  ENVIRONMENT_IS_WEB = !0,
  ENVIRONMENT_IS_WORKER = !1,
  moduleOverrides = Object.assign({}, Module),
  arguments_ = [],
  thisProgram = "./this.program",
  scriptDirectory = "";
function locateFile(e) {
  return Module.locateFile
    ? Module.locateFile(e, scriptDirectory)
    : scriptDirectory + e;
}
(ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
  (ENVIRONMENT_IS_WORKER
    ? (scriptDirectory = self.location.href)
    : "undefined" != typeof document &&
      document.currentScript &&
      (scriptDirectory = document.currentScript.src),
  (scriptDirectory = scriptDirectory.startsWith("blob:")
    ? ""
    : scriptDirectory.substr(
        0,
        scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1
      )),
  (readAsync = (e) =>
    fetch(e, { credentials: "same-origin" }).then((e) =>
      e.ok ? e.arrayBuffer() : Promise.reject(Error(e.status + " : " + e.url))
    )));
var out = Module.print || console.log.bind(console),
  err = Module.printErr || console.error.bind(console);
Object.assign(Module, moduleOverrides),
  Module.arguments && (arguments_ = Module.arguments),
  Module.thisProgram && (thisProgram = Module.thisProgram);
var wasmMemory,
  EXITSTATUS,
  HEAP8,
  HEAPU8,
  HEAP16,
  HEAPU16,
  HEAP32,
  HEAPU32,
  HEAPF32,
  HEAPF64,
  wasmBinary = Module.wasmBinary,
  ABORT = !1;
function updateMemoryViews() {
  var e = wasmMemory.buffer;
  (Module.HEAP8 = HEAP8 = new Int8Array(e)),
    (Module.HEAP16 = HEAP16 = new Int16Array(e)),
    (Module.HEAPU8 = HEAPU8 = new Uint8Array(e)),
    (Module.HEAPU16 = HEAPU16 = new Uint16Array(e)),
    (Module.HEAP32 = HEAP32 = new Int32Array(e)),
    (Module.HEAPU32 = HEAPU32 = new Uint32Array(e)),
    (Module.HEAPF32 = HEAPF32 = new Float32Array(e)),
    (Module.HEAPF64 = HEAPF64 = new Float64Array(e));
}
var __ATPRERUN__ = [],
  __ATINIT__ = [],
  __ATPOSTRUN__ = [],
  runtimeInitialized = !1;
function preRun() {
  if (Module.preRun)
    for (
      "function" == typeof Module.preRun && (Module.preRun = [Module.preRun]);
      Module.preRun.length;

    )
      addOnPreRun(Module.preRun.shift());
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  (runtimeInitialized = !0), callRuntimeCallbacks(__ATINIT__);
}
function postRun() {
  if (Module.postRun)
    for (
      "function" == typeof Module.postRun &&
      (Module.postRun = [Module.postRun]);
      Module.postRun.length;

    )
      addOnPostRun(Module.postRun.shift());
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(e) {
  __ATPRERUN__.unshift(e);
}
function addOnInit(e) {
  __ATINIT__.unshift(e);
}
function addOnPostRun(e) {
  __ATPOSTRUN__.unshift(e);
}
var runDependencies = 0,
  runDependencyWatcher = (moduleOverrides = null),
  dependenciesFulfilled = null;
function addRunDependency(e) {
  Module.monitorRunDependencies?.(++runDependencies);
}
function removeRunDependency(e) {
  var n;
  Module.monitorRunDependencies?.(--runDependencies),
    0 == runDependencies &&
      (null !== runDependencyWatcher &&
        (clearInterval(runDependencyWatcher), (runDependencyWatcher = null)),
      dependenciesFulfilled) &&
      ((n = dependenciesFulfilled), (dependenciesFulfilled = null), n());
}
function abort(e) {
  throw (
    (Module.onAbort?.(e),
    err((e = "Aborted(" + e + ")")),
    (ABORT = !0),
    (EXITSTATUS = 1),
    (e += ". Build with -sASSERTIONS for more info."),
    new WebAssembly.RuntimeError(e))
  );
}
var wasmBinaryFile,
  dataURIPrefix = "data:application/octet-stream;base64,",
  isDataURI = (e) => e.startsWith(dataURIPrefix);
function findWasmBinary() {
  var e = "token.wasm";
  return isDataURI(e) ? e : locateFile(e);
}
function getBinarySync(e) {
  if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
  if (readBinary) return readBinary(e);
  throw "both async and sync fetching of the wasm failed";
}
function getBinaryPromise(e) {
  return wasmBinary
    ? Promise.resolve().then(() => getBinarySync(e))
    : readAsync(e).then(
        (e) => new Uint8Array(e),
        () => getBinarySync(e)
      );
}
function instantiateArrayBuffer(e, n, r) {
  return getBinaryPromise(e)
    .then((e) => WebAssembly.instantiate(e, n))
    .then(r, (e) => {
      err("failed to asynchronously prepare wasm: " + e), abort(e);
    });
}
function instantiateAsync(e, n, r, t) {
  return e ||
    "function" != typeof WebAssembly.instantiateStreaming ||
    isDataURI(n) ||
    "function" != typeof fetch
    ? instantiateArrayBuffer(n, r, t)
    : fetch(n, { credentials: "same-origin" }).then((e) =>
        WebAssembly.instantiateStreaming(e, r).then(t, function (e) {
          return (
            err("wasm streaming compile failed: " + e),
            err("falling back to ArrayBuffer instantiation"),
            instantiateArrayBuffer(n, r, t)
          );
        })
      );
}
function getWasmImports() {
  return { a: wasmImports };
}
function createWasm() {
  var e = getWasmImports();
  function n(e, n) {
    return (
      (wasmMemory = (wasmExports = e.exports).e),
      updateMemoryViews(),
      addOnInit(wasmExports.f),
      removeRunDependency("wasm-instantiate"),
      wasmExports
    );
  }
  if ((addRunDependency("wasm-instantiate"), Module.instantiateWasm))
    try {
      return Module.instantiateWasm(e, n);
    } catch (e) {
      return err("Module.instantiateWasm callback failed with error: " + e), !1;
    }
  return (
    (wasmBinaryFile = wasmBinaryFile || findWasmBinary()),
    instantiateAsync(wasmBinary, wasmBinaryFile, e, function (e) {
      n(e.instance);
    }),
    {}
  );
}
function getUserAgent() {
  var e, n, r;
  return navigator.userAgent
    ? ((n = lengthBytesUTF8((e = navigator.userAgent)) + 1),
      (r = _malloc(n)),
      stringToUTF8(e, r, n),
      r)
    : null;
}
var calledRun,
  callRuntimeCallbacks = (e) => {
    for (; 0 < e.length; ) e.shift()(Module);
  },
  noExitRuntime = Module.noExitRuntime || !0,
  stackRestore = (e) => __emscripten_stack_restore(e),
  stackSave = () => _emscripten_stack_get_current(),
  __emscripten_memcpy_js = (e, n, r) => HEAPU8.copyWithin(e, n, n + r),
  _emscripten_date_now = () => Date.now(),
  abortOnCannotGrowMemory = (e) => {
    abort("OOM");
  },
  _emscripten_resize_heap = (e) => {
    HEAPU8.length, abortOnCannotGrowMemory((e >>>= 0));
  },
  getCFunc = (e) => Module["_" + e],
  writeArrayToMemory = (e, n) => {
    HEAP8.set(e, n);
  },
  lengthBytesUTF8 = (e) => {
    for (var n = 0, r = 0; r < e.length; ++r) {
      var t = e.charCodeAt(r);
      t <= 127
        ? n++
        : t <= 2047
        ? (n += 2)
        : 55296 <= t && t <= 57343
        ? ((n += 4), ++r)
        : (n += 3);
    }
    return n;
  },
  stringToUTF8Array = (e, n, r, t) => {
    if (!(0 < t)) return 0;
    for (var a = r, o = r + t - 1, i = 0; i < e.length; ++i) {
      var s = e.charCodeAt(i);
      if (
        (s =
          55296 <= s && s <= 57343
            ? (65536 + ((1023 & s) << 10)) | (1023 & e.charCodeAt(++i))
            : s) <= 127
      ) {
        if (o <= r) break;
        n[r++] = s;
      } else {
        if (s <= 2047) {
          if (o <= r + 1) break;
          n[r++] = 192 | (s >> 6);
        } else {
          if (s <= 65535) {
            if (o <= r + 2) break;
            n[r++] = 224 | (s >> 12);
          } else {
            if (o <= r + 3) break;
            (n[r++] = 240 | (s >> 18)), (n[r++] = 128 | ((s >> 12) & 63));
          }
          n[r++] = 128 | ((s >> 6) & 63);
        }
        n[r++] = 128 | (63 & s);
      }
    }
    return (n[r] = 0), r - a;
  },
  stringToUTF8 = (e, n, r) => stringToUTF8Array(e, HEAPU8, n, r),
  stackAlloc = (e) => __emscripten_stack_alloc(e),
  stringToUTF8OnStack = (e) => {
    var n = lengthBytesUTF8(e) + 1,
      r = stackAlloc(n);
    return stringToUTF8(e, r, n), r;
  },
  UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder() : void 0,
  UTF8ArrayToString = (e, n, r) => {
    for (var t = n + r, a = n; e[a] && !(t <= a); ) ++a;
    if (16 < a - n && e.buffer && UTF8Decoder)
      return UTF8Decoder.decode(e.subarray(n, a));
    for (var o = ""; n < a; ) {
      var i,
        s,
        u = e[n++];
      128 & u
        ? ((i = 63 & e[n++]),
          192 != (224 & u)
            ? ((s = 63 & e[n++]),
              (u =
                224 == (240 & u)
                  ? ((15 & u) << 12) | (i << 6) | s
                  : ((7 & u) << 18) | (i << 12) | (s << 6) | (63 & e[n++])) <
              65536
                ? (o += String.fromCharCode(u))
                : ((s = u - 65536),
                  (o += String.fromCharCode(
                    55296 | (s >> 10),
                    56320 | (1023 & s)
                  ))))
            : (o += String.fromCharCode(((31 & u) << 6) | i)))
        : (o += String.fromCharCode(u));
    }
    return o;
  },
  UTF8ToString = (e, n) => (e ? UTF8ArrayToString(HEAPU8, e, n) : ""),
  ccall = (e, n, r, t, a) => {
    var o = {
        string(e) {
          var n = 0;
          return (n = null != e && 0 !== e ? stringToUTF8OnStack(e) : n);
        },
        array(e) {
          var n = stackAlloc(e.length);
          return writeArrayToMemory(e, n), n;
        },
      },
      e = getCFunc(e),
      i = [],
      s = 0;
    if (t)
      for (var u = 0; u < t.length; u++) {
        var l = o[r[u]];
        l ? (0 === s && (s = stackSave()), (i[u] = l(t[u]))) : (i[u] = t[u]);
      }
    return (
      (e = e(...i)),
      0 !== s && stackRestore(s),
      (e = e),
      "string" === n ? UTF8ToString(e) : "boolean" === n ? Boolean(e) : e
    );
  },
  wasmImports = {
    b: __emscripten_memcpy_js,
    c: _emscripten_date_now,
    a: _emscripten_resize_heap,
    d: getUserAgent,
  },
  wasmExports = createWasm(),
  ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.f)(),
  _malloc = (Module._malloc = (e) =>
    (_malloc = Module._malloc = wasmExports.g)(e)),
  _token = (Module._token = () => (_token = Module._token = wasmExports.h)()),
  _free = (Module._free = (e) => (_free = Module._free = wasmExports.i)(e)),
  __emscripten_stack_restore = (e) =>
    (__emscripten_stack_restore = wasmExports.k)(e),
  __emscripten_stack_alloc = (e) =>
    (__emscripten_stack_alloc = wasmExports.l)(e),
  _emscripten_stack_get_current = () =>
    (_emscripten_stack_get_current = wasmExports.m)();
function run() {
  function e() {
    calledRun ||
      ((calledRun = !0), (Module.calledRun = !0), ABORT) ||
      (initRuntime(), Module.onRuntimeInitialized?.(), postRun());
  }
  0 < runDependencies ||
    (preRun(), 0 < runDependencies) ||
    (Module.setStatus
      ? (Module.setStatus("Running..."),
        setTimeout(function () {
          setTimeout(function () {
            Module.setStatus("");
          }, 1),
            e();
        }, 1))
      : e());
}
if (
  ((Module.ccall = ccall),
  (Module.UTF8ToString = UTF8ToString),
  (Module.stringToUTF8 = stringToUTF8),
  (Module.lengthBytesUTF8 = lengthBytesUTF8),
  (dependenciesFulfilled = function e() {
    calledRun || run(), calledRun || (dependenciesFulfilled = e);
  }),
  Module.preInit)
)
  for (
    "function" == typeof Module.preInit && (Module.preInit = [Module.preInit]);
    0 < Module.preInit.length;

  )
    Module.preInit.pop()();
run();
function tokenme() {
  return Module.ccall("token", "string");
}