import React, { useState } from 'react';
import { IconArrowDown } from '@gpn-design/uikit/IconArrowDown';
import { Button, IconAdd, Text, useModal } from '@gpn-prototypes/vega-ui';

import Macroparameter from '../../../../types/Macroparameters/Macroparameter';
import MacroparameterSetGroup from '../../../../types/Macroparameters/MacroparameterSetGroup';
import keyGen from '../../../helpers/keyGenerator';
import { AddArticleModal, Article } from '../../Shared/AddArticleModal/AddArticleModal';
import { ArticleWrapper } from '../ArticleWrapper';
import { GroupPlaceholder } from '../GroupPlaceholder/GroupPlaceholder';

import { cnGroupWrapper } from './cn-group-wrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import './GroupWrapper.css';

interface MacroparameterSetWrapperGroupProps {
  group: MacroparameterSetGroup;
  removeGroup: (group: MacroparameterSetGroup) => void;
  requestAddMacroparameter: (macroparameter: Macroparameter, group: MacroparameterSetGroup) => void;
  updateMacroparameterValue: (
    macroparameter: Macroparameter,
    group: MacroparameterSetGroup,
  ) => void;
}

export const GroupWrapper = ({
  group,
  requestAddMacroparameter,
  updateMacroparameterValue,
}: MacroparameterSetWrapperGroupProps) => {
  const [macroparameters] = useState(group.macroparameterList as Macroparameter[]);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const { isOpen, close, open } = useModal();

  const openAddMacroparameterModal = (): void => {
    setIsCollapsed(false);
    open();
  };

  const addMacroparameterToGroup = (macroparameter: Macroparameter): void =>
    requestAddMacroparameter(macroparameter, group);

  const updateMacroparameterValueWithGroup = (macroparameter: Macroparameter): void =>
    updateMacroparameterValue(macroparameter, group);

  return (
    <div className={cnGroupWrapper()}>
      <div className={cnGroupWrapper('header')}>
        <div
          className={cnGroupWrapper('header-name', { collapse: isCollapsed })}
          onClick={() => setIsCollapsed(!isCollapsed)}
          role="presentation"
        >
          <IconArrowDown size="xs" />
          <Text as="span" size="s">
            {group.caption}
          </Text>
        </div>
        <div className={cnGroupWrapper('header-actions')}>
          <Button
            type="button"
            title="Добавить статью"
            onlyIcon
            iconLeft={IconAdd}
            size="s"
            view="clear"
            onClick={openAddMacroparameterModal}
          />
        </div>
      </div>
      <div className={cnGroupWrapper('body', { hidden: isCollapsed })}>
        {macroparameters.length === 0 && (
          <GroupPlaceholder
            text="Пока не добавлена ни одна статья"
            callback={openAddMacroparameterModal}
          />
        )}
        {macroparameters.length > 0 &&
          macroparameters.map((macroparameter, index) => (
            <ArticleWrapper
              key={keyGen(index)}
              article={macroparameter}
              updateArticleValueCallback={updateMacroparameterValueWithGroup}
            />
          ))}
      </div>
      <AddArticleModal
        isOpen={isOpen}
        close={close}
        article={{ caption: '', unit: '' } as Article}
        callback={addMacroparameterToGroup}
      />
    </div>
  );
};
