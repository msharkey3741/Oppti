import React from "react";
import PropTypes from "prop-types";

const StudentTableDistrict = props => {
  return (
    <tr role="row">
      <td id="column_title">{props.student.firstName}</td>
      <td>
        <span className="row-value">{props.student.mi}</span>
      </td>

      <td>
        <span className="row-value">{props.student.lastName}</span>
      </td>
      <td>
        <span className="row-value">{props.student.title}</span>
      </td>
      <td>
        <span className="row-value">{props.student.school.name}</span>
      </td>
      <td>
        <span className="row-value">{props.student.gpa.toFixed(2)}</span>
      </td>
    </tr>
  );
};

StudentTableDistrict.propTypes = {
  student: PropTypes.shape({
    firstName: PropTypes.string,
    mi: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    gpa: PropTypes.number,
    title: PropTypes.string,
    school: PropTypes.shape({
      name: PropTypes.string
    })
  })
};

export default StudentTableDistrict;
