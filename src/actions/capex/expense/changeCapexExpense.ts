import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article, { ArticleValues } from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';
import { CapexesAction } from '../fetchCAPEX';

export const CHANGE_CAPEX_EXPENSE_INIT = 'CHANGE_CAPEX_EXPENSE_INIT';
export const CHANGE_CAPEX_EXPENSE_SUCCESS = 'CHANGE_CAPEX_EXPENSE_SUCCESS';
export const CHANGE_CAPEX_EXPENSE_ERROR = 'CHANGE_CAPEX_EXPENSE_ERROR';

const changeCapexExpenseInitialized = (): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_INIT,
});

const changeCapexExpenseSuccess = (
  capex: Article,
  group: CapexExpenseSetGroup,
  groupTotalValueByYear: ArticleValues[],
): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group, groupTotalValueByYear },
});

const changeCapexExpenseError = (message: any): CapexesAction => ({
  type: CHANGE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestChangeCapexExpense = (
  capex: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(changeCapexExpenseInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeCapexExpense{
            changeCapexExpense(
              capexExpenseGroupId:"${group?.id}",
              capexExpenseId:${capex.id},
              ${capex.caption ? `caption:"${capex.caption}",` : ''}
              ${capex.name ? `name:"${capex.name}",` : ''}
              ${capex.unit ? `unit:"${capex.unit}",` : 'unit:""'}
              ${capex.value ? `value:${capex.value},` : ''}
            ){
              capexExpense{
                __typename
                ... on CapexExpense{
                  id
                  name
                  caption
                  valueTotal
                  unit
                  value{
                    year
                    value
                  }
                }
                ... on Error{
                  code
                  message
                  details
                  payload
                }
              }
              totalValueByYear{
                year
                value
              }
            }
          }`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeCapexExpense;
      const groupTotalValueByYear = responseData?.totalValueByYear;

      if (response.status === 200 && responseData.capexExpense?.__typename !== 'Error') {
        const newCapex = responseData?.capexExpense;

        if (newCapex) {
          dispatch(changeCapexExpenseSuccess(newCapex as Article, group, groupTotalValueByYear));
        }
      } else {
        dispatch(changeCapexExpenseError(body.message));
      }
    } catch (e) {
      dispatch(changeCapexExpenseError(e));
    }
  };
};
