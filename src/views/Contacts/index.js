import React from 'react';

import { ListItem, Typography } from '@material-ui/core';
import MoreMenu from '../../components/more-menu';
import { getContactOrganisations, getContacts, addContact, updateContact } from '../../actions/contactActions';
import PermissionForm from '../../components/permission-form';
import SearchTable from '../../components/search-table';
import DashboardHeader from '../../components/dashboard-header';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import qs from 'qs';


function Contacts(props){

  const query_string = qs.parse(props.location.search, {ignoreQueryPrefix: true})


    const [ selected, setSelected ] = React.useState(null)

    React.useEffect(() => {
      props.getContacts();
    //  props.getContactOrganisations();
    }, [])

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <DashboardHeader 
                tabs={["Contacts", "Organisations"]}
                onTabSelect={(tab) => {

                    query_string.filter = tab;
                    props.history.push(`${window.location.pathname}?${qs.stringify(query_string)}`)

                    //setSelectedTab(tab)
                    //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
                }}
                selectedTab={query_string.filter && query_string.filter.toUpperCase() || 'CONTACTS'}
                title={"Contacts"} />
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
                <SearchTable data={(!query_string.filter || query_string.filter.toLowerCase() == "contacts") ? props.contacts : props.organisations || []}
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
    contacts: state.contacts.list,
    organisations: state.contacts.organisations,
    type: state.dashboard.types.filter((a) => a.name == "Contact"),
    permissions: state.dashboard.permissions.filter((a) => a.type == "Projects")
}), (dispatch) => ({
    addContact: (data) => dispatch(addContact(data)),
    updateContact: (obj, data) => dispatch(updateContact(obj, data)),
    getContacts: () => dispatch(getContacts()),
    getContactOrganisations: () => dispatch(getContactOrganisations()),
}))(Contacts)