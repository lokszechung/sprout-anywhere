import { useState } from 'react'
import { isAuthenticated, handleLogout } from '../../helpers/auth'
import { Link, useNavigate } from 'react-router-dom'
import { Flex, Spacer, Button, IconButton } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import customTheme from '../../pages/theme.js'

// import './navbar.scss'
import logo from '../../assets/logo.png'
import NavPlants from './NavPlants.js'
import NavSearch from './NavSearch'

const NavbarDesktop = () => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }
  // const handleMouseOver = () => {
  //   setOpen(true)
  // }
  // const handleMouseOut = () => {
  //   setOpen(false)
  // }
  const clickOutDropdown = (e) => {
    if (!e.target.classList.contains('nav-link-plants')) setOpen(false)
  }
  window.addEventListener('click', clickOutDropdown)
  const handleSearchClick = () => {
    console.log('search clicked')
  }
  const closeDropdown = () => setOpen(false)

  return (
    <Flex
      display={['none', 'none', 'flex', 'flex']}
      h="60px"
      align="center"
      justify="center"
    >
      <Flex
        top="1rem"
        left="1rem"
        ml="1rem"
        mx="15px"
        align="center"
      >
        <Link to="/"><img src={logo} alt="Sprout logo" className="sprout-logo" /></Link>
      </Flex>
      <Spacer />
      <Flex
        top="1rem"
        justify="center"
        align="center"
      >
        <Flex className="navbar-links">
          <Link to="/plants" className="nav-link">plants</Link>
          <Link to="/blogs" className="nav-link">blog</Link>
          <Link to="/aboutus" className="nav-link">about us</Link>
        </Flex>
      </Flex>
      <Spacer />
      <Flex
        top="1rem"
        right="1rem"
      >
        <Flex className="navbar-links"
          align="center"
          justify="center"
        >
          <Flex className="search-clickable" w={30} h={30} mx={15}
            align="center"
            justify="center"
          >
            <NavSearch />
          </Flex>
          {isAuthenticated() ?
            <>
              <span className='nav-link' onClick={() => handleLogout(navigate)}>logout</span>
              <Link to="/profile" className="nav-drop-link">my profile</Link>
            </>
            :
            <>
              <Link to="/register" className="nav-drop-link">register</Link>
              <Link to="/login" className="nav-drop-link">log in</Link>
            </>
          }
        </Flex>
      </Flex>
    </Flex>
  )
}
export default NavbarDesktop

{/* <div className="nav-link-plants-container">
  <div className="nav-link nav-link-plants"
    // onMouseEnter={handleMouseOver} 
    // onMouseOut={handleMouseOut}
    onClick={handleMenuClick}
  // onMouseOver={(e) => e.target.classList.add('plant-link-entered')}
  >plants <ChevronDownIcon />
    <Flex>
      {open && <NavPlants className="nav-plants-dropdown" isOpen={true} open={open} closeDropdown={closeDropdown} />}
    </Flex>
  </div>
</div> */}