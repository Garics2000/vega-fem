import React, { useEffect, useState } from 'react';
import { Button, Form, IconAdd, IconSelect, Text, TextField } from '@gpn-prototypes/vega-ui';

import Article from '../../../../types/Article';
import CapexExpenseSetGroup from '../../../../types/CAPEX/CapexExpenseSetGroup';
import CapexSet from '../../../../types/CAPEX/CapexSet';
import CapexSetGlobalValue from '../../../../types/CAPEX/CapexSetGlobalValue';
import keyGen from '../../../helpers/keyGenerator';
import { cnBlockWrapper } from '../../../styles/BlockWrapper/cn-block-wrapper';
import { cnVegaFormCustom } from '../../../styles/VegaFormCustom/cn-vega-form-custom';
import { Table } from '../../FEMTable/Table';

import { CapexGlobalValuesWrapper } from './CapexGlobalValuesWrapper';
import { GroupWrapper } from './GroupWrapper';

import '../../../styles/BlockWrapper/BlockWrapper.css';
import '../../../styles/VegaFormCustom/VegaFormCustom.css';

interface CapexSetWrapperProps {
  capexSet: CapexSet;
  addCapexSetGroup: (capexSetGroup: CapexExpenseSetGroup) => void;
  addCapex: (capex: Article, group: CapexExpenseSetGroup) => void;
  updateCapexGlobalValue: (reserveValue: CapexSetGlobalValue) => void;
  updateCapexValue: (capex: Article, group: CapexExpenseSetGroup) => void;
}

export const CapexSetWrapper = ({
  capexSet,
  updateCapexGlobalValue,
  addCapexSetGroup,
  addCapex,
  updateCapexValue,
}: CapexSetWrapperProps) => {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groups, setGroups] = useState(
    (capexSet?.capexExpenseGroupList ?? []) as CapexExpenseSetGroup[],
  );
  const [globalValues, setGlobalValues] = useState(
    (capexSet?.capexGlobalValueList ?? []) as CapexSetGlobalValue[],
  );

  useEffect(() => {
    setGroups(capexSet?.capexExpenseGroupList ?? []);
    setGlobalValues(capexSet?.capexGlobalValueList ?? []);
  }, [capexSet]);

  const toggleCapexSetGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsAddingGroup(!isAddingGroup);
    setNewGroupName('');
  };

  const requestGroupAdd = (groupName: string) => {
    addCapexSetGroup({
      caption: groupName,
    } as CapexExpenseSetGroup);
  };

  const addGroup = (event: any, groupName: string): void => {
    toggleCapexSetGroup(event);
    requestGroupAdd(groupName);
  };

  return (
    <div className={cnBlockWrapper()}>
      <div className={cnBlockWrapper('title-wrapper')}>
        <div className={cnBlockWrapper('title')}>
          <Text as="span" size="xs" className={cnBlockWrapper('title-text')}>
            CAPEX
          </Text>
          <IconSelect size="xs" className={cnBlockWrapper('title-icon')} />
        </div>
      </div>
      <div className={cnBlockWrapper('content')}>
        {capexSet && !(Object.keys(capexSet).length === 0) ? (
          <>
            <Form
              className={`${cnVegaFormCustom()} ${cnBlockWrapper('content-column')}`}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
              }}
            >
              <Form.Row gap="m" space="none" className={cnVegaFormCustom('content-body')}>
                {(globalValues ?? []).length > 0 &&
                  globalValues.map((globalValue: CapexSetGlobalValue, index: number) =>
                    index < 2 ? (
                      <CapexGlobalValuesWrapper
                        key={keyGen(index)}
                        globalValue={globalValue}
                        updateCapexGlobalValue={updateCapexGlobalValue}
                      />
                    ) : (
                      <></>
                    ),
                  )}
                <Form.Row
                  col="1"
                  gap="none"
                  space="none"
                  className={cnVegaFormCustom('groups-row')}
                >
                  {(groups ?? []).length > 0 &&
                    groups.map((group, index) => (
                      <GroupWrapper
                        key={keyGen(index)}
                        group={group}
                        requestAddCapex={addCapex}
                        updateCapexValue={updateCapexValue}
                      />
                    ))}
                </Form.Row>
              </Form.Row>
              <Form.Row col="1" gap="none" space="none" className={cnVegaFormCustom('footer')}>
                {!isAddingGroup && (
                  <Button
                    type="button"
                    size="s"
                    label="Добавить группу затрат"
                    iconLeft={IconAdd}
                    view="ghost"
                    onClick={(e) => toggleCapexSetGroup(e)}
                  />
                )}
                {isAddingGroup && (
                  <div>
                    <Text as="span" view="secondary" size="s">
                      Название группы затрат
                    </Text>
                    <Form.Row col="1" gap="none" className={cnVegaFormCustom('footer-text-field')}>
                      <Form.Field>
                        <TextField
                          size="s"
                          width="full"
                          id="capexSetGroupName"
                          type="text"
                          maxLength={150}
                          value={newGroupName}
                          onChange={(event: any) => setNewGroupName(event.e.target.value)}
                        />
                      </Form.Field>
                    </Form.Row>
                    <Form.Row className={cnVegaFormCustom('footer-action')}>
                      <Button
                        size="s"
                        label="Добавить группу"
                        view="ghost"
                        disabled={!newGroupName.length}
                        onClick={(e) => addGroup(e, newGroupName)}
                      />
                      <Button label="Отмена" size="s" view="clear" onClick={toggleCapexSetGroup} />
                    </Form.Row>
                  </div>
                )}
              </Form.Row>
            </Form>
            <Table
              entity={capexSet}
              secondaryColumn="valueTotal"
              headers={['', 'Статья', 'Суммарное']}
            />
          </>
        ) : (
          <div />
          // <CapexSetPlaceholder text="Выберите один из макроэкономических сценариев" />
        )}
      </div>
    </div>
  );
};
