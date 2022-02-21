import { Component } from 'react'
import MyContext from './MyContext'
import firebase from 'firebase/app'
import 'firebase/storage'

export default class MyProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authorized: false,
      access_code: '',
      materials: [],
      categories: [],
      wasteTypes: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.getCategories()
    this.getMaterials()
    this.getAccessCode()
    this.getWasteTypes()
  }

  getCategories = () => {
    let categories = []
    this.setState({ loading: true })
    firebase
      .firestore()
      .collection('categories')
      .orderBy('name')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          categories.push(doc.data())
          this.setState({ categories })
        })
      })
      .then(() => {
        this.setState({ loading: false })
      })
      .catch((err) => console.log(err.message))
  }

  getMaterials = () => {
    let materials = []
    this.setState({ loading: true })
    firebase
      .firestore()
      .collection('materials')
      .orderBy('name')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          let catName = {}
          this.state.categories.forEach((cat) => {
            if (cat.id === doc.data().category) {
              catName = cat
            }
          })
          materials.push({ ...doc.data(), category_obj: catName })
          this.setState({ materials })
        })
      })
      .then(() => {
        this.setState({ loading: false })
      })
      .catch((err) => console.log(err.message))
  }

  setAuthorized = (status) => {
    this.setState({ authorized: status })
  }

  getAccessCode = () => {
    firebase
      .firestore()
      .collection('assets')
      .doc('accessCode')
      .get()
      .then((data) => {
        this.setState({ access_code: data.data().code })
      })
  }

  getWasteTypes = () => {
    let wasteTypes = []
    firebase
      .firestore()
      .collection('wasteTypes')
      .orderBy('name')
      .get()
      .then((data) => {
        data.forEach((doc) => {
          wasteTypes.push(doc.data())
          this.setState({ wasteTypes })
        })
      })
      .catch((err) => console.log(err.message))
  }

  saveCategoryData = (category) => {
    firebase
      .firestore()
      .collection('categories')
      .doc(category.id)
      .update(category, { merge: true })
      .then(() => {
        this.getCategories()
      })
  }

  saveMaterialData = (material) => {
    firebase
      .firestore()
      .collection('materials')
      .doc(material.id)
      .update(material, { merge: true })
      .then(() => {
        this.getMaterials()
      })
  }

  uploadNewImage = (id, file) => {
    return new Promise((resolve, reject) => {
      let imageURL = ''
      firebase
        .storage()
        .ref(`/${id}/image`)
        .put(file)
        .then((data) => {
          data.ref
            .getDownloadURL()
            .then((url) => {
              imageURL = url
              firebase
                .firestore()
                .collection('categories')
                .doc(id)
                .update({ image: url }, { merge: true })
            })
            .then(() => {
              resolve({ url: imageURL })
            })
        })
        .then(() => {
          this.getCategories()
        })
    })
  }

  uploadNewMaterialImage = (id, file) => {
    return new Promise((resolve, reject) => {
      let imageURL = ''
      firebase
        .storage()
        .ref(`/material/${id}/image`)
        .put(file)
        .then((data) => {
          data.ref
            .getDownloadURL()
            .then((url) => {
              imageURL = url
              firebase
                .firestore()
                .collection('materials')
                .doc(id)
                .update({ image: url }, { merge: true })
            })
            .then(() => {
              resolve({ url: imageURL })
            })
        })
        .then(() => {
          this.getMaterials()
        })
    })
  }

  createCategoryData = (newCategory) => {
    firebase
      .firestore()
      .collection('categories')
      .add(newCategory)
      .then((data) => {
        data.update({ id: data.id }, { merge: true })
      })
      .then(() => {
        this.getCategories()
      })
  }
  createMaterialData = (newMaterial) => {
    firebase
      .firestore()
      .collection('materials')
      .add(newMaterial)
      .then((data) => {
        data.update({ id: data.id }, { merge: true })
      })
      .then(() => {
        this.getMaterials()
      })
  }

  render() {
    return (
      <MyContext.Provider
        value={{
          materials: this.state.materials,
          categories: this.state.categories,
          authorized: this.state.authorized,
          access_code: this.state.access_code,
          wasteTypes: this.state.wasteTypes,
          loading: this.state.loading,
          uploadNewImage: (id, file) => this.uploadNewImage(id, file),
          uploadNewMaterialImage: (id, file) =>
            this.uploadNewMaterialImage(id, file),
          saveCategoryData: (category) => this.saveCategoryData(category),
          saveMaterialData: (category) => this.saveMaterialData(category),
          getCategories: () => this.getCategories(),
          getMaterials: () => this.getMaterials(),
          setAuthorized: (status) => this.setAuthorized(status),
          createCategoryData: (newCategory) =>
            this.createCategoryData(newCategory),
          createMaterialData: (newMaterial) =>
            this.createMaterialData(newMaterial),
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}
