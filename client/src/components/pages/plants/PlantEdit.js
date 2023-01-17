import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { getToken } from '../../../helpers/auth'


import PlantForm from './PlantForm'

const PlantEdit = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
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

  const [errors, setErrors] = useState(null)

  // ! Execution
  // get plant for data
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setFormFields(data)

      } catch (err) {
        console.log(err.response.data)
        setErrors(err.response.data)
      }
    }
    getData()
  }, [id])

  // submit plant edit to database
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`/api/plants/${id}`, formFields, {
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
    <main className="plant-edit-page">
      <PlantForm
        handleSubmit={handleSubmit}
        formFields={formFields}
        setFormFields={setFormFields}
        errors={errors}
        setErrors={setErrors}
        formName="Edit Plant"
      />
    </main>
  )
}

export default PlantEdit