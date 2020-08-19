import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { CapexWrapper } from '../../../../src/components/CAPEX/CapexSetWrapper/CapexWrapper';
import CapexExpense from '../../../../types/CAPEX/CapexExpense';

let fakeCapex: CapexExpense;
beforeEach(() => {
  fakeCapex = {
    id: 1,
    name: 'fake_capex',
    caption: 'fake capex',
    valueTotal: 100,
    value: [],
    unit: 'руб.',
  };
});

describe('<CapexWrapper/>', () => {
  test('renders CapexWrapper with fake Capex', () => {
    render(<CapexWrapper capex={fakeCapex} updateCapexValue={jest.fn()} />);

    expect(screen.getByText(/fake capex/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/100/)).toBeInTheDocument();
    expect(screen.getByText(/руб./)).toBeInTheDocument();
  });

  test('change value event', () => {
    const fakeUpdate = jest.fn();

    render(<CapexWrapper capex={fakeCapex} updateCapexValue={fakeUpdate} />);

    const valueInput: HTMLElement =
      screen.getByPlaceholderText(/Значение/i) || screen.getByDisplayValue(/100/);

    fireEvent.change(valueInput, { target: { value: 150 } });
    expect(valueInput).toHaveAttribute('value', '150');
    fireEvent.blur(valueInput);
    expect(fakeUpdate).toBeCalledTimes(1);
  });
});
