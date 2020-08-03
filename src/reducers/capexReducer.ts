import CapexExpense from '../../types/CapexExpense';
import CapexExpenseSetGroup from '../../types/CapexExpenseSetGroup';
import CapexSet from '../../types/CapexSet';
import { CAPEX_ADD_SUCCESS } from '../actions/capex/addCapex';
import { CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS } from '../actions/capex/addCapexSetGroup';
import {
  CAPEX_SET_ERROR,
  CAPEX_SET_FETCH,
  CAPEX_SET_SUCCESS,
  CapexesAction,
} from '../actions/capex/capexSet';
import { CAPEX_UPDATE_VALUE_SUCCESS } from '../actions/capex/updateCapexValue';

const initialState = {
  capexSet: {} as CapexSet,
};
let groupList: CapexExpenseSetGroup[];
let group: CapexExpenseSetGroup;
let capexExpenseList: CapexExpense[];
let capexExpense: CapexExpense;
let newGroupTotalValue: number;

export default function capexReducer(state = initialState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_FETCH:
    case CAPEX_SET_SUCCESS:
      return {
        ...state,
        capexSet: action.payload,
      };
    case CAPEX_SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS:
      /* eslint-disable-line */const newCapexSet = {...state.capexSet};
      /* eslint-disable-line */newCapexSet.capexExpenseGroupList?.push(action.payload);
      return {
        ...state,
        capexSet: newCapexSet,
      };
    case CAPEX_ADD_SUCCESS:
      /* eslint-disable-line */const newCapex = {...state.capexSet};
      /* eslint-disable-line */newCapex?.capexExpenseGroupList?.find((group: CapexExpenseSetGroup) => group?.id === action.payload.group?.id)?.capexExpenseList?.push(action.payload.capex);
      return {
        ...state,
        capexSet: newCapex,
      };
    case CAPEX_UPDATE_VALUE_SUCCESS:
      groupList = (state?.capexSet.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[];
      group = (groupList?.find(
        (groupItem: CapexExpenseSetGroup) => groupItem.id === action.payload.group?.id,
      ) ?? {}) as CapexExpenseSetGroup;
      capexExpenseList = group?.capexExpenseList ?? [];
      capexExpense = (capexExpenseList.find(
        (capex: CapexExpense) => capex.id === action.payload.capex?.id,
      ) ?? {}) as CapexExpense;
      newGroupTotalValue = 0;
      /* eslint-disable-line */capexExpenseList.map((capexItem: CapexExpense) => {
        if (capexItem.id !== action.payload.capex.id) {
          newGroupTotalValue += capexItem?.valueTotal ?? 0;
        } else newGroupTotalValue += action.payload.capex.valueTotal ?? 0;
      });
      return {
        ...state,
        capexSet: {
          ...state.capexSet,
          ...{
            capexExpenseGroupList: [
              ...groupList.map((groupItem: CapexExpenseSetGroup) => {
                if (groupItem.id === group.id) {
                  return {
                    ...{
                      // ...state.capexSet.capexExpenseGroupList,
                      ...action.payload.group,
                      valueTotal: newGroupTotalValue,
                      capexExpenseList: [
                        ...capexExpenseList.map((i: CapexExpense) => {
                          if (i.id === capexExpense.id) {
                            return { ...action.payload.capex };
                          }
                          return { ...i };
                        }),
                      ],
                    },
                  };
                }
                return { ...groupItem };
              }),
            ],
            /* capexExpenseGroupList: [
              ...groupList.filter((i: CapexExpenseSetGroup) => i.id !== group.id),
              ...[
                {
                  ...group,
                  ...{
                    ...state.capexSet.capexExpenseGroupList,
                    valueTotal: newGroupTotalValue,
                    capexExpenseList: [
                      ...capexExpenseList.map((i: CapexExpense) => {
                        if (i.id === capexExpense.id) {
                          return {...action.payload.capex};
                        }
                        return {...i};
                      }),
                    ],
                    /!*capexExpenseList: [
                      ...capexExpenseList.filter((i: CapexExpense) => i.id !== capexExpense.id),
                      ...[{...capexExpense, ...action.payload.capex}],
                    ],*!/
                  },
                },
              ],
            ], */
          },
        },
      };
    default:
      return state;
  }
}
