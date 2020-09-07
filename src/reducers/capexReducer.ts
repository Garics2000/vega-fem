import Article, { ArticleValues } from '../../types/Article';
import CapexExpenseSetGroup from '../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../types/CAPEX/CapexSet';
import { CAPEX_ADD_SUCCESS } from '../actions/capex/addCapex';
import { CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS } from '../actions/capex/addCapexSetGroup';
import {
  CAPEX_SET_ERROR,
  CAPEX_SET_FETCH,
  CAPEX_SET_SUCCESS,
  CapexesAction,
} from '../actions/capex/capexSet';
import { CAPEX_EXPENSE_SET_GROUP_CHANGE_SUCCESS } from '../actions/capex/changeCapexSetGroup';
import { DELETE_CAPEX_EXPENSE_SUCCESS } from '../actions/capex/deleteCapexExpense';
import { CAPEX_EXPENSE_SET_GROUP_DELETE_SUCCESS } from '../actions/capex/deleteCapexSetGroup';
import { CAPEX_UPDATE_VALUE_SUCCESS } from '../actions/capex/updateCapexValue';
import { CAPEX_UPDATE_YEAR_VALUE_SUCCESS } from '../actions/capex/updateCapexYearValue';
// import {DELETE_CAPEX_EXPENSE_SUCCESS} from "../actions/capex/deleteCapexExpense";

const initialState = {
  capexSet: {} as CapexSet,
  focusedArticle: {} as any,
};
let groupList: CapexExpenseSetGroup[];
let group: CapexExpenseSetGroup;
let capexExpenseList: Article[];
let capexExpense: Article;
let value: ArticleValues[];
let newGroupTotalValue: number;
let newCapexValueTotal: number;

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
    case CAPEX_EXPENSE_SET_GROUP_CHANGE_SUCCESS:
      groupList = (state?.capexSet.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[];
      group = (groupList?.find(
        (groupItem: CapexExpenseSetGroup) => groupItem.id === action.payload.id,
      ) ?? {}) as CapexExpenseSetGroup;
      return {
        ...state,
        capexSet: {
          ...state.capexSet,
          capexExpenseGroupList: [
            ...groupList.map((groupItem: CapexExpenseSetGroup) => {
              if (groupItem.id === group.id) {
                return {
                  ...groupItem,
                  caption: action.payload.caption,
                };
              }
              return { ...groupItem };
            }),
          ],
        },
      };
    case CAPEX_EXPENSE_SET_GROUP_DELETE_SUCCESS:
      groupList = (state?.capexSet.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[];
      group = (groupList?.find(
        (groupItem: CapexExpenseSetGroup) => groupItem.id === action.payload.id,
      ) ?? {}) as CapexExpenseSetGroup;
      return {
        ...state,
        capexSet: {
          ...state.capexSet,
          capexExpenseGroupList: [
            ...groupList.filter((groupItem: CapexExpenseSetGroup) => groupItem.id !== group.id),
          ],
        },
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
        (capex: Article) => capex.id === action.payload.capex?.id,
      ) ?? {}) as Article;
      newGroupTotalValue = 0;
      capexExpenseList.forEach((capexItem: Article) => {
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
                      ...action.payload.group,
                      valueTotal: newGroupTotalValue,
                      capexExpenseList: [
                        ...capexExpenseList.map((i: Article) => {
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
          },
        },
      };
    case DELETE_CAPEX_EXPENSE_SUCCESS:
      groupList = (state?.capexSet.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[];
      group = (groupList?.find(
        (groupItem: CapexExpenseSetGroup) => groupItem.id === action.payload.group?.id,
      ) ?? {}) as CapexExpenseSetGroup;
      capexExpenseList = group?.capexExpenseList ?? [];
      capexExpense = (capexExpenseList.find(
        (capex: Article) => capex.id === action.payload.capex?.id,
      ) ?? {}) as Article;
      newGroupTotalValue = 0;
      capexExpenseList.forEach((capexItem: Article) => {
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
                      ...action.payload.group,
                      valueTotal: newGroupTotalValue,
                      capexExpenseList: [
                        ...capexExpenseList.filter((i: Article) => i.id !== capexExpense.id),
                      ],
                    },
                  };
                }
                return { ...groupItem };
              }),
            ],
          },
        },
      };
    case CAPEX_UPDATE_YEAR_VALUE_SUCCESS:
      groupList = (state?.capexSet.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[];
      group = (groupList?.find(
        (groupItem: CapexExpenseSetGroup) => groupItem.id === action.payload.group?.id,
      ) ?? {}) as CapexExpenseSetGroup;
      capexExpenseList = group?.capexExpenseList ?? [];
      capexExpense = (capexExpenseList.find(
        (capex: Article) => capex.id === action.payload.capex?.id,
      ) ?? {}) as Article;

      newCapexValueTotal = 0;
      value = (capexExpense?.value as ArticleValues[]).map((articleValue: ArticleValues) => {
        const iCopy = articleValue;
        if (iCopy.year === action.payload.value?.year) {
          iCopy.value = action.payload.value?.value;
          newCapexValueTotal += action.payload.value?.value;
        } else newCapexValueTotal += articleValue.value;
        return iCopy;
      });

      newGroupTotalValue = 0;
      capexExpenseList.forEach((capexItem: Article) => {
        if (capexItem.id !== action.payload.capex.id) {
          newGroupTotalValue += capexItem?.valueTotal ?? 0;
        } else newGroupTotalValue += newCapexValueTotal ?? 0;
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
                      // ...action.payload.group,
                      ...group,
                      ...{ valueTotal: newGroupTotalValue },
                      ...{
                        capexExpenseList: [
                          ...capexExpenseList.map((article: Article) => {
                            if (article.id === capexExpense.id) {
                              return {
                                ...capexExpense,
                                ...{ value },
                                ...{ valueTotal: newCapexValueTotal },
                              };
                            }
                            return { ...article };
                          }),
                        ],
                      },
                    },
                  };
                }
                return { ...groupItem };
              }),
            ],
          },
        },
      };
    /* case DELETE_CAPEX_EXPENSE_SUCCESS:{

    }; */
    default:
      return state;
  }
}
