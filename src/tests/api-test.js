"use strict";
/**
 * Manual test script for testing the RigVeda API endpoint
 * Run this script with: npx ts-node src/tests/api-test.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function testRigVedaApi() {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, testCases, _loop_1, _i, testCases_1, testCase, ashtakTestUrl, response, data, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    baseUrl = 'http://localhost:3000/api/vedas/rigveda';
                    testCases = [
                        {
                            name: 'Simple ASCII rishi parameter',
                            params: { rishi: 'XYZ' },
                            description: 'Testing with a simple ASCII rishi value'
                        },
                        {
                            name: 'Unicode rishi parameter (Devanagari)',
                            params: { rishi: 'वसिष्ठ' },
                            description: 'Testing with Devanagari Unicode characters'
                        },
                        {
                            name: 'Mixed rishi parameter with diacritics',
                            params: { rishi: 'Madhucchandā Vaiśvāmitra' },
                            description: 'Testing with Latin characters including diacritical marks'
                        },
                        {
                            name: 'Multiple parameters including rishi',
                            params: { mandal_no: '1', sukta_no: '1', rishi: 'Madhucchandā' },
                            description: 'Testing with multiple parameters including rishi'
                        },
                        {
                            name: 'Empty rishi parameter',
                            params: { rishi: '' },
                            description: 'Testing with an empty rishi parameter'
                        },
                        {
                            name: 'Special characters in rishi parameter',
                            params: { rishi: 'Viśvāmitra & Sons' },
                            description: 'Testing with special characters in the rishi parameter'
                        }
                    ];
                    console.log('Starting RigVeda API tests for rishi parameter...');
                    console.log('=================================================');
                    _loop_1 = function (testCase) {
                        var url, response, data, rishiParam_1, foundRishi, error_2;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    console.log("\nTest: ".concat(testCase.name));
                                    console.log("Description: ".concat(testCase.description));
                                    url = new URL(baseUrl);
                                    Object.entries(testCase.params).forEach(function (_a) {
                                        var key = _a[0], value = _a[1];
                                        url.searchParams.append(key, value);
                                    });
                                    console.log("URL: ".concat(url.toString()));
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, fetch(url.toString())];
                                case 2:
                                    response = _e.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    data = _e.sent();
                                    console.log("Status: ".concat(response.status, " ").concat(response.statusText));
                                    if (response.ok) {
                                        console.log("Success! Received ".concat(((_a = data.data) === null || _a === void 0 ? void 0 : _a.length) || 0, " results"));
                                        if (data.data && data.data.length > 0) {
                                            // Display the first result
                                            console.log('First result:');
                                            console.log("- mantra_ref_id: ".concat(data.data[0].mantra_ref_id));
                                            console.log("- rishi: ".concat(data.data[0].rishi));
                                            console.log("- devata: ".concat(data.data[0].devata));
                                            console.log("- mantra (first 50 chars): ".concat((_b = data.data[0].mantra) === null || _b === void 0 ? void 0 : _b.substring(0, 50), "..."));
                                            rishiParam_1 = testCase.params.rishi;
                                            if (rishiParam_1 && rishiParam_1.trim() !== '') {
                                                foundRishi = data.data.some(function (item) {
                                                    return item.rishi && item.rishi.toLowerCase().includes(rishiParam_1.toLowerCase());
                                                });
                                                if (foundRishi) {
                                                    console.log('✅ Rishi parameter correctly applied in the results');
                                                }
                                                else {
                                                    console.log('❌ Rishi parameter not found in results');
                                                }
                                            }
                                        }
                                        else {
                                            console.log('No results found for this query');
                                        }
                                    }
                                    else {
                                        console.log("Error: ".concat(data.message));
                                    }
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _e.sent();
                                    console.error("Failed to fetch: ".concat(error_2.message || 'Unknown error'));
                                    return [3 /*break*/, 5];
                                case 5:
                                    console.log('-------------------------------------------------');
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, testCases_1 = testCases;
                    _d.label = 1;
                case 1:
                    if (!(_i < testCases_1.length)) return [3 /*break*/, 4];
                    testCase = testCases_1[_i];
                    return [5 /*yield**/, _loop_1(testCase)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Test Ashtak system parameters based on memory
                    console.log('\nTesting Ashtak system parameters...');
                    ashtakTestUrl = new URL(baseUrl);
                    ashtakTestUrl.searchParams.append('ashtak_no', '1');
                    ashtakTestUrl.searchParams.append('adhyay_no', '1');
                    ashtakTestUrl.searchParams.append('varga_no', '1');
                    ashtakTestUrl.searchParams.append('mantra2_no', '1');
                    console.log("URL: ".concat(ashtakTestUrl.toString()));
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, fetch(ashtakTestUrl.toString())];
                case 6:
                    response = _d.sent();
                    return [4 /*yield*/, response.json()];
                case 7:
                    data = _d.sent();
                    console.log("Status: ".concat(response.status, " ").concat(response.statusText));
                    if (response.ok) {
                        console.log("Success! Received ".concat(((_c = data.data) === null || _c === void 0 ? void 0 : _c.length) || 0, " results"));
                        if (data.data && data.data.length > 0) {
                            console.log('First result:');
                            console.log("- mantra_ref_id: ".concat(data.data[0].mantra_ref_id));
                            console.log("- ashtak_no: ".concat(data.data[0].ashtak_no));
                            console.log("- adhyay_no: ".concat(data.data[0].adhyay_no));
                            console.log("- varga_no: ".concat(data.data[0].varga_no));
                            console.log("- mantra2_no: ".concat(data.data[0].mantra2_no));
                        }
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _d.sent();
                    console.error("Failed to fetch: ".concat(error_1.message || 'Unknown error'));
                    return [3 /*break*/, 9];
                case 9:
                    console.log('\nAll tests completed!');
                    return [2 /*return*/];
            }
        });
    });
}
// Run the tests
testRigVedaApi().catch(console.error);
