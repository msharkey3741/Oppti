import React from "react";
import * as locationServices from "../../services/locationService";
import LocationsTable from "./LocationsTable";
import logger from "sabio-debug";
import LocationModal from "./LocationModal";
import { Modal, ModalHeader, ModalBody, Container, Row } from "reactstrap";
import LocationForm from "./LocationForm";
import LocationMap from "./LocationMap";

const _logger = logger.extend("location");
class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      mappedLocations: [],
      totalCount: 0,
      totalPages: 0,
      pageSize: 20,
      pageIndex: 0,
      hasNextPage: true,
      hasPreviousPage: false,
      isEditing: true,
      modal: false,
      currentLocation: "",
      lat: 0,
      long: 0
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount = () => {
    _logger(this.props);
    this.getLocation();
  };
  getLocation = () => {
    locationServices
      .getLocation(this.state.pageIndex, this.state.pageSize)
      .then(this.onLocationSuccess)
      .catch(this.locationGetError);
  };
  onLocationSuccess = data => {
    this.setState(() => ({ locations: data.item.pagedItems }));
  };
  mapLocations = location => (
    <LocationsTable
      location={location}
      key={location.id}
      handleUpdate={this.handleUpdate}
    />
  );
  handleUpdate = id => {
    this.getById(id);
  };
  getById = id => {
    locationServices
      .getLocatonById(id)
      .then(this.successById)
      .catch(this.locationGetError);
  };
  successById = data => {
    this.setState(() => ({ currentLocation: data.item, isEditing: true }));
    this.toggle(data);
  };
  fireUpdate = id => {
    locationServices
      .updateLocationById(id)
      .then(this.state)
      .catch(this.locationGetError);
  };
  locationGetError = response => {
    _logger(response);
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <div className="col-sm-12">
        <LocationModal isOpen={this.toggle} />
        {this.state.locations.map(this.mapLocations)}
        <React.Fragment>
          <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Update Location</ModalHeader>
            <ModalBody>
              <Container>
                <Row>
                  <LocationForm
                    submit={this.handleSubmit}
                    isEditing={this.state.isEditing}
                    location={this.state.currentLocation}
                    toggle={this.toggle}
                  />
                </Row>
                <LocationMap />
              </Container>
            </ModalBody>
          </Modal>
        </React.Fragment>
      </div>
    );
  }
}

export default Location;
