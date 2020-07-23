import React from 'react';

import { CapexSetContainer } from '../../../containers/CapexSetContainer';

import { cnCapexTab } from './cn-capex-tab';

import './CapexTab.css';

export const CapexTab = (): React.ReactElement => (
  <div className={cnCapexTab()}>
    <CapexSetContainer />
  </div>
);
