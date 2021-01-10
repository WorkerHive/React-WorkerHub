import React from 'react';

import {
  Paper,
  List,
  ListItem,
  Typography
} from '@material-ui/core';

import { Header, MoreMenu, SearchTable, PermissionForm } from '@workerhive/react-ui'

import { connect } from 'react-redux';
import { removeEquipment, getEquipment, updateEquipment, addEquipment } from '../../actions/equipmentActions';
import jwt_decode from 'jwt-decode';
import './index.css';

export interface EquipmentProps {
  getEquipment: Function;
  updateEquipment: Function;
  addEquipment: Function;
  removeEquipment: Function;
  equipment: Array<any>;
  permissions: any;
  type: any;
  user: any;
}

function Equipment(props :EquipmentProps){
  const [ selectedTab, setSelectedTab ] = React.useState('');

  const [ selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    props.getEquipment()
  }, [])

  return (
    <>
    <Header 
    tabs={[...new Set(props.equipment.filter((a) => a.type).map((x) => x.type))]}
    onTabSelect={(tab) => {
        setSelectedTab(tab)
        //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={selectedTab}
    title={'Equipment'} />
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
      filter={(item, search) => item.name.indexOf(search) > -1}
      data={props.equipment.filter((a) => {
        if(!selectedTab) return true;
        return a.type == selectedTab
      })}
      renderItem={(item) => (
        <div className="equipment-item">
        <ListItem button onClick={(e) => {
        }}>
          <Typography variant="subtitle1" style={{flex: 1}}>{item.name}</Typography>
        </ListItem>
          <MoreMenu
            menu={props.user.admin && [
              {
                label: "Edit",
                action: () => setSelected(item)
              },
              {
                label: "Delete",
                color: 'red',
                action: () => props.removeEquipment(item.id)
              }
            ]} />
        </div>

      )} />
      </PermissionForm>
      </>
  )
}
export default connect((state : any) => ({
  user: jwt_decode(state.auth.token),
  equipment: state.equipment.list,
  type: state.dashboard.types.filter((a) => a.name =="Equipment"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Equipment")
}), (dispatch : any) => ({
  getEquipment: () => dispatch(getEquipment()),
  addEquipment: (equipment : any) => dispatch(addEquipment(equipment)),
  updateEquipment: (id : any, equipment : any) => dispatch(updateEquipment(id, equipment)),
  removeEquipment: (id : any) => dispatch(removeEquipment(id))
}))(Equipment)
