import { utils } from "near-api-js";

export default class Utils {
  static nearToYoctoNEAR(amount: string): string {
    const amountInYocto = utils.format.parseNearAmount(amount);
    try {
      if (amountInYocto) {
        return amountInYocto;
      } else {
        throw new Error("Something went wrong, try again.");
      }
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  static yoctoNEARToNear(amount: string): string {
    try {
      const amountInNEAR = utils.format.formatNearAmount(amount);
      if (amountInNEAR) {
        return amountInNEAR;
      } else {
        throw new Error("Something went wrong, try again.");
      }
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
