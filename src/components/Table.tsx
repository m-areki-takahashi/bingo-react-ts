/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import {
    Numbers,
    TdProps,
    OutputsProps,
    TableProps,
    RetType,
    RBState,
} from '../types';
import { Common, Output, RetInit, BingoAnalyzer } from '../func';
import { StateContext } from '../BingoSheet';
import Text from './Text';
import './Table.css';



const Td = React.memo((props: TdProps) => {
    const {slices} = props;
    const state = useContext(StateContext);
    // const gMax: number = state.MaximumContext;
    const gNumberOfSide: number = state.linesContext;
    const [tds, setTds] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const rowNums: number[] = [];
        while(rowNums.length < gNumberOfSide){
            const i = rowNums.length;
            const func = new Common();
            const target:number = func.generateRandom(slices.length);
            rowNums.push(slices[i].splice(target ,1)[0]);
        }
        const tdElements = rowNums.map((td: number, i: number) => {
                return <td key={i}>{td}</td>
            }
        );
        setTds(tdElements);
    },[]);

    return <>{tds}</>;
})

const Tr = React.memo((props: Numbers): JSX.Element => {
    const {forOutput} = props;
    const rows: JSX.Element[] = [];
    const state = useContext(StateContext);
    const gMax: number = state.MaximumContext;
    const gNumberOfSide: number = state.linesContext;

    const slices: number[][] = [];

    while(slices.length < gNumberOfSide) {
        const i = slices.length;
        slices.push(forOutput.slice(i*gMax, (i+1)*gMax));
    }
    while(rows.length < gNumberOfSide){
        const i: number = rows.length;
        rows.push(<Td key={ i } slices={slices}/>)
    };

    const trs = rows.map((tds, i) => {
        return <tr id={`row-${i}`} key={i}>{tds}</tr>
    })

    return (
        <>
        {trs}
        </>
    )
})

const Th = React.memo(() => {
    const [ths, setThs] = useState<JSX.Element[]>([])
    const line: number = useContext(StateContext).linesContext;
    const Elements: JSX.Element[] = [];

    useEffect(() => {
        while(Elements.length < line){
            const i: number = Elements.length;
            Elements.push(
                <th key={i}>{i+1}</th>
            )
        }
        setThs(Elements);
    }, []);

    return <tr>{ths}</tr>
})


//出力回数と出力ボールを出す
const Outputs = React.memo((outputs: OutputsProps):JSX.Element => {
    const {count, value} = outputs;

    const textProps = {
        id: 'output',
        text: '出力',
        count: count,
        value: value
    }

    return (
        <Text {...textProps} />
    )
})

type ReachProps= {
    value: number
}

//リーチとビンゴの回数を出力
const Reach = React.memo((reachProps: ReachProps) => {
    const {value} = reachProps;

    const props = {
        id: 'reach',
        text: 'リーチ',
        value: value
    }

    return <Text {...props} />
})

type BingoProps= {
    value: number
}

const Bingo = React.memo((bingoProps: BingoProps) => {
    const {value} = bingoProps;
    const props = {
        id: 'bingo',
        text: 'ビンゴ',
        value: value
    }

    return <Text {...props} />
})



const Table = React.memo((props: TableProps) => {
    const {gameCount, resetFunc, resetState} = props;
    const state = useContext(StateContext);
    const retInit = new RetInit(state);
    const a: RetType = retInit.retInit();
    const {maxOutput} = a;
    //useState
    const [outNumbers, setOutNumbers] = useState<number[]>(a.forOutput);
    const [ballCount, setBallCount] = useState<number>(0);
    const [outputValue, setOutputValue] = useState<number>(0);
    const [reset, setReset] = useState<number>(0);
    const [reachBingo, setReachBingo] = useState<RBState>({reach: 0, bingo: 0});
    
    useEffect(() => {
        if(resetState && resetState > 0) {
            console.log('reset')
            setReset(reset + 1);
        }
    },[resetState])

    useEffect(() => {
        if(gameCount === 0){
            alert('game start');
            console.log(`
            outNumbers: ${outNumbers},
            ballCount: ${ballCount},
            outputValue: ${outputValue},
            reset: ${reset},
            reachBingo: ${reachBingo.reach}+${reachBingo.bingo}
            `)
        }else if(gameCount > maxOutput){
            alert('gameSet!');
            const isRestart = window.confirm("do you restart?");
                if(isRestart){
                    resetFunc();
                    setOutNumbers(a.forOutput);
                    setBallCount(0);
                    setOutputValue(0);
                    setReachBingo({reach: 0, bingo: 0})
                }else{
                    return;
                }
        }else{
            if(!new Common().checkAllBingo()){
                const o = new Output();
                const outball = o.proceed(outNumbers);
                console.log(gameCount,outball);
                if(outball){
                    setOutNumbers(outball.newOutNumbers);
                    setOutputValue(outball.splice);
                    setBallCount(gameCount);
                }
                const ba = new BingoAnalyzer(a.gNumberOfSide);
                setReachBingo(ba.checkReach_Bingo())
            }else{
                const isRestart = window.confirm("do you restart");
                if(isRestart){
                    resetFunc();
                    setOutNumbers(a.forOutput);
                    setBallCount(0);
                    setOutputValue(0);
                    retInit.resetHit();
                }else{
                    return;
                }
            };
        }
    }, [gameCount]);

    const outputsProps :OutputsProps = useMemo(() => {
        return {
            count: `${ballCount}/${maxOutput}`,
            value: outputValue
        }
    }, [outputValue, reset])

    const ret = useMemo(() => {
        return (
            <>
            <Outputs {...outputsProps} />
            <table>
                <tbody>
                    <Th />
                    <Tr forOutput={outNumbers}/>
                </tbody>
            </table>
            <Reach value={reachBingo.reach}/>
            <Bingo value={reachBingo.bingo}/>
            </>
        )
    },[outputValue,reset]); //gameCountだと変わらない（なぜ？）

    console.log('before Table.ret')

    return ret;
})

export default Table
