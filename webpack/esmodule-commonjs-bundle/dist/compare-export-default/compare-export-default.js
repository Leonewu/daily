/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/compare-export-default/esm-with-default.js":
/*!********************************************************!*\
  !*** ./src/compare-export-default/esm-with-default.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let counter = 1;
function add() {
  counter++;
  return counter;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  counter,
  add
});

/***/ }),

/***/ "./src/compare-export-default/esm-without-default.js":
/*!***********************************************************!*\
  !*** ./src/compare-export-default/esm-without-default.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "counter": () => (/* binding */ counter),
/* harmony export */   "add": () => (/* binding */ add)
/* harmony export */ });
let counter = 1;
function add() {
  counter++;
  return counter;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************************!*\
  !*** ./src/compare-export-default/index.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esm_without_default_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esm-without-default.js */ "./src/compare-export-default/esm-without-default.js");
/* harmony import */ var _esm_with_default_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./esm-with-default.js */ "./src/compare-export-default/esm-with-default.js");



console.log('esmWithDefault 的行为：')
console.log(_esm_with_default_js__WEBPACK_IMPORTED_MODULE_1__.default.counter);
console.log(_esm_with_default_js__WEBPACK_IMPORTED_MODULE_1__.default.add());
console.log(_esm_with_default_js__WEBPACK_IMPORTED_MODULE_1__.default.counter);

console.log('esmWithoutDefault 的行为：')
console.log(_esm_without_default_js__WEBPACK_IMPORTED_MODULE_0__.counter);
console.log(_esm_without_default_js__WEBPACK_IMPORTED_MODULE_0__.add());
console.log(_esm_without_default_js__WEBPACK_IMPORTED_MODULE_0__.counter);
})();

/******/ })()
;