import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import { FormBtn } from "../components/Form";
import { asyncContainer, Typeahead } from "react-bootstrap-typeahead";
import SearchBar from "../components/SearchBar";
import PlantDetail from "../components/PlantDetail";
import LocalStorageOriginal from "../components/LocalStorageOriginal/index";
import Nav2 from "../components/Nav2";
import NumberBadge from "../components/NumberBadge";
import { RandomColor } from "../components/RandomColor";
import axios from 'axios'

const AsyncTypeahead = asyncContainer(Typeahead);

class Plants extends Component {
  constructor() {
    super()

  this.state = {
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
    // seedSpacing: 5,
    bgColor: "",
    name: "",
    length: "",
    breadth: "",
    pixelWidth: "1400px",
    pixelHeight: "500px",
    cols: 100,
    rowHeight: 10,
    ppi: 10,
    totalHeight: 10,
    count: 0,
    loggedIn: false,
    username: null,
    garden: { layout: [] }

  };
  this.getUser = this.getUser.bind(this)

   
  }


  componentDidMount() {

    if(this.props.location.state) {
    const userGarden = this.props.location.state.garden;


    console.log("layout of garden" + JSON.stringify(userGarden.layout));
    if (userGarden) {
      this.setState(
        {
          name: userGarden.name,
          length: userGarden.length.toString(),
          breadth: userGarden.breadth.toString(),
          finalPlants: userGarden.finalPlants,
          garden: { layout: userGarden.layout }
        },
        () => this.pixelDimensions()
      );
    }
  }
    this.loadPlants();
    this.getUser()
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log("component did mount1");
    // console.log(prevProps);
    // console.log("component did mount2");
    // console.log(this.state);
    if (prevProps.garden) {
      // console.log("component did mount if 1");

      if (isEquivalent(prevProps.garden, this.state.garden)) {
        // console.log("component did mount if 2");
      } else {
        this.pixelDimensions();
        // console.log("component did mount else 1");
      }
    }
  }

  loadPlants = () => {
    API.getPlants()
      .then(res =>
        this.setState({ plants: res.data, Type: "", Name: "", Comments: "" })
      )
      .catch(err => console.log(err));
  };

  pixelDimensions = () => {
    const { length, breadth } = this.state;
    console.log("pixel dimensions", length);
    let pixelWidth = "1300";
    let pixelHeight = "750";
    let cols = 10;
    let ppi = 10;
    let totalHeight = 20;
    switch (length) {
      case "4":
        pixelWidth = "1248px";
        cols = 48;
        ppi = 26;
        break;
      case "5":
        pixelWidth = "1320px";
        cols = 60;
        ppi = 22;
        break;
      case "6":
        pixelWidth = "1368px";
        cols = 72;
        ppi = 19;
        break;
      case "7":
        pixelWidth = "1344px";
        cols = 84;
        ppi = 16;
        break;
      case "8":
        pixelWidth = "1344px";
        cols = 96;
        ppi = 14;
        break;
      case "9":
        pixelWidth = "1404px";
        cols = 108;
        ppi = 13;
        break;
      case "10":
        pixelWidth = "1320px";
        cols = 120;
        ppi = 11;
        break;
      case "11":
        pixelWidth = "1320px";
        cols = 132;
        ppi = 10;
        break;
      case "12":
        pixelWidth = "1296px";
        cols = 144;
        ppi = 9;
        break;
      case "13":
        pixelWidth = "1404px";
        cols = 156;
        ppi = 9;
        break;
      case "14":
        pixelWidth = "1344px";
        cols = 168;
        ppi = 8;
        break;
      case "15":
        pixelWidth = "1260px";
        cols = 180;
        ppi = 7;
        break;
      case "16":
        pixelWidth = "1344px";
        cols = 192;
        ppi = 7;
        break;
    }

    pixelHeight = (ppi * parseInt(breadth) * 12 + 50).toString() + "px";
    totalHeight = parseInt(breadth) * 12;

    this.setState({
      pixelWidth,
      cols,
      pixelHeight,
      rowHeight: ppi,
      ppi,
      totalHeight
    });
  };

  deletePlant = id => {
    API.deletePlant(id)
      .then(res => this.loadPlants())
      .catch(err => console.log(err));
  };

  removePlant = id => {
    const newPlantArray = this.state.finalPlants.filter(
      plant => id !== plant.id
    );
    this.setState({ finalPlants: newPlantArray });
    this.refs.addItem.removeAnItem(id);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  updateName = event => {
    this.setState({ name: event.target.value });
  };

  updateLength = event => {
    this.setState({ length: event.target.value }, () => this.pixelDimensions());
  };

  updateBreadth = event => {
    this.setState({ breadth: event.target.value }, () =>
      this.pixelDimensions()
    );
  };

  handleFormSubmit = event => {
    event.preventDefault();
    let finalPlants = [...this.state.finalPlants];
    let finalPlant = this.state.plant.Name;
    let returnObj = {
      bgColor: "",
      seedSpacing: this.state.plant.PS,
      id: this.state.plant._id
    };
    finalPlants.push({
      name: finalPlant,
      id: this.state.plant._id,
      size: 1,
      background: RandomColor()
    });
    this.setState({ finalPlants: finalPlants });
    console.log(finalPlants);
    this.typeahead.getInstance().clear();
    // Todo: Remove plant clear completely?
    this.setState({
      plant: null
    });
    returnObj.bgColor = finalPlants[finalPlants.length - 1].background;
    console.log("Return Object ******************************", returnObj);
    // return(finalPlants[finalPlants.length -1].background)
    return returnObj;
  };

  handleGardenSave = newLayout => {
    const garden = {
      name: this.state.name,
      length: this.state.length,
      breadth: this.state.breadth,
      layout: newLayout,
      finalPlants: this.state.finalPlants
    };
    this.setState({ layout: newLayout });
    console.log({ newLayout });
    this.saveGarden(garden);
  };

  saveGarden(garden) {
    console.log({ garden });
    fetch("api/gardens", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(garden)
    });
  }

  triggerChildAddItem = plantVals => {
    this.refs.addItem.onAddItem(plantVals);
  };

  setCount = (plantId, newCount) => {
    const plant = this.state.finalPlants.find(plant => plant.id === plantId);
    plant.size = newCount;
    this.setState({ finalPlants: this.state.finalPlants });
  };

  addPlantToList = event => {
    let plantVals = this.handleFormSubmit(event);
    this.triggerChildAddItem(plantVals);
  };


  getUser() {
    axios.get('/api/user/').then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }



  render() {
    return (
      <Container fluid>
        <Nav2 />
        <Row>
          <Col size="sm-4">
            <div className="form-group">
              <label for="garden-name">
                Name your garden and specify dimensions
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={this.state.name}
                onChange={this.updateName}
              />
            </div>
            <div className="row">
              <div className="dimension-1 col">
                <input
                  type="text"
                  name="length"
                  className="form-control"
                  placeholder="feet"
                  value={this.state.length}
                  onChange={this.updateLength}
                />
              </div>

              <div className="dimension-2 col">
                <h6> by </h6>
              </div>

              <div className="dimension-3 col">
                <input
                  type="text"
                  name="breadth"
                  className="form-control w-200"
                  placeholder="feet"
                  value={this.state.breadth}
                  onChange={this.updateBreadth}
                />
              </div>
            </div>
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
            <div className="addButton">
            <FormBtn className="addPlant" onClick={this.addPlantToList} disabled={!this.state.plant}>
              Add plant
            </FormBtn>
            </div>

            
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
                  {this.state.finalPlants.map(plant => {
                    return (
                      <Col size="sm-6 col-md-6 col-lg-4">
                        <div className="listed-plant">
                          <li
                            className="list-group-item"
                            style={{ backgroundColor: plant.background }}
                          >
                            {plant.name}
                            <NumberBadge
                              id={plant.id}
                              key={plant.key}
                              name={plant.name}
                              size={plant.size}
                            />
                            {/* <span className="badge" role="badge">
                             {this.setCount}
                            </span> */}
                            <DeleteBtn
                              onClick={() => this.removePlant(plant.id)}
                            />
                          </li>
                        </div>
                      </Col>
                    );
                  })}
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
              cols={this.state.cols}
              rowHeight={this.state.rowHeight}
              gardenWidth={this.state.gardenWeight}
              pixelWidth={this.state.pixelWidth}
              pixelHeight={this.state.pixelHeight}
              ppi={this.state.ppi}
              totalHeight={this.state.totalHeight}
              ref="addItem"
              // seedSpacing={this.state.seedSpacing}
              defaultLayout={this.state.garden.layout}
              handleGardenSave={this.handleGardenSave}
              finalPlants={this.state.finalPlants}
              plant={this.state.plant}
              bgColor={this.state.bgColor}
              setCount={this.setCount}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}
export default Plants;
