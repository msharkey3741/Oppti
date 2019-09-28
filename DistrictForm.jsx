import React from "react";
import PropTypes from "prop-types";
import districtValidation from "./districtValidation";
import { Formik, Form, FastField } from "formik";
import _logger from "sabio-debug";
import * as organizationService from "../../services/organizationService";
import Swal from "sweetalert";
import Files from "../files/Files";
import LocationForm from "../location/LocationForm";
import { NavLink } from "react-router-dom";

class DistrictForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      schoolTypes: [],
      formData: {
        name: "",
        headline: "",
        description: "",
        siteUrl: "",
        phone: "",
        typeId: 2,
        logo: ""
      },
      locationData: {
        lineOne: "",
        lineTwo: "",
        city: "",
        zip: "",
        stateId: 0,
        latitude: 0,
        longitude: 0
      }
    };
  }
  componentDidMount = () => {
    _logger(this.props.location.state);
    if (this.props.location.state ? this.isEditing() : null) {
    }
    this.getCombinedTypes();
  };
  isEditing = () => {
    this.setState(() => ({
      isEditing: true
    }));
    this.getDistrictById();
  };
  getCombinedTypes = () => {
    organizationService
      .getCombinedTypes()
      .then(this.onCombinedSuccess)
      .catch(this.onActionError);
  };
  getDistrictById = () => {
    const id = this.props.history.location.state.districtId;
    organizationService
      .getOrganizationsById(id)
      .then(this.populateForm)
      .catch(this.err);
  };
  err = response => {
    _logger(response);
  };

  populateForm = data => {
    this.setState(() => ({
      formData: data.item,
      locationData: data.item.location
    }));
    _logger(data.item.location);
  };
  onActionError = response => {
    _logger(response);
  };

  handleSubmit = values => {
    if (
      this.state.locationData.city &&
      this.state.locationData.lineOne &&
      this.state.locationData.stateId > 0 &&
      this.state.locationData.zip
    ) {
      this.form.geocode(this.state.locationData).then(geoValues => {
        this.setState({ isSubmitting: true });
        values.lineOne = geoValues.lineOne;
        values.lineTwo = geoValues.lineTwo;
        values.city = geoValues.city;
        values.zip = geoValues.zip;
        values.location.state.id = geoValues.stateId;
        values.latitude = geoValues.latitude;
        values.stateId = geoValues.stateId;
        values.longitude = geoValues.longitude;
        values.locationTypeId = values.location.type.id;
        values.typeId = values.type.id;
        values.LocationId = values.location.id;
        values.modifiedBy = this.props.currentUser.Id;
        values.orgId = values.id;
        if (this.state.isEditing === false) {
          organizationService
            .createDistrict(values)
            .then(this.onCreateSuccess)
            .catch(this.onCreateError);
        } else {
          debugger;
          _logger("values", values);
          organizationService
            .updateOrganizationsById(values)
            .then(this.onUpdateSuccess)
            .catch(this.err);
        }
      });
    } else {
      Swal({
        icon: "error",
        text: "Enter Location Information",
        button: "Ok"
      });
    }
  };
  onUpdateSuccess = () => {
    Swal({
      title: "Good job!",
      text: "You have updated successfully",
      icon: "success"
    });
    this.props.history.push("/district/dashboard");
  };
  onCreateSuccess = () => {
    Swal({
      title: "Good job!",
      text: "You have registred successfully",
      icon: "success"
    });
    this.props.history.push("/district/dashboard");
  };

  onCreateError = () => {
    Swal({
      icon: "error",
      text: "Registration Failed",
      button: "Ok"
    });
  };

  uploadFile = (response, formikData) => {
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...formikData,
          logo: response
        }
      };
    });
  };

  updateLocation = locationFormData => {
    this.setState({ locationData: locationFormData });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-lg-6">
                {this.state.isEditing ? (
                  <h5>Edit District</h5>
                ) : (
                  <h5>Add District</h5>
                )}
              </div>
              <div className="col-lg-6">
                <ol className="breadcrumb pull-right">
                  <li className="breadcrumb-item">
                    <a href="#">
                      <i className="fa fa-home" />
                    </a>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12" style={{ paddingBottom: 4 }}>
          <div className="card">
            <Formik
              initialValues={this.state.formData}
              enableReinitialize={true}
              validationSchema={districtValidation}
              onSubmit={this.handleSubmit}
              render={formikProps => (
                <Form
                  onSubmit={formikProps.handleSubmit}
                  className="theme-form mega-form px-3"
                >
                  <br />
                  <h4 className="col-md-6">District Information</h4>
                  <div className="form-group col-md-8">
                    <label htmlFor="col-form-label">Name</label>{" "}
                    <FastField
                      type="text"
                      className="form-control"
                      placeholder="District Name"
                      name="name"
                    />
                    {formikProps.touched.name && formikProps.errors.name && (
                      <div className="text-danger">
                        {formikProps.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="col-md-4 pull-right">
                      <img
                        itemProp="thumbnail"
                        alt="Logo"
                        className="img-thumbnail"
                        src={
                          this.state.formData.logo
                            ? this.state.formData.logo
                            : "https://www.designevo.com/res/templates/thumb_small/green-and-blue-symmetric-graph.png"
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group col-md-8">
                    <label htmlFor="col-form-label">Headline</label>{" "}
                    <FastField
                      type="text"
                      className="form-control"
                      placeholder="Headline"
                      name="headline"
                    />
                    {formikProps.touched.headline &&
                      formikProps.errors.headline && (
                        <div className="text-danger">
                          {formikProps.errors.headline}
                        </div>
                      )}
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="col-form-label">Description</label>{" "}
                    <FastField
                      className="form-control"
                      component="textarea"
                      rows="6"
                      placeholder="Description"
                      name="description"
                    />
                    {formikProps.touched.description &&
                      formikProps.errors.description && (
                        <div className="text-danger">
                          {formikProps.errors.description}
                        </div>
                      )}
                  </div>
                  <div
                    className="row"
                    style={{ paddingLeft: 14, paddingRight: 20 }}
                  >
                    <div className="form-group col-md-6">
                      <label htmlFor="col-form-label">Website URL</label>
                      <FastField
                        type="text"
                        className="form-control"
                        placeholder="Enter URL"
                        name="siteUrl"
                      />
                      {formikProps.touched.siteUrl &&
                        formikProps.errors.siteUrl && (
                          <div className="text-danger">
                            {formikProps.errors.siteUrl}
                          </div>
                        )}
                    </div>
                    <div className="form-group col-md-5">
                      <label htmlFor="col-form-label">Phone Number</label>{" "}
                      <FastField
                        type="text"
                        className="form-control"
                        placeholder="xxx-xxx-xxxx "
                        name="phone"
                      />
                      {formikProps.touched.phone &&
                        formikProps.errors.phone && (
                          <div className="text-danger">
                            {formikProps.errors.phone}
                          </div>
                        )}
                    </div>
                  </div>
                  <hr />
                  <div className="pl-3">
                    <h4>Location Information</h4>
                    <div className="form-group">
                      <LocationForm
                        district={true}
                        //initialValues={this.state.locationData}
                        updateLocation={this.updateLocation}
                        noSubmitButton={true}
                        ref={node => (this.form = node)}
                        locationData={this.state.locationData}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-8">
                    <Files
                      name="logo"
                      label="District Logo"
                      uploadFile={val =>
                        this.uploadFile(val, formikProps.values)
                      }
                    />
                  </div>
                  <div className="card-footer">
                    <NavLink to="/district/dashboard/">
                      <button className="btn btn-primary" type="button">
                        Dashboard
                      </button>
                    </NavLink>
                    <button
                      className="btn btn-primary float-right"
                      type="submit"
                    >
                      Submit
                    </button>{" "}
                  </div>
                </Form>
              )}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
DistrictForm.propTypes = {
  locationData: PropTypes.any,
  props: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  currentUser: PropTypes.any
};
export default DistrictForm;
