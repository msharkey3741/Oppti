import React from "react";
import SchoolDistrictCard from "./SchoolDistrictCard";
import logger from "sabio-debug";
import * as schoolDistrictService from "../../services/schoolDistrictService";

import * as adminService from "../../services/adminService";
import { PropTypes } from "prop-types";
import { Chart } from "react-google-charts";
import { NavLink } from "react-router-dom";
import AllStudents from "./DIstrictsStudents";
import "./district.css";

const _logger = logger.extend("Districts");
class SchoolDistrictDash extends React.Component {
  state = {
    schoolDistrict: null,
    number: {
      userCount: [],
      studentCount: [],
      opportunityCount: [],
      approvedApplications: [],
      applicationCount: [],
      fashion: []
    },
    fashion: 0,
    health: 0,
    healthScience: 0,
    infoAndCom: 0,
    marketSalesServ: 0,
    it: 0
  };
  componentDidMount() {
    this.totalCountTypes();
    this.getDistrictByUserId();
    this.IndustryTypeCountCall();
  }
  getDistrictByUserId = () => {
    const roles = this.props.currentUser.id;
    schoolDistrictService
      .getDistrictByUserId(roles)
      .then(this.getDistrictSuccess)
      .catch(this.getCompanyError);
  };
  getDistrictSuccess = response => {
    const schoolDistrict = response.item;
    this.setState(() => ({
      schoolDistrict
    }));
  };
  getCountSuccess = response => {
    this.setState(() => ({
      userCount: response.items[0].userCount,
      studentCount: response.items[0].studentCount,
      opportunityCount: response.items[0].opportunityCount,
      approvedApplications: response.items[0].approvedApplications,
      applicationCount: response.items[0].applicationCount
    }));
  };
  getItCountSuccess = response => {
    _logger("IT", response);

    this.setState(() => ({
      fashion: response.items[0].itCount,
      health: response.items[1].itCount,
      healthScience: response.items[2].itCount,
      infoAndCom: response.items[3].itCount,
      it: response.items[4].itCount,
      marketSalesServ: response.items[5].itCount
    }));
  };
  // handleEdit = id => {
  //   this.props.history.push("/district/new", state:{isEditing: true});
  //   _logger(id);
  // };
  getCompanyError = response => {
    _logger("response", response);
  };
  totalCountTypes = () => {
    adminService
      .totalCountTypes()
      .then(this.getCountSuccess)
      .catch(this.onActionError);
  };
  IndustryTypeCountCall = () => {
    adminService
      .industryTypesCount()
      .then(this.getItCountSuccess)
      .catch(this.getCompanyError);
  };
  getAllStudentsForDistrict = (pageIndex, pageSize) => {
    schoolDistrictService
      .getBySchoolDistrict(pageIndex, pageSize)
      .then(this.studentsSuccess)
      .catch(this.onActionError);
  };
  render() {
    _logger("districtdash");
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-lg-6">
                <h3>
                  School District Panel <small>Oppti</small>
                </h3>
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
        <div className="row">
          <div className="col-xl-3 col-sm-6 xl-50">
            <div className="card bg-primary">
              <div className="card-body">
                <h6>
                  <b>Student Users</b>
                </h6>
                <div className="row social-media-counter">
                  <div className="col text-center">
                    <i className="icofont icofont-users-alt-1"></i>
                  </div>
                  <div className="col text-center">
                    <h4 className="counter">{this.state.studentCount}</h4>
                    <p>Total</p>
                  </div>
                  <div className="col text-center">
                    {/* <h4 className="counter">364</h4>
                    <p>Post</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 xl-50">
            <NavLink to="/district/studentapplications">
              <div className="card bg-secondary">
                <div className="card-body">
                  <h6>
                    <b>Student Applications</b>
                  </h6>
                  <div className="row social-media-counter">
                    <div className="col text-center">
                      <i className="icofont icofont-letter"></i>
                    </div>
                    <div className="col text-center">
                      <h4 className="counter">{this.state.applicationCount}</h4>
                      <p>Total</p>
                    </div>
                    <div className="col text-center">
                      {/* <h4 className="counter">364</h4>
                    <p>Post</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-xl-3 col-sm-6 xl-50">
            <NavLink to="/district/acceptedstudents">
              <div className="card bg-success">
                <div className="card-body">
                  <h6>
                    <b>Student Accepted</b>
                  </h6>
                  <div className="row social-media-counter">
                    <div className="col text-center">
                      <i className="icofont icofont-graduate-alt"></i>
                    </div>
                    <div className="col text-center">
                      <h4 className="counter">
                        {this.state.approvedApplications}
                      </h4>
                      <p>Total</p>
                    </div>
                    <div className="col text-center">
                      {/* <h4 className="counter">364</h4>
                    <p>Post</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col-xl-3 col-sm-6 xl-50">
            <NavLink to="/admin/opportunities">
              <div className="card bg-info">
                <div className="card-body">
                  <h6>
                    <b>Opportunites</b>
                  </h6>
                  <div className="row social-media-counter">
                    <div className="col text-center">
                      <i className="icofont icofont-briefcase-alt-2"></i>
                    </div>
                    <div className="col text-center">
                      <h4 className="counter">{this.state.opportunityCount}</h4>
                      <p>Total</p>
                    </div>
                    <div className="col text-center">
                      {/* <h4 className="counter">364</h4>
                    <p>Post</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        <AllStudents />
        <div className="card col-md-12">
          <div className="row">
            <div className=" col-md-6 piegraph">
              {/* <div className="col-md-1"></div> */}
              <Chart
                width={"700px"}
                height={"475px"}
                chartType="PieChart"
                loader={
                  <h4>
                    <i className="icofont icofont-refresh"></i>Loading Chart
                  </h4>
                }
                data={[
                  ["Categories", "Industries"],
                  ["Fashion and Interior Design", this.state.fashion],
                  ["Health", this.state.health],
                  ["Health Sci & Med Tech", this.state.healthScience],
                  [
                    "Marketing, Sales, and Services",
                    this.state.marketSalesServ
                  ],
                  ["Information and Communication", this.state.infoAndCom],
                  ["IT", this.state.it]
                ]}
                options={{
                  animation: {
                    startup: true,
                    easing: "linear",
                    duration: 1500
                  },
                  title: "Opportunities by Industry",
                  slices: {
                    0: { color: "#8a5fda" },
                    1: { color: "#1d98a8" },
                    2: { color: "#00936f" },
                    3: { color: "#3886c7" },
                    4: { color: "#2e9dd1" },
                    5: { color: "#60679f" }
                  }
                }}
                rootProps={{ "data-testid": "1" }}
              />
            </div>
            <div className=" col-md-6 bargraph">
              <Chart
                height={"500px"}
                chartType="Bar"
                loader={
                  <h4>
                    <i className="icofont icofont-refresh"></i>Loading Chart
                  </h4>
                }
                data={[
                  [
                    "By Student",
                    "Total Student Users",
                    "Students Who Applied",
                    "Accepted Students"
                  ],
                  [
                    "Student Information",
                    this.state.studentCount,
                    this.state.applicationCount,
                    this.state.approvedApplications
                  ]
                  // get all, for loop return array length set state of the array length and then reference student information
                ]}
                options={{
                  // Material design options
                  animation: {
                    startup: true,
                    easing: "linear",
                    duration: 1500
                  },
                  colors: ["#ab8ce4", "#26c6da", "#00c292"],
                  chart: {
                    title: "Participation"
                  }
                }}
                // For tests
                rootProps={{ "data-testid": "2" }}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <h3>Your District</h3>
        </div>
        <div className="card col-md-12">
          <SchoolDistrictCard
            district={this.state.schoolDistrict}
            handleEdit={this.handleEdit}
          />
        </div>

        {/* <div className="card col-md-5" style={{ marginLeft: 28 }}>
            <div className="col-md-6">
                <div
                  className="card"
                  style={{
                    marginLeft: 10
                  }}
                >
                  
                </div>
              </div> */}
      </React.Fragment>
    );
  }
}
SchoolDistrictDash.propTypes = {
  props: PropTypes.any,
  schoolDistrict: PropTypes.shape({}),
  match: PropTypes.any,
  currentUser: PropTypes.any,
  history: PropTypes.any,
  state: PropTypes.any
};
export default SchoolDistrictDash;
