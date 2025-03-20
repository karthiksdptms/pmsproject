import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../assets/context/authContext";

import Loading from "../assets/components/Loading";

function Studentplacement() {
  const { user } = useAuth();
  const [student, setStudent] = useState({
    registration_number: "",
    name: "",
    department: "",
    batch: "",
    sslc: "",
    hsc: "",
    diploma: "",
    sem1: "",
    sem2: "",
    sem3: "",
    sem4: "",
    sem5: "",
    sem6: "",
    sem7: "",
    sem8: "",
    cgpa: "",
    arrears: "",
    internships: "",
    certifications: "",
    patentspublications: "",
    achievements: "",
    hoa: "",
    language: "",
    aoi: "",
    email: "",
    address: "",
    phoneno: "",
    resume: null,
    image: null,
    offerpdf: null,
    placement: "",
    offers: [],
    expassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Display 2 announcements per page

  // ✅ Fetch Student Data
  const fetchStudent = async () => {
    if (!user?._id) return; // Ensure user ID is available
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/students/getone/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudent(response.data.student);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Placement Announcements
  const fetchAnnouncements = async () => {
    setLoading(true)
    if (!student?._id) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/placements/${student._id}`
      );
      const reversedAnnouncements =
        (response.data.placement_announce || []).reverse();
      setAnnouncements(reversedAnnouncements);
      setLoading(false)
    } catch (error) {
      console.error(
        "Error fetching placement announcements:",
        error.response?.data?.message || error.message
      );
    }
  };

  // ✅ Fetch Student Data on Component Mount
  useEffect(() => {
    fetchStudent();
  }, [user._id]);

  // ✅ Fetch Announcements Only When student._id is Available
  useEffect(() => {
    if (student._id) {
      fetchAnnouncements();
    }
  }, [student._id]);

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Back Button and Header */}
      <div className="hea">
        <Link
          to="/Studentdashboard"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                marginLeft: "20px",
                border: "none",
                position: "relative",
                top: "95px",
                right: "40px",
                fontSize: "35px",
                color: "black",
                backgroundColor: "transparent",
              }}
            >
              <IoIosArrowBack />
            </button>
            <h2
              style={{
                position: "relative",
                top: "45px",
                left: "30px",
                fontFamily: "poppins",
                fontSize: "35px",
                width: "600px",
              }}
            >
              Placement Announcements
            </h2>
          </div>
        </Link>
      </div>

      {loading ? (
                    <Loading />
                ) : (
      <div
        style={{
          position: "relative",
          left: "250px",
          margin: "50px auto",
          width: "80%",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "20px", fontFamily: "poppins" }}></h3>
        {currentAnnouncements.length > 0 ? (
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
            }}
          >
            {currentAnnouncements.map((announce, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4 style={{ margin: "0", fontSize: "20px" }}>
                  {announce.title}
                </h4>
                <p style={{ margin: "10px 0", whiteSpace: "pre-wrap" }}>
                  {announce.description}
                </p>
                <small style={{ color: "gray" }}>
                  Posted on: {new Date(announce.postedAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No placement announcements available.</p>
        )}

        {/* Pagination Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {Array.from(
            { length: Math.ceil(announcements.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                style={{
                  margin: "5px",
                  padding: "10px 15px",
                  backgroundColor:
                    currentPage === index + 1 ? "rgb(180, 178, 178)" : "#ddd",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      
      </div>
                )}

    </>
  );
}

export default Studentplacement;
