"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const near_api_js_1 = require("near-api-js");
class Utils {
    static nearToYoctoNEAR(amount) {
        const amountInYocto = near_api_js_1.utils.format.parseNearAmount(amount);
        try {
            if (amountInYocto) {
                return amountInYocto;
            }
            else {
                throw new Error("Something went wrong, try again.");
            }
        }
        catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
    static yoctoNEARToNear(amount) {
        try {
            const amountInNEAR = near_api_js_1.utils.format.formatNearAmount(amount);
            if (amountInNEAR) {
                return amountInNEAR;
            }
            else {
                throw new Error("Something went wrong, try again.");
            }
        }
        catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map