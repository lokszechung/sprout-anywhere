import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../../helpers/auth'

import PlantForm from './PlantForm'

const PlantNew = () => {

  const navigate = useNavigate()
  
  const [ formFields, setFormFields ] = useState({
    name: '',
    thumbnail: '',
    mainDescription: '',
    lightDescription: '',
    waterDescription: '',
    tempDescription: '',
    humidityDescription: '',
    heightDescription: '',
    toxicityDescription: '',
    category: '',
    idealLocation: '',
    sunlightRequired: '',
    plantHeight: '',
    beginnerFriendly: '',
    safeForPetsOrChildren: '',
  })

  const [ errors, setErrors ] = useState(null)

  // ! Execution
  // submit plant to database
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/plants', formFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate(`/plants/${data._id}`)
    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  return (
    <main className="plant-add-page">
      <PlantForm 
        handleSubmit={handleSubmit} 
        formFields={formFields} 
        setFormFields={setFormFields}
        errors={errors}
        setErrors={setErrors} 
        formName="Add Plant"
      />
    </main>
  )
}

export default PlantNew