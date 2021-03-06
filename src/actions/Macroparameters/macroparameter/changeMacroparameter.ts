import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import Article from '../../../../types/Article';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import headers from '../../../helpers/headers';
import { projectIdFromLocalStorage } from '../../../helpers/projectIdToLocalstorage';
import { MacroparamsAction } from '../macroparameterSetList';

export const CHANGE_MACROPARAM_INIT = 'CHANGE_MACROPARAM_INIT';
export const CHANGE_MACROPARAM_SUCCESS = 'CHANGE_MACROPARAM_SUCCESS';
export const CHANGE_MACROPARAM_ERROR = 'CHANGE_MACROPARAM_ERROR';

const changeMacroparameterInitialized = (): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_INIT,
});

const changeMacroparameterSuccess = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_SUCCESS,
  payload: { macroparameter, group },
});

const changeMacroparameterError = (message: any): MacroparamsAction => ({
  type: CHANGE_MACROPARAM_ERROR,
  errorMessage: message,
});

export const requestChangeMacroparameter = (
  macroparameter: Article,
  group: MacroparameterSetGroup,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  /* TODO: replace any by defining reducers type */
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
    const { selected } = getState()?.macroparamsReducer;
    dispatch(changeMacroparameterInitialized());

    try {
      const response = await fetch(`graphql/${projectIdFromLocalStorage()}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          query:
            /* `mutation {changeMacroparameter(` +
            `macroparameterSetId: ${selected.id.toString()},` +
            `macroparameterGroupId: ${group?.id?.toString()},` +
            `macroparameterId: ${macroparameter.id},` +
            `${macroparameter.caption ? `caption:"${macroparameter.caption}",` : ''}` +
            `${macroparameter.unit ? `unit:"${macroparameter.unit}",` : ''}` +
            `${macroparameter.value ? `value:${macroparameter.value},` : ''}` +
            `){macroparameter{name, id, caption,unit, value{year,value}}, ok}}`, */
            `mutation changeMacroparameter{
            changeMacroparameter(
              macroparameterSetId: ${selected.id.toString()}
              macroparameterGroupId: ${group?.id?.toString()}
              macroparameterId: ${macroparameter.id}
              ${macroparameter.caption ? `caption:"${macroparameter.caption}",` : ''}
              ${macroparameter.unit ? `unit:"${macroparameter.unit}",` : 'unit:""'}
              ${macroparameter.value ? `value:${macroparameter.value},` : ''}
            ){
              macroparameter{
              __typename
                ... on Macroparameter{
                  name
                  id
                  caption
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
            }
          }`,
        }),
      });

      const body = await response.json();
      const responseData = body?.data?.changeMacroparameter;

      if (response.status === 200 && responseData?.macroparameter?.__typename !== 'Error') {
        const updatedMacroparameter = responseData?.macroparameter;

        if (updatedMacroparameter) {
          dispatch(changeMacroparameterSuccess(updatedMacroparameter as Article, group));
        }
      } else {
        dispatch(changeMacroparameterError(body.message));
      }
    } catch (e) {
      dispatch(changeMacroparameterError(e));
    }
  };
};
