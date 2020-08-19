import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';

import { CapexSetWrapper } from '../../../../src/components/CAPEX/CapexSetWrapper/CapexSetWrapper';
import CapexSet from '../../../../types/CAPEX/CapexSet';
import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';

let fakeCapexSet: CapexSet;
let fakeReservedValue: CapexSetGlobalValue;

beforeEach(() => {
  fakeCapexSet = {
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
  fakeReservedValue = {
    id: '3',
    name: 'reserveValue',
    value: 38.0,
  };
});

describe('<CapexSetWrapper/>', () => {
  test('рендерится без ошибок', () => {
    const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
      .create(
        <CapexSetWrapper
          capexSet={fakeCapexSet}
          reservedValueSet={fakeReservedValue}
          addCapexSetGroup={jest.fn()}
          addCapex={jest.fn()}
          updateCapexGlobalValue={jest.fn()}
          updateCapexValue={jest.fn()}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('срабатывают евенты на изменение глобального значения', () => {
    const fakeUpdateCapexGlobalValue = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        reservedValueSet={fakeReservedValue}
        addCapexSetGroup={jest.fn()}
        addCapex={jest.fn()}
        updateCapexGlobalValue={fakeUpdateCapexGlobalValue}
        updateCapexValue={jest.fn()}
      />,
    );

    const globalValueInput: HTMLElement = screen.getByDisplayValue(/38/);
    fireEvent.change(globalValueInput, { target: { value: '50' } });
    expect(globalValueInput).toHaveAttribute('value', '50');
    fireEvent.blur(globalValueInput);
    expect(fakeUpdateCapexGlobalValue).toBeCalledTimes(1);
  });

  test('срабатывают евенты на добавление группы', () => {
    const fakeAddGroup = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        reservedValueSet={fakeReservedValue}
        addCapexSetGroup={fakeAddGroup}
        addCapex={jest.fn()}
        updateCapexGlobalValue={jest.fn()}
        updateCapexValue={jest.fn()}
      />,
    );

    const addToggle: HTMLElement = screen.getByText(/добавить группу затрат/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы затрат',
    );
    const addGroupButton: HTMLElement = screen.getByText('Добавить группу');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupButton);
    expect(fakeAddGroup).toBeCalledTimes(1);
  });
  test('отмена добавления группы', () => {
    const fakeAddGroup = jest.fn();
    render(
      <CapexSetWrapper
        capexSet={fakeCapexSet}
        reservedValueSet={fakeReservedValue}
        addCapexSetGroup={fakeAddGroup}
        addCapex={jest.fn()}
        updateCapexGlobalValue={jest.fn()}
        updateCapexValue={jest.fn()}
      />,
    );

    const addToggle: HTMLElement = screen.getByText(/добавить группу затрат/i);
    fireEvent.click(addToggle);
    const addGroupInput: HTMLElement = screen.getByPlaceholderText(
      'Введите название группы затрат',
    );
    const addGroupCancelButton: HTMLElement = screen.getByText('Отмена');

    expect(addGroupInput).toBeInTheDocument();
    fireEvent.change(addGroupInput, { target: { value: 'new group' } });
    fireEvent.click(addGroupCancelButton);
    expect(fakeAddGroup).toBeCalledTimes(0);
  });
});
