export class SelectCase {
  arr = [];
  defaultresult: any = "";
  condtype = "";

  case(cond: string[] | [number, number] | string | number, result: any) {
    this.check(cond);
    this.arr.push({ cond, result });
    return this;
  }

  else(result: any) {
    this.defaultresult = result;
    return this;
  }

  caseMatch(cond: string[] | number[] | string, result: any) {
    const Cond = {
      c: cond,
      isMatch: true,
    };
    this.arr.push({ Cond, result });
    return this;
  }

  has(pick) {
    for (const element of this.arr) {
      const { cond, result } = element;
      const type = this.type(cond);

      if (type == "number[]") {
        if (pick >= cond[0] && pick <= cond[1]) return result;
      }
      if (type == "string[]") {
        if (cond.includes(pick)) return result;
      }
      if (type == "string" || type == "number") {
        if (pick === cond) return result;
      }
      if (type == "matchmode") {
        if (cond.c.includes(pick)) return result;
      }
    }

    return this.defaultresult;
  }

  isLT(pick) {
    for (const element of this.arr) {
      const { cond, result } = element;
      const type = this.type(cond);
      if (type !== "number")
        throw new Error("cannot compare types other than numbers");

      if (pick < cond) return result;
    }
    return this.defaultresult;
  }

  isGT(pick) {
    for (const element of this.arr) {
      const { cond, result } = element;
      const type = this.type(cond);
      if (type !== "number")
        throw new Error("cannot compare types other than numbers");

      if (pick > cond) return result;
    }
    return this.defaultresult;
  }

  isLTE(pick) {
    for (const element of this.arr) {
      const { cond, result } = element;
      const type = this.type(cond);
      if (type !== "number")
        throw new Error("cannot compare types other than numbers");

      if (pick <= cond) return result;
    }
    return this.defaultresult;
  }

  isGTE(pick) {
    for (const element of this.arr) {
      const { cond, result } = element;
      const type = this.type(cond);
      if (type !== "number")
        throw new Error("cannot compare types other than numbers");

      if (pick >= cond) return result;
    }
    return this.defaultresult;
  }

  check(cond) {
    const check = this.type(cond).replace("[]", "");

    if (!this.condtype) this.condtype = check;
    else if (this.condtype !== check)
      throw new Error("number and string cannot be compare at same time");
  }

  type(cond) {
    if (Array.isArray(cond)) {
      switch (typeof cond[0]) {
        case "number":
          if (cond.length !== 2)
            throw new Error("number case must be [number, number]");

          return "number[]";
        case "string":
          return "string[]";
        case "object":
          if (cond?.isMatch) return "matchmode";
        default:
          throw new Error("selectcase only accept string or number");
      }
    }
    if (typeof cond === "string") return "string";
    if (typeof cond === "number") return "number";

    throw new Error("selectcase only accept string or number");
  }
}

Object.defineProperties(window, {
  SelectCase: { value: Object.freeze(SelectCase) },
});
