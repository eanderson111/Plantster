import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { asyncContainer, Typeahead } from "react-bootstrap-typeahead";
import SearchWrap from "../components/SearchWrap";
import SearchBar from "../components/SearchBar";
import PlantDetail from "../components/PlantDetail";

const AsyncTypeahead = asyncContainer(Typeahead);

class Plants extends Component {
  state = {
    plant: null,
    plants: [],
    Type: "",
    Name: "",
    Comments: "",
    isLoading: false,
    options: []
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

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        synopsis: this.state.synopsis
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        {/* <Row>
          <Col size="md-6">
            <Jumbotron>
              {this.state.plant && (
                <div>
                  <h2>{this.state.plant.Name}</h2>
                  <p>Type:{this.state.plant.Type}</p>
                  <p>Spacing:{this.state.plant.Spacing}</p>
                  <p>PS:{this.state.plant.PS}</p>
                  <p>RS:{this.state.plant.RS}</p>
                  <p>Depth:{this.state.plant.Depth}</p>
                  <p>Spread:{this.state.plant.Spread}</p>
                  <p>Light:{this.state.plant.Light}</p>
                  <p>Maturity:{this.state.plant.Maturity}</p>
                </div>
              )}
              {this.state.plant && (
                <div>
                  Image: <img src={this.state.plant.Image} />
                </div>
              )}
            </Jumbotron>

            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                name="author"
                placeholder="Author (required)"
              />
              <TextArea
                value={this.state.synopsis}
                onChange={this.handleInputChange}
                name="synopsis"
                placeholder="Synopsis (Optional)"
              />
              <FormBtn
                disabled={!(this.state.author && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Search Plants</h1>
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
            </Jumbotron>
            {this.state.plants.length ? (
              <List>
                {this.state.plants.map(plant => (
                  <ListItem key={plant._id}>
                    <Link to={"/books/" + plant._id}>
                      <strong>{plant.Name}</strong>
                    </Link>
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
       */}
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
          </Col>
          <Col size="sm-8">
          
          <PlantDetail plant={this.state.plant} style={{ marginTop: 0, marginBottom: 0 }}/>
        </Col>
        </Row>
      </Container>
    );
  }
}

export default Plants;
