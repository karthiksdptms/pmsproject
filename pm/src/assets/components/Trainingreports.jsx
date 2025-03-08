import React, { useState, useEffect } from "react";
import "./Trainingreports.css";
import { IoIosArrowBack } from "react-icons/io";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";


function Trainingreports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:3000')
      .then(result => setTrainings(result.data))
      .catch(err => console.log(err))
  }, [])


  const filterByDate = (training) => {
    if (!training.fromdate || !training.todate) return false;

    const trainingStart = new Date(training.fromdate);
    const trainingEnd = new Date(training.todate);

    const filterStart = fromDate ? new Date(fromDate) : null;
    const filterEnd = toDate ? new Date(toDate) : null;

    if (filterStart && filterEnd) {
      return trainingStart >= filterStart && trainingEnd <= filterEnd;
    }
    if (filterStart) {
      return trainingStart >= filterStart;
    }
    if (filterEnd) {
      return trainingEnd <= filterEnd;
    }

    return true;
  };



  const filteredTrainings = trainings.filter(filterByDate);



  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trainings.length / rowsPerPage);

  const startIdx = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredTrainings.slice(
    startIdx,
    startIdx + rowsPerPage
  );
  const handleExcelDownload = () => {
    if (filteredTrainings.length === 0) {
      alert("No records to export.");
      return;
    }


    const filteredData = filteredTrainings.map(({ _id, __v, id, ...rest }) => ({ ...rest }));


    const keys = Object.keys(filteredData.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    const consistentData = filteredData.map((obj) =>
      keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] || "" }), {})
    );

    const ws = XLSX.utils.json_to_sheet(consistentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trainings");

    const fromDateFormatted = fromDate ? new Date(fromDate).toLocaleDateString("en-CA") : "all_dates";
    const toDateFormatted = toDate ? new Date(toDate).toLocaleDateString("en-CA") : "all_dates";
    const fileName = `Trainings_from_${fromDateFormatted}_to_${toDateFormatted}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };


  //
  const [trtype, settrtype] = useState("");
  const [trainee, settrainee] = useState("");
  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState();
  const [duration, setduration] = useState();
  const [batch, setbatch] = useState("");
  const [department, setdepartment] = useState("");
  const [participated, setparticipated] = useState();

  const Submit = (e) => {
    e.preventDefault();

    if (trtype != '' && trainee != '' && fromdate != '' && todate != '' && duration != '' && batch != '' && department != '' && participated != 0) {
      axios
        .post("http://localhost:3000/createUser", {
          trtype,
          trainee,
          fromdate: new Date(fromdate).toLocaleDateString("en-CA"),
          todate: new Date(todate).toLocaleDateString("en-CA"),
          duration,
          batch,
          department,
          participated,
        })
        .then((result) => {
          console.log("Success:", result.data),
            window.location.reload()
        })
        .catch((err) => console.error("Error:", err));
    }
    else {
      alert("Please fill all fields");
    }
  };

  const [editData, setEditData] = useState({
    _id: "",
    trtype: "",
    trainee: "",
    fromdate: "",
    todate: "",
    duration: "",
    batch: "",
    department: "",
    participated: "",
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  const handleEditClick = (training) => {
    setEditData({
      _id: training._id,
      trtype: training.trtype,
      trainee: training.trainee,
      fromdate: formatDate(training.fromdate),
      todate: formatDate(training.todate),
      duration: training.duration,
      batch: training.batch,
      department: training.department,
      participated: training.participated,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3000/updateUser/${editData._id}`, editData)
      .then((result) => {
        console.log("Updated Successfully:", result.data);
        window.location.reload();  // Refresh table after update
      })
      .catch((err) => console.error("Update Error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:3000/deleteUser/${id}`)
        .then((response) => {
          alert("Record deleted successfully!");
          setTrainings(trainings.filter((training) => training._id !== id)); // Remove from UI
        })
        .catch((error) => {
          console.error("Error deleting record:", error);
        });
    }
  };
  return (
    <>

      <Link to="/Maindashboard/Training">
        <button
          type="button"
          className="btn btn-secondary"
          style={{
            marginLeft: "20px",
            border: "none",
            position: "relative",

            top: "95px",
            right: "40px",
            left: "210px",
            fontSize: "35px",
            color: "black",
            backgroundColor: "transparent",
            zIndex: "100",
          }}
        >
          <IoIosArrowBack />
        </button>
      </Link>
      <h2
        style={{
          position: "relative",
          left: "285px",
          top: "45px",
          width: "100px",
        }}
      >
        Report's
      </h2>
      
      




    </>
  );
}

export default Trainingreports;