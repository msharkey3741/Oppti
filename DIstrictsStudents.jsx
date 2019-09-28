import React from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import * as schoolDistrictService from "../../services/schoolDistrictService";
import StudentTableDistrict from "./StudentTableDistrict";
import "../students/Students.css";
import { ToastContainer, toast } from "react-toastify";

const _logger = logger.extend("Opportunities");

class StudentsListBySchool extends React.Component {
  state = {
    students: [],
    mappedStudents: [],
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    current: 1,
    didSearch: false,
    query: ""
  };

  componentDidMount() {
    this.getSchool();
  }

  getSchool = () => {
    schoolDistrictService
      .getStudentsByDistrict(this.state.pageIndex, this.state.pageSize)
      .then(this.getSuccess)
      .catch(this.onActionError);
  };

  getSuccess = data => {
    _logger(data);
    this.setState(() => ({
      students: data.item.pagedItems,
      mappedStudents: data.item.pagedItems.map(this.mapStudents),
      totalCount: data.item.totalCount
    }));
  };

  onActionError = errResponse => {
    _logger(errResponse);
  };

  mapStudents = student => {
    return <StudentTableDistrict key={student.id} student={student} />;
  };

  handleSearchChange = event => {
    this.setState({
      query: event.target.value
    });
  };

  didSearchTrue = () => {
    this.setState(
      () => ({ didSearch: true, pageIndex: 0, current: 1 }),
      () => this.searchHandler()
    );
  };

  handleSearchClick = event => {
    event.preventDefault();
    this.didSearchTrue();
  };
  searchHandler = () => {
    schoolDistrictService
      .getStudentsByDistrictSearch(
        this.state.pageIndex,
        this.state.pageSize,
        this.state.query
      )
      .then(this.getSuccess)
      .catch(this.getSearchError);
  };

  handleRefresh = () => {
    this.setState(
      () => ({ pageIndex: 0, didSearch: false }),
      () => this.getSchool()
    );
  };
  getSearchError = () => {
    toast("Does not exist, try another search");
  };
  onPageChange = page => {
    this.state.didSearch
      ? this.setState(
          {
            pageIndex: page - 1,
            current: page
          },
          () => this.searchHandler()
        )
      : this.setState(
          {
            pageIndex: page - 1,
            current: page
          },
          () => this.getSchool()
        );
  };
  render() {
    return (
      <div>
        <div className="page-header">
          <div className="row">
            <div className="col-lg-6">
              <h3>Students</h3>
            </div>
            <div className="col-lg-6"></div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="card col-lg-12">
              <div className="card-body">
                <div className="dt-ext table-responsive">
                  <div
                    id="responsive_wrapper"
                    className="container-fluid dataTables_wrapper dt-bootstrap4"
                  >
                    <div className="row" style={{ margin: "0px" }}>
                      <div className="col-sm-12 col-md-12">
                        <form
                          id="responsive_search"
                          className="form-inline"
                          onSubmit={this.handleSearchClick}
                        >
                          <button
                            className="btn btn-primary my-2 my-sm-0"
                            type="button"
                            onClick={this.handleRefresh}
                          >
                            <i className="fa fa-spin fa-refresh"></i>
                          </button>

                          <input
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Search.."
                            onChange={this.handleSearchChange}
                            value={this.state.query}
                          />
                          <button
                            className="btn btn-primary my-2 my-sm-0"
                            type="button"
                            onClick={this.handleSearchClick}
                          >
                            <i className="fa fa-search"></i>
                          </button>
                        </form>
                      </div>
                    </div>
                    <br />
                    <div className="responsive_table">
                      <div className="col-sm col-md">
                        <table
                          id="responsive"
                          className="dataTable display dtr-inline responsive-table table-hover"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr role="row">
                              <th className="sorting">First Name</th>
                              <th className="sorting">Middle Initial</th>
                              <th className="sorting">Last Name</th>
                              <th className="sorting">Email</th>
                              <th className="sorting">School</th>
                              <th className="sorting">GPA</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.mappedStudents}</tbody>
                          <tfoot>
                            <tr>
                              <th className="sorting">First Name</th>
                              <th className="sorting">Middle Initial</th>
                              <th className="sorting">Last Name</th>
                              <th className="sorting">Email</th>
                              <th className="sorting">School</th>
                              <th className="sorting">GPA</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="row" id="responsive_footer">
                      <div className="col-sm col-md">
                        <div id="responsive_paginate">
                          <Pagination
                            current={this.state.current}
                            total={this.state.totalCount}
                            pageSize={this.state.pageSize}
                            onChange={this.onPageChange}
                            showTotal={total => `Total ${total} items`}
                            locale={localeInfo}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer autoClose={5000} />
        </div>
      </div>
    );
  }
}

StudentsListBySchool.propTypes = {
  currentUser: PropTypes.object
};

export default StudentsListBySchool;
