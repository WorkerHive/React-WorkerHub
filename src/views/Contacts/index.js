import React from 'react';

import { ListItem, Typography } from '@material-ui/core';
import MoreMenu from '../../components/more-menu';
import { addContact, updateContact } from '../../actions/contactActions';
import PermissionForm from '../../components/permission-form';
import SearchTable from '../../components/search-table';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';

function Contacts(props){

    const [ selected, setSelected ] = React.useState(null)

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <PermissionForm 
                onClose={() => {   
                    setSelected(null)
                }}
                onSave={(obj, data) => {
                    if(obj.id){
                        let d = Object.assign({}, data);
                        delete d.id
                        props.updateContact(obj.id, d)
                      }else{
                        props.addContact(data)
                      }
                }}
                selected={selected}
                permissions={props.permissions}
                type={props.type}>
                <SearchTable data={props.data}
                 renderItem={(item) => [
                    <div className="project-item">
                      <ListItem button onClick={() => {
                        props.history.push(`${props.match.url}/${item.id}`)
                        }}>
                        <Typography style={{flex: 1}} variant="subtitle1">{item.name}</Typography>
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
                            action: () => props.removeProject(item.id)
                          }
                        ] : [])} />
                    </div>
                  ]}
                />
            </PermissionForm>

        </div>
    )
}

export default connect((state) => ({
    user: jwt_decode(state.auth.token),
    data: state.contacts.list,
    type: state.dashboard.types.filter((a) => a.name == "Contact"),
    permissions: state.dashboard.permissions.filter((a) => a.type == "Projects")
}), (dispatch) => ({
    addContact: (data) => dispatch(addContact(data)),
    updateContact: (obj, data) => dispatch(updateContact(obj, data))
}))(Contacts)