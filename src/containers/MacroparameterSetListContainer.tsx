import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MacroparameterSet from '../../types/MacroparameterSet';
import {
  fetchMacroparameterSetList,
  selectMacroparameterSet,
} from '../actions/macroparameterSetList';
import { MacroparameterSetList } from '../components/MacroparameterSetList/MacroparameterSetList';

export const MacroparameterSetListContainer = () => {
  const dispatch = useDispatch();

  /* TODO: describe state interface */
  const selectorMacroparameterSet = (state: any) => state.macroparamsReducer.macroparameterSetList;
  const macroparameterSetList: MacroparameterSet[] = useSelector(selectorMacroparameterSet);

  useEffect(() => {
    dispatch(fetchMacroparameterSetList());
  }, [dispatch]);

  const chooseMacroparameterSet = useCallback(
    (set: any) => {
      dispatch(selectMacroparameterSet(set));
    },
    [dispatch],
  );

  return (
    <MacroparameterSetList
      macroparameterSetList={macroparameterSetList}
      chooseMacroparameterSet={chooseMacroparameterSet}
    />
  );
};
