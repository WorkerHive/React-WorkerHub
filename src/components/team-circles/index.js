import React from 'react'

import {
    Avatar
} from '@material-ui/core';

import { connect } from 'react-redux';
import './index.css';

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function TeamCircles(props){
    let getMember = (id) => {
        return props.team.filter((a) => a.id == id)[0]
    }
    console.log(props.members, Array.isArray(props.members))
    return (
        <div className="team-circles">
            {props.members && (Array.isArray(props.members) ? props.members : []).map((mbr) => {
                let member = getMember(mbr)
                if(member)                return <Avatar style={{backgroundColor: '#'+ intToRGB(hashCode(member.name))}}>{member.name.split(' ').map((x) => x.substring(0, 1))}</Avatar>
            })}
        </div>
    )
}

export default connect((state) => ({
    team: state.team.list
}))(TeamCircles)