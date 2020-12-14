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
import { getEquipment, updateEquipment, addEquipment } from '../../actions/equipmentActions';

function Equipment(props){
  const [ selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    props.getEquipment()
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
          let d = Object.assign({}, data);
          console.log(data)
          delete d.id;
          props.updateEquipment(data.id, d)
        }else{
          props.addEquipment(data)
        }
      }}
      onClose={() => setSelected(null)}
      selected={selected} 
      type={props.type} 
      permissions={props.permissions}>
    <SearchTable
      data={props.equipment}
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
  equipment: state.equipment.list,
  type: state.dashboard.types.filter((a) => a.name =="Equipment"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Equipment")
}), (dispatch) => ({
  getEquipment: () => dispatch(getEquipment()),
  addEquipment: (equipment) => dispatch(addEquipment(equipment)),
  updateEquipment: (id, equipment) => dispatch(updateEquipment(id, equipment))
}))(Equipment)
