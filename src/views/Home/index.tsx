import React from 'react';

import { ShortcutLinks } from '@workerhive/react-ui'

import './index.css';
import { AccountTree, Description, Settings } from '@material-ui/icons';

export interface HomeProps{

}

export default function Home(props: React.FC<HomeProps>){
    return (
        <div className="home-view">
            <ShortcutLinks 
                maxItems={4}
                links={[
                    {label: "Projects", icon:<AccountTree />},
                    {label:"Documents", icon: <Description />},
                    {label: "Settings", icon: <Settings />},
                    ]}/>
        </div>
    )
}