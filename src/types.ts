export type StateContextType = {
    linesContext: number,
    MaximumContext: number,
}

export type Numbers = {
    forOutput: number[]
}

export type TdProps = {
    slices: number[][],
}

export type OutputsProps = {
    count: string,
    value: number
}

export type TableProps = {
    // pFunc: () => void,
    gameCount: number,
    resetFunc: () => void,
    resetState?: number,
};
export type RetType = {
    gNumberOfSide: number;
    forOutput: number[],
    maxOutput: number,
}

export type RBState = {
    reach: number,
    bingo: number,
}