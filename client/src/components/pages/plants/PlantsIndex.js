import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import PlantsCheckBox from './PlantsCheckBox.js'

// Chakra imports
import { Container, Box, SimpleGrid, Flex } from '@chakra-ui/react'
import { Card, CardBody, Image, Heading, Button } from '@chakra-ui/react'

const PlantsIndex = () => {
  
  const [plants, setPlants] = useState([])
  const [filterPlants, setFilterPlants] = useState([])

  const [filters, setFilters] = useState({
    category: [],
    idealLocation: [],
    sunlightRequired: [], 
    plantHeight: [],
    beginnerFriendly: false,
    safeForPetsOrChildren: false,
  })

  useEffect(() => {
    const getPlants = async () => {
      try {
        const { data } = await axios.get('/api/plants')
        setPlants(data)
        setFilterPlants(data)
      } catch (err) {
        console.log(err)
      }
    }
    getPlants()
  },[])

  const handleFilter = (key, value) => {
    const isFilterBoolean = ['beginnerFriendly', 'safeForPetsOrChildren'].includes(key)
    if (isFilterBoolean) {
      return setFilters({ ...filters, [key]: value })
    }

    const filterArr = filters[key]
    const isExistingValue = filterArr.includes(value)
    let updatedArray = []

    if (isExistingValue) {
      updatedArray = filterArr.filter(element => element !== value)
    }
    if (!isExistingValue) {
      updatedArray = [...filterArr, value]
    }
    return setFilters({ ...filters, [key]: updatedArray })
  }

  const getNonEmptyFilterKeys = () => 
    Object.keys(filters).filter(filter => {
      const isFilterBool = ['beginnerFriendly', 'safeForPetsOrChildren'].includes(filter)
      if (isFilterBool) {
        return filters[filter]
      }
      return filters[filter].length !== 0 
    })
          
  useEffect(() => {
    const filteredPlants = plants.filter((plant) => {
      const nonEmptyFiltersKeys = getNonEmptyFilterKeys()
      let noOfFiltersMatched = 0

      nonEmptyFiltersKeys.forEach(filter => {
        if (filter === 'beginnerFriendly' || filter === 'safeForPetsOrChildren') {
          // return matched = plant.beginner === true ? + 1 : matched
          return noOfFiltersMatched = plant[filter] 
            ? noOfFiltersMatched + 1 
            : noOfFiltersMatched
        }
        
        const filterArr = filters[filter]

        if (filter === 'idealLocation') {
          const dataMatches = plant[filter].filter(location => filterArr.includes(location))
          return noOfFiltersMatched = dataMatches.length > 0 
            ? noOfFiltersMatched + 1 
            : noOfFiltersMatched
        }
        
        const dataMatches = filterArr.includes(plant[filter]) 
  
        if (dataMatches) {
          return noOfFiltersMatched++
        }
        
      })
      // return whether matched = the amount of filters that are selected
      return noOfFiltersMatched === nonEmptyFiltersKeys.length
    })
    setFilterPlants(filteredPlants)
  }, [filters])  

  return (
    <>
      <main className="plants-index">
        <PlantsCheckBox className="plants-filters" filters={filters} handleFilter={handleFilter} />
        {filterPlants.length > 0 ?
          <Container m={2} maxW="997px">
            <SimpleGrid minChildWidth="250px" spacing='30px'>
              {filterPlants.map(({ _id, name, thumbnail }) => 
                <Link key={_id} to={`/plants/${_id}`}>
                  <Card className="plants-index-cards" variant="unstyled">
                    <CardBody>
                      <Image src={thumbnail} alt={name} />
                      <Heading mt="2" size='md'>{name}</Heading>
                    </CardBody>
                  </Card>
                </Link>
              )}
            </SimpleGrid>  
          </Container>
          :
          <div className="no-results">No results</div>
        }
      </main>
    </>
  )  
}

export default PlantsIndex