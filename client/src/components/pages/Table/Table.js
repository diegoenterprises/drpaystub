import moment from "moment";
import React, { Component } from "react";
import { FaArchive } from "react-icons/fa";
import { Link, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import "./table.css";

class Table extends Component {
  // Sample data for the table
  state = {};
  formatAndJoinDates = (dates) => {
    return dates
      .map((date) => moment(date, "DD-MM-YYYY").format("DD-MMM-YYYY"))
      .join(", ");
  };

  render() {
    const { headings, data } = this.props;
    if (!data?.length) {
      return (
        <div className="container mt-4 fort">
            <FaArchive className="w-16 h-16" />
            <h5>No Entries Found</h5>
        </div>
      );
    }
    return (
      <div className="container mt-4">
        <table className="table">
          <thead>
            <tr>
              {headings.map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{++i}</td>
                <td>{item.params.company_name}</td>
                <td>{item.params.employee_name}</td>
                <td>{item.params.emailAddress}</td>
                <td>{moment(item.createdAt).format("DD-MMM-YYYY")}</td>
                <td>{item.params.pay_dates.length}</td>
                {/* <td>{this.formatAndJoinDates(item.params.pay_dates)}</td> */}

                {/* <td>{moment(item.params.pay_dates, 'DD-MM-YYYY').format('DD-MMM-YYYY')}</td> */}
                <td>{item.params.pay_dates.length * 15}</td>
                <td>
                  <a
                    href={`/dashboard/paystub/${item._id}`}
                    class="icon icon-btn  me-2"
                  >
                    <i className="fa fa-eye"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
