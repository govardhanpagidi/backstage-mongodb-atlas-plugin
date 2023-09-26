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
  TableColumn,
} from '@backstage/core-components';
import {  
  CatalogFilterLayout, 
  EntityKindPicker, 
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker, EntityTagPicker, EntityTypePicker, UserListFilterKind, UserListPicker } from '@backstage/plugin-catalog-react';
import { CatalogTableRow } from '@backstage/plugin-catalog';
import {ProjectTable} from '../ProjectFetchComponent/ProjectFetchComponent';
import {  CreateButton } from '@backstage/core-components';

const orgId = ""
const subTitle = "Fully managed MongoDB database in the cloud"
export type DefaultProjectProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
};

const title = 'org: '+orgId;
export const ExampleComponent = (props: DefaultProjectProps) => (
  
  <Page themeId="home">
    <Header title="MongoDB Atlas Resources" subtitle={subTitle}>
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
    <ContentHeader title={title} >
          <CreateButton
            title="CREATE PROJECT"
            to={'/atlas'}
          />
            <SupportButton>Atlas mongodb api</SupportButton>
          </ContentHeader>
      <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker initialFilter="api" hidden />
              <EntityTypePicker />
              <UserListPicker  />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
               <ProjectTable />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
    </Content>
  </Page>
);
