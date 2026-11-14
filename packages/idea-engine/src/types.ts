export type FieldType = 'text'|'number'|'date'|'time'|'choice'|'notes';
export type FlowType = 'calculator'|'handoff'|'checklist'|'journal'|'ledger'|'inventory'|'timeline'|'register'|'measure'|'counter'|'session'|'flashcard'|'progress';
export type Calculation = 'none'|'rounding'|'cash'|'shortage'|'commission'|'reorder'|'area'|'change'|'difference'|'cutlist'|'split'|'progress'|'sum'|'counterValue'|'unique:first';
export type Layout = 'ledger'|'board'|'timeline'|'paper'|'shelf'|'tiles'|'atelier'|'hero';
export interface FieldSpec {key:string;type:FieldType;label:string;required:boolean;options?:readonly string[]}
export interface IdeaSpec {
  id:string;slug:string;name:string;category:string;icp:string;job:string;query:string;score:number;
  ratings:{intent:number;pay:number;repeat:number;fast:number;safe:number};
  flow:FlowType;fields:readonly FieldSpec[];rule:Calculation;cta:string;layout:Layout;
}
export interface Entry {id:string;createdAt:string;values:Record<string,string>;done:boolean;count:number}
