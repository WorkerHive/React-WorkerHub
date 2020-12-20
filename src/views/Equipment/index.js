import React from 'react';

import {
  Paper,
  List,
  ListItem,
  Typography
} from '@material-ui/core';

import DashboardHeader from '../../components/dashboard-header';
import SearchTable from '../../components/search-table';
import PermissionForm from '../../components/permission-form';
import { connect } from 'react-redux';
import { removeEquipment, getEquipment, updateEquipment, addEquipment } from '../../actions/equipmentActions';
import MoreMenu from '../../components/more-menu';
import jwt_decode from 'jwt-decode';
import './index.css';

function Equipment(props){
  const [ selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    props.getEquipment()
  }, [])

  return [
    <DashboardHeader 
    tabs={[...new Set(props.equipment.filter((a) => a.type).map((x) => x.type))]}
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
        <div className="equipment-item">
        <ListItem button onClick={(e) => {
        }}>
          <Typography variant="subtitle1" style={{flex: 1}}>{item.name}</Typography>
        </ListItem>
          <MoreMenu
            menu={[
            ].concat(props.user.admin ? [
              {
                label: "Edit",
                action: () => setSelected(item)
              },
              {
                label: "Delete",
                color: 'red',
                action: () => props.removeEquipment(item.id)
              }
            ] : [])} />
        </div>

      )} />
      </PermissionForm>
  ]
}
export default connect((state) => ({
  user: jwt_decode(state.auth.token),
  equipment: state.equipment.list,
  type: state.dashboard.types.filter((a) => a.name =="Equipment"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Equipment")
}), (dispatch) => ({
  getEquipment: () => dispatch(getEquipment()),
  addEquipment: (equipment) => dispatch(addEquipment(equipment)),
  updateEquipment: (id, equipment) => dispatch(updateEquipment(id, equipment)),
  removeEquipment: (id) => dispatch(removeEquipment(id))
}))(Equipment)
