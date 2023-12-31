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
import { Project } from '@backstage/plugin-gcp-projects/src/components/NewProjectPage/NewProjectPage';
import axios from 'axios';


//  const apiUrl = 'https://cloud.mongodb.com/api/atlas/v1.0/groups'; 
const apiUrl = 'http://localhost:8080/api/project?Id=64b6d746ec88e93a0087d10a'; // Replace with your API endpoint
const username = '';
const password = '';

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
    debugger

    const token = `${username}:${password}`;
    const encodedToken = Buffer.from(token).toString('base64');

    var config = {
      method: 'GET',
      url: apiUrl,
      headers: { 'Authorization': 'Basic '+ encodedToken}
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    
    // Assuming the data structure is an array of Project objects
    return response.data.Response as Project[];
    // Assuming the data structure is an array of Project objects
  } catch (error) {
    console.log('Error fetching data:', error.message);
    throw error;
  }

}
 
export const ProjectTable = ( ) => {

  const columns: TableColumn[] = [
    { 
      title: 'Name', field: 'name',
    },
    { 
      title: 'ID', field: 'id',
    },
    { 
      title: 'OrgId', field: 'orgId',
    },
    { 
      title: 'Created', field: 'created',
    },
    { 
      title: 'Link', field: 'link',
    },
  ];



  const { value, loading, error } = useAsync<Project[]>(fetchDataWithDigestAuth);
  console.log("ProjectFetchComponent");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!value) {
    return <div>No data available.</div>;
  }


  return (
    <Table
      title="Projects"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value}
    />
  );
};



export const exampleProjects = {
  "results": [
    {
      "name": "atlas-projet1"
    },
    {
      "name": "atlas-projet2"
    },
    {
      "name": "atlas-projet2"
    },
    {
      "name": "atlas-projet4"
    },
   
  ]
}

interface Project {
  id: number;
  name: string;
  // Other properties...
}

export const ProjectFetchComponent = () => {
const { value, loading, error } = useAsync<Project[]>(fetchDataWithDigestAuth);

  console.log("ProjectFetchComponent");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!value) {
    return <div>No data available.</div>;
  }

  // Assuming value contains an array of Project objects
  return (
    <div>
      {value.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>

    
  );
};