import React from "react";
import propTypes from "prop-types";
import { Formik, Field, ErrorMessage } from "formik";
import Geocode from "react-geocode";
import logger from "sabio-debug";
import locationSchema from "./LocationValidation";
import { Button, FormGroup, Form } from "reactstrap";
import * as stateService from "../../services/locationService";
import * as locationService from "../../services/locationService";
import { Alert } from "reactstrap";
const _logger = logger.extend("location");
class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOptions: [],
      locationOpt: [],
      isEditing: false,
      visible: false,
      formData: {
        // ...props.formData
        locationTypeId: 7,
        lineOne: "",
        lineTwo: "",
        city: "",
        zip: "",
        stateId: 0,
        latitude: "",
        longitude: ""
      }
    };
  }
  componentDidMount() {
    this.getAllStates();
    this.getLocationTypes();
    if (this.props.isEditing) {
      this.locationById();
    }
  }

  componentDidUpdate() {
    if (this.props.locationData !== this.state.formData) {
      this.locationById();
    }
    if (this.props.isBadLocation) {
      this.form.setTouched({
        lineOne: true,
        city: true,
        zip: true,
        stateId: true
      });
      if (this.props.locationData) {
        this.form.setValues(this.props.locationData);
        //this.setState(() => ({ formData: this.props.initialValues }));
      }
      _logger(this.form);
    }
  }

  //Populating form with clicked on locationId
  locationById = () => {
    let formData = this.props.locationData;
    formData.stateId = this.props.locationData.stateId;
    formData.locationTypeId = this.props.locationData.locationTypeId;
    this.setState({
      formData
    });
  };

  getAllStates = () => {
    stateService
      .getAllStates()
      .then(this.onGetStateSuccess)
      .catch(this.getError);
  };
  getLocationTypes = () => {
    locationService
      .getLocationTypes()
      .then(this.onGetLocationTypes)
      .catch(this.getError);
  };
  onGetLocationTypes = data => {
    this.setState(() => ({ locationOpt: data.item }));
  };
  onGetStateSuccess = data => {
    this.setState(() => ({ stateOptions: data.item }));
  };
  locationSelect = locationValue => {
    this.setState(() => ({ formData: { locationTypeId: locationValue } }));
  };

  handleSubmit = values => {
    this.geocode(values)
      .then(geoValues => geoValues)
      .catch(() => "Error");
  };
  geocode = async values => {
    Geocode.setApiKey("");
    const geoValues = await Geocode.fromAddress(values.lineOne + values.zip)
      .then(response => {
        const latitude = response.results[0].geometry.location.lat;
        const longitude = response.results[0].geometry.location.lng;
        const id = values.id;
        values.longitude = longitude;
        values.latitude = latitude;
        this.setState(
          prevState => {
            return {
              ...prevState,
              formData: values
            };
          },
          () => {
            if (this.props.updateLocation) {
              this.props.updateLocation(this.state.formData);
            }
          }
        );
        if (this.props.isEditing === true) {
          locationService
            .updateLocationById(id, values)
            .then(this.updateSuccess);
        } else {
          _logger(values);
          if (!this.props.noSubmitButton) {
            locationService.addLocation(values).then(this.addSuccess);
          }
        }
        return values;
      })
      .catch(error => {
        this.getError();
        _logger(error, "error");
      });
    return geoValues;
  };
  addSuccess = originalValues => {
    this.setState(() => ({
      formData: originalValues
    }));
    // this.props.toggle();
    return originalValues;
  };
  updateSuccess = response => {
    // this.props.toggle();
    _logger(response);
  };
  getError = () => {
    this.setState(() => ({
      visible: true
    }));
  };
  handleChange = ev => {
    const formData = {
      ...this.state.formData,
      [ev.target.name]: ev.target.value
    };

    if (this.props.sendLocation) {
      this.setState(() => {
        return { formData };
      }, this.props.sendLocation(formData));
    } else if (this.props.updateLocation) {
      this.setState(() => {
        return { formData };
      }, this.props.updateLocation(formData));
    } else {
      this.setState(() => {
        return { formData };
      });
    }
  };
  render() {
    return (
      <Formik
        ref={node => (this.form = node)}
        enableReinitialize={true}
        initialValues={
          this.state.isEditing ? this.state.formData : this.props.locationData
        }
        onSubmit={this.handleSubmit}
        validationSchema={locationSchema}
      >
        {formikProps => {
          const { values, handleSubmit } = formikProps;

          return (
            <Form
              onSubmit={handleSubmit}
              className="form-horizontal"
              onChange={this.handleChange}
            >
              <FormGroup>
                {/* Line one */}
                <Alert
                  color="primary"
                  isOpen={this.state.visible}
                  toggle={this.onDismiss}
                >
                  There was an error
                </Alert>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="col-form-label">Address Line One</label>
                    <Field
                      name="lineOne"
                      type="text"
                      value={values.lineOne}
                      label="lineOne"
                      placeholder="123 Evergreen Terrace"
                      autoComplete="off"
                      className="form-control btn-square input-md"
                    />
                    {formikProps.touched.lineOne &&
                      formikProps.errors.lineOne && (
                        <div className="text-danger">
                          {formikProps.errors.lineOne}
                        </div>
                      )}
                  </div>
                  {/* Line two */}
                  <div
                    className="form-group col-md-6"
                    style={{ paddingRight: 25 }}
                  >
                    <label htmlFor="col-form-label">Address Line Two</label>
                    <Field
                      name="lineTwo"
                      type="text"
                      values={values.lineTwo}
                      placeholder="Apartment, suite, unit, etc."
                      className="form-control btn-square input-md"
                    />
                    <ErrorMessage name="lineTwo" />
                  </div>
                </div>
                {/* City */}
                <div className="row">
                  <div
                    className="form-group col-md-4"
                    style={{ paddingLeft: 15 }}
                  >
                    <label htmlFor="col-form-label">City</label>
                    <Field
                      name="city"
                      type="text"
                      values={values.city}
                      placeholder="Irvine"
                      className="form-control btn-square input-md"
                    />
                    {formikProps.touched.city && formikProps.errors.city && (
                      <div className="text-danger">
                        {formikProps.errors.city}
                      </div>
                    )}
                  </div>
                  {/* Zip */}
                  <div className="form-group col-md-4">
                    <label htmlFor="col-form-label">Zip Code</label>
                    <div className="col" style={{ paddingLeft: 1 }}>
                      <Field
                        name="zip"
                        type="text"
                        placeholder="12345"
                        values={values.zip}
                        className="form-control btn-square input-md"
                      />
                      {formikProps.touched.zip && formikProps.errors.zip && (
                        <div className="text-danger">
                          {formikProps.errors.zip}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* State */}
                  <div className="form-group col-md-4">
                    <label htmlFor="col-form-label">State</label>
                    <div className="col" style={{ paddingLeft: 1 }}>
                      <Field
                        name="stateId"
                        component="select"
                        label="stateId"
                        className="form-control btn-square input-md"
                      >
                        <option value="0">Select State</option>
                        {this.state.stateOptions.map(state => {
                          return (
                            <option value={state.id} key={state.id}>
                              {state.name}
                            </option>
                          );
                        })}
                      </Field>
                      {/*    Old component, might bring back later
                
                <StateSelectDropdown
                  options={this.state.stateOptions}
                  values={values.state}
                /> */}
                      {formikProps.touched.stateId &&
                        formikProps.errors.stateId && (
                          <div className="text-danger">
                            {formikProps.errors.stateId}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Location Type */}
                </div>
                {/* 
                
                Old component, might bring back later
                
                
                <LocationTypeDropdown
                  options={this.state.locationOpt}
                  onSelectLocation={this.locationSelect}
                  //values={values.locationType}
                  values={this.values}
                />{" "} */}
                {/* 
                  Get Lat and Long
                  DONE SERVER SIDE, KEPT INCASE OF NEED LATER
                </Button> */}
                {/* <div className="form-group row">
                  <label
                    className="col-lg-12 control-label text-lg-left"
                    htmlFor="longitude"
                  >
                    Longitude
                  </label>
                  <div className="col-lg-12">
                    <Field
                      name="longitude"
                      type="text"
                      //values={values.longitude}
                      placeholder="-90 to 90"
                      className="form-control btn-square input-md"
                    />
                    <ErrorMessage name="longitude" />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    className="col-lg-12 control-label text-lg-left"
                    htmlFor="latitude"
                  >
                    Latitude
                  </label>
                  <div className="col-lg-12">
                    <Field
                      name="latitude"
                      type="text"
                      // values={values.latitude}
                      placeholder="-180 to 180"
                      className="form-control btn-square input-md"
                    />
                    <ErrorMessage name="latitude" />
                  </div>
                </div> */}
                {/* <br /> */}
                {!this.props.noSubmitButton && (
                  <Button type="submit">
                    {this.props.isEditing ? "Update Location" : "Add Location"}
                  </Button>
                )}
              </FormGroup>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

//DONT ABUSE FORM, TALK TO INSTRUCTOR

LocationForm.propTypes = {
  locationData: propTypes.shape({
    locationTypeId: propTypes.number,
    lineOne: propTypes.string,
    lineTwo: propTypes.string,
    city: propTypes.string,
    zip: propTypes.string,
    stateId: propTypes.number,
    latitude: propTypes.number,
    longitude: propTypes.number
  }),
  isEditing: propTypes.bool,
  noSubmitButton: propTypes.bool,
  isBadLocation: propTypes.bool,
  toggle: propTypes.func,
  sendLocation: propTypes.func,
  updateLocation: propTypes.func
};
export default LocationForm;
