import {
  canGenerateOut09,
  defaultEntitlement,
  out09Quota,
  type Entitlement,
} from "../src/lib/entitlements";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(out09Quota("free") === 0, "free quota");
assert(out09Quota("carrera") === 1, "carrera quota");
assert(out09Quota("plus") === 2, "plus quota");

const free = defaultEntitlement();
assert(!canGenerateOut09(free).ok, "free cannot out09");

const carrera: Entitlement = { ...free, plan: "carrera", out09UsedMonth: 0 };
assert(canGenerateOut09(carrera).ok, "carrera can out09");

const exhausted: Entitlement = { ...carrera, out09UsedMonth: 1 };
assert(!canGenerateOut09(exhausted).ok, "carrera exhausted");

console.log("entitlements tests ok");
