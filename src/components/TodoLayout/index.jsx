import React from 'react'
import ToolBar from './ToolBar';
import { Outlet} from "react-router-dom";


function Index(){
    return(
        <>
            <ToolBar />
            <Outlet/>
        </>
    )
}

export default Index;