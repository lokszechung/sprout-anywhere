import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import ImageUpload from '../../ImageUpload'

// Chakra imports
import { Container, Box, Image, Button, Select, Input, Flex } from '@chakra-ui/react'

const PlantForm = ({ handleSubmit, formFields, setFormFields, errors, setErrors, formName }) => {

  // Variable to store locations chosen

  // const [locationArray, setLocationArray] = useState([])

  //Options for dropdown

  const categories = ['succulent', 'palm', 'bonsai', 'fern', 'foliage']
  const locations = ['office', 'living room', 'bedroom', 'bathroom', 'balcony', 'kitchen']
  const sunlights = [
    {
      amount: 'small', 
      desc: 'small - less than 1 hour daily',
    }, 
    {
      amount: 'medium',
      desc: 'medium - 1 to 2 hours daily',
    }, 
    {
      amount: 'large',
      desc: 'large - more than 2 hours daily',
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

  // Get values and add to formfields object 

  const handleChange = (e) => {
    if (e.target.name !== 'idealLocation') {
      setFormFields({ ...formFields, [e.target.name]: e.target.value })
      return setErrors({ ...errors, [e.target.name]: '', message: '' })
    }

    if (e.target.checked) {
      const newLocations = [ ...formFields.idealLocation, e.target.value ] 
      setFormFields({ ...formFields, [e.target.name]: newLocations })
      setErrors({ ...errors, [e.target.name]: '', message: '' })
    }

    if (!e.target.checked) {
      const newLocations = formFields.idealLocation.filter((location) => location !== e.target.value)
      setFormFields({ ...formFields, [e.target.name]: newLocations })
      setErrors({ ...errors, [e.target.name]: '', message: '' })
    }
  }

  const isLocationInArray = (location) => {
    formFields.idealLocation.includes(location)
  }

  return (
    <Container w={[350, 500, 768, 997]} m={2} maxW="997px">
      <Box className="plant-add-title">
        <Link to={'/profile'}>
          <Button variant="ghost" _hover="ghost" m="0" p="1">Back</Button>
        </Link>
        <h1>{formName}</h1>
      </Box>
      <Box className="plant-add-form">
        <form onSubmit={handleSubmit}>
          <Box>
            {/* Name */}
            <label htmlFor="title">Plant name <span className="required">*</span></label>
            <Input 
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Plant Name"
              value={formFields.name}
              borderColor="#9CB42F"
              required 
            />
            {/* Image */}
            <ImageUpload
              formFields={formFields}
              setFormFields={setFormFields}
            />
            {/* Main Description */}
            <label htmlFor="mainDescription">Main Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="mainDescription"
              onChange={handleChange}
              placeholder="Type Main Description here"
              value={formFields.mainDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Light Description */}
            <label htmlFor="lightDescription">Light Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="lightDescription"
              onChange={handleChange}
              placeholder="Type Light Description here"
              value={formFields.lightDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Watering Description */}
            <label htmlFor="waterDescription">Watering Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="waterDescription"
              onChange={handleChange}
              placeholder="Type Watering Description here"
              value={formFields.waterDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Temperature Description */}
            <label htmlFor="tempDescription">Temperature Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="tempDescription"
              onChange={handleChange}
              placeholder="Type Temperature Description here"
              value={formFields.tempDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Humidity Description */}
            <label htmlFor="humidityDescription">Humidity Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="humidityDescription"
              onChange={handleChange}
              placeholder="Type Humidity Description here"
              value={formFields.humidityDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Height Description */}
            <label htmlFor="heightDescription">Growth and Height Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="heightDescription"
              onChange={handleChange}
              placeholder="Type Growth and Height Description here"
              value={formFields.heightDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Toxicity Description */}
            <label htmlFor="toxicityDescription">Toxicity Description <span className="required">*</span></label>
            <Input 
              type="text"
              name="toxicityDescription"
              onChange={handleChange}
              placeholder="Type Toxicity Description here"
              value={formFields.toxicityDescription}
              borderColor="#9CB42F"
              maxLength="500"
              required 
            />
            {/* Category */}
            <label htmlFor="category">Category <span className="required">*</span></label>
            <Select borderColor="#9CB42F" name="category" onChange={handleChange} 
              value={formFields.category}
              required>
              <option value="" disabled selected>Select Plant Category</option>
              {categories.map(category => {
                return <option key={category} value={category}>{category}</option>
              })}
            </Select>
            {/* Ideal Location */}
            <label htmlFor="idealLocation">Ideal Location <span className="required">*</span></label>
            <Flex className="plant-add-location-checkbox">
              {locations.map(location => {
                return (
                  <Flex key={location}>
                    <input name="idealLocation" type="checkbox" 
                      value={location}
                      checked={formFields.idealLocation.includes(location)}
                      onChange={handleChange}
                    />
                    <label>{location}</label>
                  </Flex>
                )
              })}
            </Flex>
            {/* Sunlight Required */}
            <label htmlFor="sunlightRequired">Sunlight Required <span className="required">*</span></label>
            <Select borderColor="#9CB42F" name="sunlightRequired" onChange={handleChange} 
              value={formFields.sunlightRequired}
              required>
              <option value="" disabled selected>Select Sunlight Required</option>
              {sunlights.map(sunlight => {
                return <option key={sunlight.amount} value={sunlight.amount}>{sunlight.desc}</option>
              })}
            </Select>
            {/* Height */}
            <label htmlFor="plantHeight">Plant Height <span className="required">*</span></label>
            <Select borderColor="#9CB42F" name="plantHeight" onChange={handleChange} 
              value={formFields.plantHeight}
              required>
              <option value="" disabled selected>Select Plant Height</option>
              {heights.map(height => {
                return <option key={height.amount} value={height.amount}>{height.desc}</option>
              })}
            </Select>
            {/* Beginner Friendly */}
            <label htmlFor="beginnerFriendly">Beginner Friendly <span className="required">*</span></label>
            <Select borderColor="#9CB42F" name="beginnerFriendly" onChange={handleChange} 
              value={formFields.beginnerFriendly}
              required>
              <option value="" disabled selected>Select Beginner Friendly</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Select>
            {/* Safe for Children & Pets */}
            <label htmlFor="safeForPetsOrChildren">Safe for Children &amp; Pets <span className="required">*</span></label>
            <Select borderColor="#9CB42F" name="safeForPetsOrChildren" onChange={handleChange}
              value={formFields.safeForPetsOrChildren}
              required>
              <option value="" disabled selected>Select Safe for Children and Pets</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Select>
            <Button onSubmit={handleSubmit} type="submit" className="btn-green">{formName}</Button>
          </Box>
        </form>
      </Box>
    </Container>
  )

}

export default PlantForm