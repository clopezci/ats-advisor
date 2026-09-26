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
assert(out09Quota("carrera") === 0, "carrera no incluye el curso a medida");
assert(out09Quota("plus") === 2, "plus quota");

const free = defaultEntitlement();
assert(!canGenerateOut09(free).ok, "free cannot out09");

const carrera: Entitlement = { ...free, plan: "carrera", out09UsedMonth: 0 };
assert(!canGenerateOut09(carrera).ok, "carrera no genera el curso a medida");

const plus: Entitlement = { ...free, plan: "plus", out09UsedMonth: 0 };
assert(canGenerateOut09(plus).ok, "plus can out09");

const exhausted: Entitlement = { ...plus, out09UsedMonth: 2 };
assert(!canGenerateOut09(exhausted).ok, "plus exhausted");

console.log("entitlements tests ok");
