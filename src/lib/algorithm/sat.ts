import assert from "assert";

type SatVariable = boolean | undefined;
type SatClause = Map<number, boolean>;

class SatState {
  private variables: SatVariable[];
  private positives: number[];
  private negatives: number[];
  private pureLiterals: Set<number>;
  private varClauses: number[][];
  private clauses: (SatClause | undefined)[];
  private satisfiedClauses: number;
  private unitClauses: number[];
  private inUnitClauses: Set<number>;

  private constructor(
    variables: SatVariable[],
    positives: number[],
    negatives: number[],
    pureLiterals: Set<number>,
    varClauses: number[][],
    clauses: (SatClause | undefined)[],
    satisfiedClauses: number,
    unitClauses: number[],
    inUnitClauses: Set<number>,
  ) {
    this.variables = variables;
    this.positives = positives;
    this.negatives = negatives;
    this.pureLiterals = pureLiterals;
    this.varClauses = varClauses;
    this.clauses = clauses;
    this.satisfiedClauses = satisfiedClauses;
    this.unitClauses = unitClauses;
    this.inUnitClauses = inUnitClauses;
  }

  public static empty(): SatState {
    return new SatState([], [], [], new Set(), [], [], 0, [], new Set());
  }

  public copy(): SatState {
    return new SatState(
      this.variables.slice(),
      this.positives.slice(),
      this.negatives.slice(),
      new Set(this.pureLiterals),
      this.varClauses.map((clauses) => clauses.slice()),
      this.clauses.map((clause) =>
        clause === undefined ? undefined : new Map(clause),
      ),
      this.satisfiedClauses,
      this.unitClauses.slice(),
      new Set(this.inUnitClauses),
    );
  }

  public addVariable(): number {
    const varI = this.variables.length;
    this.variables.push(undefined);
    this.varClauses.push([]);
    this.positives.push(0);
    this.negatives.push(0);
    return varI;
  }

  public addClause(clause: readonly [number, boolean][]) {
    const clauseI = this.clauses.length;

    this.clauses.push(new Map(clause));

    for (const [variable, negated] of clause) {
      this.varClauses[variable].push(clauseI);

      if (negated) {
        this.negatives[variable]++;
      } else {
        this.positives[variable]++;
      }
      this.updatePureLiteral(variable);
    }

    if (clause.length === 1) {
      this.unitClauses.push(clauseI);
      this.inUnitClauses.add(clauseI);
    }
  }

  private updatePureLiteral(variable: number) {
    const purePositive =
      this.positives[variable] > 0 && this.negatives[variable] === 0;
    const pureNegative =
      this.negatives[variable] > 0 && this.positives[variable] === 0;

    if (purePositive || pureNegative) {
      this.pureLiterals.add(variable);
    } else {
      this.pureLiterals.delete(variable);
    }
  }

  /**
   * Set a variable and simplify formulas.
   *
   * @param variable - The variable to assign.
   * @param value - The value to assign to.
   * @returns If it was ok or not.
   */
  public setVariable(variable: number, value: boolean): boolean {
    // If already assigned, ok/fail instantly
    if (this.variables[variable] !== undefined) {
      return this.variables[variable] === value;
    }

    this.variables[variable] = value;

    // Simplify formulas
    for (const clauseI of this.varClauses[variable]) {
      const clause = this.clauses[clauseI];

      if (clause === undefined) {
        // Clause already satisfied
        continue;
      }

      const negated = clause.get(variable)!;
      const satisfied = value !== negated;

      if (satisfied) {
        // Update positives and negatives
        for (const [variable, negated] of clause) {
          if (negated) {
            this.negatives[variable]--;
          } else {
            this.positives[variable]--;
          }
          this.updatePureLiteral(variable);
        }

        this.clauses[clauseI] = undefined;
        this.satisfiedClauses++;
      } else {
        clause.delete(variable);

        if (negated) {
          this.negatives[variable]--;
        } else {
          this.positives[variable]--;
        }
        this.updatePureLiteral(variable);

        if (clause.size === 1) {
          this.unitClauses.push(clauseI);
          this.inUnitClauses.add(clauseI);
        } else if (clause.size === 0) {
          return false;
        }
      }
    }

    // Remove old varClauses
    this.varClauses[variable] = this.varClauses[variable].filter((clauseI) =>
      this.clauses[clauseI]?.has(variable),
    );

    return true;
  }

  public done(): boolean {
    const done = this.satisfiedClauses === this.clauses.length;
    if (done) {
      assert(
        this.variables.reduce(
          (a, variable) => a && variable !== undefined,
          true,
        ),
      );
    }
    return done;
  }

  public getVariables(): (boolean | undefined)[] {
    return this.variables.slice();
  }

  public getVariable(variable: number): boolean | undefined {
    return this.variables[variable];
  }

  public getNVariables(): number {
    return this.variables.length;
  }

  public binaryConstraintPropagation(): boolean {
    while (this.unitClauses.length > 0) {
      const clauseI = this.unitClauses.pop()!;
      const clause = this.clauses[clauseI];

      if (clause === undefined) {
        // We might have deleted it when doing pure literal assignment
        continue;
      }

      const [[variable, negated]] = clause.entries();

      const assignment = !negated;

      const assignOk = this.setVariable(variable, assignment);

      if (!assignOk) {
        return false;
      }
    }

    return true;
  }

  public pureLiteralEliminiation() {
    while (this.pureLiterals.size > 0) {
      const pureVariable = this.pureLiterals.values().next().value!;

      const positive = this.positives[pureVariable] > 0;

      const ok = this.setVariable(pureVariable, positive);

      assert(ok, "If it's pure it should always be ok.");
    }
  }
}

export class SatSolver {
  private state: SatState;

  constructor() {
    this.state = SatState.empty();
  }

  public addVariable(): number {
    return this.state.addVariable();
  }

  /**
   * Add a clause
   *
   * @param clause - The clause. Contains the variable, and if it is negated.
   */
  public addClause(clause: readonly [number, boolean][]) {
    assert(clause.length > 0, "A clause have at least one variable.");
    this.state.addClause(clause);
  }

  public *solveDpll(): Generator<(boolean | undefined)[], void> {
    function* dpll(state: SatState): Generator<(boolean | undefined)[], void> {
      const bcpOk = state.binaryConstraintPropagation();
      if (!bcpOk) {
        return;
      }
      state.pureLiteralEliminiation();

      if (state.done()) {
        yield state.getVariables();
      } else {
        for (let variable = 0; variable < state.getNVariables(); variable++) {
          const unset = state.getVariable(variable) === undefined;

          if (unset) {
            const s1 = state.copy();
            const s2 = state.copy();

            if (s1.setVariable(variable, false)) {
              yield* dpll(s1);
            }

            if (s2.setVariable(variable, true)) {
              yield* dpll(s2);
            }

            return;
          }
        }
      }
    }

    yield* dpll(this.state.copy());
  }
}
