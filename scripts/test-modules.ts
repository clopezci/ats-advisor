import { OUTPLACEMENT_MODULES } from "../src/lib/outplacement/modules";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(OUTPLACEMENT_MODULES.length === 8, "expected 8 modules");
for (const m of OUTPLACEMENT_MODULES) {
  assert(m.capsules.length === m.days, `${m.code} days mismatch`);
  assert(m.days >= 7, `${m.code} should have >=7 days`);
  for (const c of m.capsules) {
    assert(c.quiz && c.quiz.options.length >= 2, `${m.code} d${c.day} missing quiz`);
    assert(c.content.length > 20, `${m.code} d${c.day} thin content`);
  }
}

console.log("modules tests ok", {
  modules: OUTPLACEMENT_MODULES.length,
  capsules: OUTPLACEMENT_MODULES.reduce((a, m) => a + m.capsules.length, 0),
});
