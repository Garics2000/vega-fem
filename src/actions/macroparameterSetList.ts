import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import MacroparameterSet from '../../types/MacroparameterSet';
import { authHeader } from '../helpers/authTokenToLocalstorage';

export const MACROPARAMS_SET_LIST_FETCH = 'MACROPARAMS_SET_LIST_FETCH';
export const MACROPARAMS_SET_LIST_SUCCESS = 'MACROPARAMS_SET_LIST_SUCCESS';
export const MACROPARAMS_SET_LIST_ERROR = 'MACROPARAMS_SET_LIST_ERROR';

export const MACROPARAMS_SET_SELECTED = 'MACROPARAMS_SET_SELECTED';

export interface MacroparamsAction {
  type: string;
  // TODO: replace any
  payload?: any;
  errorMessage?: any;
}

const macroparameterSetListFetch = (): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_FETCH,
});

const macroparameterSetListSuccess = (
  macroparameterSetList: MacroparameterSet[],
): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_SUCCESS,
  payload: macroparameterSetList,
});

const macroparameterSetListError = (message: any): MacroparamsAction => ({
  type: MACROPARAMS_SET_LIST_ERROR,
  errorMessage: message,
});

export function fetchMacroparameterSetList(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(macroparameterSetListFetch());

    try {
      /* TODO: set project id dynamically */
      const response = await fetch('graphql/5edde72c45eb7b93ad30c0c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({
          query:
            '{macroparameterSetList{' +
            'id,' +
            'name,' +
            'caption,' +
            'years,' +
            'yearStart,' +
            'category,' +
            'allProjects,' +
            'macroparameterGroupList{id,name,caption,macroparameterList{id,name,caption,unit,value{year,value}}}}}',
        }),
      });
      const body = await response.json();

      if (response.ok) {
        dispatch(macroparameterSetListSuccess(body.data?.macroparameterSetList));
      } else {
        dispatch(macroparameterSetListError(body.message));
      }
    } catch (e) {
      dispatch(macroparameterSetListError(e));
    }
  };
}

export const selectMacroparameterSet = (MacroparamSet: MacroparameterSet): MacroparamsAction => ({
  type: MACROPARAMS_SET_SELECTED,
  payload: MacroparamSet,
});
