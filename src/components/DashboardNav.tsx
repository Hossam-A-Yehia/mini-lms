'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { deepPurple } from '@mui/material/colors'

const drawerWidth = 260

interface Props {
  window?: () => Window
  children?: React.ReactNode
}

export default function ResponsiveDashboardDrawer(props: Props) {
  const { window, children } = props
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const navItems = [
    {
      text: 'Courses',
      href: '/dashboard',
      icon: <DashboardIcon />,
      visible: true
    },
    {
      text: 'Create Course',
      href: '/dashboard/courses/new',
      icon: <AddCircleOutlineIcon />,
      visible: user?.role === 'admin'
    }
  ]

  const drawer = (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <Toolbar className="flex items-center gap-2">
        <Avatar sx={{ bgcolor: deepPurple[500] }}>L</Avatar>
        <Typography variant="h6" noWrap className="font-bold">
          Mini LMS
        </Typography>
      </Toolbar>
      
      {user && (
        <div className="px-4 py-3 mb-2 bg-gray-800 rounded-md mx-2">
          <Typography variant="subtitle2" className="font-medium">
            {user.email}
          </Typography>
          <Typography variant="caption" className="text-gray-400 capitalize">
            {user.role}
          </Typography>
        </div>
      )}
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />
      
      <List className="flex-1">
        {navItems.map((item) => (
          item.visible && (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  borderRadius: 1,
                  mx: 1
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      
      <div className="p-2">
        <Button
          onClick={logout}
          variant="text"
          fullWidth
          startIcon={<ExitToAppIcon />}
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            textTransform: 'none',
            px: 2,
            py: 1.5,
            borderRadius: 1,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#101828',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard navigation"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: '#111827'
            }
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: '#111827',
              borderRight: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}