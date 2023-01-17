import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { getToken, isOwner } from '../../../helpers/auth'

// Chakra imports
import { Container, Box, SimpleGrid, Flex, Spacer, Text, Card, CardBody, Image, Heading, Button, ButtonGroup } from '@chakra-ui/react'
import { FaAmazon } from 'react-icons/fa'
import lightIcon from '../../../assets/light-icon.webp'
import waterIcon from '../../../assets/water-icon.webp'
import tempIcon from '../../../assets/temp-icon.webp'
import humidIcon from '../../../assets/humid-icon.webp'
import timeIcon from '../../../assets/time-icon.webp'
import petIcon from '../../../assets/pet-icon.webp'


const PlantsIndex = () => {

  const [plant, setPlant] = useState(null)
  const [error, setError] = useState(false)
  const [reviewField, setReviewField] = useState({
    text: '',
  })

  const { id } = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant(data)
      } catch (err) {
        setError(true)
      }
    }
    getPlant()
  }, [id])

  const deletePlant = async (e) => {
    try {
      await axios.delete(`/api/plants/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate('/plants')
    } catch (err) {
      console.log(err)
    }
  }

  const amazonClick = () => {
    window.open(
      `https://www.amazon.co.uk/s?k=${plant.name}`
    )
  }

  const handleChange = (e) => {
    const updatedReviewField = {
      ...reviewField,
      [e.target.name]: e.target.value,
    }
    setReviewField(updatedReviewField)
    if (error) setError('')
  }

  const handleClick = async (e) => {
    try {
      const { data } = await axios.post(`/api/plants/${id}/review`, reviewField, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setPlant(data)
      setReviewField({
        text: '',
      })
    } catch (err) {
      console.log('review FAIL ->', err)
      setError(err.response.data)
    }
  }


  return (
    <>
      <main className="plant-single">
        <Flex>

        </Flex>
        <Container className="plant-container">
          {plant ?
            <>
              <h1 className="plant-name"><strong>{plant.name}</strong></h1>
              <img className="plant-img" src={plant.thumbnail} alt={plant.name} />
              <p className="plant-main-description">{plant.mainDescription}</p>
              <Flex className='amazon-btn-div'>
                <Button className='amazon-btn' bg="rgba(255,153,0,1)"
                  _hover={{ backgroundColor: 'rgba(255,130,0,1)' }}
                  boxShadow="xl"
                  leftIcon={<FaAmazon />}
                  onClick={amazonClick}>Buy on Amazon</Button>
              </Flex>
              <Flex className="plant-info-guide-title-container">
                <p className="plant-info-guide-title">{plant.name} Care &amp; Info Guide</p>
              </Flex>
              <Flex className="plant-info-container">
                <Flex className="plant-info light-info">
                  <img src={lightIcon} />
                  <p className="plant-info-subtitle">Light</p>
                  <p>{plant.lightDescription}</p>
                </Flex>
                <Flex className="plant-info water-info">
                  <img src={waterIcon} />
                  <p className="plant-info-subtitle">Watering</p>
                  <p>{<p>{plant.waterDescription}</p>}</p>
                </Flex>
                <Flex className="plant-info temp-info">
                  <img src={tempIcon} />
                  <p className="plant-info-subtitle">Temperature</p>
                  <p>{plant.tempDescription}</p>
                </Flex>
                <Flex className="plant-info humid-info">
                  <img src={humidIcon} />
                  <p className="plant-info-subtitle">Humidity</p>
                  <p>{plant.humidityDescription}</p>
                </Flex>
                <Flex className="plant-info growth-info">
                  <img src={timeIcon} />
                  <p className="plant-info-subtitle">Height &amp; Growth Rate</p>
                  <p>{plant.heightDescription}</p>
                </Flex>
                <Flex className="plant-info toxic-info">
                  <img src={petIcon} />
                  <p className="plant-info-subtitle">Toxicity</p>
                  <p>{plant.toxicityDescription}</p>
                </Flex>
                <Box>
                  {/* This checks if the owner of the plant is viewing the page, and if so, displays the edit/delete buttons */}
                  {
                    isOwner(plant.owner) &&
                    <ButtonGroup gap='2'>
                      <Link to={`/plants/${id}/edit`}><Button className="btn-green">Edit</Button></Link>
                      <Button onClick={deletePlant} colorScheme='red'>Delete</Button>
                    </ButtonGroup>
                  }
                </Box>
                <Flex className="plant-info review-info">
                  <p className="review-section">Any comments ?</p>
                  {plant.reviews.length > 0 &&
                    plant.reviews.map(review => {
                      return (
                        <div key={review._id} className='review-flex'>
                          <div className='review-details'>
                            <p><span>{review.username}</span></p>
                            <p id='review-date'>{Date().toString().split('G').slice(0, 1).join()}</p>
                          </div>
                          <p id='review-text'>{review.text}</p>
                        </div>
                      )
                    })
                  }

                  <div className='input-review-flex'>

                    <input
                      type="text"
                      name="text"
                      onChange={handleChange}
                      value={reviewField.text}
                      placeholder="Comment"
                    />
                    <button className="btn-post" onClick={handleClick}>Post comment</button>
                  </div>
                </Flex>
              </Flex>
            </>
            :
            error ?
              <div className="error">
                <h2 className="error-text display-6">Something went wrong, try again later.</h2>
              </div>
              :
              <h2>Loading...</h2>
          }
        </Container>
      </main>

    </>
  )
}

export default PlantsIndex

