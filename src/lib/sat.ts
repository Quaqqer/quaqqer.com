import assert from "assert";

export type Assignments = readonly (boolean | undefined)[];
export type Clause = Map<number, boolean>;

/**
 * Binary constraint propagation of logic in CNF form.
 * Ex. `(~a or b or c) and (~b or ~c)` where `(~b or ~c)` is a clause.
 */
export function binaryConstraintPropagation(
  assignments_: readonly (boolean | undefined)[],
  clauses_: readonly Clause[],
): [Assignments, Clause[]] | undefined {
  const assignments = assignments_.slice();
  const clauses: (Clause | undefined)[] = clauses_.map(
    (clause) => new Map(clause),
  );
  const varClauses: Map<number, Set<number>> = new Map(
    assignments.map((_, i) => [i, new Set<number>()]),
  );

  for (let clauseI = 0; clauseI < clauses_.length; clauseI++) {
    const clause = clauses_[clauseI];
    for (const variable of clause.keys()) {
      varClauses.get(variable)!.add(clauseI);
    }
  }

  const queue = new Array<number>();
  for (let variableI = 0; variableI < assignments.length; variableI++) {
    const assignment = assignments[variableI];
    if (assignment !== undefined) {
      queue.push(variableI);
    }
  }

  while (queue.length > 0) {
    const variable = queue.pop()!;
    const value = assignments[variable]!;

    for (const clauseI of varClauses.get(variable)!) {
      const clause = clauses[clauseI];

      if (clause !== undefined) {
        const negated = clause.get(variable)!;
        const satisfied = value !== negated;

        if (satisfied) {
          clauses[clauseI] = undefined;
        } else {
          clause.delete(variable);

          if (clause.size === 0) {
            // No solution
            return undefined;
          } else if (clause.size === 1) {
            const [lastVariable, lastNegated] = clause.entries().next().value!;
            const derivedValue = !lastNegated;

            if (assignments[lastVariable] === undefined) {
              assignments[lastVariable] = derivedValue;
              queue.push(lastVariable);
            } else if (assignments[lastVariable] !== derivedValue) {
              // Conflict
              return undefined;
            }
          }
        }
      }
    }
  }

  const newClauses = clauses
    .values()
    .filter((clause) => clause !== undefined)
    .toArray();
  return [assignments, newClauses];
}

function assignPure(
  assignments_: Assignments,
  clauses_: readonly Clause[],
): [Assignments, Clause[]] {
  const assignments = assignments_.slice();
  const clauses: (Clause | undefined)[] = clauses_.map(
    (clause) => new Map(clause),
  );

  const positive = new Map<number, number[]>(
    assignments.map((_, variable) => [variable, []]),
  );
  const negative = new Map<number, number[]>(
    assignments.map((_, variable) => [variable, []]),
  );

  for (let clauseI = 0; clauseI < clauses.length; clauseI++) {
    const clause = clauses[clauseI];

    if (clause === undefined) continue;

    for (const [variable, negated] of clause) {
      if (negated) {
        negative.get(variable)!.push(clauseI);
      } else {
        positive.get(variable)!.push(clauseI);
      }
    }
  }

  for (let variable = 0; variable < assignments.length; variable++) {
    const varPositive = positive.get(variable)!;
    const varNegative = negative.get(variable)!;

    if (varPositive.length > 0 && varNegative.length === 0) {
      assignments[variable] = true;
      for (const clauseI of varPositive) {
        clauses[clauseI] = undefined;
      }
    } else if (varNegative.length > 0 && varPositive.length === 0) {
      assignments[variable] = false;
      for (const clauseI of varNegative) {
        clauses[clauseI] = undefined;
      }
    }
  }

  return [assignments, clauses.filter((clause) => clause !== undefined)];
}

export function* dpll(
  assignments: Assignments,
  clauses: readonly Clause[],
): Generator<Assignments, void> {
  let result = binaryConstraintPropagation(assignments, clauses);

  if (result === undefined) {
    return;
  }

  [assignments, clauses] = result;

  [assignments, clauses] = assignPure(assignments, clauses);

  if (clauses.length === 0) {
    yield assignments;
    return;
  }

  const variable = assignments.findIndex((v) => v === undefined);
  assert(
    variable !== -1,
    "If all variables are assigned then there should be no clauses left.",
  );

  const dpllTrue = dpll(assignments.with(variable, true), clauses);
  if (dpllTrue !== undefined) yield* dpllTrue;
  yield* dpll(assignments.with(variable, false), clauses);
}
