import React from 'react';

import { ListItem, Typography } from '@material-ui/core';

import { getContactOrganisations, getContacts, addContact, updateContact } from '../../actions/contactActions';

import { Header, PermissionForm, SearchTable, MoreMenu } from "@workerhive/react-ui"
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import qs from 'qs';


export interface ContactProps {
  location: any;
  history: any;
  match: any;
  user: any;
  contacts: any;
  organisations: any;
  getContacts: Function;
  updateContact: Function;
  addContact: Function;
  permissions: any;
  type: any;
  removeProject: Function;
}

const Contacts : React.FC<ContactProps> = (props) => {

  const query_string = qs.parse(props.location.search, {ignoreQueryPrefix: true})


    const [ selected, setSelected ] = React.useState(null)

    React.useEffect(() => {
      props.getContacts();
    //  props.getContactOrganisations();
    }, [])

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <Header 
                tabs={["Contacts", "Organisations"]}
                onTabSelect={(tab : any) => {

                    query_string.filter = tab;
                    props.history.push(`${window.location.pathname}?${qs.stringify(query_string)}`)

                    //setSelectedTab(tab)
                    //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
                }}
                selectedTab={query_string.filter && query_string.filter.toString().toUpperCase() || 'CONTACTS'}
                title={"Contacts"} />
            <PermissionForm 
                onClose={() => {   
                    setSelected(null)
                }}
                onSave={(obj : any, data : any) => {
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
                <SearchTable data={(!query_string.filter || query_string.filter.toString().toLowerCase() == "contacts") ? props.contacts : props.organisations || []}
                 renderItem={(item : any) => [
                    <div className="project-item">
                      <ListItem button onClick={() => {
                        props.history.push(`${props.match.url}/${item.id}`)
                        }}>
                        <Typography style={{flex: 1}} variant="subtitle1">{item.name}</Typography>
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
                            action: () => props.removeProject(item.id)
                          }
                        ]} />
                    </div>
                  ]}
                />
            </PermissionForm>

        </div>
    )
}

export default connect((state : any) => ({
    user: jwt_decode(state.auth.token),
    contacts: state.contacts.list,
    organisations: state.contacts.organisations,
    type: state.dashboard.types.filter((a: any) => a.name == "Contact"),
    permissions: state.dashboard.permissions.filter((a: any) => a.type == "Projects")
}), (dispatch : any) => ({
    addContact: (data :any) => dispatch(addContact(data)),
    updateContact: (obj: any, data : any) => dispatch(updateContact(obj, data)),
    getContacts: () => dispatch(getContacts()),
    getContactOrganisations: () => dispatch(getContactOrganisations()),
}))(Contacts)