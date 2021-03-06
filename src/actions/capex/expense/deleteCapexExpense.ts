import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';
import { CapexesAction } from '../fetchCAPEX';

export const DELETE_CAPEX_EXPENSE_INIT = 'DELETE_CAPEX_EXPENSE_INIT';
export const DELETE_CAPEX_EXPENSE_SUCCESS = 'DELETE_CAPEX_EXPENSE_SUCCESS';
export const DELETE_CAPEX_EXPENSE_ERROR = 'DELETE_CAPEX_EXPENSE_ERROR';

const capexDeleteValueInitialized = (): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_INIT,
});

const capexDeleteValueSuccess = (capex: Article, group: CapexExpenseSetGroup): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_SUCCESS,
  payload: { capex, group },
});

const capexDeleteValueError = (message: any): CapexesAction => ({
  type: DELETE_CAPEX_EXPENSE_ERROR,
  errorMessage: message,
});

export const requestDeleteCapexExpense = (
  capex: Article,
  group: CapexExpenseSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(capexDeleteValueInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation deleteCapexExpense{
            deleteCapexExpense(
              capexExpenseGroupId:"${group?.id?.toString()}",
              capexExpenseId:"${capex.id}"
            ){
              result{
                __typename
                ... on Result{
                  vid
                }
                ... on Error{
                  code
                  message
                  details
                  payload
                }
              }
            }
        }`,
        }),
      });

      const body = await response.json();

      if (response.status === 200 && body.data.deleteCapexExpense?.result.__typename !== 'Error') {
        dispatch(capexDeleteValueSuccess(capex, group));
      } else {
        dispatch(capexDeleteValueError(body.message));
      }
    } catch (e) {
      dispatch(capexDeleteValueError(e));
    }
  };
};
