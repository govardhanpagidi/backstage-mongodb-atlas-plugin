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
import { Table, TableColumn } from '@backstage/core-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@backstage/core-components';
const username = '';
const password = '';
const orgId = ""
const apiUrl = 'http://localhost:8080/api/projects?publicKey='+username+'&privateKey='+password+'&orgId='+orgId; // Replace with your API endpoint


type AsyncState<T> = {
  value: T | null;
  loading: boolean;
  error: Error | null;
};

export function useAsync<T>(asyncFunction: () => Promise<T>): AsyncState<T> {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    asyncFunction()
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

async function fetchDataWithDigestAuth(): Promise<Project[]> {
  try {

    var apiConfig = {
      method: 'GET',
      url: apiUrl,
    };

    const response = await axios(apiConfig);
    console.log(JSON.stringify(response.data));
    
    // Assuming the data structure is an array of Project objects
    return response.data as Project[];
    // Assuming the data structure is an array of Project objects
  } catch (error) {
    console.log('Error fetching data:', error.message);
    throw error;
  }

}

export const ProjectTable = () => {

  const columns: TableColumn[] = [
    { 
      title: 'ID', field: 'id',
    },
    { 
      title: 'Name', field: 'name',
    },
    { 
      title: 'Created', field: 'created',
    },
    { 
      title: 'ClusterCount', field: 'clusterCount',
    },
  ];

  const { value, loading, error } = useAsync<Project[]>(fetchDataWithDigestAuth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!value) {
    return <div>No data available.</div>;
  }

  value.forEach((project) => {
      project.name = <Link to={`/clusters/${project.id}/${project.name}`}> <b>{project.name}</b></Link>;
  });
  

  return (
    <Table
      title="Projects"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value}
    />
  );
};


interface Project {
  id: string;
  name: string;
  created:string;
  orgId:string;
  clusterCount:string;
  // Other properties...
}


