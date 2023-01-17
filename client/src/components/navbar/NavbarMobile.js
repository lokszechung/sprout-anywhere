import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { Flex, Spacer, Button, IconButton, Text } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { Fade as Hamburger } from 'hamburger-react'
import { VscAccount } from 'react-icons/vsc'
import { MdOutlineAccountCircle } from 'react-icons/md'

import NavSearch from './NavSearch'
import NavLinks from './NavLinks.js'
import NavPlants from './NavPlants.js'
// import './navbar.scss'
import logo from '../../assets/logo.png'

const NavbarMobile = () => {

  const [open, setOpen] = useState(false)
 
  const handleMenuClick = () => {
    setOpen(!open)
  }
  const handleSearchClick = () => {
    console.log('search clicked')
  }
  const closeDropdown = () => setOpen(false)
  const clickOutDropdown = (e) => {
    if (!e.target.classList.contains('hamburger-react')) {
      setOpen(false)
    }  
  }
  window.addEventListener('click', clickOutDropdown)

  return (
    <Flex
      display={['flex', 'flex', 'none', 'none']}
      h="60px"
      align="center"
      justify="space-between"
    >
      <Flex className="burger-icon-container"
        top="1rem"
        justify="center"
        align="center"
      >    
        <Flex className="navbar-icon"
          ml="1rem"
          mr="0.5rem"
        >
          <Hamburger className="burger-icon" toggled={open} toggle={handleMenuClick}/>
        </Flex>
        <Flex w={18}></Flex>
        <Flex>
          {open && <NavLinks className="nav-menu-drop"/>}
        </Flex>
      </Flex>

      <Flex
        top="1rem"
        left="1rem"
        align="center"
        justify="center"
      >
        <Link to="/"><img src={logo} alt="Sprout logo" className="sprout-logo"/></Link>
      </Flex>

      <Flex
        top="1rem"
        right="1rem"
        align="center"
      >  
        <Flex className="navbar-icon"
          mr="1rem"
          ml="0.5rem"
          align="center"
          justify="center"
        >
          <NavSearch />
          
          <Link to="/profile" className="account-icon-link">
            <VscAccount className="account-icon" w={30} h={30} />
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default NavbarMobile

