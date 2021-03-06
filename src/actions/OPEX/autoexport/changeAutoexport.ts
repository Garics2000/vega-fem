import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { OPEXGroup } from '../../../../types/OPEX/OPEXGroup';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';

export const OPEX_AUTOEXPORT_CHANGE_INIT = 'OPEX_AUTOEXPORT_CHANGE_INIT';
export const OPEX_AUTOEXPORT_CHANGE_SUCCESS = 'OPEX_AUTOEXPORT_CHANGE_SUCCESS';
export const OPEX_AUTOEXPORT_CHANGE_ERROR = 'OPEX_AUTOEXPORT_CHANGE_ERROR';

export interface OPEXAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const OPEXAutoexportChangeInit = (): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_INIT,
});

const OPEXAutoexportChangeSuccess = (autoexport: OPEXGroup): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_SUCCESS,
  payload: autoexport,
});

const OPEXAutoexportChangeError = (message: any): OPEXAction => ({
  type: OPEX_AUTOEXPORT_CHANGE_ERROR,
  errorMessage: message,
});

export function autoexportChange(
  autoexport: OPEXGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(OPEXAutoexportChangeInit());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query: `mutation changeOpexAutoexport{
              changeOpexAutoexport(
                yearEnd: ${autoexport.yearEnd.toString()},
              ){
                autoexport{
                  __typename
                  ... on OpexExpenseGroup{
                    yearStart,
                    yearEnd,
                    opexExpenseList{
                      __typename
                    ... on OpexExpenseList{
                      opexExpenseList{
                        id,
                        name,
                        caption,
                        unit,
                        valueTotal,
                        description,
                        value{
                          year,
                          value
                        }
                      }
                    }
                      ... on Error{
                        code
                        message
                        details
                        payload
                      }
                    }
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

      if (
        response.status === 200 &&
        body.data.changeOpexAutoexport.autoexport?.__typename !== 'Error'
      ) {
        dispatch(OPEXAutoexportChangeSuccess(body.data?.changeOpexAutoexport?.autoexport));
      } else {
        dispatch(OPEXAutoexportChangeError(body.message));
      }
    } catch (e) {
      dispatch(OPEXAutoexportChangeError(e));
    }
  };
}
