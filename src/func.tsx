import { StateContextType } from "./types";




export class Common{

    generateRandom = (max: number): number => {
        return max > 3 ? Math.floor(Math.random() * max) : max-1;
    }

    //乱数生成用の最大値を返す
    getMaxNum = (key: number ,gMax: number) =>{
        return (key + 1) * gMax +1
    }

    //数字の長さを返す
    private CheckNumDigits = (target: number): number =>{
        return target.toString().length;
    }

    //一桁の数字の先頭に0を付ける
    private addZero = (target: number | string): string =>{
        const strTarget = typeof target === 'number' ? String(target) : target;
        return this.CheckNumDigits(parseInt(strTarget)) < 2 ? "0" + strTarget : strTarget;
    }

    //指定個所に半角空白を付ける
    private addSpace = (target: string, type: number): string =>{
        const escape = "&ensp;";
        if(type==1){
            return escape + target;
        }else if(type==2){
            return target + escape;
        }else{
            return escape + target + escape;
        };
    }

    //ビンゴシートに出力する数字の型形成
    adjustValLength = (target: string): string =>{
        const strTarget = target.toString();
        const len = strTarget.length;

        if(len === 1){
            return this.addSpace(this.addZero(strTarget),3);
        }else if(len === 2){
            return this.addSpace(strTarget,3);
        }else{
            return strTarget;
        }
    }

    //document.getElementById()の省略
    getId = (idName: string) =>{
        return document.getElementById(idName);
    }

    //document.getElementsByTagName()の省略
    getTagName = (tagName: string) =>{
        return document.getElementsByTagName(tagName);
    }

    

    //引数を配列にして返す
    // toAry = (target: aryArg): Ary =>{
    //     return Array.from(Array.isArray(target) ? target : Array.from(target));
    // }

    // //gNumberOfSideの中央値を返す
    // getMedian = () => {
    //     if(gNumberOfSide %2 === 1){
    //         return gNumberOfSide/2 + 0.5;
    //     }else{
    //         return gNumberOfSide/2;
    //     }
    // }

    //ビンゴシートが全て終わっているか確認する
    checkAllBingo =()=>{
        const flg: string[] = [];
        const trs: Element[] = Array.from(this.getTagName("tr"));
        trs.forEach((tr:Element ,i: number) => {
            if(i !== 0){
                const tds: Element[] = Array.from(tr.children);
                if(tds.some((td) => td.className !== "hit")) flg.push("f");
            };
        });
        return (flg.length == 0);
    }
}


type InitProps = {
    gMax: number,
    gNumberOfSide: number,
    forOutput: number[],
    maxOutput: number
}

export class MainInit extends Common{
    private context: StateContextType;
    constructor(context: StateContextType){
        super();
        this.context = context
    }
    

    protected init = () => {
        const gMax: number = this.context.MaximumContext;
        const gNumberOfSide: number = this.context.linesContext;
        const forOutput: number[] = Array.from(
            {length: gMax * gNumberOfSide },
            (_,key) => key + 1
        );
        const maxOutput: number = forOutput.length;

        return {gMax,gNumberOfSide,forOutput,maxOutput};
    }
}

type RetType = {
    gNumberOfSide: number,
    forOutput: number[],
    maxOutput: number
}
export class RetInit extends MainInit {
    retInit = (): RetType => {
        const init = this.init();
        return {
            gNumberOfSide: init.gNumberOfSide,
            forOutput: init.forOutput,
            maxOutput: init.maxOutput
        }
    }

    resetHit = (): void => {
        const trs: Element[] = Array.from(this.getTagName("tr"));
        trs.forEach((tr,i) => {
            if(i != 0){
                const tds: Element[] = Array.from(tr.children);
                tds.map((td) => td.className = '')
            };
        });
    }
}

type OutputType = {
    splice: number,
    newOutNumbers: number[]
}

export class Output extends Common{
    private spliceOneFromAry = (ary: number[]) => {
        const max: number = ary.length;
        const spliceKey: number = this.generateRandom(max);
        const cpAry: number[] = Array.from(ary);
        const splice: number[] = cpAry.splice(spliceKey, 1);
        return {splice : splice[0], newOutNumbers: cpAry };
    }
    
    //出たボールとビンゴシート状の数が一致するか確認
    private checkHit = (outBall: number): boolean =>{
        const tagTd = this.getTagName("td");
        if(tagTd){
            const tds = Array.from(tagTd) as HTMLTableCellElement[];
            tds.forEach((td: HTMLTableCellElement) => {
                const tdVal = td.textContent ? parseInt(td.textContent): 0;
                if(tdVal == outBall && tdVal > 0) td.className = "hit";
            });
            return true;
        }else{
            return false;
        }
    }

    proceed = (forOutputs: number[]): OutputType | null => {
        const outball: OutputType = this.spliceOneFromAry(forOutputs);
        const isOK = this.checkHit(outball.splice);
        return isOK ? outball : null;
    }   
}

// export class Reset extends Common{
//     resetHit = () => {
//         const trs: Element[] = Array.from(this.getTagName("tr"));
//         trs.forEach((tr,i) => {
//             if(i != 0){
//                 const tds: Element[] = Array.from(tr.children);
//                 tds.map((td) => td.className = '')
//             };
//         });
//     }

// }

// export class Judge extends Common{



//     //gNumberOfSide文だけgNumbersの条件範囲から値を取ってくる
//     forGetValues = (tgtAry) => {
//         const ret = [];
//         const ary = toAry(tgtAry);
//         while(ret.length < gNumberOfSide){
//             const splice = spliceOneFromAry(ary);
//             ret.push(splice);
//         }
//         return ret;
//     }

//     //gMaxの条件を基にgNumbersからgNumberOfSide分取得する
//     fetchValFromAry = (key) => {
//         const ary = toAry(gNumbers[0]);
//         const scope = ary.slice(key*gMax, (key+1)*gMax);
//         const valAry = forGetValues(scope);
//         return valAry;
//     }

//     //gNumbersを生成して、ビンゴシート用の数字を取得する
//     generateSheetValues = () => {
//         setOutNumbers();
//         const valAry = [];
//         while(valAry.length < gNumberOfSide){
//             const i = valAry.length;
//             valAry[i] = fetchValFromAry(i);
//         }
//         sortRowToCols(valAry);
//     }

//     //生成された数字をシートに出力する
//     setNum = (setNumbers,trNum) =>{
//         const tr = getId(`row-${trNum}`);
//         const tds = toAry(tr.children);
//         tds.map((td,i) => {
//             const value = adjustValLength(setNumbers[i]);
//             td.innerHTML = value;
//         });
//     }

//     //2次元配列のvalueを返す
//     getDoubleKeyVal = (twoDimensionalAry,key0,key1) => {
//         return twoDimensionalAry[key0][key1];
//     }

//     //row状態のビンゴシート用配列を出力用のcol状態の並び替える再帰関数
//     loopToSort = (i, times, func, argList, state, retValue) =>{
//         const ret = retValue ? retValue : [];
//         if(i<times){
//             if(state === 1){
//                 if(i == getMedian()-1){
//                     ret.push("free");
//                     loopToSort(i+1, times, getDoubleKeyVal, argList, state, ret);
//                 }else{
//                     ret.push(getDoubleKeyVal(argList[0], i, argList[1]));
//                     loopToSort(i+1, times, getDoubleKeyVal, argList, state, ret);
//                 }
//             }else if(state === 2){
//                 if(i == times-1){
//                     ret.push(getDoubleKeyVal(argList[0], getMedian()-1, getMedian()-1));
//                     loopToSort(i+1, times, getDoubleKeyVal, argList, state, ret);
//                 }else{
//                     ret.push(getDoubleKeyVal(argList[0], i, argList[1]));
//                     loopToSort(i+1, times, getDoubleKeyVal, argList, state, ret);
//                 }
//             }else{
//                 ret.push(getDoubleKeyVal(argList[0], i, argList[1]));
//                 loopToSort(i+1, times, getDoubleKeyVal, argList, state, ret);
//             }
//         }
//         return ret;
//     }

//     //[0]->B列用配列,[1]->I列用配列...となっているため、[0]->BINGOの１列目用数字...のように置き換える
//     sortRowToCols = (setNumbers) =>{
//         const columns = [];

//         while(columns.length < gNumberOfSide){
//             const i = columns.length;
//             if(i === getMedian()-1){
//                 columns[i] = loopToSort(0, gNumberOfSide, getDoubleKeyVal, [setNumbers, i], 1);
//             }else{
//                 columns[i] = loopToSort(0, gNumberOfSide, getDoubleKeyVal, [setNumbers, i], 0);
//             }
//             setNum(columns[i], i+1);
//         }
//     }

//     //ビンゴシートが全て終わっているか確認する
//     checkAllBingo =()=>{
//         const flg = [];
//         const trs = toAry(getTagName("tr"));
//         trs.forEach((tr,i) => {
//             if(i != 0){
//                 const tds = toAry(tr.children);
//                 if(tds.some((td) => td.className != "hit")) flg.push("f");
//             };
//         });
//         return (flg.length == 0);
//     }

//     //既出ボール数を返す
//     getNowOutCount = () =>{
//         const count = gNumberOfSide * gMax - gNumbers[0].length;
//         return count;
//     }

//     //出力ボールの数字を取り出す
//     fetchOutBall = () => {
//         const splice = spliceOneFromAry(gNumbers[0]);
//         return splice;
//     }


//     //出力ボール生成
//     setOutBall = () =>{
//         const random = fetchOutBall();
//         const newBall = addSpace(addZero(random.toString()),3);
//         const out = getId("out");
//         const nowCount = getNowOutCount();
//         out.innerHTML = `Ball[${nowCount}]:${newBall}`;
//     }


type HitSheet = string[][];
type RBcount = number[];
type CheckHit = {
    hitSheet: HitSheet,
    counts: RBcount
}
type CheckCntType = {
    hitCount: number,
    counts: RBcount
}

export class BingoAnalyzer extends Common{

    sideLength: number;

    constructor(sideLength = 0){
        super();
        this.sideLength = sideLength;
    }

    private generateHitSheet = (): HitSheet =>{
        const hitSheet: HitSheet = new Array(this.sideLength).fill(null);
        hitSheet.forEach((_, i: number) => {
            hitSheet[i] = new Array(this.sideLength).fill("");
        });
        return hitSheet;
    }

    private getHitState =(): HitSheet=>{
        const trs: Element[] = Array.from(this.getTagName("tr"));
        const hitSheet: HitSheet = this.generateHitSheet();
        trs.forEach((tr, i: number) => {
            if(i !== 0){
                const tds: Element[] = Array.from(tr.children);
                tds.forEach((td, n: number) => {
                    if(td.className === "hit") hitSheet[i-1][n] = "h";
                });
            }
        });
        return hitSheet;
    }

    //リーチとビンゴの数を算出する
    private checkCnt =(arg: CheckCntType)=>{
        const {hitCount, counts} = arg;
        const [reach, bingo] = counts;

        if(hitCount === this.sideLength-1){
            return [reach + 1, bingo];
        }else if(hitCount === this.sideLength){
            return [reach, bingo + 1];
        }else{
            return [reach, bingo];
        }
    }

    private getReachBingoCount = (arg: CheckHit) =>{
        const {hitSheet,counts} = arg
        const count: number[] = [];
        const ret: RBcount = Array.from(counts);
        hitSheet.forEach((row: string[], r: number) => {
            // count[r]: number = (row.filter((val)=>val === "h")).length;
            count.push(
                (row.filter(
                    (val)=> val === "h")
                ).length
            );
        });

        // const tmp = [];
        count.forEach((cnt: number)=> {
            if(cnt >= this.sideLength - 1) {
                const tmp: RBcount = this.checkCnt({hitCount:cnt,counts: ret});
                tmp.forEach(
                    (val: number, i: number) => ret[i] = val
                );
            }
        });
        return ret;
    }

    //横列のビンゴチェック
    private checkHitRow =(arg: CheckHit)=>{
        const {hitSheet,counts} = arg
        return this.getReachBingoCount({hitSheet,counts});
    }

    //一次元配列から並び替えた新たな配列を生成する
    private cutOutArray = (
        oneRowAry: string[],
        pRetLen: number,
        count: number = 0,
        retValue: string = ''
    ): string[] =>{
        if(count <this.sideLength){
            // const r = pRetLen ? pRetLen : 0;
            const r = pRetLen;
            const add = oneRowAry[r + count * this.sideLength];
            const ret = count !== this.sideLength-1 ? `${retValue + add},` : `${retValue + add}`;
            return this.cutOutArray(oneRowAry, r, count + 1, ret);
        }
        return retValue.split(",");
    }

    //元HitSheetの一次元配列からHitSheetにおける各行の同じ列で配列を生成する
    private sortToCheckHitColumn = (oneRowAry: string[]): HitSheet=>{
        const ret: HitSheet = [];
        while(ret.length < this.sideLength){
            const i: number = ret.length; //cutOutArray()のpRetLen
            ret.push(
                this.cutOutArray(oneRowAry,i)
            );
        }
        return ret;
    }

    //縦列のビンゴチェック
    private checkHitCol =(arg: CheckHit)=>{
        const {hitSheet, counts} = arg;
        const oneRowAry: string[] = [];
        hitSheet.forEach((row) => {
            row.forEach((val: string)=> oneRowAry.push(val));
        });

        const sortAry: HitSheet = this.sortToCheckHitColumn(oneRowAry);
        const cnt: RBcount = Array.from(counts);

        return this.getReachBingoCount({hitSheet: sortAry, counts: cnt});
    }

    //"/"のビンゴチェック
    private checkSlash = (hitSheet: HitSheet, count: number, line: number): number =>{
        const rowCnt: number = hitSheet.length -1;
        return hitSheet[line][rowCnt - line] === "h" ? count +1 : count;
    }

    //"\"のビンゴチェック
    private checkBSlash = (hitSheet: HitSheet, count: number, line: number): number =>{
        return hitSheet[line][line] === "h" ? count +1 : count;
    }

    //ななめのヒット数をそれぞれ出す
    private getCrossCount = (hitSheet: HitSheet, CrossCnt: RBcount, colCnt: number) =>{
        const slash = this.checkSlash(hitSheet, CrossCnt[0], colCnt);
        const bSlash = this.checkBSlash(hitSheet, CrossCnt[1], colCnt);
        return [slash, bSlash];
    }

    //ななめのビンゴチェック
    private checkHitCross =(arg: CheckHit): RBcount=>{
        const {hitSheet, counts} = arg
        const XCnt: number[] = [0,0]; //[slashCount, bSlashCount]
        hitSheet.forEach((_,i) => {
            const HitCntOfX: RBcount = this.getCrossCount(hitSheet, XCnt, i);
            HitCntOfX.forEach((cnt, n) => XCnt[n] = cnt);
        });
        const [slash, bSlash] = XCnt;
        const results: RBcount = 
            this.checkCnt({hitCount: bSlash, counts:
                this.checkCnt({hitCount: slash, counts})
            });
        return results;
    }

    private checkUpdateReach_Bingo =(counts: RBcount): void =>{
        counts.forEach((count,i) => {
            switch(i){
                case 0:
                    const reach = this.getId("reach") as HTMLDivElement;
                    reach.textContent = String(count);
                    break;
                case 1:
                    const bingo = this.getId("bingo") as HTMLDivElement;
                    bingo.textContent = String(count);
                    break;
                default:
                    break;
            }
        });
    }

    private getAllRBCounts = (arg: CheckHit): RBcount => {
        const {hitSheet,counts} = arg;
        const row: RBcount = this.checkHitRow({hitSheet,counts});
        const col: RBcount = this.checkHitCol({hitSheet,counts: row});
        const x: RBcount = this.checkHitCross({hitSheet,counts: col});
        return x;
    }


    checkReach_Bingo = () =>{
        const counts: RBcount = [0,0];     //counts[reach, bingo]
        const hitSheet: HitSheet = this.getHitState();
        const results: RBcount = this.getAllRBCounts({hitSheet, counts})
        // this.checkUpdateReach_Bingo(results);
        return {reach: results[0], bingo: results[1]}
    }
}