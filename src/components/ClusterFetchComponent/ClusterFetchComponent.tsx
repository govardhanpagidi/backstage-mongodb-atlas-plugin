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
import {  CreateButton, Link } from '@backstage/core-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableColumn } from '@backstage/core-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { CatalogFilterLayout,  EntityKindPicker,  EntityLifecyclePicker,  EntityListProvider,  EntityOwnerPicker,  EntityTagPicker,  EntityTypePicker,  UserListFilterKind, UserListPicker } from '@backstage/plugin-catalog-react';
import {  CatalogTableRow } from '@backstage/plugin-catalog';


const baseURL = "http://localhost:8080"
const username = '';
const password = '';
const orgId = "";


export type DefaultProjectProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
};


type AsyncState<T> = {
  value: T | null;
  loading: boolean;
  error: Error | null;
};

export function useAsync<T>(asyncFunction: (projectId? : string) => Promise<T>,projectId? :string): AsyncState<T> {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    asyncFunction(projectId)
      .then((data) => {
        setValue(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      }); 
  }, [asyncFunction]);

  return { value, loading, error };
}

async function fetchClusters(projectId? : string): Promise<Cluster[]> {
  try {
    debugger
    // call the api with digest auth    
    const apiURL = "/api/project/"+projectId+"/cluster";
    const queryParams = {
      publicKey: username,
      privateKey: password,
    };
    const url = new URL(apiURL, baseURL);

    // Add query parameters to the URL
    for (const key in queryParams) {
        url.searchParams.append(key, queryParams[key]);
    }

    var apiConfig = {
      method: 'GET',
      url: url.toString(),
    };

    const response = await axios(apiConfig);
    console.log(JSON.stringify(response.data));
    
    // Assuming the data structure is an array of Project objects
    return response.data as Cluster[];
    // Assuming the data structure is an array of Project objects
  } catch (error) {
    console.log('Error fetching data:', error.message);
    throw error;
  }

}

interface Cluster {
  id: string;
  name: string;
  mongoDBMajorVersion:string;
  createdDate:string;
  orgId:string;
  projectId:string;
  diskSizeGB:string;
  backupEnabled:string;
  advancedSettings: AdvancedSettings;
  clusterType:string;
  // Other properties...
}

interface AdvancedSettings {
  javascriptEnabled: boolean,
  minimumEnabledTLSProtocol: string,
  noTableScan: boolean
}


export  const ClustersComponent = () => {

  const {projectId,projectName} = useParams();
  const { value, loading, error } = useAsync<Cluster[]>( fetchClusters,projectId);
  
  const title = "project: "+projectName;
  var child = <div>loading...</div>;


  if (loading) {
    return display(title, <div>Loading...</div>,projectId);
  }

  if (error) {
    return display(title,<div>Error: {error.message}</div>,projectId);
  }

  if (!value) {
    return display(title,<div>No data available.</div>,projectId);
  }
  
    const columns: TableColumn[] = [
      { 
        title: 'ID', field: 'id',
      },
      { 
        // create clickable link to project
  
        title: 'Name', field: 'name',
      },
      { 
        title: 'Cluster Type', field: 'clusterType',
      },
      { 
        title: 'Version', field: 'mongoDBVersion',
      },
      { 
        title: 'State', field: 'stateName',
      },
      { 
        title: 'Disk Size (GB)', field: 'diskSizeGB',
      },
      { 
        title: 'Backup Enabled', field: 'backupEnabled',
      },
      { 
        title: 'Created On', field: 'createdDate',
      },
    ];
  
  
  
    value.forEach((cluster: { name: {} | null | undefined; id: any; }) => {
      cluster.name = <Link to={`/clusters/${cluster.id}`}><b>{cluster.name}</b></Link>;
    });
    
    child = <Table
              title="Clusters"
              options={{ search: false, paging: false }}
              columns={columns}
              data={value}
            />

  
    // Add your table rendering logic here
    return display(title,child,projectId,projectName);
    
  
};

function display(title: string | undefined ,child: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined,projectId : string | undefined,projectName : string | undefined) {
  return <Page themeId="home">
    <Header title="MongoDB Atlas Resources" subtitle="Fully managed MongoDB database in the cloud">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
    <ContentHeader title={title}  >
    <CreateButton
            title="CREATE CLUSTER"
            to={'/create-cluster/'+orgId+'/'+projectId+"/"+projectName}
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
            {child}
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
    </Content>
  </Page>
    
}

