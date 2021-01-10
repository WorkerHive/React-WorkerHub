import { gql } from '@apollo/client';
import {withGraph} from '../graph';
import * as types from './types';

const graph = withGraph()

export const addBooking = (time : Date, projectId: string, booking : any) => {
    return (dispatch : any) => {
    graph.getClient().mutate({
        mutation: gql`
    mutation AddBooking($time: CalendarInput, $projectId: ID, $booking: BookingInput){
        addBooking(time: $time, projectId: $projectId, booking: $booking){
            id
            startTime
            endTime
            allDay
            date
            project {
                id 
                name
            }
            items {
                equipment {
                    name
                }
                team {
                    name
                }
            }
        }
    }
  `,
  variables: {
      time: time,
      projectId: projectId,
      booking: booking
  }
}).then((r: any) => r.data.addBooking).then((r : any) => {
    dispatch({type: types.ADD_BOOKING, booking: r})
})
    }
}

  export const getBookings = () => {
      return (dispatch : any) => {
    graph.getClient().query({
        query: gql`
            query GetBookings{
                calendar{
                    id
                    startTime
                    endTime
                    allDay
                    date
                    project {
                        id
                        name
                    }
                    items {
                        equipment{
                            name
                        }
                        team {
                            name

                        }
                    }
                }
            }
        `
    }).then((r : any) => r.data.calendar).then((r : any) => {
        console.log(r)
        dispatch({type: types.SET_BOOKINGS, bookings: r})
    })
}
  }
