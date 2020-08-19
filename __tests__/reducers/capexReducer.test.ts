import { CAPEX_ADD_ERROR, CAPEX_ADD_SUCCESS } from '../../src/actions/capex/addCapex';
import {
  CAPEX_EXPENSE_SET_GROUP_ADD_ERROR,
  CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS,
} from '../../src/actions/capex/addCapexSetGroup';
import {
  CAPEX_SET_ERROR,
  CAPEX_SET_FETCH,
  CAPEX_SET_SUCCESS,
  CapexesAction,
} from '../../src/actions/capex/capexSet';
import capexReducer from '../../src/reducers/capexReducer';
import CapexExpense from '../../types/CAPEX/CapexExpense';
import CapexExpenseSetGroup from '../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../types/CAPEX/CapexSet';

let state: CapexSet = {
  years: 15,
  yearStart: 2020,
  capexGlobalValueList: [
    {
      id: '3',
      name: 'reserveValue',
      caption: 'Величина резерва',
      value: 38.0,
    },
  ],
  capexExpenseGroupList: [
    {
      id: '1',
      name: 'oneTimePaymentGroup',
      caption: 'Первоначальный взнос',
      valueTotal: 1000000.0,
      capexExpenseList: [
        {
          id: '1',
          name: 'oneTimePaymentValue',
          caption: 'Значение разового платежа',
          valueTotal: 1000000.0,
        },
      ],
    },
  ],
};

beforeEach(() => {
  state = {
    years: 15,
    yearStart: 2020,
    capexGlobalValueList: [
      {
        id: '3',
        name: 'reserveValue',
        caption: 'Величина резерва',
        value: 38.0,
      },
    ],
    capexExpenseGroupList: [
      {
        id: '1',
        name: 'oneTimePaymentGroup',
        caption: 'Первоначальный взнос',
        valueTotal: 1000000.0,
        capexExpenseList: [
          {
            id: '1',
            name: 'oneTimePaymentValue',
            caption: 'Значение разового платежа',
            valueTotal: 1000000.0,
          },
        ],
      },
    ],
  };
});

describe('capexSet', () => {
  test('capex set fetch', () => {
    const action: CapexesAction = { type: CAPEX_SET_FETCH };
    const newState = capexReducer({ capexSet: {} }, action);
    expect(newState.capexSet).toBeUndefined();
  });
  test('capex set success', () => {
    const action: CapexesAction = { type: CAPEX_SET_SUCCESS, payload: state };
    const newState = capexReducer({ capexSet: {} }, action);
    expect(newState.capexSet).toBeDefined();
  });
  test('capex set error', () => {
    const action: CapexesAction = { type: CAPEX_SET_ERROR, errorMessage: 'error' };
    const newState = capexReducer({ capexSet: {} }, action);
    expect(newState.error).toBe('error');
  });
});

describe('addCapexSetGroup', () => {
  test('add success', () => {
    const fakeGroup: CapexExpenseSetGroup = {
      id: 4,
      name: 'Новая_группа',
      caption: 'Новая группа',
      valueTotal: 0,
      capexExpenseList: [],
    };
    const action: CapexesAction = { type: CAPEX_EXPENSE_SET_GROUP_ADD_SUCCESS, payload: fakeGroup };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.capexSet.capexExpenseGroupList).toHaveLength(2);
  });
  test('add error', () => {
    const action: CapexesAction = {
      type: CAPEX_EXPENSE_SET_GROUP_ADD_ERROR,
      errorMessage: 'error',
    };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.error).toBe('error');
  });
});

describe('addCapex', () => {
  test('add success', () => {
    const fakeCapex: CapexExpense = {
      id: '3',
      name: 'Новая_статья',
      caption: 'Новая статья',
      unit: 'руб.',
      value: [],
    };
    const fakeCapexExpenseGroupList: Array<CapexExpenseSetGroup> = [
      {
        id: '1',
        name: 'oneTimePaymentGroup',
        caption: 'Первоначальный взнос',
        valueTotal: 1000000.0,
        capexExpenseList: [
          {
            id: '1',
            name: 'oneTimePaymentValue',
            caption: 'Значение разового платежа',
            valueTotal: 1000000.0,
          },
        ],
      },
    ];
    const action: CapexesAction = {
      type: CAPEX_ADD_SUCCESS,
      payload: { capex: fakeCapex, group: fakeCapexExpenseGroupList[0] },
    };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.capexSet.capexExpenseGroupList[0].capexExpenseList).toHaveLength(2);
  });
  test('add error', () => {
    const action: CapexesAction = { type: CAPEX_ADD_ERROR, errorMessage: 'error' };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.error).toBe('error');
  });
});

describe('updateCapexValue', () => {
  test('update success', () => {
    const fakeCapex: CapexExpense = {
      id: '3',
      name: 'Новая_статья',
      caption: 'Новая статья',
      unit: 'руб.',
      value: [],
    };
    const fakeCapexExpenseGroupList: Array<CapexExpenseSetGroup> = [
      {
        id: '1',
        name: 'oneTimePaymentGroup',
        caption: 'Первоначальный взнос',
        valueTotal: 1000000.0,
        capexExpenseList: [
          {
            id: '1',
            name: 'oneTimePaymentValue',
            caption: 'Значение разового платежа',
            valueTotal: 1000000.0,
          },
        ],
      },
    ];
    const action: CapexesAction = {
      type: CAPEX_ADD_SUCCESS,
      payload: { capex: fakeCapex, group: fakeCapexExpenseGroupList[0] },
    };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.capexSet.capexExpenseGroupList[0].capexExpenseList).toHaveLength(2);
  });
  test('update error', () => {
    const action: CapexesAction = { type: CAPEX_ADD_ERROR, errorMessage: 'error' };
    const newState = capexReducer({ capexSet: state }, action);
    expect(newState.error).toBe('error');
  });
});
