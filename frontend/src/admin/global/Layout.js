import { Box } from '@mui/material';
import React from 'react'
import HeaderTop from './HeaderTop';
import SidebarAdm from './Sidebar';
import Navbar_blog from '../../components/Navbar_blog';
const Layout = (Component) => ({ ...props }) => {

    return (
        <>
        <Navbar_blog />
            <div style={{ display: 'flex', minHeight: "100vh" }}>
                <SidebarAdm />
                <Box sx={{ width: "100%", bgcolor: "#fafafa" }}>
                    <HeaderTop />
                    <Box sx={{ p: 3 }}>
                        <Component {...props} />
                    </Box>
                </Box>
            </div>
        </>
    )
}

export default Layout