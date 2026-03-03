import React, { Component } from "react";
import { Slide } from "react-reveal";
import "./Blogs.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import { axios } from "../../HelperFunctions/axios";
const format1 = "MM/DD/YYYY";

export class Blogs extends Component {
  state = {
    allBlogs: [],
  };
  componentDidMount() {
    axios
      .get("/api/blogs")
      .then((res) => {
        this.setState({ allBlogs: res.data.articles });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  allBlogsComponent = () => {
    let allBlogs = this.state.allBlogs.slice(0, 3).map((blog, bid) => {
      return (
        <div name="blog" className="mt-4 pt-2 col-md-6 col-lg-4">
          <div className="blog rounded border-0 shadow card">
            <div className="position-relative">
              <img
                src={blog.image ? blog.image.src : ""}
                alt=""
                className="rounded-top card-img-top"
              />
              <div className="overlay rounded-top bg-dark"></div>
            </div>
            <div className="content card-body">
              <h5>
                <Link
                  className="card-title title text-dark"
                  to={`/blogs/${blog.id}`}
                >
                  {blog.title}
                </Link>
              </h5>
              <div className="post-meta d-flex justify-content-between mt-3">
                <Link className="text-muted readmore" to={`/blogs/${blog.id}`}>
                  Read More <i className="fa fa-chevron-right"></i>
                </Link>
              </div>
            </div>
            <div className="author">
              <small className="text-light user d-block">
                <i className="fa fa-user"></i> {blog.author}
              </small>
              <small className="text-light date">
                <i className="fa fa-calendar"></i>{" "}
                {blog.updated_at ? moment(blog.updated_at).format(format1) : ""}
              </small>
            </div>
          </div>
        </div>
      );
    });
    return allBlogs;
  };
  render() {
    return (
      <div className="blogs">
        <div className="container">
          <div className="blogs-header">
            <span className="blogs-badge">Insights</span>
            <h2 className="blogs-title">Latest from the blog.</h2>
            <p className="blogs-subtitle">
              Tax tips, payroll updates, and financial knowledge to keep
              you ahead.
            </p>
          </div>
          <div className="row">{this.allBlogsComponent()}</div>
          <div className="blogs-cta">
            <Link to="/blogs" className="btn btn-secondary">
              All articles <i className="fa fa-arrow-right" style={{ marginLeft: '8px', fontSize: '13px' }}></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Blogs;
