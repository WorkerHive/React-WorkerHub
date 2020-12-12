import React from 'react';

import {
  Paper,
  List,
  ListItem
} from '@material-ui/core';

import DashboardHeader from '../../components/dashboard-header';
import SearchTable from '../../components/search-table';
import PermissionForm from '../../components/permission-form';
import { connect } from 'react-redux';
import { useMutation } from '@apollo/client'
import { getEquipment, UPDATE_EQUIPMENT, ADD_EQUIPMENT } from '../../actions/equipmentActions';

function Equipment(props){
  const [ equipment, setEquipment ] = React.useState([])
  const [ selected, setSelected] = React.useState(null)

  const [ addEquipment ] = useMutation(ADD_EQUIPMENT)
  const [ updateEquipment ] = useMutation(UPDATE_EQUIPMENT)

  React.useEffect(() => {
    getEquipment().then((result) => setEquipment(result.data.equipment))
  }, [])

  return [
    <DashboardHeader 
    tabs={[]}
    onTabSelect={(tab) => {
        //setSelectedTab(tab)
        //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={''}
    title={'Equipment'} />,
    <PermissionForm 
      onSave={(data) => {
        if(data.id){
          let d = data;
          delete d.id;
          updateEquipment({
            variables: {
              equipmentId: data.id,
              equipment: d
            }
          })
        }else{
          addEquipment({
            variables: {
              equipment: data
            }
          })
        }
      }}
      onClose={() => setSelected(null)}
      selected={selected} 
      type={props.type} 
      permissions={props.permissions}>
    <SearchTable
      data={equipment}
      renderItem={(item) => (
        <ListItem button onClick={(e) => {
          setSelected(item)
        }}>
          {item.name}
        </ListItem>
      )} />
      </PermissionForm>
  ]
}
export default connect((state) => ({
  type: state.dashboard.types.filter((a) => a.name =="Equipment"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Equipment")
}))(Equipment)
