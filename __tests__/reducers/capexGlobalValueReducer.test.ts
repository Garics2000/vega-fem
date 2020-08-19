import { CapexesAction } from '../../src/actions/capex/capexSet';
import {
  CAPEX_SET_GLOBAL_VALUE_ERROR,
  CAPEX_SET_GLOBAL_VALUE_SUCCESS,
} from '../../src/actions/capex/capexSetGlobalValue';
import capexGlobalValuesReducer from '../../src/reducers/capexGlobalValuesReducer';
import CapexSetGlobalValue from '../../types/CAPEX/CapexSetGlobalValue';

describe('capexSetGlobalValue', () => {
  test('get global value success', () => {
    const fakeGlobalValue: CapexSetGlobalValue = {
      id: '3',
      name: 'reserveValue',
      value: 38.0,
    };
    const action: CapexesAction = {
      type: CAPEX_SET_GLOBAL_VALUE_SUCCESS,
      payload: fakeGlobalValue,
    };
    const newState = capexGlobalValuesReducer({ capexSetGlobalValue: {} }, action);
    expect(newState.capexSetGlobalValue).toBeDefined();
  });
  test('get global value error', () => {
    const action: CapexesAction = { type: CAPEX_SET_GLOBAL_VALUE_ERROR, errorMessage: 'error' };
    const newState = capexGlobalValuesReducer({ capexSetGlobalValue: {} }, action);
    expect(newState.error).toBe('error');
  });
});
