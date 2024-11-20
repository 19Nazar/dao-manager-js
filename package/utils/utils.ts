import { utils } from "near-api-js";

export class Utils {
  static nearToYoctoNEAR(amount: string): string {
    const amountInYocto = utils.format.parseNearAmount(amount);
    if (amountInYocto) {
      return amountInYocto;
    } else {
      throw new Error("Something went wrong, try again.");
    }
  }

  static yoctoNEARToNear(amount: string): string {
    const amountInNEAR = utils.format.formatNearAmount(amount);
    if (amountInNEAR) {
      return amountInNEAR;
    } else {
      throw new Error("Something went wrong, try again.");
    }
  }
}
