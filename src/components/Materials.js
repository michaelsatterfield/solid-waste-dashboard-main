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

export default function Materials() {
  const context = useContext(MyContext)
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState({})
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [creatingNewMaterial, setCreatingNewMaterial] = useState(false)

  //const [searchTerm, setSearchTerm] = useState('')
  // let searchResults = context.categories.filter((category) =>
  //   category.name.includes(searchTerm)
  // )

  let selectMaterial = (row) => {
    setSelectedMaterial(row)
    setModalOpen(true)
  }

  let saveData = () => {
    context.saveMaterialData({
      name: selectedMaterial.name,
      id: selectedMaterial.id,
      category: selectedMaterial.category,
    })
    setModalOpen(false)
  }

  let createNewMaterial = () => {
    context.createMaterialData(selectedMaterial)
    setCreatingNewMaterial(false)
    setModalOpen(false)
    setSelectedMaterial({
      name: selectedMaterial.name,
      id: selectedMaterial.id,
      category: selectedMaterial.category,
    })
  }

  let setUpNewMaterial = () => {
    setSelectedMaterial({
      name: '',
      category: '',
    })
    setCreatingNewMaterial(true)
    setModalOpen(true)
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.name,
  })

  return (
    <div className="categories_container">
      <h1 style={{ textAlign: 'center' }}>Materials</h1>
      <Autocomplete
        freeSolo
        style={{ maxWidth: '800px', margin: 'auto' }}
        id="free-solo-2-demo"
        disableClearable
        options={context.materials}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          setSelectedMaterial(newValue)
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
        onClick={() => setUpNewMaterial()}
      >
        Create New Material
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
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {context.materials.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.category_obj.name}</TableCell>
                    <TableCell align="left">
                      <IconButton
                        onClick={() => selectMaterial(row)}
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
              src={selectedMaterial.image || default_image}
            />
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={(evnt) => {
                if (!creatingNewMaterial) {
                  context
                    .uploadNewMaterialImage(
                      selectedMaterial.id,
                      evnt.target.files[0]
                    )
                    .then((reponse) => {
                      setSelectedMaterial((prevState) => {
                        return { ...prevState, image: reponse.url }
                      })
                      console.log(reponse.url)
                    })
                }
              }}
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
          <h1>{selectedMaterial.name}</h1>

          <TextField
            label="Name"
            variant="outlined"
            value={selectedMaterial.name}
            style={{ width: '80%', marginBottom: '24px' }}
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedMaterial((prevState) => {
                return { ...prevState, name: evnt.target.value }
              })
            }}
          />

          <TextField
            id="outlined-select-currency"
            select
            label="Category"
            value={selectedMaterial.category_obj}
            onChange={(evnt) => {
              if (saveDisabled) {
                setSaveDisabled(false)
              }
              setSelectedMaterial((prevState) => {
                return {
                  ...prevState,
                  category: evnt.target.value.id,
                  category_obj: evnt.target.value,
                }
              })
            }}
            variant="outlined"
            style={{ width: '80%', marginBottom: '24px' }}
          >
            {context.categories.map((option) => (
              <MenuItem key={option.id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            style={{ width: '80%', marginBottom: '13px', marginTop: '23px' }}
            variant="contained"
            color="primary"
            onClick={() =>
              creatingNewMaterial ? createNewMaterial() : saveData()
            }
            disabled={saveDisabled}
          >
            {creatingNewMaterial ? 'Create' : 'Save'}
          </Button>
          <Button
            style={{ width: '80%', marginBottom: '13px' }}
            variant="contained"
            onClick={() => {
              setModalOpen(false)
              setCreatingNewMaterial(false)
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}
