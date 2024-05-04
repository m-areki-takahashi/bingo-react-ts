import React, { 
    useState, 
    useMemo, 
    useEffect, 
    useCallback
} from 'react'
import Table from './components/Table';
import { StateContextType } from './types';

const contextValue: StateContextType = {
    linesContext: 5,    //列の数
    MaximumContext: 15  //列に出力する値の幅（n*MaximumContext ~ (n+1)*MaximumContext）
}
export const StateContext = React.createContext<StateContextType>(contextValue);

const BingoSheet = () => {
    const [gameCount, setGameCount] = useState<number>(0);
    const [resetState, setResetState] = useState<number>(0)

    const resetGameCount = useCallback((): void => {
        setGameCount(0);
        setResetState(resetState + 1);
    },[resetState]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent): void => {
            if(e.key === 'Enter'){
                setGameCount(gameCount + 1);
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    },[gameCount]);

    const ret = useMemo(() => {
        return (
            <>
            <StateContext.Provider value={contextValue}>
                <Table gameCount={gameCount} resetFunc={resetGameCount} resetState={
                    resetState > 0 ? resetState : 0
                }/>
            </StateContext.Provider>
            </>
        )
    },[gameCount,resetState]);

    return ret
}

export default BingoSheet
