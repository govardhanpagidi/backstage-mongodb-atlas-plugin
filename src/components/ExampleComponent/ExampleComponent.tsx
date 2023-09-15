/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Typography, Grid, TableProps } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  PageWithHeader,
  CreateButton,
  TableColumn,
} from '@backstage/core-components';
import { CatalogFilterLayout, EntityKindPicker, EntityLifecyclePicker, EntityListProvider, EntityOwnerPicker, EntityTagPicker, EntityTypePicker, UserListFilterKind, UserListPicker } from '@backstage/plugin-catalog-react';
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
const registerComponentLink = useRouteRef(registerComponentRouteRef);

// import { ProjectTable } from '../ProjectFetchComponent/ProjectFetchComponent';
import {ProjectTable} from '../ProjectFetchComponent/ProjectFetchComponent';
import ClusterTable, { ClusterList } from '../ClusterFetchComponent/ClusterFetchComponent';
//import {ProjectTable} from '../ProjectComponent/ProjectComponent';
// import { useRouteRef } from '@backstage/core-plugin-api';
// import { createProjectRouteRef } from '../../routes';
// const registerComponentLink = useRouteRef(createProjectRouteRef);

export type DefaultProjectProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
};

export const ExampleComponent = (props: DefaultProjectProps) => (
  <Page themeId="tool">
    <Header title="MongoDB Atlas Resources" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
    <ContentHeader title="|" >
          <CreateButton
            title="Create Project"
            to={registerComponentLink?.()}
          />
            <SupportButton>Atlas mongodb api</SupportButton>
          </ContentHeader>
      <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Content>
               <ClusterList />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
    </Content>
  </Page>
);
