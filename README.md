# Sprout Anywhere

This is my third project completed during the end of week 8 and all of week 9 of General Assembly's Software Engineering bootcamp, having learned backend development for one and a half weeks - NodeJS, Express, MongoDB/Mongoose and building RESTful APIs.

The aim of this project was to create a full-stack application using the MERN stack skills we had learnt. Inspired by one of our group member's love of plants, we decided to take a blogging/e-commerce approach for this project, taking houseplants as our theme. The app allows all users to browse plants, with Amazon links to buy and read blogs about all things plants, however more functionality is available to users who create an account. User who create an account are given their own profile page and can add plants and blogs themselves, and share their love and knowledge with the world!

- **Project timeframe:** 8 days
- **Team size:** 3 

[Check it out here!](https://sprout-anywhere.herokuapp.com/)

![Sprout Anywhere Landing Page](/readme-images/sprout-anywhere-1.png)
_&uarr; Landing Page &uarr;_
![Sprout Anywhere Plants Index Page](/readme-images/sprout-anywhere-2.png)
_&uarr; Plants Index Page &uarr;_
![Sprout Anywhere Plants Single Page](/readme-images/sprout-anywhere-3.png)
_&uarr; Plants Single Page &uarr;_
![Sprout Anywhere Blogs Index Page](/readme-images/sprout-anywhere-4.png)
_&uarr; Blogs Index Page &uarr;_
![Sprout Anywhere Plants Single Page](/readme-images/sprout-anywhere-5.png)
_&uarr; Profile Page &uarr;_

#### Technologies Used
- React
- CSS3, Sass
- Express
- NodeJS
- MongoDB & Mongoose
- JSON Web Token
- Axios
- Chakra UI
- Insomnia
- Figma
- Git & GitHub


#### Brief
- Build a full-stack application by making your own backend and frontend
- Use an Express API to serve your data from a Mongo database
- Consume your API with a separate React frontend
- Be a complete product with multiple relationships and CRUD functionality
- Implement thoughful user stories/wireframes
- Have a visually impressive design
- Be deployed online so it's publicly accessible

---

## Planning

### Wireframe & Pseudocode 

Our first discussion was about the concept for the app, which we all decided would be a blogging and e-commerce-like website with a focus on houseplants. Once we were happy with out idea, we created a wireframe for the app using Figma. When it came to dividing up tasks, we felt it was important for each member of the group to be involved in both frontend and backend aspects of the app. With this in mind, it was decided that I would take care of the navbar, the landing page, creating the backend database and frontend display for the plants. Shawn was responsible for creating the backend Mongo database and the frontend React for the blogs, and Gael was in charge of creating the users backend and frontend and the comments section. 

We spent time drawing up our ideas, taking inspiration from other plant websites such as [plantsome.nl](https://www.plantsome.nl/) and [hortology.co.uk](https://hortology.co.uk/), and discussing which features we want to see in the finished product. We had to ensure that all the ideas were doable given the timeline we had, and so we selected which features to prioritise, and which to add if we had time at the end. 

We also planned out the models and the fields it would contain, as well as how the data would be related, such as the relationship between a user and his/her blogs or plants posted. 

We communicated often over Zoom and Slack, including daily morning stand-ups, to ensure we were on track, to problem-solve and to discuss any changes that may have needed to be implemented. 

Note: the original plan was for a mobile first app, so the wireframe has mobile-sized designs on it. The end product is indeed mobile-friendly, however. 

![wireframe Page 1](/readme-images/wireframe-1.png)
![wireframe Page 2](/readme-images/wireframe-2.png)
_Wireframe_

---

## Build Process

### BACKEND 

### Plant Model

I started by creating the plant model using Mongoose as it provides a built in Schema class. I included a lot of fields in the Model Schema so that users could then receive a lot of details about plants in the app, as well as for the filter feature.  
```js
const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  mainDescription: { type: String, required: true, maxlength: 500 },
  lightDescription: { type: String, required: true, maxlength: 500 },
  waterDescription: { type: String, required: true, maxlength: 500 },
  tempDescription: { type: String, required: true, maxlength: 500 },
  humidityDescription: { type: String, required: true, maxlength: 500 },
  heightDescription: { type: String, required: true, maxlength: 500 },
  toxicityDescription: { type: String, required: true, maxlength: 500 },
  category: { type: String, required: true },
  idealLocation: [{ type: String, required: true }],
  sunlightRequired: { type: String, required: true },
  plantHeight: { type: String, required: true }, 
  beginnerFriendly: { type: Boolean, required: true }, )
  safeForPetsOrChildren: { type: Boolean, required: true }, 
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  reviews: [reviewPlantSchema]
})
```
The ```owner``` field assigns an owner to every plant posted and uses a **referenced** relationship. The ```reviews``` field is an **embedded** relationship and this is used for the array of reviews (or comments) each plant post can have. The reviews section was mainly dealt with by Gael. 

### Middleware

Next in the process is to start the server and add the middleware. 

1. An async function called ```startServer``` is created, inside of which I use a try-catch block to handle any errors that might occur while connecting to the MongoDB database. 
2. The ```mongoose.connect()``` method connects to the MongoDB.
3. I then add the middleware. Firstly, the ```use``` method adds the ```express.json()``` middleware, which parses JSON data in the request body. The second middleware handles requests to the ```'/api'``` route using the ```router``` object. Lastly, a middleware is added as a catcher to handle 404 errors by returning a JSON response with the message "Page Not Found".
4. The server is then started by calling the ```app.listen``` method. 
```js
const app = express()

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
 
    app.use(express.json())

    app.use((req, res, next) => {
      console.log(`Request recieved: ${req.method} - ${req.url}`)
      next()
    })

    app.use('/api', router)

    app.use((_req, res) => res.status(404).json('Page Not Found'))

    app.listen(process.env.PORT, console.log(`🚀Sever running on port ${process.env.PORT}`))

  } catch (err) {
    console.log(err)
  }
}
startServer()
```

### Routers

I then made a ```router.js``` file inside the config folder, where the endpoints for our API are created.
```js
router.route('/plants')
  .get(getAllPlants)
  .post(secureRoute, addPlant)

router.route('/plants/:id')
  .get(getSinglePlant)
  .put(secureRoute, updatePlant)
  .delete(secureRoute, deletePlant)

```
- The GET request to the ```/plants``` endpoint hits the ```getAllPlants``` controller and returns all plants.
- The POST request to the ```/plants``` endpoint first calls the ```secureRoute``` function, and if it passes validation, will allow a logged in user to add a plant to the database via the ```addPlant``` controller. 
- The GET request to the ```/plants/:id``` endpoint, where ```:id``` is a placeholder for the id of a plant posted, hits the ```getSinglePlant``` to return a certain plant
- The PUT request to ```/plants/:id``` endpoint hits the ```secureRoute```, then the ```updatePlant``` controller to allow logged in owners of the plant posted to edit and update the post.
- The DELETE request to ```/plants/:id``` endpoint hits the ```secureRoute```, then the ```deletePlant``` controller to allow logged in owners of the plant posted to delete the post.

### Controllers

Next in the process was to create the controllers. All the following are async functions that takes in ```req``` - the incoming request - and ```res``` - the response object - as parameters.

**Index Controller** 

The ```getAllPlants``` function uses ```Plants.find()``` to find all documents in the Plants model. ```Plants.find()``` method returns a promise, so ```await``` is used to pause the execution of the function until the method is resolved. The returned array is then assigned to the variable ```plants```, before using the ```res.json()``` method to send the data back to the client. 
```js
export const getAllPlants = async (_req, res) => {
  try {
    const plants = await Plant.find()
    return res.json(plants)
  } catch (err) {
    console.log(err)
  }
}
```
**Create Controller**

The ```addPlant``` function uses the ```Plant.create()``` method to create a new instance of the Plant model and saves it to the database. Data is spread in from the request body ```...req.body``` and an ```owner``` field is added with the value of the current logged in user's id. ```currentUser``` is from the secure route, which will be explained later on. If any errors occur while creating a new plant, it will be caught in the catch block, and will the send a 422 error and the error object. 
```js
export const addPlant = async (req, res) => {
  try {
    const plantToAdd = await Plant.create({ ...req.body, owner: req.currentUser._id })
    return res.status(201).json(plantToAdd)
  } catch (err) {
    return res.status(422).json(err.errors)
  }
}
```
**Single Plant Controller**

The ```getSinglePlant``` function uses ```Plant.findById()``` to find a plant with a given id. ```req.params``` is an object that contains parameters from the request's URL, and by destructuring, I extract the ```id``` property and assign it to the variable with the smae name ```id```. If no plant is found, then it throws a new error 'plant not found'. 
```js
export const getSinglePlant = async (req, res) => {
  try {
    const { id } = req.params
    const plant = await Plant.findById(id)
    if (!plant) {
      throw new Error('Plant not found')
    }
    return res.json(plant)
  } catch (err) {
    return res.status(404).json({ message: 'plant not found' })
  }
}
```

**Update Controller** 

The ```updatePlant``` function finds the plant to update, similar to the function above. If a plant is found and the logged in user's id is equal to the plant owner's id, then the plant information is updated using ```Object.assign()``` by copying the properties from ```req.body``` to the ```plant``` object, then saving the updated plant to the database. 
```js
export const updatePlant = async (req, res) => {
  try {
    const { id } = req.params
    const plant = await Plant.findById(id)
    if (!plant) {
      throw new Error('Plant not found')
    }
    if (plant && req.currentUser._id.equals(plant.owner._id)) {
      Object.assign(plant, req.body)
      plant.save()
      return res.status(202).json(plant)
    }
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Plant not found' })
    }
    return res.status(404).json(err)
  }
}
```
**Delete Controller** 

The ```deletePlant``` function again finds the plant to delete. If successful, the ```remove()``` method is called to delete the plant from the database. 
```js
export const deletePlant = async (req, res) => {
  try {
    const { id } = req.params
    const plant = await Plant.findById(id)
    if (!plant) {
      throw new Error('Plant not found')
    }
    await plant.remove()
    return res.sendStatus(204)
  } catch (err) {
    console.log(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Plant not found' })
    }
    return res.status(404).json(err)
  }
}
```

### Secure Route

For every route which is only accessible for users stored in the database, we run some authentication middleware in the ```secureRoute.js``` file to identify if a user is truly logged in. This is run before we run the controller. 
```js
try {
  const auth = req.headers.authorization
  if (!auth) {
    console.log('MISSING HEADERS')
    throw new Unauthorised('Missing headers')
  }

  const token = auth.replace('Bearer ', '')

  const payload = jwt.verify(token, process.env.SECRET)

  const userToVerify = await User.findById(payload.sub)

  if (!userToVerify) {
    throw new Unauthorised('User not found')
  }

  req.currentUser = userToVerify

  next()

} catch (err) {
  sendErrors(res, err)
}
```
1. ```const auth = req.headers.authorization``` ensures the authorization header was sent with the requests. If not, an unauthorised error is thrown.
2. If auth header is present, ```const token = auth.replace('Bearer ', '')``` is run to get the token in the correct format by removing the "Bearer " from the beginning
3. Then jwt.verify() is used, passing in the ```token``` to check if it is valid. If the token is valid, ```payload.sub``` is used to identify which user is making the request by querying the User model
4. If a user is returned, the request is passed to the controller. If no user was found, invalidate the request.
5. Before passing to the next piece of middleware, a key is added to the req object, ```req.currentUser```, that holds the validated user as a value, so that it is accessible in any future middleware. 

### Seeding the Database

The next part of the process was the create initial seed data. This was necessary for testing the endpoints in Insomnia, making sure everything was working the way it should. To seed the database with data, the following was run.

```js
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)

    await mongoose.connection.db.dropDatabase()

    const users = await User.create(userData)

    const plantsWithOwners = plantData.map(plant => {
      return { ...plant, owner: users[1]._id }
    })

    const plants = await Plant.create(plantsWithOwners)

    await mongoose.connection.close()

  } catch (err) {
    await mongoose.connection.close()
  }
}
seedDatabase()
```
1. Connect to the database with the ```connect()``` method.
2. Any data in the existing database is removed, using ```mongoose.connection.db.dropDatabase()```.
3. Users are created from ```userData``` with the ```User.create()``` method.
4. At this point, the plant seed data does not include a User, so the seed data ```plantData``` is mapped through, and adds to each an owner field, which is assigned the user indexed 1. Then the plants are created using ```Plant.create()```.
5. The database connection is closed via ```mongoose.connection.close()```.

### FRONTEND 

The bulk of the time we had was spent on the frontend. For the frontend of this project, we decided to try out Chakra UI's components. I was designated the navbar, plant index, show and form pages, and the landing page, and it was in this order that I worked on them. 

### The NavBar

The NavBar renders different information for authorised and unauthorised users. For this component, the final link displays a 'logout' and 'my profile' rather than 'register' and 'log in' for authenticated users using a ternary operator to identify if a valid token is found in local storage.
```js
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
```

### Plants Index Page

The plants index page displays the collection of all the plants, with the ability to use a filter to return more specifc plants. 

1. The variables ```plants``` and ```filterPlants``` are set to state, using the React hook ```useState```, and are set to empty arrays.
2. In a ```useEffect hook```, data is fetched from the API when the component is first rendered. Once a response object is returned from the GET request using the axios library, it is destructure for it's ```data``` property, which is then used to update the state of ```plants``` and ```filterPlants```. 
3. ```filterPlants``` is then used to display the results to the user.

```js
const [plants, setPlants] = useState([])
const [filterPlants, setFilterPlants] = useState([])
```
```js
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
```

**Filters**

Users have the ability to filter the results based on 
* Plant category
* Ideal location for the plant
* Sunlight required
* Plant height
* Whether it's beginner friendly 
* Whether it's toxic for children and pets

1. To create the filter function, first I set in state the filter requirements, which are empty (or false for booleans) to start with. The object keys match the fields in the Plant model. 
```js
const [filters, setFilters] = useState({
    category: [],
    idealLocation: [],
    sunlightRequired: [], 
    plantHeight: [],
    beginnerFriendly: false,
    safeForPetsOrChildren: false,
  })
```
2. The ```handleFilter``` function takes a ```key``` and ```value``` as its arguments. Each filter uses the ```handleFilter``` function when the event handler ```onChange``` is triggered, for instance, ```onChange={() => handleFilter('category', option)}``` or ```onChange={() => handleFilter('idealLocation', option)}```. The ```key``` that is passed in as the argument will match one of the keys in the ```filters``` state. The ```value``` is the ```option``` that is passed through, which is the specifics the user has chosen to filter. 
```js
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
```
3. If either ```beginnerFriendly``` or ```safeForPetsOrChildren``` is ticked by the user, ```isFilterBoolean``` becomes a truthy value, and the ```setFilters``` will set ```filters``` accordingly.
4. If the user makes a change on any other filter for a certain ```key```, it is saved in the variable ```filterArr```. ```isExistingValue``` is subsequently true or false depending on whether the ```value``` passed to the function is already in the ```filterArr```. If ```isExistingValue``` is true, then array ```updatedArray``` is assigned by using the ```filter()``` method to remove the value from the ```filterArr``` array. If ```isExistingValue``` is false, then ```updatedArray``` is existing values in ```filterArr``` are spread in and the new ```value``` passed to the function is added to it. 
5. The ```filters``` state is updated with the ```key``` passed in and the ```updatedArray```.
6. The function ```getNonEmptyFilterKeys``` is used in the ```useEffect``` below, and returns an array of the ```filter``` keys that are ticked by the user. 
```js
const getNonEmptyFilterKeys = () => 
  Object.keys(filters).filter(filter => {
    const isFilterBool = ['beginnerFriendly', 'safeForPetsOrChildren'].includes(filter)
    if (isFilterBool) {
      return filters[filter]
    }
    return filters[filter].length !== 0 
  })
```
7. In the ```useEffect```, whenever the ```filters``` state is updated, it uses the ```filter()``` method to filter the ```plants``` state variable. ```nonEmptyFiltersKeys``` is assigned the results of calling ```getNonEmptyFilterKeys``` function. ```noOfFiltersMatched``` is initialised to 0. 
8. A ```forEach``` method is used to iterate over ```nonEmptyFiltersKeys```. It firstly checks whether the key is either ```beginnerFriendly``` or ```safeForPetsOrChildren```, if so, add 1 to ```noOfFiltersMatched```, if not, then it checks if the the key is ```idealLocation```. If so, it checks whether any of the values in the ```idealLocation``` array match any of the values in the ```filters``` array, if any match it updates the ```noOfFiltersMatched``` by 1. If the key is not any of these three, then it checks if the value of the key in the ```plant``` object matches any of the values in the ```filters``` array. If it does, it updates ```noOfFiltersMatched``` by 1.
```js
useEffect(() => {
  const filteredPlants = plants.filter((plant) => {
    const nonEmptyFiltersKeys = getNonEmptyFilterKeys()
    let noOfFiltersMatched = 0

    nonEmptyFiltersKeys.forEach(filter => {
      if (filter === 'beginnerFriendly' || filter === 'safeForPetsOrChildren') {
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
    return noOfFiltersMatched === nonEmptyFiltersKeys.length
  })
  setFilterPlants(filteredPlants)
}, [filters])
```
9. Finally, once the ```plants``` array has been looped through, the array of matching plants in ```filteredPlants``` is used to update the ```filterPlants``` state, which is in turn used to display the results to the user. 

### Single Plant Page

1. To fetch the information required to be displayed on this page, I used the ```useState``` React hook and created ```plant``` and ```error``` state variables and initialised them as 'null' and 'false' respectively. I also destructured the ```id``` variable from the ```useParams()``` hook.

```js
const [plant, setPlant] = useState(null)
const [error, setError] = useState(false)
``` 
```js
const { id } = useParams()
```
2. Inside a ```useEffect```, the getPlant function makes a GET request to the ```/api/plants/${id}``` endpoint, using the id destructured passed in. Inside the try block, ```data``` is destructured from the response object and is used to updated the ```plant``` state. 
3. If an error occurs when the data is fetched, it will be caught in the the catch block, and the ```error``` state set to true. 
```js
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
```

**Amazon Link**

The Amazon link links the user to the Amazon website already displaying the plant. This is simply a link with the plant name appended to it. 
```js
const amazonClick = () => {
    window.open(
      `https://www.amazon.co.uk/s?k=${plant.name}`
    )
  }
```

**Edit & Delete Buttons**

At the bottom of the plant displayed, if the user logged in is the owner of the plant posted, then they will be able to see an edit and a delete button for the plant.

```js
isOwner(plant.owner) &&
<ButtonGroup gap='2'>
  <Link to={`/plants/${id}/edit`}><Button className="btn-green">Edit</Button></Link>
  <Button onClick={deletePlant} colorScheme='red'>Delete</Button>
</ButtonGroup>
```

### Plant Forms

The plant forms are used when a user decides to either post or edit a plant. 

1. To create the form, first I set in state the requirement form fields, which are empty to start with. The object keys match the fields in the Plant model. I also set ```errors``` as null. 
```js
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
```
```js
  const [ errors, setErrors ] = useState(null)
```
2. The ```handleChange``` function is run each time the event handler ```onChange``` is triggered in each field of the form, 
```js
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
```
3. Some fields require a written description (such as name of plant), or a single selection from a dropdown list (such a plant category). However, plant location is a list of checkboxes and the user checks as many options that apply to the plant. Therefore, in the ```handleChange```, the input ```idealLocation``` is treated differently to the other inputs. If the input field is not ```idealLocation```, the current state of ```formFields``` is spread in, and updates the specific input field changed to the value inputted. It is then set as the new state of the ```formFields``` variable. If the input field is ```idealLocation```, then the value of the key ```idealLocation``` in ```formFields``` is spread in, updating the value, and then saved to the variable ```newLocations```. This is then used to update the ```idealLocation``` in ```formFields```. If there are any errors, this is updated also. 
4. The ```handleSubmit``` function handles when the user hits the submit button on a form. In the try block, it makes a POST request to the ```/api/plants``` endpoint, passing the ```formFields``` as the request body and an options object with the headers property containing the Authorization header with the bearer token.
```js
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
    setErrors(err.response.data)
  }
}
```

### Landing Page

The main feature of the landing page is an interactive filter of sorts, asking the user whether they would like to read blogs or buy plants. Once chosen, a series of filters will appear depending on the user's answer, and takes the user through the choices. When the user clicks 'Show me something', the page will autoscroll to reveal three suggested blogs or plants that best matches the user's choices. 

This feature also informs the user of how much the plants suggested to them matches their choices, in the form of a percentage. For instance, if the plant suggested matched 4 out of the 5 filters, it will have an '80% match' above the suggestion. For the sake of simplicity and succinctness, it does not tell the reader which of the filters matched. 

To achieve this, after sending a GET request for all plants, for each plant, I counted how many of the filters chosen match those on the plant. The total is saved to the variable ```matchingFilters```. The plant is then spread in to a variable ```plantWithMatch``` and the field matches is added with ```matchingFilters``` as it's value. ```plantWithMatch``` is then pushed into a the ```plantsToSet``` array, which then in turn is used to update the state of ```plantsCompared```. 
```js
const [plantsCompared, setPlantsCompared] = useState([])
```
```js
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
}
```
I then sort the ```plantsCompared``` plants into order of matches descending. I then take the first three of these plants to display and suggest to the user. 
```js
const [topThreePlants, setTopThreePlants] = useState([])
```
```js
useEffect(() => {
  const sortedPlants = plantsCompared.sort((a, b) => (b.matches < a.matches) ? -1 : ((a.matches > b.matches) ? 1 : 0))
  const topSortedThree = []
  for (let i = 0; i < 3; i++) {
    topSortedThree.push(sortedPlants[i])
  }
  setTopThreePlants(topSortedThree)
}, [plantsCompared])
```

### Bugs

- An autoscroll feature is implemented in the landing page, however this sometimes does not scroll all the way down. 
- The landing page is useable on mobile, but does not resize well. 
- The search bar should close when you click anywhere outside of the search container, but it does not.

---

## Reflection

### Challenges 

- Creating the filters function on the plants index page was the most challenging part of this project, and consumed a lot of time. 
- Navigating the CSS file was a challenge, as we did all the styling on one file. In future projects, I will try to implement separate CSS files for each component. 

### Wins

- Creating an interactive and engaging landing page to greet users. 
- I am particularly pleased with the filters function on the plants index page, as it took me a while to find a way to make it work.
- We decided to try a new CSS framework for this project, Chakra UI. Although it took a bit of getting used to, we were able to make a visually appealing app that is intuitive and functions well. 

### Key Takeaways

- A good, well-rounded understanding of creating an Express API using Mongoose, such as experience with Model schemas, creating endpoints, user authentication, relationship betwwen models, routing requests and controllers. 
- Improved my knowledge with using React hooks.
- The importance of good error-handling, both in the frontend and the backend, so that relevant messages can be sent to the frontend, and that debugging is made more efficient in the backend. 

### Future Improvements

- Include pagination for the index page, which will be useful when many more plants are posted. 
- Link the e-commerce and the bloggings parts of the site together to give the app better cohension. For instance, this could be suggetsed blogs related to a plant at the bottom of the single plant page. 
- The plants and blogs can recieve a numerical reviews which translates into a average star rating for users to see. 
- A pop-up box when the user wants to delete a post, confirming if this is indeed what they intend to do.