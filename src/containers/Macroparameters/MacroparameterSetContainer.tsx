import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Article from '../../../types/Article';
import CapexExpenseSetGroup from '../../../types/CAPEX/CapexExpenseSetGroup';
import MacroparameterSet from '../../../types/Macroparameters/MacroparameterSet';
import MacroparameterSetGroup from '../../../types/Macroparameters/MacroparameterSetGroup';
import { requestAddMacroparameter } from '../../actions/Macroparameters/addMacroparameter';
import { addMacroparameterSetGroup as addGroup } from '../../actions/Macroparameters/addMacroparameterSetGroup';
import { changeMacroparameterSetGroup } from '../../actions/Macroparameters/changeMacroparameterSetGroup';
import { requestDeleteMacroparameter } from '../../actions/Macroparameters/deleteMacroparameter';
import { deleteMacroparameterSetGroup } from '../../actions/Macroparameters/deleteMacroparameterSetGroup';
import {
  macroparameterHighlight,
  macroparameterHighlightClear,
} from '../../actions/Macroparameters/highlightMacroparameter';
import { updateMacroparameterSet as updateSet } from '../../actions/Macroparameters/updateMacroparameterSet';
import { requestUpdateMacroparameterValue } from '../../actions/Macroparameters/updateMacroparameterValue';
import { MacroparameterSetWrapper } from '../../components/Macroparameters/MacroparameterSetWrapper/MacroparameterSetWrapper';

export const MacroparameterSetContainer = () => {
  const dispatch = useDispatch();

  const selectorSelectedMacroparameterSet = (state: any) => state.macroparamsReducer.selected;
  const selectedMacroparameterSet: MacroparameterSet = useSelector(
    selectorSelectedMacroparameterSet,
  );

  const updateMacroparameterSet = useCallback(
    (updatedMacroparameterSet: MacroparameterSet) => {
      dispatch(updateSet(updatedMacroparameterSet));
    },
    [dispatch],
  );

  const addMacroparameterSetGroups = useCallback(
    (newMacroparameterSetGroups: MacroparameterSetGroup) => {
      dispatch(addGroup(newMacroparameterSetGroups));
    },
    [dispatch],
  );

  const addMacroparameter = useCallback(
    (newMacroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestAddMacroparameter(newMacroparameter, group));
    },
    [dispatch],
  );

  const updateMacroparameterValue = useCallback(
    (macroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestUpdateMacroparameterValue(macroparameter, group));
    },
    [dispatch],
  );
  const deleteMacroparameter = useCallback(
    (macroparameter: Article, group: MacroparameterSetGroup) => {
      dispatch(requestDeleteMacroparameter(macroparameter, group));
    },
    [dispatch],
  );

  const requestDeleteMacroparameterGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(deleteMacroparameterSetGroup(group));
    },
    [dispatch],
  );
  const requestChangeMacroparameterGroup = useCallback(
    (group: CapexExpenseSetGroup) => {
      dispatch(changeMacroparameterSetGroup(group));
    },
    [dispatch],
  );

  const articleHighlight = useCallback(
    (article: Article, group: MacroparameterSetGroup) => {
      dispatch(macroparameterHighlight(article, group));
    },
    [dispatch],
  );

  const articleHighlightClear = useCallback(() => {
    dispatch(macroparameterHighlightClear());
  }, [dispatch]);

  return (
    <MacroparameterSetWrapper
      macroparameterSet={selectedMacroparameterSet}
      updateMacroparameterSet={updateMacroparameterSet}
      addMacroparameterSetGroup={addMacroparameterSetGroups}
      addMacroparameter={addMacroparameter}
      updateMacroparameterValue={updateMacroparameterValue}
      deleteMacroparameterValue={deleteMacroparameter}
      requestDeleteMacroparameterGroup={requestDeleteMacroparameterGroup}
      requestChangeMacroparameterGroup={requestChangeMacroparameterGroup}
      highlightArticle={articleHighlight}
      highlightArticleClear={articleHighlightClear}
    />
  );
};
