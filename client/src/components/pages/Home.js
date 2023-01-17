import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Image, Button, Select, Input, Flex, SimpleGrid, Card, CardBody, Heading, Text } from '@chakra-ui/react'


const Home = () => {

  const plantRef = useRef(null)
  const blogRef = useRef(null)

  const [action, setAction] = useState(null)

  // const [chosenLocation, setChosenLocation ] = useState('')

  const [dropValue, setDropValue] = useState({
    idealLocation: '',
    sunlightRequired: '',
    plantHeight: '',
    beginnerFriendly: '',
    safeForPetsOrChildren: '',
    category: '',
    tags: '',
  })

  // *** buy a plant states and variables
  const [plants, setPlants] = useState([])
  const [plantsCompared, setPlantsCompared] = useState([])
  const [topThreePlants, setTopThreePlants] = useState([])
  const [filtersPlants, setFiltersPlants] = useState({})
  const locations = ['office', 'living room', 'bedroom', 'bathroom', 'balcony', 'kitchen']
  const sunlights = [
    {
      amount: 'small',
      desc: 'less than 1 hour daily',
    },
    {
      amount: 'medium',
      desc: '1 to 2 hours daily',
    },
    {
      amount: 'large',
      desc: 'more than 2 hours daily',
    }
  ]
  const heights = [
    {
      amount: 'small',
      desc: 'small - less than 50cm',
    },
    {
      amount: 'medium',
      desc: 'medium - 50cm to 100cm',
    },
    {
      amount: 'large',
      desc: 'large - more than 100cm',
    }
  ]

  // *** read a blog states and variables

  const [blogs, setBlogs] = useState([])
  const [blogsCompared, setBlogsCompared] = useState([])
  const [topThreeBlogs, setTopThreeBlogs] = useState([])
  const [filtersBlogs, setFiltersBlogs] = useState({})
  const categories = [
    {
      cat: 'succulent',
      desc: 'succulent',
    },
    {
      cat: 'plant-care',
      desc: 'plant care',
    },
    {
      cat: 'house-plants',
      desc: 'house plants',
    }
  ]
  const tags = ['maintenance', 'science', 'inspiration']




  const handleActionChange = (e) => {
    setFiltersPlants({})
    setFiltersBlogs({})
    setTopThreePlants([])
    setTopThreeBlogs([])
    setAction(e.target.value)
  }

  // *** buy a plant ***

  useEffect(() => {
    const getPlants = async () => {
      try {
        const { data } = await axios.get('/api/plants')
        setPlants(data)
      } catch (err) {
        console.log(err)
      }
    }
    getPlants()
  }, [])

  const handleChangePlant = (e) => {
    const key = e.target.id
    const value = e.target.value
    const updatedDropValue = {
      ...dropValue, [key]: value,
    }
    setDropValue(updatedDropValue)
    if (key === 'beginnerFriendly' || key === 'safeForPetsOrChildren') {
      return setFiltersPlants({ ...filtersPlants, [key]: value === 'true' }) // returns boolean
    }
    return setFiltersPlants({ ...filtersPlants, [key]: value })
  }

  useEffect(() => {
    setDropValue({
      idealLocation: '',
      sunlightRequired: '',
      plantHeight: '',
      beginnerFriendly: '',
      safeForPetsOrChildren: '',
      category: '',
      tags: '',
    })
  }, [action])

  const handleSubmitPlant = (e) => {
    e.preventDefault()
    const plantsToSet = []
    plants.forEach(plant => {
      let matchingFilters = 0
      for (const filter in filtersPlants) {
        if (filter === 'idealLocation') {
          plant[filter].includes(filtersPlants[filter]) && matchingFilters++
        }
        (plant[filter] === filtersPlants[filter] && matchingFilters++)
      }
      const plantWithMatch = { ...plant, matches: matchingFilters }
      plantsToSet.push(plantWithMatch)
    })
    setPlantsCompared(plantsToSet)
    // plantRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const sortedPlants = plantsCompared.sort((a, b) => (b.matches < a.matches) ? -1 : ((a.matches > b.matches) ? 1 : 0))
    const topSortedThree = []
    for (let i = 0; i < 3; i++) {
      topSortedThree.push(sortedPlants[i])
    }
    setTopThreePlants(topSortedThree)
  }, [plantsCompared])


  // *** read about plants ***

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const { data } = await axios.get('/api/blogs')
        setBlogs(data)
      } catch (err) {
        console.log(err)
      }
    }
    getBlogs()
  }, [])

  const handleChangeBlog = (e) => {
    const key = e.target.id
    const value = e.target.value
    const updatedDropValue = {
      ...dropValue, [key]: value,
    }
    setDropValue(updatedDropValue)
    return setFiltersBlogs({ ...filtersBlogs, [key]: value })
  }

  const handleSubmitBlog = (e) => {
    e.preventDefault()
    const blogsToSet = []
    blogs.forEach(blog => {
      let matchingFilters = 0
      for (const filter in filtersBlogs) {
        blog[filter] === filtersBlogs[filter] && matchingFilters++
      }
      const blogWithMatch = { ...blog, matches: matchingFilters }
      blogsToSet.push(blogWithMatch)
    })
    setBlogsCompared(blogsToSet)
    // blogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const sortedBlogs = blogsCompared.sort((a, b) => (b.matches < a.matches) ? -1 : ((a.matches > b.matches) ? 1 : 0))
    const topSortedThree = []
    for (let i = 0; i < 3; i++) {
      topSortedThree.push(sortedBlogs[i])
    }
    setTopThreeBlogs(topSortedThree)
  }, [blogsCompared])


  const scrollToBottom = () => {
    blogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [topThreeBlogs])

  useEffect(() => {
    scrollToBottom()
  }, [topThreePlants])


  return (
    <main className="home-main">
      <Flex className="home-container">
        <Flex className="home-forms-container">
          <Flex className="home-title-container">
            <h2 className="home-title">Tell us what you&apos;re looking for:</h2>
            <Flex className="home-action-container"
              align="center">
              <span className="home-want">I want to</span>
              <span>
                <select className="home-buy-learn-select home-select" onChange={handleActionChange}>
                  <option value="" disabled selected></option>
                  <option value="learn">learn about plants</option>
                  <option value="buy">buy plants</option>
                </select>
              </span>
            </Flex>
          </Flex>
          {action === null ?
            null
            :
            action === 'buy' ?
              <Flex className="home-select-container">
                <form onSubmit={handleSubmitPlant}>
                  <Flex className="home-location-container">
                    <span>My new friend will be staying in the</span>
                    <span>
                      <select className="home-location-select home-select" value={dropValue.idealLocation} id="idealLocation" onChange={handleChangePlant}>
                        <option value="" disabled selected></option>
                        {locations.map(location => {
                          return <option key={location} value={location}>{location}</option>
                        })}
                      </select>
                    </span>
                  </Flex>
                  <Flex className="home-sunlight-container">
                    <span>This location provides sunlight for</span>
                    <span>
                      <select className="home-sunlight-select home-select" value={dropValue.sunlightRequired} id="sunlightRequired" onChange={handleChangePlant}>
                        <option value="" disabled selected></option>
                        {sunlights.map(sunlight => {
                          return <option key={sunlight.amount} value={sunlight.amount}>{sunlight.desc}</option>
                        })}
                      </select>
                    </span>
                  </Flex>
                  <Flex className="home-height-container">
                    <span>I love plants that are</span>
                    <span>
                      <select className="home-height-select home-select" value={dropValue.plantHeight} id="plantHeight" onChange={handleChangePlant}>
                        <option value="" disabled selected></option>
                        {heights.map(height => {
                          return <option key={height.amount} value={height.amount}>{height.desc}</option>
                        })}
                      </select>
                    </span>
                  </Flex>
                  <Flex className="home-beginner-container">
                    <span>and I am</span>
                    <span>
                      <select className="home-beginner-select home-select" value={dropValue.beginnerFriendly} id="beginnerFriendly" onChange={handleChangePlant}>
                        <option value="" disabled selected></option>
                        <option value={false}>a natural talent</option>
                        <option value={true}>not the best</option>
                      </select>
                    </span>
                    <span>in care.</span>
                  </Flex>
                  <Flex className="home-toxic-container">
                    <span>Pets?</span>
                    <span>
                      <select className="home-toxic-select home-select" value={dropValue.safeForPetsOrChildren} id="safeForPetsOrChildren" onChange={handleChangePlant}>
                        <option value="" disabled selected></option>
                        <option value={false}>My plants are my pets</option>
                        <option value={true}>My plants need to be pet-friendly</option>
                      </select>
                    </span>
                  </Flex>
                  <Button onSubmit={handleSubmitPlant} type="submit" className="btn-green"
                    disabled={Object.keys(filtersPlants).length !== 5}>Show me something!
                  </Button>
                </form>
              </Flex>
              :
              <Flex className="home-select-container">
                <form className="home-select-form" onSubmit={handleSubmitBlog}>
                  <Flex className="home-category-container">
                    <span>I want to learn more about</span>
                    <span>
                      <select className="home-category-select home-select" value={dropValue.category} id="category" onChange={handleChangeBlog}>
                        <option value="" disabled selected></option>
                        {categories.map(category => {
                          return <option key={category.cat} value={category.cat}>{category.desc}</option>
                        })}
                      </select>
                    </span>
                  </Flex>
                  <Flex className="home-tag-container">
                    <span>I am looking for info on</span>
                    <span>
                      <select className="home-tags-select home-select" value={dropValue.tags} id="tags" onChange={handleChangeBlog}>
                        <option value="" disabled selected></option>
                        {tags.map(tag => {
                          return <option key={tag} value={tag}>{tag}</option>
                        })}
                      </select>
                    </span>
                  </Flex>
                  <Button onSubmit={handleSubmitBlog} type="submit" className="btn-green"
                    disabled={Object.keys(filtersBlogs).length !== 2}>Show me something!
                  </Button>
                </form>
              </Flex>
          }
        </Flex>
        <Flex className="home-results">
          {topThreePlants[0] !== undefined ?
            <Container m={2} maxW="997px">
              <div className="home-results-message">Here are the 3 best matches we found for you:</div>
              <SimpleGrid minChildWidth="250px" spacing='30px'>
                {topThreePlants.map(({ _id, name, thumbnail, matches }) =>
                  <Link key={_id} to={`/plants/${_id}`}>
                    <Card className="plants-index-cards" variant="unstyled">
                      <CardBody>
                        <Text>{matches / 5 * 100}% match</Text>
                        <Image src={thumbnail} alt={name} />
                        <Heading mt="2" size='md'>{name}</Heading>
                      </CardBody>
                    </Card>
                  </Link>
                )}
              </SimpleGrid>
            </Container>
            :
            topThreeBlogs[0] !== undefined ?
              <Container m={2} maxW="997px">
                <div className="home-results-message">Here are the 3 best matches we found for you:</div>
                <SimpleGrid minChildWidth="250px" spacing='30px'>
                  {topThreeBlogs.map(({ _id, title, thumbnail, matches }) =>
                    <Link key={_id} to={`/blogs/${_id}`}>
                      <Card variant="unstyled">
                        <CardBody>
                          <Text>{matches / 2 * 100}% match</Text>
                          <Image src={thumbnail} alt={title} />
                          <Heading mt="2" size='md'>{title}</Heading>
                        </CardBody>
                      </Card>
                    </Link>
                  )}
                </SimpleGrid>
              </Container>
              : null}
        </Flex>
      </Flex>
      <div ref={plantRef}></div>
      <div className="empty" ref={blogRef}></div>
    </main>
  )
}

export default Home