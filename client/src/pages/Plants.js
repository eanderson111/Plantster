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
import Nav2 from "../components/Nav2";
import NumberBadge from "../components/NumberBadge";

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
    finalPlants: [],
    gardenHeight: 750,
    gardenWeight: 12,
    seedSpacing: 5,
    bgColor: "",
    defaultLayout: []
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
    const newPlantArray = this.state.finalPlants.filter(
      plant => id !== plant.id
    );
    this.setState({ finalPlants: newPlantArray });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  
  getRandomColor(){
    let colorValues = ["#F2506E", "#07418C", "#03738C", "#91E0F2", "#F2CA52", "#077336", "#145932", "#F27405", "#D9411E", "#A6A486", "#F2D5C4", "#8C2E6B", "#468C8C", "#F2DF80", "#BFB4AA", "#F27777" ];
    return colorValues[Math.floor(Math.random() * colorValues.length)];
  }

 
  handleFormSubmit = event => {
    event.preventDefault();
    let finalPlants = [...this.state.finalPlants];
    let finalPlant = this.state.plant.Name;
    let returnObj = {
      bgColor: "",
      seedSpacing: this.state.plant.seedSpacing
    }
    finalPlants.push({
      name: finalPlant,
      id: this.state.plant._id,
      key: 1,
      background: this.getRandomColor()
    });
    this.setState({ finalPlants: finalPlants });
    console.log(finalPlants);
    this.typeahead.getInstance().clear();
    // Todo: Remove plant clear completely?
    this.setState({
      plant: null
    });
    returnObj.bgColor = finalPlants[finalPlants.length -1].background;
    console.log("Return Object ******************************", returnObj);
    // return(finalPlants[finalPlants.length -1].background)
    return(returnObj)
  };


  handleGardenSave = (newLayout) => {
    this.setState({ layout : newLayout });
  }

  triggerChildAddItem = (plantVals) => {
    this.refs.addItem.onAddItem(plantVals);

  }

  addPlantToList = (event) =>{
  // let bgColor =  this.handleFormSubmit(event);
  // this.triggerChildAddItem(bgColor);
  let plantVals =  this.handleFormSubmit(event);
  this.triggerChildAddItem(plantVals);
  }

  render() {
    return (
      <Container fluid>
        <Nav2 />
        <Row>
          <Col size="sm-4">
            <SearchBar>
              <AsyncTypeahead
                ref={typeahead => (this.typeahead = typeahead)}
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


            <FormBtn onClick={this.addPlantToList} disabled={!this.state.plant} >Add plant</FormBtn>

          </Col>
          <Col size="sm-8">
            {this.state.plant && (
              <PlantDetail
                plant={this.state.plant}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
            )}
            {!this.state.plant && (
              <div>
                <ul>
                  {this.state.finalPlants.map(plant => (
                     <Col size="sm-6 col-md-6 col-lg-4">
                     <div className="listed-plant" >
                       <li className="list-group-item" style={{backgroundColor: plant.background}}>{plant.name}
                       <NumberBadge 
                        id={plant.id}
                        key={plant.key}
                        name={plant.name}
                        // style={{backgroundColor: plant.background}}
                        />
                       <DeleteBtn onClick={() => this.removePlant(plant.id)} />
                       </li>
                     </div>
                   </Col>
                  ))}
                </ul>
              </div>
            )}
          </Col>
        </Row>

        <Row>
          <Col size="sm-12">
            <LocalStorageOriginal
            // cols={10}
            // rowHeight={30}
            gardenWidth={this.state.gardenWeight}
            ref="addItem"
            seedSpacing={this.state.seedSpacing}
            defaultLayout={this.state.defaultLayout}
            handleGardenSave={this.handleGardenSave}
            finalPlants={this.state.finalPlants}
            plant={this.state.plant}
            bgColor={this.state.bgColor}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Plants;
