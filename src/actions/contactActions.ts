import { gql } from '@apollo/client';
import * as types from './types';
import { withGraph } from '../graph';

const graph = withGraph()

export const addContact = (contact : any) => {
  return (dispatch : any) => {
    graph.getClient().mutate({
      mutation: gql`
  mutation AddContact($contact: ContactInput){
    addContact(contact: $contact){
      id
      name
      phoneNumber
      email
    }
  }
`,
      variables: {
        contact: contact
      }
    }).then((r : any) => r.data.addContact).then((r : any) => {
      dispatch({ type: types.ADD_CONTACT, newItem: r })
    })
  }
}

export const addContactOrganisation = (contact : any) => {
  return (dispatch : any) => {
    graph.getClient().mutate({
      mutation: gql`
      mutation AddContactOrg($contact: ContactOrganisationInput){
        addContactOrganisation(contactOrganisation: $contact){
          id
          name
          location
        }
      }
    `,
      variables: {
        contact: contact
      }
    }).then((r : any) => r.data.addContactOrganisation).then((r : any) => {
      dispatch({ type: types.ADD_CONTACT_ORGANIZATION, newItem: r })
    })
  }
}

export const updateContact = (id : string, contact: any) => {
  let _contact : Record<any, any> = {
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    email: contact.email
  }

  //console.log(_contact)
  for (var k in _contact) {
    if (!_contact[k]) delete _contact[k]
  }
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
      mutation UpdateContact($id: ID, $contact: ContactInput){
        updateContact(id: $id, contact: $contact){
          name
          phoneNumber
          email
        }
      }
    `,
      variables: {
        id: id,
        contact: _contact
      }
    }).then((r : any) => r.data.updateContact).then((r : any) => {
      dispatch({ type: types.UPDATE_CONTACT, contact: _contact, id })
    })
  }
}

export const removeKnowledge = (id : string) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveEquipment($id: String){
          removeEquipment(equipmentId: $id)
        }
      `,
      variables: {
        id: id
      }
    }).then((r: any) => r.data.removeEquipment).then((r : any) => {
      dispatch({ type: types.REMOVE_EQUIPMENT, id: id })
    })
  }
}

export const getContactOrganisations = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetContactOrganisations {
          contactOrganisations {
            id
            name
          }
        }
      `
    }).then((r : any) => r.data.contactOrganisations).then((r : any) => {
    //  dispatch({ type: types.SET_CONTACT_ORGANIZATIONS, organisations: r })
    })
  }

}

export const getContacts = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetContacts {
          contacts {
            id
            name
            phoneNumber
            email
          }

          contactOrganisations { 
            id
            name
          }
        }
      `
    }).then((r : any) => r.data).then((r : any) => {
      dispatch({ type: types.SET_CONTACTS, contacts: r.contacts });
      dispatch({ type: types.SET_CONTACT_ORGANIZATIONS, organisations: r.contactOrganisations })
    })
  }

}
