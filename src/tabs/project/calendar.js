import React from 'react';
import {YContext} from '../../graph/yjs';
import { connect } from 'react-redux';
import { setStatus } from '../../actions/authActions';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import './calendar.css';

let yDoc;

const localizer = momentLocalizer(moment)
function CalendarTab(props){
    const {ydoc} = React.useContext(YContext);

    const [ bookings, setBookings ] = React.useState([])
    const [ nodes, setNodes ] = React.useState([])
    const [ doc, setDoc ] = React.useState(null)
    const [ docProject, setProject ] = React.useState({})

    const observer = () => {
        if(yDoc){
          let obj = yDoc.toJSON()
          console.log("OBSERVE", obj)
          if(obj.nodes != null){
            setNodes(obj.nodes.map((x) => Object.assign({}, x)))
          }
        
        }
      }
  
      React.useEffect(() => {
        console.log("YDC", props)
        if(props.project && ydoc && props.project.id != docProject.id){
          if(doc) doc.unobserve(observer);
  
          console.log("Setting up YDOC")
          let _doc = ydoc.getMap(`plan-${props.project.id}`)
          yDoc = _doc;
            setDoc(_doc)
          _doc.observe(observer)
  
          setProject(props.project)
          
          let init = _doc.toJSON();
  
          if(init.nodes != null) setNodes(init.nodes)
        }
      }, [props.project, doc])

    return (
        <div className="calendar-tab">
            <Calendar
                localizer={localizer}
                events={nodes.filter((a) => a.data && a.data.dueDate).map((x) => ({
                    id: x.id,
                    title: x.data.label,
                    allDay: false,
                    start: new Date(((x.data.dueDate)*1000) -( 5 * 1000 * 60)),
                    end: new Date((x.data.dueDate)* 1000)
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ flex: 1 }} />
        </div>
    )
}

export default connect(null, (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status))
}))(CalendarTab)