import React, { useEffect, useState } from 'react';
import {
    Header,
    Page,
    Content,
    ContentHeader,
    HeaderLabel,
    SupportButton,
  } from '@backstage/core-components';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ClustersComponent } from '../ClusterFetchComponent';

const username = '';
const password = '';
const baseURL = "http://localhost:8080"

export interface Cluster {
    id: string;
    name: string;
    mongoDBMajorVersion:string;
    createdDate:string;
    orgId:string;
    projectId:string;
    diskSizeGB:string;
    backupEnabled:string;
    clusterType:string;

    // Other properties...
}

export const CreateClusterComponent = () => {
  const {projectId,projectName} = useParams();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    instancetype: '',
    mongoDBMajorVersion: '4.4',
    tstshirtSize : 'm',
    cloudProvider : 'AWS',
    projectId : projectId,
    version : '6'
    // Add more fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(formData);
    const result = createCluster(formData)

    navigate("/clusters/"+formData.projectId+"/"+projectName);
  }

  return (

    <Page themeId="home">
    <Header title="MongoDB Atlas Resources" subtitle="Fully managed MongoDB database in the cloud">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
    <ContentHeader title="Create Cluster" >
            <SupportButton>Atlas mongodb api</SupportButton>
    </ContentHeader>
    <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField  
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <br />  <br />

          <FormControl margin='normal' fullWidth>
          <InputLabel>InstanceType</InputLabel>
            <Select
              label="Instance Type"
              name="instancetype"
              value={formData.instancetype}
              onChange={handleChange}
            >
              <MenuItem value="s">M0</MenuItem>
              <MenuItem value="m">M10</MenuItem>
              <MenuItem value="l">M20</MenuItem>
              <MenuItem value="xl">M30</MenuItem>
            </Select>
          </FormControl>
          <br /> <br/>

          <FormControl margin='normal' fullWidth>
          <InputLabel >MongoDB Version</InputLabel>
            <Select
              label="MongoDB Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
            >
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="4.4">4.4</MenuItem>
            </Select>
          </FormControl>
            <br />  <br /> 

          <FormControl margin='normal' fullWidth>
          <InputLabel >Cloud Provider</InputLabel>
            <Select
              label="MongoDB Version"
              name="cloudProvider"
              value={formData.cloudProvider}
              onChange={handleChange}
            >
              <MenuItem value="AWS">AWS</MenuItem>
              <MenuItem value="AZURE">Azure</MenuItem>
              <MenuItem value="GCP">GCP</MenuItem>
            </Select>
          </FormControl>
            <br />  <br /> 

            <Button type="submit" variant="contained" >
                Create
            </Button>
          </form>
         
    </Content>
  </Page>
    
  );
};



type AsyncState<T> = {
    value: T | null;
    loading: boolean;
    error: Error | null;
};
  
  export function useAsync<T>(asyncFunction: (cluster? : FormData) => Promise<T>,cluster? :FormData): AsyncState<T> {
    const [value, setValue] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      asyncFunction(cluster)
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
  
async function createCluster(cluster : FormData): Promise<Cluster> {
    try{

      // call the api with digest auth    
      const apiURL = "/api/project/"+cluster?.projectId+"/cluster";
      const url = new URL(apiURL, baseURL);

      const payload = {
        publicKey: username,
        privateKey: password,
        clusterName:cluster.name,
        mongoDBMajorVersion:cluster.mongoDBMajorVersion,
        cloudProvider:cluster.cloudProvider,
        projectId: cluster.projectId,
        tshirtSize:  "m"
      };
  
      var apiConfig = {
        method: 'POST',
        url: url.toString(),
        data: payload,
      };
  
      const response = await axios(apiConfig);
      console.log(JSON.stringify(response.data));

      return response.data as Cluster;
    }
    catch(error){
      console.log(error);
      alert(error)
      return error;
    }
  }


  function display(child: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) {
    return <Page themeId="home">
      <Header title="MongoDB Atlas Resources" subtitle="Fully managed MongoDB database in the cloud">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
           <ContentHeader title="" >
              <SupportButton>Atlas mongodb api</SupportButton>
            </ContentHeader>
        
              {child}
             
      </Content>
    </Page>

  };
      