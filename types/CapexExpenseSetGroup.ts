import CapexExpense from './CapexExpense';

export default interface CapexExpenseSetGroup {
  id?: string | number;
  name?: string;
  caption?: string;
  valueTotal?: string;
  capexExpenseList?: CapexExpense[];
}
