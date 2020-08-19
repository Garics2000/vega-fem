import CapexSetGlobalValue from '../../types/CAPEX/CapexSetGlobalValue';
import { CapexesAction } from '../actions/capex/capexSet';
import {
  CAPEX_SET_GLOBAL_VALUE_ERROR,
  CAPEX_SET_GLOBAL_VALUE_SUCCESS,
} from '../actions/capex/capexSetGlobalValue';

export interface InitialState {
  capexSetGlobalValue: CapexSetGlobalValue;
  error?: any;
}
const firstState: InitialState = { capexSetGlobalValue: {} };

export default function capexGlobalValuesReducer(state = firstState, action: CapexesAction) {
  switch (action.type) {
    case CAPEX_SET_GLOBAL_VALUE_SUCCESS:
      return {
        ...state,
        capexSetGlobalValue: action.payload,
      };
    case CAPEX_SET_GLOBAL_VALUE_ERROR:
      return {
        ...state,
        error: action.errorMessage,
      };
    default:
      return state;
  }
}
