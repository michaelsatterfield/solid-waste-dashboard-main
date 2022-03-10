import React, { useContext, useState } from 'react'
import MyContext from '../state/MyContext'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { EditSharp } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { createFilterOptions } from '@material-ui/lab/Autocomplete'

import default_image from '../assets/test_image.png'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}))

export default function Categories() {
  const context = useContext(MyContext)
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState({})
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [creatingNewCategory, setCreatingNewCategory] = useState(false)
  const [newDepot, setNewDepot] = useState('')

  //const [searchTerm, setSearchTerm] = useState('')
  // let searchResults = context.categories.filter((category) =>
  //   category.name.includes(searchTerm)
  // )




  let selectCategory = (row) => {
    setSelectedCategory(row)
    setModalOpen(true)
  }

  let saveData = () => {
    context.saveCategoryData(selectedCategory)
    setModalOpen(false)
  }

  let createNewCategory = () => {
    context.createCategoryData(selectedCategory)
    setNewDepot('')
    setCreatingNewCategory(false)
    setModalOpen(false)
    setSelectedCategory({})
  }

  let setUpNewCategory = () => {
    setSelectedCategory({
      collection: '',
      depots: [],
      instructions: '',
      name: '',
      wasteType: '',
    })
    setCreatingNewCategory(true)
    setModalOpen(true)
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.name,
  })

  return (
    <div className="categories_container">
      <h1 style={{ textAlign: 'center' }}>Categories</h1>
      <Autocomplete
        freeSolo
        style={{ maxWidth: '800px', margin: 'auto' }}
        id="free-solo-2-demo"
        disableClearable
        options={context.categories}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setSelectedCategory(newValue)
          setModalOpen(true)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: 'search' }}
            //onChange={(evnt) => setSearchTerm(evnt.target.value)}
          />
        )}
      />
      <Button
        style={{
          width: '80%',
          maxWidth: '400px',
          display: 'block',
          margin: 'auto',
          marginTop: '23px',
          background: '#222',
          color: '#fff',
        }}
        variant="contained"
        onClick={() => setUpNewCategory()}
      >
        Create New Category
      </Button>
      <div className="card_container">
        {context.loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Waste Type</TableCell>
                  <TableCell align="left">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {context.categories.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                        <div dangerouslySetInnerHTML={{__html: row.name}}></div>
                      {/*{row.name}*/}
                    </TableCell>
                    <TableCell align="left">{row.wasteType}</TableCell>
                    <TableCell align="left">
                      <IconButton
                        onClick={() => selectCategory(row)}
                        aria-label="edit"
                      >
                        <EditSharp />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="modal_container">
          <div className="upload_image_container">
            <img
              alt="category"
              className="category_image"
              src={selectedCategory.image || default_image}
            />
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={(evnt) =>
                context
                  .uploadNewImage(selectedCategory.id, evnt.target.files[0])
                  .then((reponse) => {
                    setSelectedCategory((prevState) => {
                      return { ...prevState, image: reponse.url }
                    })
                    console.log(reponse.url)
                  })
              }
            />
            <label htmlFor="contained-button-file">
              <Button
                style={{ marginTop: '12px' }}
                variant="contained"
                component="span"
              >
                Upload New Image
              </Button>
            </label>
          </div>
          <h1>{selectedCategory.name}</h1>

          <TextField
            label="Name"
            variant="outlined"
            value={selectedCategory.name}
            style={{ width: '80%', marginBottom: '24px' }}
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedCategory((prevState) => {
                return { ...prevState, name: evnt.target.value }
              })
            }}
          />

          <TextField
            id="outlined-select-currency"
            select
            label="Waste Type"
            value={selectedCategory.wasteType}
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedCategory((prevState) => {
                return { ...prevState, wasteType: evnt.target.value }
              })
            }}
            variant="outlined"
            style={{ width: '80%', marginBottom: '24px' }}
          >
            {context.wasteTypes.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Instructions"
            variant="outlined"
            value={selectedCategory.instructions}
            style={{ width: '80%', marginBottom: '24px' }}
            multiline
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedCategory((prevState) => {
                return { ...prevState, instructions: evnt.target.value }
              })
            }}
          />

          <TextField
            label="Collection"
            variant="outlined"
            value={selectedCategory.collection}
            style={{
              width: '80%',
              marginBottom: '24px',
            }}
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedCategory((prevState) => {
                return { ...prevState, collection: evnt.target.value }
              })
            }}
          />

          <div className="depot_container">
            <TextField
              label="Depot"
              variant="outlined"
              value={newDepot}
              style={{
                width: '80%',
                marginBottom: '24px',
              }}
              onChange={(evnt) => {
                setNewDepot(evnt.target.value)
              }}
            />
            <Button
              style={{ width: '80px', height: '60px' }}
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectedCategory((prevState) => {
                  let depots = prevState.depots
                  depots.push(newDepot)
                  return {
                    ...prevState,
                    depots,
                  }
                })
                setNewDepot('')
                setSaveDisabled(false)
              }}
            >
              Add
            </Button>
          </div>

          {selectedCategory.depots?.map((depot, i) => {
            return (
              <div key={i} className="depots_container">
                <p>{depot}</p>
                <Button
                  style={{ width: '80px', height: '60px' }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedCategory((prevState) => {
                      let depots = prevState.depots
                      depots.splice(i, 1)
                      return {
                        ...prevState,
                        depots,
                      }
                    })
                    setNewDepot('')
                    setSaveDisabled(false)
                  }}
                >
                  Remove
                </Button>
              </div>
            )
          })}

          <Button
            style={{ width: '80%', marginBottom: '13px', marginTop: '23px' }}
            variant="contained"
            color="primary"
            onClick={() =>
              creatingNewCategory ? createNewCategory() : saveData()
            }
            disabled={saveDisabled}
          >
            {creatingNewCategory ? 'Create' : 'Save'}
          </Button>
          <Button
            style={{ width: '80%', marginBottom: '13px' }}
            variant="contained"
            onClick={() => {
              setModalOpen(false)
              setCreatingNewCategory(false)
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}
