import { gql } from '@apollo/client';
import * as types from './types';
import GClient, { withGraph } from '../graph';

const graph = withGraph()

export const addContact = (contact) => {
  return (dispatch) => {
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
    }).then((r) => r.data.addContact).then((r) => {
      dispatch({ type: types.ADD_CONTACT, newItem: r })
    })
  }
}

export const addContactOrganisation = (contact) => {
  return (dispatch) => {
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
    }).then((r) => r.data.addContactOrganisation).then((r) => {
      dispatch({ type: types.ADD_CONTACT_ORGANIZATION, newItem: r })
    })
  }
}

export const updateContact = (id, contact) => {
  let _contact = {
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    email: contact.email
  }

  //console.log(_contact)
  for (var k in _contact) {
    if (!_contact[k]) delete _contact[k]
  }
  return (dispatch) => {
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
    }).then((r) => r.data.updateContact).then((r) => {
      dispatch({ type: types.UPDATE_CONTACT, contact: _contact, id })
    })
  }
}

export const removeKnowledge = (id) => {
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveEquipment($id: String){
          removeEquipment(equipmentId: $id)
        }
      `,
      variables: {
        id: id
      }
    }).then((r) => r.data.removeEquipment).then((r) => {
      dispatch({ type: types.REMOVE_EQUIPMENT, id: id })
    })
  }
}

export const getContactOrganisations = () => {
  return (dispatch) => {
    return graph.getClient().query({
      query: gql`
        query GetContactOrganisations {
          contactOrganisations {
            id
            name
          }
        }
      `
    }).then((r) => r.data.contactOrganisations).then((r) => {
    //  dispatch({ type: types.SET_CONTACT_ORGANIZATIONS, organisations: r })
    })
  }

}

export const getContacts = () => {
  return (dispatch) => {
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
    }).then((r) => r.data).then((r) => {
      dispatch({ type: types.SET_CONTACTS, contacts: r.contacts });
      dispatch({ type: types.SET_CONTACT_ORGANIZATIONS, organisations: r.contactOrganisations })
    })
  }

}
