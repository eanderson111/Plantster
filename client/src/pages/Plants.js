import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { FormBtn } from "../components/Form";
import { asyncContainer, Typeahead } from "react-bootstrap-typeahead";
import SearchBar from "../components/SearchBar";
import PlantDetail from "../components/PlantDetail";
import LocalStorageOriginal from "../components/LocalStorageOriginal/index";

const AsyncTypeahead = asyncContainer(Typeahead);

class Plants extends Component {
  state = {
    plant: null,
    plants: [],
    Type: "",
    Name: "",
    Comments: "",
    isLoading: false,
    options: [],
    finalPlant: {},
    finalPlants: []
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ plants: res.data, Type: "", Name: "", Comments: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  removePlant = id => {
   const newPlantArray = this.state.finalPlants.filter(plant => id !== plant.id)
   this.setState({finalPlants: newPlantArray});
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    let finalPlants = [...this.state.finalPlants];
    let finalPlant = this.state.plant.Name;
    finalPlants.push({
      name: finalPlant,
      id: this.state.plant._id,
      key: 1
    });
    this.setState({ finalPlants: finalPlants });
    console.log(finalPlants);
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="sm-4">
            <SearchBar>
              <AsyncTypeahead
                isLoading={this.state.isLoading}
                labelKey="Name"
                onChange={([selectedPlant]) => {
                  this.setState({ plant: selectedPlant });
                  console.log(selectedPlant);
                }}
                onSearch={query => {
                  this.setState({ isLoading: true });
                  fetch(`api/plants?name=${query}`)
                    .then(resp => resp.json())
                    .then(plants => {
                      this.setState({
                        isLoading: false,
                        options: plants
                      });
                    });
                }}
                options={this.state.options}
              />
            </SearchBar>
            <FormBtn onClick={this.handleFormSubmit}>Add plant to list</FormBtn>
          </Col>
          <Col size="sm-8">
          {this.state.plant && <PlantDetail plant={this.state.plant} style={{ marginTop: 0, marginBottom: 0 }}/>}
          {!this.state.plant && (
              <List>
                {this.state.finalPlants.map(plant => (
                  <ListItem key={plant.id}>
                    {plant.name}
                    <DeleteBtn onClick={() => this.removePlant(plant.id)} />
                  </ListItem>
                ))}
              </List>
            ) }
          
          </Col>
        </Row>
     

        <Row>
          <Col size="sm-12">
            <LocalStorageOriginal />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Plants;
